import apiClient from './client'

export const jobService = {
  fetchFromUrl: async (url) => {
    const response = await apiClient.post('/api/jobs/fetch-from-url', { url })
    return response.data
  },

  createJob: async (jobData) => {
    const response = await apiClient.post('/api/jobs', jobData)
    return response.data
  },

  getJobs: async () => {
    const response = await apiClient.get('/api/jobs')
    return response.data
  },

  getJob: async (jobId) => {
    const response = await apiClient.get(`/api/jobs/${jobId}`)
    return response.data
  },

  updateJob: async (jobId, updates) => {
    const response = await apiClient.patch(`/api/jobs/${jobId}`, updates)
    return response.data
  },

  deleteJob: async (jobId) => {
    const response = await apiClient.delete(`/api/jobs/${jobId}`)
    return response.data
  },
}
