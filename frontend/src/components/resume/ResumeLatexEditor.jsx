import { useState, useEffect } from 'react'
import { Download, Save, RefreshCw, Copy } from 'lucide-react'
import { resumeService } from '../../api/resumeService'

/**
 * ResumeLatexEditor - Edit and preview LaTeX resume with PDF generation
 * Provides split view: LaTeX editor on left, PDF preview on right
 */
function ResumeLatexEditor() {
  const [latexContent, setLatexContent] = useState('')
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState(null)
  const [saving, setSaving] = useState(false)
  const [compiling, setCompiling] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState(null)
  const [showTemplate, setShowTemplate] = useState(false)

  // Load existing LaTeX content on mount
  useEffect(() => {
    loadLatexContent()
  }, [])

  const loadLatexContent = async () => {
    try {
      const data = await resumeService.getLatexContent()
      if (data.latexContent) {
        setLatexContent(data.latexContent)
        // Auto-compile after loading
        compileLatex(data.latexContent)
      }
    } catch (err) {
      console.error('Failed to load LaTeX content:', err)
    }
  }

  const compileLatex = async (content = latexContent) => {
    if (!content.trim()) {
      setError('LaTeX content is empty')
      return
    }

    setCompiling(true)
    setError(null)

    try {
      const pdfBlob = await resumeService.compileLatex(content)
      const url = URL.createObjectURL(pdfBlob)
      setPdfPreviewUrl(url)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to compile LaTeX')
      console.error('LaTeX compilation error:', err)
    } finally {
      setCompiling(false)
    }
  }

  const handleSave = async () => {
    if (!latexContent.trim()) {
      setError('LaTeX content cannot be empty')
      return
    }

    setSaving(true)
    setError(null)
    setSaved(false)

    try {
      await resumeService.saveLatexContent(latexContent)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to save LaTeX content')
    } finally {
      setSaving(false)
    }
  }

  const handleDownload = async () => {
    if (!latexContent.trim()) {
      setError('LaTeX content is empty')
      return
    }

    setError(null)

    try {
      await resumeService.downloadLatexPdf(latexContent, 'resume.pdf')
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to download PDF')
      console.error('Download error:', err)
    }
  }

  const handleLoadTemplate = () => {
    const template = resumeService.getLatexTemplate()
    setLatexContent(template)
    setShowTemplate(false)
  }

  const handleCopyLatex = () => {
    navigator.clipboard.writeText(latexContent)
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          LaTeX Resume Editor
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Edit your resume in LaTeX and preview the PDF in real-time
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400">
          <p className="font-semibold">Error</p>
          <p>{error}</p>
        </div>
      )}

      {/* Success Message */}
      {saved && (
        <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-green-700 dark:text-green-400">
          <p className="flex items-center gap-2">
            <span>✓</span> LaTeX saved successfully
          </p>
        </div>
      )}

      {/* Toolbar */}
      <div className="mb-6 flex flex-wrap gap-3">
        <button
          onClick={() => compileLatex()}
          disabled={compiling || !latexContent.trim()}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition"
        >
          <RefreshCw size={18} className={compiling ? 'animate-spin' : ''} />
          {compiling ? 'Compiling...' : 'Refresh PDF'}
        </button>

        <button
          onClick={handleSave}
          disabled={saving || !latexContent.trim()}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition"
        >
          <Save size={18} />
          {saving ? 'Saving...' : 'Save LaTeX'}
        </button>

        <button
          onClick={handleDownload}
          disabled={!latexContent.trim()}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition"
        >
          <Download size={18} />
          Download PDF
        </button>

        <button
          onClick={handleCopyLatex}
          disabled={!latexContent.trim()}
          className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition"
        >
          <Copy size={18} />
          Copy LaTeX
        </button>

        <button
          onClick={() => setShowTemplate(!showTemplate)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition"
        >
          {showTemplate ? 'Hide' : 'Show'} Template
        </button>
      </div>

      {/* Template Selector */}
      {showTemplate && (
        <div className="mb-6 p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
            Load a default template to get started:
          </p>
          <button
            onClick={handleLoadTemplate}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition"
          >
            Load Default Template
          </button>
        </div>
      )}

      {/* Main Content - Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LaTeX Editor */}
        <div className="flex flex-col">
          <div className="mb-2">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              LaTeX Source Code
            </label>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {latexContent.length} characters
            </div>
          </div>
          <textarea
            value={latexContent}
            onChange={(e) => setLatexContent(e.target.value)}
            placeholder="Paste your LaTeX resume code here..."
            className="flex-1 min-h-screen p-4 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg font-mono text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            spellCheck="false"
          />
        </div>

        {/* PDF Preview */}
        <div className="flex flex-col">
          <div className="mb-2">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              PDF Preview
            </label>
            {compiling && (
              <div className="text-xs text-blue-600 dark:text-blue-400">
                Compiling LaTeX...
              </div>
            )}
          </div>
          <div className="flex-1 min-h-screen bg-gray-100 dark:bg-gray-950 border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden flex items-center justify-center">
            {pdfPreviewUrl ? (
              <iframe
                src={pdfPreviewUrl}
                className="w-full h-full"
                title="PDF Preview"
              />
            ) : (
              <div className="text-center">
                <p className="text-gray-500 dark:text-gray-400 mb-2">
                  No PDF preview yet
                </p>
                <p className="text-sm text-gray-400 dark:text-gray-500">
                  Edit the LaTeX and click "Refresh PDF" to generate preview
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg text-sm text-blue-700 dark:text-blue-400">
        <p className="font-semibold mb-2">Tips for LaTeX resume:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Make sure to include \documentclass, \begin{'{'}document{'}'}, and \end{'{'}document{'}'}
          </li>
          <li>Use \section*{'{'}Section Name{'}'} for section headers</li>
          <li>Compile your LaTeX using pdflatex or online tools if needed</li>
          <li>Save your changes regularly so they're not lost</li>
        </ul>
      </div>
    </div>
  )
}

export default ResumeLatexEditor
