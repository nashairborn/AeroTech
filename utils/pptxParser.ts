import JSZip from 'jszip';

export const extractTextFromPPTX = async (file: File): Promise<string> => {
  try {
    // @ts-ignore - JSZip types might not be perfectly resolved in this env
    const zip = await JSZip.loadAsync(file);
    const slides: { id: number, content: string }[] = [];
    const slidePromises: Promise<void>[] = [];

    zip.forEach((relativePath: string, zipEntry: any) => {
      // Look for slides: ppt/slides/slide1.xml, ppt/slides/slide2.xml, etc.
      const match = relativePath.match(/ppt\/slides\/slide(\d+)\.xml/);
      if (match) {
        const slideNumber = parseInt(match[1]);
        const promise = zipEntry.async('string').then((xmlContent: string) => {
           const parser = new DOMParser();
           const xmlDoc = parser.parseFromString(xmlContent, "text/xml");
           // Extract text from <a:t> tags (PowerPoint Text)
           const textNodes = xmlDoc.getElementsByTagName("a:t");
           let slideText = "";
           for (let i = 0; i < textNodes.length; i++) {
             slideText += textNodes[i].textContent + " ";
           }
           
           if (slideText.trim().length > 0) {
              slides.push({
                id: slideNumber,
                content: slideText.replace(/\s+/g, ' ').trim()
              });
           }
        });
        slidePromises.push(promise);
      }
    });

    await Promise.all(slidePromises);

    // Sort by slide ID to ensure logical reading order
    slides.sort((a, b) => a.id - b.id);

    if (slides.length === 0) {
      return "No text content found in this presentation.";
    }

    return slides.map(s => `[Slide ${s.id}]\n${s.content}`).join("\n\n");

  } catch (error) {
    console.error("Error parsing PPTX:", error);
    throw new Error("Failed to parse PowerPoint file. Please ensure it is a valid .pptx file.");
  }
};