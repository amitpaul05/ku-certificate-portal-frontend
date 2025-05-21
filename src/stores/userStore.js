// stores/userStore.js
import { reactive } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('userStore', () => {
  const userDefaultSchema = {
    id: '',
    firstName: '',
    lastName: '',
    user_type: '',
    email: '',
    isAuthenticated: false,
    // role-specific fields will be added dynamically
  }

  const user = reactive({ ...userDefaultSchema })

  function setUserAuth(authState, accessToken, refreshToken) {
    user.isAuthenticated = authState
    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('refreshToken', refreshToken)
  }

  function setUser(loggedinUser) {
    // Clean previous role-specific data if any
    delete user.studentDetails
    delete user.teacherDetails
    delete user.librarianDetails

    // Base user info
    user.id = loggedinUser.id
    user.firstName = loggedinUser.first_name
    user.lastName = loggedinUser.last_name
    user.email = loggedinUser.email
    user.user_type = loggedinUser.user_type
    user.isAuthenticated = true

    // Role-specific details
    if (loggedinUser.user_type === 'student' && loggedinUser.student_details) {
      user.studentDetails = { ...loggedinUser.student_details }
    } else if (loggedinUser.user_type === 'teacher' && loggedinUser.teacher_details) {
      user.teacherDetails = { ...loggedinUser.teacher_details }

      // Optional: also flatten head_info if needed
      if (loggedinUser.teacher_details.head_info) {
        user.teacherDetails.headInfo = { ...loggedinUser.teacher_details.head_info }
      }
    } else if (loggedinUser.user_type === 'librarian' && loggedinUser.librarian_details) {
      user.librarianDetails = { ...loggedinUser.librarian_details }
    }
  }


  function setUserProfile(profileData) {
    user.firstName = profileData.first_name
    user.lastName = profileData.last_name
    user.email = profileData.email
  }

  function signOutCurrenUser() {
    for (const key in userDefaultSchema) {
      user[key] = userDefaultSchema[key]
    }
    delete user.studentDetails
    delete user.teacherDetails
    delete user.librarianDetails

    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user-store')
  }

  return {
    user,
    setUser,
    setUserAuth,
    setUserProfile,
    signOutCurrenUser,
  }
}, {
  persist: {
    key: 'user-store',
  },
})
