import apiClient from './axiosService.js'

const urlBase = '/form'

export default {


  getAllHead() {
    return apiClient.get(`${urlBase}`)

  },

  getHeadById(HeadId) {
    return apiClient.get(`${urlBase}/${HeadId}`)
  },
}
