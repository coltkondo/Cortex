import apiClient from './client'

export const resumeService = {
  uploadResume: async (file) => {
    const formData = new FormData()
    formData.append('file', file)

    const response = await apiClient.post('/api/resume/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },

  getResume: async () => {
    const response = await apiClient.get('/api/resume')
    return response.data
  },

  deleteResume: async () => {
    const response = await apiClient.delete('/api/resume')
    return response.data
  },

  analyzeResume: async () => {
    const response = await apiClient.post('/api/resume/analyze')
    return response.data
  },

  updateSections: async (sections) => {
    const response = await apiClient.patch('/api/resume/sections', sections)
    return response.data
  },

  exportAsText: async () => {
    const response = await apiClient.get('/api/resume')
    const resumeData = response.data
    if (!resumeData) return null

    const blob = new Blob([resumeData.content], { type: 'text/plain' })
    return blob
  },
}
