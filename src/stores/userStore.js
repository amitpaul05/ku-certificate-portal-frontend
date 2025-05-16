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
  }


  const user = reactive({ ...userDefaultSchema })

  function setUserAuth(authState, accessToken, refreshToken) {
    user.isAuthenticated = authState
    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('refreshToken', refreshToken)
  }

  function setUser(loggedinUser) {
    user.id = loggedinUser.id
    user.firstName = loggedinUser.first_name
    user.lastName = loggedinUser.last_name
    user.email = loggedinUser.email
    user.user_type = loggedinUser.user_type
  }

  function signOutCurrenUser() {
    for (const key in userDefaultSchema) {
      user[key] = userDefaultSchema[key]
    }
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user-store')
    localStorage.removeItem('locale')
    localStorage.removeItem('locale-store')
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
