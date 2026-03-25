import { useNavigate } from 'react-router-dom'
import { Upload, Link as LinkIcon, Target, FileText, MessageSquare, TrendingUp, ArrowRight } from 'lucide-react'
import { useStore } from '../store/useStore'
import HeroCard from '../components/common/HeroCard'
import FeatureCard from '../components/common/FeatureCard'
import PremiumButton from '../components/common/PremiumButton'
import ResumeUpload from '../components/resume/ResumeUpload'
import JobDescriptionInput from '../components/jobs/JobDescriptionInput'

/**
 * HomePage - Premium Dashboard
 * Feature cards grid, hero section, clean layout
 */
function HomePage() {
  const navigate = useNavigate()
  const { resume } = useStore()

  const handleStartNewAnalysis = () => {
    const targetSection = resume ? document.getElementById('job-section') : document.getElementById('resume-section')
    if (targetSection) {
      targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const features = [
    {
      id: 'upload-resume',
      icon: Upload,
      title: 'Upload Resume',
      description: 'Upload your resume to start analyzing job matches and get AI-powered insights',
      onClick: () => {
        document.getElementById('resume-section')?.scrollIntoView({ behavior: 'smooth' })
      },
      status: resume ? 'completed' : 'active',
    },
    {
      id: 'add-job',
      icon: LinkIcon,
      title: 'Add Job Description',
      description: 'Paste a job description or URL to analyze fit and generate tailored content',
      onClick: () => {
        document.getElementById('job-section')?.scrollIntoView({ behavior: 'smooth' })
      },
      status: resume ? 'active' : 'locked',
    },
    {
      id: 'match-score',
      icon: Target,
      title: 'Resume Match Score',
      description: 'See how well your experience aligns with job requirements and skill gaps',
      onClick: () => navigate('/applications'),
      status: resume ? 'active' : 'locked',
    },
    {
      id: 'cover-letter',
      icon: FileText,
      title: 'Generate Cover Letter',
      description: 'Create personalized cover letters that highlight your relevant experience',
      onClick: () => navigate('/applications'),
      status: resume ? 'active' : 'locked',
    },
    {
      id: 'interview-prep',
      icon: MessageSquare,
      title: 'Interview Questions',
      description: 'Get role-specific interview questions and STAR-ready answers',
      onClick: () => navigate('/applications'),
      status: resume ? 'active' : 'locked',
    },
    {
      id: 'skill-gap',
      icon: TrendingUp,
      title: 'Skill Gap Analysis',
      description: 'Identify missing skills and get recommendations to strengthen your profile',
      onClick: () => navigate('/insights'),
      status: resume ? 'active' : 'locked',
      badge: 'Soon',
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Hero Section */}
      <section className="container-premium py-16 md:py-24">
        <HeroCard className="fade-in-up">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4 leading-tight">
              Welcome to Your
              <span className="block mt-1 bg-gradient-premium bg-clip-text text-transparent">
                Career Command Center
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
              Transform your job search with AI-powered insights. Upload your resume, analyze job fits,
              and generate tailored content—all in one place.
            </p>
            <div className="flex flex-wrap gap-4">
              <PremiumButton
                variant="primary"
                size="lg"
                icon={ArrowRight}
                iconPosition="right"
                onClick={handleStartNewAnalysis}
              >
                Start New Analysis
              </PremiumButton>
              <PremiumButton
                variant="secondary"
                size="lg"
                onClick={() => navigate('/applications')}
              >
                View Applications
              </PremiumButton>
            </div>
          </div>
        </HeroCard>
      </section>

      {/* Feature Cards Grid */}
      <section className="container-premium pb-24">
        <div className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3">
            Everything You Need
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Powerful features to accelerate your job search
          </p>
        </div>

        <div className="grid-features">
          {features.map((feature, index) => (
            <div
              key={feature.id}
              className={`fade-in-up-delay-${Math.min(index % 3, 3)}`}
            >
              <FeatureCard {...feature} />
            </div>
          ))}
        </div>
      </section>

      {/* Resume Upload Section */}
      <section id="resume-section" className="container-premium pb-24">
        <div className="premium-card p-10 max-w-4xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-100 to-primary-50 dark:from-primary-900/30 dark:to-primary-800/20 flex items-center justify-center">
                <Upload className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  Upload Your Resume
                </h3>
                {resume && (
                  <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium mt-1">
                    ✓ Resume uploaded successfully
                  </p>
                )}
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              {resume
                ? 'Your resume is ready. You can now analyze job descriptions and generate tailored content.'
                : 'Upload your resume to unlock all features and start analyzing job opportunities.'
              }
            </p>
          </div>

          <ResumeUpload />
        </div>
      </section>

      {/* Job Description Section */}
      {resume && (
        <section id="job-section" className="container-premium pb-24">
          <div className="premium-card p-10 max-w-4xl mx-auto">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-100 to-primary-50 dark:from-primary-900/30 dark:to-primary-800/20 flex items-center justify-center">
                  <LinkIcon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    Add Job Description
                  </h3>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Paste a job posting URL or the full job description to analyze your fit and generate custom content.
              </p>
            </div>

            <JobDescriptionInput />
          </div>
        </section>
      )}
    </div>
  )
}

export default HomePage
