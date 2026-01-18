import { GoogleGenAI, Modality, Type } from "@google/genai";
import { decodeBase64, pcmToWav } from "../utils/audioHelper";
import { extractTextFromPPTX } from "../utils/pptxParser";
import { AudioSection } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// --- Helpers ---

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const fileToGenerativePart = async (file: File): Promise<{ inlineData: { data: string; mimeType: string } }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = (reader.result as string).split(',')[1];
      resolve({
        inlineData: {
          data: base64String,
          mimeType: file.type,
        },
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const synthesizeSpeech = async (text: string, retries = 3): Promise<string> => {
  const model = "gemini-2.5-flash-preview-tts";
  try {
    // Basic cleanup to prevent silence or weird artifacts
    const cleanText = text.replace(/[*#]/g, '').trim();
    if (!cleanText) return "";

    const response = await ai.models.generateContent({
      model,
      contents: [{ parts: [{ text: cleanText }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) throw new Error("No audio data returned.");

    const pcmData = decodeBase64(base64Audio);
    const wavBlob = pcmToWav(pcmData);
    return URL.createObjectURL(wavBlob);
  } catch (e: any) {
    // Check for rate limit error codes (429)
    if (retries > 0 && (e.status === 429 || (e.error && e.error.code === 429) || e.message?.includes('429'))) {
      const waitTime = 2000 * (4 - retries); // 2s, 4s, 6s wait
      console.warn(`TTS Rate limit hit. Retrying in ${waitTime}ms...`);
      await delay(waitTime);
      return synthesizeSpeech(text, retries - 1);
    }
    console.error("TTS Error:", e);
    throw e;
  }
};

// --- Core Services ---

export const generateTeachingSummary = async (file: File): Promise<string> => {
  const model = "gemini-3-flash-preview";
  
  const prompt = `
    You are an expert aviation instructor.
    Convert this training material into a clear "Teaching Script" I can listen to.
    
    Structure:
    1. **Overview**
    2. **Core Concepts** (Use analogies)
    3. **Teaching Tips** (Gotchas/Errors)
    4. **Review Questions**
    
    Style: Natural, spoken-word, professional. Keep it concise but effective.
  `;

  let contentParts = [];
  const isPPTX = file.name.toLowerCase().endsWith('.pptx') || 
                 file.type === 'application/vnd.openxmlformats-officedocument.presentationml.presentation';

  if (isPPTX) {
    const pptxText = await extractTextFromPPTX(file);
    contentParts = [
      { text: prompt },
      { text: `Extracted Presentation Content:\n\n${pptxText}` }
    ];
  } else {
    const documentPart = await fileToGenerativePart(file);
    contentParts = [documentPart, { text: prompt }];
  }

  const response = await ai.models.generateContent({
    model,
    contents: { parts: contentParts },
  });

  return response.text || "Could not generate summary.";
};

/**
 * Reverted to robust sequential generation to ensure reliability.
 */
export const generateAudioFromText = async (text: string): Promise<AudioSection[]> => {
  // Simple splitting by double newline to create natural pauses between paragraphs
  // Limiting to first 5 chunks for the "Quick Summary" to ensure speed/reliability
  const rawChunks = text.split(/\n\n+/).filter(c => c.length > 20);
  const chunksToProcess = rawChunks.slice(0, 8); // Process up to 8 paragraphs

  const audioPlaylist: AudioSection[] = [];

  for (let i = 0; i < chunksToProcess.length; i++) {
    const chunkText = chunksToProcess[i];
    // Create a title based on the first few words
    const title = chunkText.split('.')[0].slice(0, 30).replace(/[*#]/g, '') + "...";
    
    try {
      // Add a small delay between chunks to avoid hitting TPM/RPM limits aggressively
      if (i > 0) await delay(1000); 
      
      const audioUrl = await synthesizeSpeech(chunkText);
      audioPlaylist.push({
        id: `summary-${i}`,
        title: title || `Part ${i + 1}`,
        audioUrl: audioUrl
      });
    } catch (e) {
      console.warn(`Skipping chunk ${i} due to error`);
    }
  }

  return audioPlaylist;
};

/**
 * Generates Structured Guidance AND the Audio Playlist for Deep Dive.
 */
export const generateDeepDiveGuidance = async (file: File): Promise<{ playlist: AudioSection[], textTranscript: string }> => {
  const model = "gemini-3-flash-preview";
  
  let contentParts = [];
  const isPPTX = file.name.toLowerCase().endsWith('.pptx') || 
                 file.type === 'application/vnd.openxmlformats-officedocument.presentationml.presentation';

  if (isPPTX) {
    const pptxText = await extractTextFromPPTX(file);
    contentParts = [{ text: `Material:\n${pptxText}` }];
  } else {
    const documentPart = await fileToGenerativePart(file);
    contentParts = [documentPart];
  }

  const prompt = `
    You are a master flight instructor mentor. 
    I need a comprehensive, deep-dive audio guide on EXACTLY how to teach this material.
    
    Break the lesson down into 3-5 high-value topics.
    For EACH topic, provide a detailed spoken script.
    
    The script must:
    - Explain the concept depth.
    - Give specific analogies.
    - Identify common student errors.
    - Provide "Instructor Patter".
    
    Return the response in JSON format.
  `;

  const response = await ai.models.generateContent({
    model,
    contents: {
      parts: [...contentParts, { text: prompt }]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            topicTitle: { type: Type.STRING },
            teachingScript: { type: Type.STRING, description: "Detailed script." }
          },
          required: ["topicTitle", "teachingScript"]
        }
      }
    }
  });

  const jsonStr = response.text || "[]";
  let chapters;
  try {
    chapters = JSON.parse(jsonStr);
  } catch (e) {
    throw new Error("Failed to generate structured guidance.");
  }

  const playlist: AudioSection[] = [];
  let fullTranscript = "";

  // Sequential processing for reliability
  for (let i = 0; i < chapters.length; i++) {
    const chapter = chapters[i];
    fullTranscript += `## ${chapter.topicTitle}\n\n${chapter.teachingScript}\n\n`;
    
    try {
      // Add delay between chapters
      if (i > 0) await delay(1500);

      const audioUrl = await synthesizeSpeech(chapter.teachingScript);
      playlist.push({
        id: `deepdive-${i}`,
        title: chapter.topicTitle,
        audioUrl: audioUrl
      });
    } catch (e) {
      console.warn(`Skipping deep dive chapter ${i}`);
    }
  }

  return { playlist, textTranscript: fullTranscript };
};

export const generateWhiteboardImage = async (summaryContext: string, customInstruction?: string): Promise<string> => {
  const model = "gemini-2.5-flash-image";
  const context = summaryContext.slice(0, 500); 

  let prompt = `
    A realistic, high-resolution photo of a classroom whiteboard prepared for an aviation lesson.
    Topic Context: ${context}
    Visual Requirements:
    - Hand-drawn schematic diagrams in black, red, and blue marker.
    - PARTIALLY INCOMPLETE: The board should look like a "Lesson Prep".
    - Leave some labels as empty lines.
    Style: Educational, technical, professional aviation school.
  `;

  if (customInstruction) {
    prompt += `\n\nUSER ADJUSTMENT REQUEST: "${customInstruction}". Apply these changes.`;
  }

  const response = await ai.models.generateContent({
    model,
    contents: { parts: [{ text: prompt }] },
    config: { imageConfig: { aspectRatio: "16:9" } }
  });

  let base64Image = null;
  for (const candidate of response.candidates || []) {
    for (const part of candidate.content.parts) {
      if (part.inlineData) {
        base64Image = part.inlineData.data;
        break;
      }
    }
    if (base64Image) break;
  }

  if (!base64Image) throw new Error("No image generated.");
  return `data:image/png;base64,${base64Image}`;
};