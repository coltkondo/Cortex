import { useState } from 'react'
import { Upload, FileText, X } from 'lucide-react'
import { useStore } from '../../store/useStore'
import { resumeService } from '../../api/resumeService'

function ResumeUpload({ onSuccess }) {
  const { resume, setResume, setLoading, setError } = useStore()
  const [dragActive, setDragActive] = useState(false)

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const file = e.dataTransfer.files[0]
    if (file && file.type === 'application/pdf') {
      await uploadResume(file)
    } else {
      setError('Please upload a PDF file')
    }
  }

  const handleFileInput = async (e) => {
    const file = e.target.files[0]
    if (file) {
      await uploadResume(file)
    }
  }

  const uploadResume = async (file) => {
    try {
      setLoading(true)
      setError(null)
      const uploadedResume = await resumeService.uploadResume(file)
      setResume(uploadedResume)

      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess(uploadedResume)
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to upload resume')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    try {
      await resumeService.deleteResume()
      setResume(null)
    } catch (err) {
      setError('Failed to delete resume')
    }
  }

  if (resume) {
    return (
      <div className="p-6 rounded-button border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0">
              <FileText className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">{resume.filename}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Uploaded on {new Date(resume.uploaded_at).toLocaleDateString()}
              </p>
            </div>
          </div>
          <button
            onClick={handleDelete}
            className="w-9 h-9 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 flex items-center justify-center transition-colors text-gray-400 hover:text-red-600 dark:hover:text-red-400"
            title="Delete resume"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      className={`relative border-2 border-dashed rounded-button p-12 text-center transition-all duration-200 ${
        dragActive
          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 scale-[1.02]'
          : 'border-gray-300 dark:border-gray-700 hover:border-primary-400 dark:hover:border-primary-600 bg-gray-50 dark:bg-gray-900/50'
      }`}
    >
      <input
        type="file"
        accept=".pdf"
        onChange={handleFileInput}
        className="hidden"
        id="resume-upload"
      />
      <Upload className={`mx-auto h-12 w-12 mb-4 transition-colors ${
        dragActive ? 'text-primary-500' : 'text-gray-400'
      }`} />
      <div className="mb-2">
        <label
          htmlFor="resume-upload"
          className="cursor-pointer text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-semibold transition-colors"
        >
          Click to upload
        </label>
        <span className="text-gray-600 dark:text-gray-400"> or drag and drop</span>
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-500">PDF files only (max 10MB)</p>
    </div>
  )
}

export default ResumeUpload
