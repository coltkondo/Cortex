import { CheckCircle2, ArrowRight, Sparkles, Target, FileText, Lightbulb } from 'lucide-react'
import ResumeUpload from '../components/resume/ResumeUpload'
import JobDescriptionInput from '../components/jobs/JobDescriptionInput'
import EmptyState from '../components/common/EmptyState'
import Badge from '../components/common/Badge'
import { useStore } from '../store/useStore'
import { APP_STEPS } from '../config/constants'

function HomePage() {
  const { resume } = useStore()

  const steps = [
    {
      ...APP_STEPS.UPLOAD_RESUME,
      completed: !!resume,
      icon: FileText,
    },
    {
      ...APP_STEPS.ADD_JOB,
      completed: false,
      icon: Target,
    },
    {
      ...APP_STEPS.GET_INSIGHTS,
      completed: false,
      icon: Sparkles,
    },
  ]

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Hero Section with better visual hierarchy */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-3">
          <h1 className="text-4xl font-bold text-gray-900">
            Welcome to Cortex
          </h1>
          <Badge variant="primary" size="sm">AI-Powered</Badge>
        </div>
        <p className="text-lg text-gray-600 mb-6">
          Your career second brain for the active job seeker
        </p>

        {/* Progress Indicator - Shows user where they are in the flow */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
              Quick Start Guide
            </h3>
            <span className="text-sm text-gray-500">
              {steps.filter(s => s.completed).length} of {steps.length} completed
            </span>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {steps.map((step, idx) => (
              <div
                key={step.number}
                className={`relative p-4 rounded-lg border-2 transition-all ${
                  step.completed
                    ? 'border-green-500 bg-green-50'
                    : idx === 0 || steps[idx - 1]?.completed
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      step.completed
                        ? 'bg-green-500 text-white'
                        : 'bg-white border-2 border-current text-primary-600'
                    }`}
                  >
                    {step.completed ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : (
                      <span className="text-sm font-bold">{step.number}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <step.icon className="h-4 w-4 text-gray-600" />
                      <h4 className="text-sm font-semibold text-gray-900">
                        {step.title}
                      </h4>
                    </div>
                    <p className="text-xs text-gray-600">
                      {step.description}
                    </p>
                  </div>
                </div>
                {idx < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowRight className="h-4 w-4 text-gray-400" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {/* Resume Upload Section with enhanced styling */}
        <section>
          <div className="flex items-center space-x-3 mb-4">
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full ${
                resume ? 'bg-green-500 text-white' : 'bg-primary-600 text-white'
              }`}
            >
              {resume ? <CheckCircle2 className="h-6 w-6" /> : <span className="font-bold">1</span>}
            </div>
            <h2 className="text-2xl font-semibold text-gray-800">
              Upload Your Resume
            </h2>
            {resume && <Badge variant="success">Completed</Badge>}
          </div>
          <ResumeUpload />
        </section>

        {/* Job Description Input Section - Progressive disclosure */}
        {resume ? (
          <section>
            <div className="flex items-center space-x-3 mb-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-600 text-white">
                <span className="font-bold">2</span>
              </div>
              <h2 className="text-2xl font-semibold text-gray-800">
                Add a Job Description
              </h2>
            </div>
            <JobDescriptionInput />
          </section>
        ) : (
          <section className="opacity-50 pointer-events-none">
            <div className="flex items-center space-x-3 mb-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-gray-300 text-gray-400">
                <span className="font-bold">2</span>
              </div>
              <h2 className="text-2xl font-semibold text-gray-400">
                Add a Job Description
              </h2>
              <Badge variant="default">Locked</Badge>
            </div>
            <div className="bg-white rounded-lg border border-gray-200">
              <EmptyState
                icon={Target}
                title="Upload Your Resume First"
                description="Complete step 1 to unlock job analysis features. Your resume serves as the baseline for all AI-powered comparisons."
              />
            </div>
          </section>
        )}
      </div>

      {/* Feature Cards - Help users understand the value */}
      {!resume && (
        <div className="mt-12 pt-8 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <Lightbulb className="h-5 w-5 text-yellow-500" />
            <span>What You'll Get</span>
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-white p-4 rounded-lg border border-blue-100">
              <div className="text-3xl mb-2">📊</div>
              <h4 className="font-semibold text-gray-900 mb-1">Fit Scoring</h4>
              <p className="text-sm text-gray-600">
                See how well your experience matches each role with detailed breakdowns
              </p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-white p-4 rounded-lg border border-green-100">
              <div className="text-3xl mb-2">✍️</div>
              <h4 className="font-semibold text-gray-900 mb-1">Tailored Content</h4>
              <p className="text-sm text-gray-600">
                Generate customized resume bullets and cover letters for each application
              </p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-white p-4 rounded-lg border border-purple-100">
              <div className="text-3xl mb-2">🎯</div>
              <h4 className="font-semibold text-gray-900 mb-1">Interview Prep</h4>
              <p className="text-sm text-gray-600">
                Get role-specific interview questions and STAR-ready answers
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default HomePage
