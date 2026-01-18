import { SAMPLE_RATE, NUM_CHANNELS, BITS_PER_SAMPLE } from '../types';

/**
 * Decodes a base64 string into a Uint8Array.
 */
export const decodeBase64 = (base64: string): Uint8Array => {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
};

/**
 * Wraps raw PCM data with a WAV header to make it playable by standard HTML5 audio.
 * Gemini API returns raw PCM (Linear16).
 */
export const pcmToWav = (pcmData: Uint8Array): Blob => {
  const headerLength = 44;
  const wavDataLength = pcmData.length + headerLength;
  const buffer = new ArrayBuffer(wavDataLength);
  const view = new DataView(buffer);

  // RIFF chunk descriptor
  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + pcmData.length, true); // File size - 8
  writeString(view, 8, 'WAVE');

  // fmt sub-chunk
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true); // Subchunk1Size (16 for PCM)
  view.setUint16(20, 1, true); // AudioFormat (1 for PCM)
  view.setUint16(22, NUM_CHANNELS, true); // NumChannels
  view.setUint32(24, SAMPLE_RATE, true); // SampleRate
  view.setUint32(28, SAMPLE_RATE * NUM_CHANNELS * (BITS_PER_SAMPLE / 8), true); // ByteRate
  view.setUint16(32, NUM_CHANNELS * (BITS_PER_SAMPLE / 8), true); // BlockAlign
  view.setUint16(34, BITS_PER_SAMPLE, true); // BitsPerSample

  // data sub-chunk
  writeString(view, 36, 'data');
  view.setUint32(40, pcmData.length, true); // Subchunk2Size

  // Write PCM data
  const wavBytes = new Uint8Array(buffer);
  wavBytes.set(pcmData, 44);

  return new Blob([buffer], { type: 'audio/wav' });
};

const writeString = (view: DataView, offset: number, string: string) => {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
};
