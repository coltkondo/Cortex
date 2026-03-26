import { useState, useEffect } from 'react'
import { FileText, Download, Upload, Trash2, AlertCircle } from 'lucide-react'
import { useStore } from '../store/useStore'
import { resumeService } from '../api/resumeService'
import PremiumButton from '../components/common/PremiumButton'
import ResumeViewer from '../components/resume/ResumeViewer'
import ResumeEditor from '../components/resume/ResumeEditor'
import ResumeLatexEditor from '../components/resume/ResumeLatexEditor'
import AIInsights from '../components/resume/AIInsights'
import Modal from '../components/common/Modal'
import ResumeUpload from '../components/resume/ResumeUpload'

/**
 * ResumePage - Comprehensive resume management with AI insights
 * Three tabs: View, Edit, AI Insights
 * Actions: Download, Upload New, Delete
 */
function ResumePage() {
  const [activeTab, setActiveTab] = useState('view') // view, edit, insights
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const { resume, setResume } = useStore()

  // Fetch resume on mount if not in store
  useEffect(() => {
    if (!resume) {
      fetchResume()
    }
  }, [])

  const fetchResume = async () => {
    try {
      const resumeData = await resumeService.getResume()
      setResume(resumeData)
    } catch (err) {
      console.error('Failed to fetch resume:', err)
    }
  }

  const handleDownload = async () => {
    try {
      const blob = await resumeService.exportAsText()
      if (!blob) return

      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${resume.filename.replace('.pdf', '')}.txt`
      a.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Download failed:', err)
    }
  }

  const handleDelete = async () => {
    try {
      await resumeService.deleteResume()
      setResume(null)
      setShowDeleteConfirm(false)
    } catch (err) {
      console.error('Delete failed:', err)
    }
  }

  const handleUploadSuccess = () => {
    setShowUploadModal(false)
    fetchResume()
  }

  const tabs = [
    { id: 'view', label: 'View' },
    { id: 'edit', label: 'Edit' },
    { id: 'latex', label: 'LaTeX Editor' },
    { id: 'insights', label: 'AI Insights' },
  ]

  // No resume state
  if (!resume) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary-100 to-primary-50 dark:from-primary-900/30 dark:to-primary-800/20 flex items-center justify-center">
            <FileText className="w-8 h-8 text-primary-600 dark:text-primary-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            No Resume Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Upload your resume to unlock AI-powered insights and improvements
          </p>
          <PremiumButton
            variant="primary"
            size="lg"
            icon={Upload}
            onClick={() => setShowUploadModal(true)}
          >
            Upload Resume
          </PremiumButton>
        </div>

        {/* Upload Modal */}
        {showUploadModal && (
          <Modal onClose={() => setShowUploadModal(false)}>
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                Upload Your Resume
              </h3>
              <ResumeUpload onSuccess={handleUploadSuccess} />
            </div>
          </Modal>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header Section */}
      <div className="bg-gradient-subtle border-b border-gray-200 dark:border-gray-800">
        <div className="container-premium py-12">
          <div className="flex items-start justify-between gap-6 flex-wrap">
            {/* Left: Icon + Title + Description */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-100 to-primary-50 dark:from-primary-900/30 dark:to-primary-800/20 flex items-center justify-center flex-shrink-0">
                <FileText className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  Your Resume
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  View, edit, and optimize your resume with AI-powered insights
                </p>
              </div>
            </div>

            {/* Right: Action Buttons */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <PremiumButton
                variant="secondary"
                size="md"
                icon={Download}
                onClick={handleDownload}
              >
                Download
              </PremiumButton>
              <PremiumButton
                variant="secondary"
                size="md"
                icon={Upload}
                onClick={() => setShowUploadModal(true)}
              >
                Upload New
              </PremiumButton>
              <PremiumButton
                variant="ghost"
                size="md"
                icon={Trash2}
                onClick={() => setShowDeleteConfirm(true)}
                className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
              >
                Delete
              </PremiumButton>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-800">
        <div className="container-premium">
          <div className="flex gap-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  relative py-4 text-sm font-semibold transition-colors
                  ${
                    activeTab === tab.id
                      ? 'text-primary-600 dark:text-primary-400'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                  }
                `}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 dark:bg-primary-400 rounded-full" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container-premium py-12">
        {activeTab === 'view' && <ResumeViewer />}
        {activeTab === 'edit' && <ResumeEditor />}
        {activeTab === 'latex' && <ResumeLatexEditor />}
        {activeTab === 'insights' && <AIInsights />}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <Modal onClose={() => setShowUploadModal(false)}>
          <div className="p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Upload New Resume
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              This will replace your current resume
            </p>
            <ResumeUpload onSuccess={handleUploadSuccess} />
          </div>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <Modal onClose={() => setShowDeleteConfirm(false)}>
          <div className="p-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  Delete Resume?
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Are you sure you want to delete your resume? This action cannot be undone.
                </p>
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <PremiumButton
                variant="secondary"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </PremiumButton>
              <PremiumButton
                variant="primary"
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700"
              >
                Delete
              </PremiumButton>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

export default ResumePage
