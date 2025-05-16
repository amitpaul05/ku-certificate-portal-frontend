import apiClient from './axiosService.js'

export default {
  registerUser(user) {
    return apiClient.post('/user/register/', user, { public: true })
  },

  getToken(email, password) {
    const userData = {
      email: email,
      password: password
    }
    return apiClient.post('/user/token/', userData, { public: true })
  },
  getUserDetails(userId) {
    return apiClient.get(`user/${userId}/`, { public: true })
  },
  updateUserProfile(userId, formData){

    return apiClient.put(`user/${userId}/edit/`, formData)
  },
  changePassword(userId, passwordData) {
    return apiClient.put(`/user/${userId}/change-password/`, passwordData)
  },
}
