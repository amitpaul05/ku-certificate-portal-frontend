import apiClient from './axiosService.js'

const urlBase = '/form'

export default {
  createForm(Form) {
    return apiClient.post(`${urlBase}`, Form)
  },

//   getAllCities() {
//     return apiClient.get(`${urlBase}`)
//   },

//   getFormById(FormId) {
//     return apiClient.get(`${urlBase}/${FormId}`)
//   },

//   updateForm(FormId, FormData) {
//     return apiClient.put(`${urlBase}/${FormId}`, FormData)
//   },

//   deleteForm(FormId) {
//     return apiClient.delete(`${urlBase}/${FormId}`)
//   }
}
