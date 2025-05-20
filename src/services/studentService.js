import apiClient from './axiosService.js';

const urlBase = '/user/student';

export default {
  createStudent(studentData) {
    return apiClient.post(`${urlBase}/`, studentData);
  },
  getAllStudent() {
    return apiClient.get(`${urlBase}/`);
  },
  getStudentById(studentId) {
    return apiClient.get(`${urlBase}/${studentId}/`);
  },
  updateStudent(studentId, studentData) {
    return apiClient.put(`${urlBase}/${studentId}/`, studentData);
  },
  deleteStudent(studentId) {
    return apiClient.delete(`${urlBase}/${studentId}/`);
  }
};
