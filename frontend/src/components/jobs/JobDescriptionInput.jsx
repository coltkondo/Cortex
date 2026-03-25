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
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Tab Selector */}
      <div className="flex space-x-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-button">
        <button
          type="button"
          onClick={() => setInputMode('url')}
          className={`flex-1 py-2.5 px-4 rounded-button flex items-center justify-center space-x-2 transition-all font-medium ${
            inputMode === 'url'
              ? 'bg-white dark:bg-gray-900 text-primary-600 dark:text-primary-400 shadow-soft'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
        >
          <LinkIcon className="h-4 w-4" />
          <span>From URL</span>
        </button>
        <button
          type="button"
          onClick={() => setInputMode('manual')}
          className={`flex-1 py-2.5 px-4 rounded-button flex items-center justify-center space-x-2 transition-all font-medium ${
            inputMode === 'manual'
              ? 'bg-white dark:bg-gray-900 text-primary-600 dark:text-primary-400 shadow-soft'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
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
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Job Posting URL
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-button bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                placeholder={EXTERNAL_LINKS.PLACEHOLDER_JOB_URL}
                disabled={isFetchingUrl}
              />
              <button
                type="button"
                onClick={handleFetchFromUrl}
                disabled={isFetchingUrl || !urlInput.trim()}
                className="px-6 py-3 bg-primary-600 dark:bg-primary-500 text-white rounded-button hover:bg-primary-700 dark:hover:bg-primary-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium shadow-soft hover:shadow-card"
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
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
              {MESSAGES.INSTRUCTION_PASTE_URL}
            </p>
          </div>
        </div>
      )}

      {/* Success notification for URL fetch */}
      {urlFetchSuccess && (
        <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-button p-4 flex items-center gap-3 fade-in-up">
          <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
          <span className="text-sm text-emerald-800 dark:text-emerald-300 font-medium">{MESSAGES.SUCCESS_URL_FETCHED}</span>
        </div>
      )}

      {/* Manual Input Mode */}
      {inputMode === 'manual' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Building className="h-4 w-4 text-gray-500 dark:text-gray-500" />
                <span>Company Name *</span>
              </label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className={`w-full px-4 py-3 border rounded-button focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all ${
                  formData.company
                    ? 'border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-900/20'
                    : 'border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900'
                } text-gray-900 dark:text-gray-100`}
                placeholder="Acme Corp"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <User className="h-4 w-4 text-gray-500 dark:text-gray-500" />
                <span>Role Title *</span>
              </label>
              <input
                type="text"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className={`w-full px-4 py-3 border rounded-button focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all ${
                  formData.role
                    ? 'border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-900/20'
                    : 'border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900'
                } text-gray-900 dark:text-gray-100`}
                placeholder="Senior Software Engineer"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Source
              </label>
              <input
                type="text"
                value={formData.source}
                onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-button bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                placeholder="LinkedIn, Company Site, etc."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Company Stage
              </label>
              <select
                value={formData.company_stage}
                onChange={(e) => setFormData({ ...formData, company_stage: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-button bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
              >
                <option value={COMPANY_STAGES.STARTUP.value}>{COMPANY_STAGES.STARTUP.label}</option>
                <option value={COMPANY_STAGES.SERIES_B.value}>{COMPANY_STAGES.SERIES_B.label}</option>
                <option value={COMPANY_STAGES.LATE_STAGE.value}>{COMPANY_STAGES.LATE_STAGE.label}</option>
                <option value={COMPANY_STAGES.PUBLIC.value}>{COMPANY_STAGES.PUBLIC.label}</option>
              </select>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                <FileText className="h-4 w-4 text-gray-500 dark:text-gray-500" />
                <span>Job Description *</span>
              </label>
              <span className={`text-xs font-semibold ${
                formData.description.length >= VALIDATION.MIN_DESCRIPTION_LENGTH
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-gray-500 dark:text-gray-500'
              }`}>
                {formData.description.length} characters
                {formData.description.length < VALIDATION.MIN_DESCRIPTION_LENGTH && ` (min ${VALIDATION.MIN_DESCRIPTION_LENGTH})`}
              </span>
            </div>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={10}
              className={`w-full px-4 py-3 border rounded-button focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all resize-none ${
                formData.description.length >= VALIDATION.MIN_DESCRIPTION_LENGTH
                  ? 'border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-900/20'
                  : 'border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900'
              } text-gray-900 dark:text-gray-100`}
              placeholder="Paste the full job description here..."
            />
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
              {MESSAGES.INSTRUCTION_INCLUDE_DETAILS}
            </p>
          </div>
        </div>
      )}

      {/* Submit Button - Only show in manual mode */}
      {inputMode === 'manual' && (
        <div className="space-y-3">
          <button
            type="submit"
            disabled={!isFormValid}
            className={`w-full py-3.5 px-6 rounded-button transition-all flex items-center justify-center gap-2 font-semibold ${
              isFormValid
                ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white hover:from-primary-700 hover:to-primary-600 shadow-soft hover:shadow-card premium-hover'
                : 'bg-gray-200 dark:bg-gray-800 text-gray-500 dark:text-gray-600 cursor-not-allowed'
            }`}
          >
            <Briefcase className="h-5 w-5" />
            <span>{isFormValid ? 'Analyze Job Fit' : 'Complete Required Fields'}</span>
          </button>
          {!isFormValid && (
            <p className="text-xs text-center text-gray-500 dark:text-gray-500">
              {MESSAGES.INSTRUCTION_COMPLETE_FIELDS}
            </p>
          )}
        </div>
      )}
    </form>
  )
}

export default JobDescriptionInput
