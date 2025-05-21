import Librarian from '@/components/Teacher/Librarian.vue'
import apiClient from './axiosService.js'

const urlBase = '/form'

export default {
  getAllLibrary() {
    return apiClient.get(`${urlBase}`)
  },

  getLibraryById(LibrarianId) {
    return apiClient.get(`${urlBase}/${LibrarianId}`)
  },
}
