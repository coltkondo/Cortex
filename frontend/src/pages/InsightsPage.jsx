import { useState, useEffect } from 'react'
import {
  BarChart3, TrendingUp, Clock, Target,
  Building2, Briefcase, Activity
} from 'lucide-react'
import StatCard from '../components/insights/StatCard'
import FunnelChart from '../components/insights/FunnelChart'
import TopListCard from '../components/insights/TopListCard'
import EmptyState from '../components/common/EmptyState'
import PremiumButton from '../components/common/PremiumButton'
import PageHeader from '../components/common/PageHeader'
import { useNavigate } from 'react-router-dom'

/**
 * InsightsPage - Analytics dashboard
 * Track job search progress, identify trends, and measure success
 */
function InsightsPage() {
  const [insights, setInsights] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    fetchInsights()
  }, [])

  const fetchInsights = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('http://localhost:8000/api/insights')
      if (!response.ok) throw new Error('Failed to fetch insights')
      const data = await response.json()
      setInsights(data)
    } catch (err) {
      console.error('Failed to fetch insights:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <PageHeader
          icon={BarChart3}
          title="Insights"
          description="Track your job search progress and identify trends"
        />

        {/* Loading Skeleton */}
        <div className="container-premium py-12">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="premium-card p-6 animate-pulse">
                <div className="h-20 bg-gray-200 dark:bg-gray-800 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <EmptyState
          icon={BarChart3}
          title="Failed to Load Insights"
          description={error}
          action={
            <PremiumButton variant="primary" onClick={fetchInsights}>
              Try Again
            </PremiumButton>
          }
        />
      </div>
    )
  }

  // Empty state: no applications yet
  if (insights && insights.stats.totalApplications === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <PageHeader
          icon={BarChart3}
          title="Insights"
          description="Track your job search progress and identify trends"
        />

        <div className="container-premium py-12 flex items-center justify-center min-h-[500px]">
          <EmptyState
            icon={BarChart3}
            title="No Insights Yet"
            description="Start adding applications to your pipeline to see analytics and trends"
            action={
              <PremiumButton variant="primary" onClick={() => navigate('/applications')}>
                Go to Applications
              </PremiumButton>
            }
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <PageHeader
        icon={BarChart3}
        title="Insights"
        description="Track your job search progress and identify trends"
      />

      {/* Content */}
      <div className="container-premium py-12">
        {/* Overview Stats */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Applications"
            value={insights.stats.totalApplications}
            subtitle="All time"
            icon={Target}
          />
          <StatCard
            title="Active Applications"
            value={insights.stats.activeApplications}
            subtitle="In progress"
            icon={Activity}
          />
          <StatCard
            title="Interview Rate"
            value={`${insights.stats.successRate.interviewRate}%`}
            subtitle="Applications → Interviews"
            icon={TrendingUp}
          />
          <StatCard
            title="Avg. Response Time"
            value={insights.stats.averageTimeInStage.appliedToScreen !== null
              ? `${insights.stats.averageTimeInStage.appliedToScreen} days`
              : 'N/A'}
            subtitle="Applied → Screen"
            icon={Clock}
          />
        </div>

        {/* Funnel */}
        <div className="grid lg:grid-cols-1 gap-6 mb-8">
          <div className="premium-card p-8">
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              Application Funnel
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              Track how applications progress through each stage of your job search
            </p>
            <FunnelChart
              byStage={insights.stats.byStage}
              successRate={insights.stats.successRate}
            />
          </div>
        </div>

        {/* Top Companies + Top Roles */}
        <div className="grid lg:grid-cols-2 gap-6">
          <TopListCard
            title="Top Companies"
            items={insights.topCompanies.map(c => ({ name: c.company, count: c.count }))}
            icon={Building2}
          />
          <TopListCard
            title="Top Roles"
            items={insights.topRoles.map(r => ({ name: r.role, count: r.count }))}
            icon={Briefcase}
          />
        </div>
      </div>
    </div>
  )
}

export default InsightsPage
