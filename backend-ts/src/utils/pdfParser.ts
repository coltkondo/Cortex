import pdfParse from 'pdf-parse';

export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  try {
    const parsedPdfData = await pdfParse(buffer);
    return parsedPdfData.text.trim();
  } catch (error) {
    throw new Error(`Failed to parse PDF: ${error}`);
  }
}
