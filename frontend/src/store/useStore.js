import { create } from 'zustand'
import { applicationService } from '../api/applicationService'

export const useStore = create((set) => ({
  // Resume state
  resume: null,
  setResume: (resume) => set({ resume }),

  // Jobs state
  jobs: [],
  addJob: (job) => set((state) => ({ jobs: [...state.jobs, job] })),
  updateJob: (jobId, updates) =>
    set((state) => ({
      jobs: state.jobs.map((job) =>
        job.id === jobId ? { ...job, ...updates } : job
      ),
    })),
  removeJob: (jobId) =>
    set((state) => ({ jobs: state.jobs.filter((job) => job.id !== jobId) })),

  // Applications state
  applications: [],
  addApplication: (application) =>
    set((state) => ({ applications: [...state.applications, application] })),
  updateApplication: (applicationId, updates) =>
    set((state) => ({
      applications: state.applications.map((app) =>
        app.id === applicationId ? { ...app, ...updates } : app
      ),
    })),
  removeApplication: (applicationId) =>
    set((state) => ({
      applications: state.applications.filter(
        (app) => app.id !== applicationId
      ),
    })),
  setApplications: (applications) => set({ applications }),
  fetchApplications: async () => {
    try {
      const applications = await applicationService.getApplications()
      set({ applications })
    } catch (error) {
      console.error('Failed to fetch applications:', error)
    }
  },

  // Generated content state
  generatedContent: {},
  setGeneratedContent: (jobId, contentType, content) =>
    set((state) => ({
      generatedContent: {
        ...state.generatedContent,
        [jobId]: {
          ...state.generatedContent[jobId],
          [contentType]: content,
        },
      },
    })),

  // Insights state
  insights: null,
  setInsights: (insights) => set({ insights }),
  clearInsights: () => set({ insights: null }),

  // UI state
  loading: false,
  setLoading: (loading) => set({ loading }),
  error: null,
  setError: (error) => set({ error }),
}))
