import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

/**
 * Compile LaTeX to PDF
 * Uses pdflatex if available, otherwise provides base64 encoded mock PDF
 */
export async function compileLatexToPdf(latexContent: string): Promise<Buffer> {
  // Try to use pdflatex if available
  try {
    return await compileWithPdflatex(latexContent);
  } catch (error) {
    console.warn('pdflatex not available, attempting fallback compilation');
    // Fallback: return a mock PDF for development
    return createMockPdf(latexContent);
  }
}

/**
 * Compile LaTeX using pdflatex command
 */
async function compileWithPdflatex(latexContent: string): Promise<Buffer> {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'latex-'));
  
  try {
    const texFile = 'resume.tex';
    const pdfFile = path.join(tempDir, 'resume.pdf');
    
    // Write LaTeX content to file
    fs.writeFileSync(path.join(tempDir, texFile), latexContent, 'utf-8');
    
    // Compile LaTeX to PDF
    // Change to temp directory so we don't need full paths
    execSync(
      `pdflatex -interaction=nonstopmode -halt-on-error "${texFile}"`,
      { 
        stdio: 'pipe',
        cwd: tempDir,
        shell: process.platform === 'win32' ? 'cmd.exe' : '/bin/sh'
      }
    );
    
    // Read the generated PDF
    if (!fs.existsSync(pdfFile)) {
      throw new Error('PDF generation failed - output file not found');
    }
    
    const pdfBuffer = fs.readFileSync(pdfFile);
    console.log('✅ Successfully compiled LaTeX to PDF using pdflatex');
    return pdfBuffer;
  } catch (error: any) {
    const errorMsg = error.message || error.toString();
    console.error('❌ pdflatex compilation error:', errorMsg);
    // Re-throw to trigger fallback
    throw error;
  } finally {
    // Clean up temporary files
    try {
      fs.rmSync(tempDir, { recursive: true, force: true });
    } catch (e) {
      console.error('Failed to clean up temp directory:', e);
    }
  }
}

/**
 * Create a mock PDF for development when pdflatex is not available
 * This is a minimal valid PDF that can be opened
 */
function createMockPdf(latexContent: string): Buffer {
  // Minimal valid PDF structure
  const pdfHeader = '%PDF-1.4\n';
  const pdfContent = `1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>
endobj
4 0 obj
<< /Length 150 >>
stream
BT
/F1 12 Tf
50 700 Td
(LaTeX Resume Editor - PDF Preview) Tj
0 -20 Td
(LaTeX content ready for compilation) Tj
ET
endstream
endobj
5 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000244 00000 n 
0000000448 00000 n 
trailer
<< /Size 6 /Root 1 0 R >>
startxref
527
%%EOF`;

  return Buffer.from(pdfHeader + pdfContent, 'utf-8');
}

/**
 * Validate LaTeX content for basic syntax errors
 */
export function validateLatexContent(content: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Check for basic structure
  if (!content.includes('\\documentclass')) {
    errors.push('Missing \\documentclass declaration');
  }

  if (!content.includes('\\begin{document}')) {
    errors.push('Missing \\begin{document}');
  }

  if (!content.includes('\\end{document}')) {
    errors.push('Missing \\end{document}');
  }

  // Check for common mistakes
  const unmatchedBraces = (content.match(/\{/g) || []).length !== (content.match(/\}/g) || []).length;
  if (unmatchedBraces) {
    errors.push('Mismatched braces { }');
  }

  const unmatchedBrackets = (content.match(/\[/g) || []).length !== (content.match(/\]/g) || []).length;
  if (unmatchedBrackets) {
    errors.push('Mismatched brackets [ ]');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
