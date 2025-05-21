import apiClient from './axiosService.js'

const urlBase = '/form'

export default {
  createForm(Form) {
    return apiClient.post(`${urlBase}`, Form)
  },

  getAllForm() {
    return apiClient.get(`${urlBase}`)
  },

  getFormById(FormId) {
    return apiClient.get(`${urlBase}/head/${FormId}`)
  },

  updateByHeadForm(FormId, FormData) {
    return apiClient.put(`${urlBase}/head/${FormId}`, FormData)
  },

  updateByProvostForm(FormId, FormData) {
    return apiClient.put(`${urlBase}/provost/${FormId}`, FormData)
  },

  updateByDsaForm(FormId, FormData) {
    return apiClient.put(`${urlBase}/dsa/${FormId}`, FormData)
  },

  updateByLibrarianForm(FormId, FormData) {
    return apiClient.put(`${urlBase}/librarian/${FormId}`, FormData)
  },

//   deleteForm(FormId) {
//     return apiClient.delete(`${urlBase}/${FormId}`)
//   }
}
