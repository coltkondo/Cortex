import { useState } from 'react'
import { Save, CheckCircle } from 'lucide-react'
import { useStore } from '../../store/useStore'
import { resumeService } from '../../api/resumeService'
import PremiumButton from '../common/PremiumButton'

/**
 * ResumeEditor - Edit resume sections with premium form styling
 * Textareas for Experience, Skills, Education, Projects
 * Save button with loading state
 */
function ResumeEditor() {
  const { resume, setResume } = useStore()
  const [sections, setSections] = useState({
    experienceSection: resume?.experience_section || '',
    skillsSection: resume?.skills_section || '',
    educationSection: resume?.education_section || '',
    projectsSection: resume?.projects_section || '',
  })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState(null)

  if (!resume) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <p className="text-gray-600 dark:text-gray-400">No resume loaded</p>
      </div>
    )
  }

  const handleSave = async () => {
    setSaving(true)
    setError(null)
    setSaved(false)

    try {
      const updatedResume = await resumeService.updateSections(sections)
      setResume(updatedResume)
      setSaved(true)

      // Hide success message after 3 seconds
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to save changes')
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (field, value) => {
    setSections({ ...sections, [field]: value })
    setSaved(false) // Clear saved state when editing
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Info Card */}
      <div className="premium-card p-6 bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800">
        <p className="text-sm text-gray-700 dark:text-gray-300">
          <strong>Tip:</strong> Edit your resume sections below. These sections will be used for AI-powered analysis and improvements. Leave sections blank if not applicable.
        </p>
      </div>

      {/* Experience Section */}
      <div className="premium-card p-8">
        <label className="block mb-3">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
              <span className="text-sm font-bold text-primary-600 dark:text-primary-400">E</span>
            </div>
            <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Experience
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            List your work experience, roles, and responsibilities
          </p>
          <textarea
            value={sections.experienceSection}
            onChange={(e) => handleChange('experienceSection', e.target.value)}
            rows={10}
            placeholder="e.g., Software Engineer at Company (2020-2023)&#10;• Developed web applications using React and Node.js&#10;• Led team of 3 engineers&#10;• Improved performance by 40%"
            className="
              w-full px-4 py-3 rounded-button
              border border-gray-300 dark:border-gray-700
              bg-white dark:bg-gray-900
              text-gray-900 dark:text-gray-100
              placeholder-gray-400 dark:placeholder-gray-600
              focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
              transition-colors resize-none
              font-mono text-sm
            "
          />
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
            {sections.experienceSection.length} characters
          </p>
        </label>
      </div>

      {/* Skills Section */}
      <div className="premium-card p-8">
        <label className="block mb-3">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
              <span className="text-sm font-bold text-primary-600 dark:text-primary-400">S</span>
            </div>
            <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Skills
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            List your technical and soft skills
          </p>
          <textarea
            value={sections.skillsSection}
            onChange={(e) => handleChange('skillsSection', e.target.value)}
            rows={6}
            placeholder="e.g., JavaScript, React, Node.js, TypeScript, Git, AWS, Agile, Team Leadership"
            className="
              w-full px-4 py-3 rounded-button
              border border-gray-300 dark:border-gray-700
              bg-white dark:bg-gray-900
              text-gray-900 dark:text-gray-100
              placeholder-gray-400 dark:placeholder-gray-600
              focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
              transition-colors resize-none
              font-mono text-sm
            "
          />
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
            {sections.skillsSection.length} characters
          </p>
        </label>
      </div>

      {/* Education Section */}
      <div className="premium-card p-8">
        <label className="block mb-3">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
              <span className="text-sm font-bold text-primary-600 dark:text-primary-400">D</span>
            </div>
            <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Education
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            List your degrees, certifications, and academic achievements
          </p>
          <textarea
            value={sections.educationSection}
            onChange={(e) => handleChange('educationSection', e.target.value)}
            rows={6}
            placeholder="e.g., Bachelor of Science in Computer Science&#10;University Name, 2016-2020&#10;GPA: 3.8/4.0"
            className="
              w-full px-4 py-3 rounded-button
              border border-gray-300 dark:border-gray-700
              bg-white dark:bg-gray-900
              text-gray-900 dark:text-gray-100
              placeholder-gray-400 dark:placeholder-gray-600
              focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
              transition-colors resize-none
              font-mono text-sm
            "
          />
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
            {sections.educationSection.length} characters
          </p>
        </label>
      </div>

      {/* Projects Section */}
      <div className="premium-card p-8">
        <label className="block mb-3">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
              <span className="text-sm font-bold text-primary-600 dark:text-primary-400">P</span>
            </div>
            <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Projects
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            Highlight notable projects and personal work
          </p>
          <textarea
            value={sections.projectsSection}
            onChange={(e) => handleChange('projectsSection', e.target.value)}
            rows={6}
            placeholder="e.g., E-commerce Platform&#10;• Built full-stack e-commerce site with React and Node.js&#10;• Implemented payment processing with Stripe&#10;• Deployed to AWS with 99.9% uptime"
            className="
              w-full px-4 py-3 rounded-button
              border border-gray-300 dark:border-gray-700
              bg-white dark:bg-gray-900
              text-gray-900 dark:text-gray-100
              placeholder-gray-400 dark:placeholder-gray-600
              focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
              transition-colors resize-none
              font-mono text-sm
            "
          />
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
            {sections.projectsSection.length} characters
          </p>
        </label>
      </div>

      {/* Error Message */}
      {error && (
        <div className="premium-card p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
        </div>
      )}

      {/* Save Button */}
      <div className="flex items-center gap-4">
        <PremiumButton
          variant="primary"
          size="lg"
          icon={saved ? CheckCircle : Save}
          onClick={handleSave}
          loading={saving}
          disabled={saving || saved}
          className="flex-1 md:flex-initial"
        >
          {saved ? 'Saved!' : 'Save Changes'}
        </PremiumButton>

        {saved && (
          <p className="text-sm text-emerald-600 dark:text-emerald-400">
            Your changes have been saved successfully
          </p>
        )}
      </div>
    </div>
  )
}

export default ResumeEditor
