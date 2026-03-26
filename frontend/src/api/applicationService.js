import apiClient from './client'

export const applicationService = {
  // Get all applications
  getApplications: async () => {
    const response = await apiClient.get('/api/applications')
    return response.data
  },

  // Create new application
  createApplication: async (applicationData) => {
    const response = await apiClient.post('/api/applications', applicationData)
    return response.data
  },

  // Update application (stage, notes)
  updateApplication: async (applicationId, updates) => {
    const response = await apiClient.patch(`/api/applications/${applicationId}`, updates)
    return response.data
  },

  // Delete application
  deleteApplication: async (applicationId) => {
    const response = await apiClient.delete(`/api/applications/${applicationId}`)
    return response.data
  },
}
