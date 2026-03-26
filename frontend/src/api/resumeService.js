import apiClient from './client'

export const resumeService = {
  uploadResume: async (file) => {
    const formData = new FormData()
    formData.append('file', file)

    const response = await apiClient.post('/api/resume/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },

  getResume: async () => {
    const response = await apiClient.get('/api/resume')
    return response.data
  },

  deleteResume: async () => {
    const response = await apiClient.delete('/api/resume')
    return response.data
  },

  analyzeResume: async () => {
    const response = await apiClient.post('/api/resume/analyze')
    return response.data
  },

  updateSections: async (sections) => {
    const response = await apiClient.patch('/api/resume/sections', sections)
    return response.data
  },

  exportAsText: async () => {
    const response = await apiClient.get('/api/resume')
    const resumeData = response.data
    if (!resumeData) return null

    const blob = new Blob([resumeData.content], { type: 'text/plain' })
    return blob
  },

  // LaTeX operations
  getLatexContent: async () => {
    const response = await apiClient.get('/api/resume/latex/content')
    return response.data
  },

  saveLatexContent: async (latexContent) => {
    const response = await apiClient.post('/api/resume/latex/save', { latexContent })
    return response.data
  },

  compileLatex: async (latexContent) => {
    const response = await apiClient.post('/api/resume/latex/compile', { latexContent }, {
      responseType: 'blob'
    })
    return response.data
  },

  downloadLatexPdf: async (latexContent, filename = 'resume.pdf') => {
    const response = await apiClient.post('/api/resume/latex/download', 
      { latexContent, filename },
      { responseType: 'blob' }
    )
    
    // Create a blob URL and trigger download
    const url = window.URL.createObjectURL(response.data)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', filename)
    document.body.appendChild(link)
    link.click()
    link.parentNode.removeChild(link)
    window.URL.revokeObjectURL(url)
  },

  getLatexTemplate: () => {
    return `\\documentclass[11pt]{article}
\\usepackage[letterpaper,
top=0.5in,
bottom=0.5in,
left=0.5in,
right=0.5in]{geometry}

\\usepackage{XCharter}
\\usepackage[T1]{fontenc}
\\usepackage[utf8]{inputenc}
\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}
\\usepackage{titlesec}
\\raggedright
\\pagestyle{empty}

\\input{glyphtounicode}
\\pdfgentounicode=1

\\titleformat{\\section}{\\bfseries\\large}{}{0pt}{}[\\vspace{1pt}\\titlerule\\vspace{-6.5pt}]
\\renewcommand\\labelitemi{$\\vcenter{\\hbox{\\small$\\bullet$}}$}
\\setlist[itemize]{itemsep=-2pt, leftmargin=12pt, topsep=7pt}

\\begin{document}

\\centerline{\\Huge Your Name}
\\vspace{5pt}
\\centerline{youremail@example.com | \\href{https://github.com/yourprofile}{github.com/yourprofile}}

\\vspace{-8pt}

\\section*{Skills}
\\textbf{Languages:} Python, JavaScript/TypeScript, Java, SQL \\\\
\\textbf{Frameworks:} React, Node.js, FastAPI, Flask \\\\
\\textbf{Databases:} PostgreSQL, MongoDB, Redis | \\textbf{Tools:} Git, Docker, AWS, Jira

\\vspace{-6.5pt}

\\section*{Experience}

\\textbf{Software Engineer, Company Name} -- City, State \\hfill Month Year -- Present \\\\
\\vspace{-9pt}
\\begin{itemize}
  \\item Identified problem/need; designed and built solution using [technology], achieving measurable result
  \\item Diagnosed blocker/inefficiency; implemented [technical approach], reducing time/cost by X\\%
  \\item Partnered with [stakeholder]; developed [product], improving [metric] and enabling [outcome]
\\end{itemize}

\\textbf{Software Engineer, Previous Company} -- City, State \\hfill Start -- End \\\\
\\vspace{-9pt}
\\begin{itemize}
  \\item Recognized gap in [area]; built [solution] using [tech stack], achieving [specific result]
  \\item Optimized [system/process]; redesigned with [approach], reducing [metric] by X\\%
\\end{itemize}

\\vspace{-18.5pt}

\\section*{Projects}

\\textbf{Project Name -- Description} \\hfill \\href{https://github.com/profile/repo}{GitHub}\\\\
\\vspace{-9pt}
\\begin{itemize}
  \\item Built [core component] with [tech stack] to solve [problem], achieving X\\% improvement
  \\item Implemented [feature/optimization] reducing [metric] by X\\% using [approach]
  \\item Deployed [service] with [infrastructure], enabling [capability/scale]
\\end{itemize}

\\vspace{-18.5pt}

\\section*{Education}
\\textbf{University Name} -- B.S. Computer Science \\hfill Graduation Year \\\\
GPA: X.X | Dean's List, Relevant Scholarship, Notable Honor

\\end{document}`
  }
}

