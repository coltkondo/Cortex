import { useState } from 'react'
import { Upload, FileText, X } from 'lucide-react'
import { useStore } from '../../store/useStore'
import { resumeService } from '../../api/resumeService'

function ResumeUpload() {
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
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <FileText className="h-6 w-6 text-primary-600 mt-1" />
            <div>
              <h3 className="font-medium text-gray-900">{resume.filename}</h3>
              <p className="text-sm text-gray-500 mt-1">
                Uploaded on {new Date(resume.uploaded_at).toLocaleDateString()}
              </p>
            </div>
          </div>
          <button
            onClick={handleDelete}
            className="text-gray-400 hover:text-red-600 transition-colors"
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
      className={`relative border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
        dragActive
          ? 'border-primary-500 bg-primary-50'
          : 'border-gray-300 hover:border-gray-400'
      }`}
    >
      <input
        type="file"
        accept=".pdf"
        onChange={handleFileInput}
        className="hidden"
        id="resume-upload"
      />
      <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
      <label
        htmlFor="resume-upload"
        className="cursor-pointer text-primary-600 hover:text-primary-700 font-medium"
      >
        Click to upload
      </label>
      <span className="text-gray-600"> or drag and drop</span>
      <p className="text-sm text-gray-500 mt-2">PDF files only</p>
    </div>
  )
}

export default ResumeUpload
