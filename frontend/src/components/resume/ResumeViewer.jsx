import { FileText, Calendar, Type, Hash } from 'lucide-react'
import { useStore } from '../../store/useStore'

/**
 * ResumeViewer - Display resume in premium read-only format
 * Shows filename, upload date, stats, full content, and sections
 */
function ResumeViewer() {
  const { resume } = useStore()

  if (!resume) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <p className="text-gray-600 dark:text-gray-400">No resume loaded</p>
      </div>
    )
  }

  // Calculate stats
  const wordCount = resume.content ? resume.content.split(/\s+/).length : 0
  const charCount = resume.content ? resume.content.length : 0
  const uploadDate = resume.uploaded_at ? new Date(resume.uploaded_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }) : 'Unknown'

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Card with Stats */}
      <div className="premium-card p-8">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-100 to-emerald-50 dark:from-emerald-900/30 dark:to-emerald-800/20 flex items-center justify-center flex-shrink-0">
            <FileText className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
              {resume.filename}
            </h2>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Calendar className="w-4 h-4" />
              <span>Uploaded {uploadDate}</span>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-6 border-t border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center">
              <Type className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {wordCount.toLocaleString()}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Words</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center">
              <Hash className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {charCount.toLocaleString()}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Characters</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center">
              <FileText className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {resume.content ? Math.ceil(wordCount / 250) : 0}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Pages (~)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Full Content Card */}
      <div className="premium-card p-8">
        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary-600 dark:text-primary-400" />
          Full Content
        </h3>
        <div className="prose prose-sm max-w-none dark:prose-invert">
          <div className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap font-mono text-sm">
            {resume.content || 'No content available'}
          </div>
        </div>
      </div>

      {/* Experience Section */}
      {resume.experience_section && (
        <div className="premium-card p-8">
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
              <span className="text-sm font-bold text-primary-600 dark:text-primary-400">E</span>
            </div>
            Experience
          </h3>
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <div className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
              {resume.experience_section}
            </div>
          </div>
        </div>
      )}

      {/* Skills Section */}
      {resume.skills_section && (
        <div className="premium-card p-8">
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
              <span className="text-sm font-bold text-primary-600 dark:text-primary-400">S</span>
            </div>
            Skills
          </h3>
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <div className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
              {resume.skills_section}
            </div>
          </div>
        </div>
      )}

      {/* Education Section */}
      {resume.education_section && (
        <div className="premium-card p-8">
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
              <span className="text-sm font-bold text-primary-600 dark:text-primary-400">D</span>
            </div>
            Education
          </h3>
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <div className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
              {resume.education_section}
            </div>
          </div>
        </div>
      )}

      {/* Projects Section */}
      {resume.projects_section && (
        <div className="premium-card p-8">
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
              <span className="text-sm font-bold text-primary-600 dark:text-primary-400">P</span>
            </div>
            Projects
          </h3>
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <div className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
              {resume.projects_section}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ResumeViewer
