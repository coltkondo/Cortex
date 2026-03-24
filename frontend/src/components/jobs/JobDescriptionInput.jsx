import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Briefcase, Link as LinkIcon, FileText, Loader2, CheckCircle, Building, User } from 'lucide-react'
import { useStore } from '../../store/useStore'
import { jobService } from '../../api/jobService'
import { VALIDATION, TIMING, MESSAGES, EXTERNAL_LINKS, COMPANY_STAGES } from '../../config/constants'

function JobDescriptionInput() {
  const navigate = useNavigate()
  const { addJob, setLoading, setError } = useStore()
  const [inputMode, setInputMode] = useState('manual') // 'url' or 'manual'
  const [urlInput, setUrlInput] = useState('')
  const [isFetchingUrl, setIsFetchingUrl] = useState(false)
  const [formData, setFormData] = useState({
    company: '',
    role: '',
    description: '',
    source: '',
    company_stage: 'series_b',
  })
  const [urlFetchSuccess, setUrlFetchSuccess] = useState(false)

  // Form validation (UX: Real-time feedback)
  const isFormValid = formData.company && formData.role && formData.description.length >= VALIDATION.MIN_DESCRIPTION_LENGTH

  const handleFetchFromUrl = async () => {
    if (!urlInput.trim()) {
      setError(MESSAGES.ERROR_INVALID_URL)
      return
    }

    try {
      setIsFetchingUrl(true)
      setError(null)
      const jobData = await jobService.fetchFromUrl(urlInput)

      // Pre-fill form with fetched data
      setFormData({
        company: jobData.company || formData.company,
        role: jobData.role || formData.role,
        description: jobData.description,
        source: jobData.source || urlInput,
        company_stage: formData.company_stage,
      })

      // Switch to manual mode to allow edits
      setInputMode('manual')
      setError(null)
      setUrlFetchSuccess(true)
      // Clear success message after configured duration
      setTimeout(() => setUrlFetchSuccess(false), TIMING.SUCCESS_MESSAGE_DURATION)
    } catch (err) {
      setError(err.response?.data?.detail || MESSAGES.ERROR_FETCH_URL_FAILED)
    } finally {
      setIsFetchingUrl(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.company || !formData.role || !formData.description) {
      setError(MESSAGES.ERROR_MISSING_FIELDS)
      return
    }

    try {
      setLoading(true)
      setError(null)
      const job = await jobService.createJob(formData)
      addJob(job)
      navigate(`/analysis/${job.id}`)
    } catch (err) {
      setError(err.response?.data?.detail || MESSAGES.ERROR_CREATE_JOB_FAILED)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="space-y-4">
        {/* Tab Selector */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          <button
            type="button"
            onClick={() => setInputMode('url')}
            className={`flex-1 py-2 px-4 rounded-md flex items-center justify-center space-x-2 transition-colors ${
              inputMode === 'url'
                ? 'bg-white text-primary-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <LinkIcon className="h-4 w-4" />
            <span>From URL</span>
          </button>
          <button
            type="button"
            onClick={() => setInputMode('manual')}
            className={`flex-1 py-2 px-4 rounded-md flex items-center justify-center space-x-2 transition-colors ${
              inputMode === 'manual'
                ? 'bg-white text-primary-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <FileText className="h-4 w-4" />
            <span>Manual Input</span>
          </button>
        </div>

        {/* URL Input Mode */}
        {inputMode === 'url' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Job Posting URL
              </label>
              <div className="flex space-x-2">
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder={EXTERNAL_LINKS.PLACEHOLDER_JOB_URL}
                  disabled={isFetchingUrl}
                />
                <button
                  type="button"
                  onClick={handleFetchFromUrl}
                  disabled={isFetchingUrl || !urlInput.trim()}
                  className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {isFetchingUrl ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>{MESSAGES.LOADING_FETCHING}</span>
                    </>
                  ) : (
                    <>
                      <LinkIcon className="h-4 w-4" />
                      <span>Fetch</span>
                    </>
                  )}
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {MESSAGES.INSTRUCTION_PASTE_URL}
              </p>
            </div>
          </div>
        )}

        {/* Success notification for URL fetch */}
        {urlFetchSuccess && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center space-x-2 animate-fade-in">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="text-sm text-green-800 font-medium">{MESSAGES.SUCCESS_URL_FETCHED}</span>
          </div>
        )}

        {/* Manual Input Mode */}
        {inputMode === 'manual' && (
          <>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-1">
              <Building className="h-4 w-4 text-gray-500" />
              <span>Company Name *</span>
            </label>
            <input
              type="text"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all ${
                formData.company ? 'border-green-300 bg-green-50' : 'border-gray-300'
              }`}
              placeholder="Acme Corp"
            />
          </div>

          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-1">
              <User className="h-4 w-4 text-gray-500" />
              <span>Role Title *</span>
            </label>
            <input
              type="text"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all ${
                formData.role ? 'border-green-300 bg-green-50' : 'border-gray-300'
              }`}
              placeholder="Senior Software Engineer"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Source
            </label>
            <input
              type="text"
              value={formData.source}
              onChange={(e) => setFormData({ ...formData, source: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="LinkedIn, Company Site, etc."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Company Stage
            </label>
            <select
              value={formData.company_stage}
              onChange={(e) => setFormData({ ...formData, company_stage: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value={COMPANY_STAGES.STARTUP.value}>{COMPANY_STAGES.STARTUP.label}</option>
              <option value={COMPANY_STAGES.SERIES_B.value}>{COMPANY_STAGES.SERIES_B.label}</option>
              <option value={COMPANY_STAGES.LATE_STAGE.value}>{COMPANY_STAGES.LATE_STAGE.label}</option>
              <option value={COMPANY_STAGES.PUBLIC.value}>{COMPANY_STAGES.PUBLIC.label}</option>
            </select>
          </div>
        </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                <FileText className="h-4 w-4 text-gray-500" />
                <span>Job Description *</span>
              </label>
              <span className={`text-xs font-medium ${
                formData.description.length >= VALIDATION.MIN_DESCRIPTION_LENGTH ? 'text-green-600' : 'text-gray-500'
              }`}>
                {formData.description.length} characters
                {formData.description.length < VALIDATION.MIN_DESCRIPTION_LENGTH && ` (minimum ${VALIDATION.MIN_DESCRIPTION_LENGTH})`}
              </span>
            </div>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={10}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all ${
                formData.description.length >= VALIDATION.MIN_DESCRIPTION_LENGTH ? 'border-green-300 bg-green-50' : 'border-gray-300'
              }`}
              placeholder="Paste the full job description here..."
            />
            <p className="text-xs text-gray-500 mt-1">
              {MESSAGES.INSTRUCTION_INCLUDE_DETAILS}
            </p>
          </div>
        </>
        )}

        {/* Submit Button - Only show in manual mode */}
        {inputMode === 'manual' && (
          <div className="space-y-2">
            <button
              type="submit"
              disabled={!isFormValid}
              className={`w-full py-3 px-4 rounded-md transition-all flex items-center justify-center space-x-2 font-semibold ${
                isFormValid
                  ? 'bg-primary-600 text-white hover:bg-primary-700 hover:shadow-lg transform hover:-translate-y-0.5'
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }`}
            >
              <Briefcase className="h-5 w-5" />
              <span>{isFormValid ? 'Analyze Job Fit' : 'Complete Required Fields'}</span>
            </button>
            {!isFormValid && (
              <p className="text-xs text-center text-gray-500">
                {MESSAGES.INSTRUCTION_COMPLETE_FIELDS}
              </p>
            )}
          </div>
        )}
      </div>
    </form>
  )
}

export default JobDescriptionInput
