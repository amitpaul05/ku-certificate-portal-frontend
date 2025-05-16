import axios from 'axios'
import { jwtDecode } from 'jwt-decode'
import { createPinia, setActivePinia } from 'pinia'
import { useUserStore } from '@/stores/userStore.js'
import Swal from 'sweetalert2'


// const baseURL = "http://localhost:8000/api/"
const pinia = createPinia()
setActivePinia(pinia)

const userStore = useUserStore()

function getBaseURL() {
  console.log("called the base url")
  const locale = localStorage.getItem('locale');
  console.log(locale)
  if(locale) {
    return locale?.toLowerCase() === 'en'
    ? import.meta.env.VITE_API_URL
    : import.meta.env.VITE_API_BN_URL
  }
  else {
    return import.meta.env.VITE_API_URL
  }

}


const isTokenExpired = (token) => {
  if (!token) return true
  const decodedToken = jwtDecode(token)
  const currentTime = new Date().getTime() / 1000 // current time in seconds
  return decodedToken.exp < currentTime
}

const getNewToken = async (refreshToken) => {
  try {
    const response = await axios.post(`${getBaseURL()}/user/token/refresh/`, { refresh: refreshToken })
    const newAuthToken = response.data.access
    localStorage.setItem('accessToken', newAuthToken)
    return newAuthToken
  } catch (error) {
    console.log(error);
    return null
  }
}


const getAuthToken = async () =>{
  const authToken = localStorage.getItem('accessToken')
  const refreshToken = localStorage.getItem('refreshToken')

  if (isTokenExpired(authToken)) {
    if (refreshToken) {
      const newAuthToken = await getNewToken(refreshToken)
      if (newAuthToken) {
        return newAuthToken
      }
    }
  } else {
    return authToken
  }

  return null
}

const logOutUser = () => {
  console.log('in logout')
  setTimeout(() => {
    userStore.signOutCurrenUser()
    window.location = '/'
  }, 1500)
  Swal.fire({
    title: 'Session has expired!!!',
    icon: 'warning',
    timer: 2000
  }).then((result) => {})
}

const ApiClient = () => {
  const defaultOptions = {
    baseURL: getBaseURL(),
    headers: { Accept: 'application/json' }
  }

  const instance = axios.create(defaultOptions)

  instance.interceptors.request.use(async (request) => {
    const requireToken = request.public !== undefined ? !request.public : true

    // Sometimes in public API we may need to pass the token
    // Use sendToken: True to send token with request even though it may be public
    const sendToken = request.sendToken !== undefined ? request.sendToken : true

    const contentType = request.contentType
    if (contentType) {
      request.headers['Content-Type'] = contentType
    } else {
      request.headers['Content-Type'] = 'application/json'
    }

    if (requireToken || sendToken) {
      const authToken = await getAuthToken()
      if (authToken) {
        request.headers.Authorization = `Bearer ${authToken}`
      }else{
        if(requireToken){
          logOutUser()
        }
      }
    }
    return request
  })

  return instance
}

export default ApiClient()



