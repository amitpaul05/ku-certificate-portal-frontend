import { reactive } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('userStore', () => {
  // const userDefaultSchema = {
  //   id: '',
  //   firstName: '',
  //   lastName: '',
  //   user_type: '',
  //   email: '',
  //   isAuthenticated: false,
  // }

  const userDefaultSchema = {
    id: '',
    firstName: '',
    lastName: '',
    user_type: '',
    email: '',
    isAuthenticated: false,
    // No default detail fields here
  }

 console.log("userDefaultSchema", userDefaultSchema)
 
  const user = reactive({ ...userDefaultSchema })

  function setUserAuth(authState, accessToken, refreshToken) {
    user.isAuthenticated = authState
    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('refreshToken', refreshToken)
  }

  // function setUser(loggedinUser) {
  //   user.id = loggedinUser.id
  //   user.firstName = loggedinUser.first_name
  //   user.lastName = loggedinUser.last_name
  //   user.email = loggedinUser.email
  //   user.user_type = loggedinUser.user_type 
  // }


  function setUser(loggedinUser) {

    // Base user info
    user.id = loggedinUser.id
    user.firstName = loggedinUser.first_name
    user.lastName = loggedinUser.last_name
    user.email = loggedinUser.email
    user.user_type = loggedinUser.user_type
    user.isAuthenticated = true

    // Add only the relevant details dynamically
    if (loggedinUser.user_type === 'student' && loggedinUser.student_details) {
      user.studentDetails = { ...loggedinUser.student_details }
    } else if (loggedinUser.user_type === 'teacher' && loggedinUser.teacher_details) {
      user.teacherDetails = { ...loggedinUser.teacher_details }
    } else if (loggedinUser.user_type === 'librarian' && loggedinUser.librarian_details) {
      user.librarianDetails = { ...loggedinUser.librarian_details }
    }
  }

  function signOutCurrenUser() {
    for (const key in userDefaultSchema) {
      user[key] = userDefaultSchema[key]
    }
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user-store')

  }

  function setUserProfile(profileData){
    user.firstName = profileData.first_name
    user.lastName = profileData.last_name
    user.email = profileData.email
  }

  return { user, setUser, setUserAuth, signOutCurrenUser,setUserProfile}
},{
  persist: {
    key: 'user-store'
  },
})
