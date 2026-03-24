import apiClient from './client'

export const analysisService = {
  analyzeFit: async (jobId) => {
    const response = await apiClient.post(`/api/analysis/fit-score/${jobId}`)
    return response.data
  },

  generateBullets: async (jobId) => {
    const response = await apiClient.post(`/api/analysis/bullets/${jobId}`)
    return response.data
  },

  generateCoverLetter: async (jobId, tone = 'professional') => {
    const response = await apiClient.post(`/api/analysis/cover-letter/${jobId}`, {
      tone,
    })
    return response.data
  },

  generateInterviewPrep: async (jobId) => {
    const response = await apiClient.post(`/api/analysis/interview-prep/${jobId}`)
    return response.data
  },

  getGeneratedContent: async (jobId) => {
    const response = await apiClient.get(`/api/analysis/content/${jobId}`)
    return response.data
  },
}
