import apiClient from './axiosService.js'

const urlBase = '/hall'

export default {


  getAllHall() {
    return apiClient.get(`${urlBase}`)
  },

  getHallById(HallId) {
    return apiClient.get(`${urlBase}/${HallId}`)
  },
}
