import axios from 'axios'
import { useRouter } from 'next/router'
import { createContext, useContext, useEffect, useReducer } from 'react'
import { removeLocalStorage, setLocalStorage } from '../helpers/index'

const initialState = {
  user: null,
}
export const UserContext = createContext(initialState)

const userReducer = (state, action) => {
  const { type, payload } = action
  switch (type) {
    case 'LOGIN':
      return { ...state, user: payload }
    case 'UPDATE':
      setLocalStorage('user', payload)
      console.log('update success')
      return { ...state, user: payload }
    case 'LOGOUT':
      removeLocalStorage('user')
      return { ...state, user: null }
    default:
      throw new Error('No case for this type in userReducer')
  }
}

export const UserProvider = ({ children, user }) => {
  const [state, dispatch] = useReducer(userReducer, initialState)
  const router = useRouter()

  axios.defaults.withCredentials = true
  useEffect(() => {
    try {
      const getCsrfToken = async () => {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_APP_NAME}/api/csrf-token`
        )
        axios.defaults.headers['X-CSRF-Token'] = data.csrfToken
      }
      getCsrfToken()
    } catch (error) {
      console.log(error)
    }
  }, [])
  useEffect(async () => {
    await axios
      .get(`${process.env.NEXT_PUBLIC_APP_NAME}/api/user`)
      .then(({ data }) => {
        dispatch({
          type: 'LOGIN',
          payload: JSON.parse(window.localStorage.getItem('user')),
        })
      })
      .catch(({ response }) => {
        dispatch({ type: 'LOGOUT' })
      })
  }, [])
  axios.interceptors.response.use(
    function (response) {
      // any status code that lie within the range of 2XX cause this function
      // to trigger
      return response
    },
    function (error) {
      // any status codes that falls outside the range of 2xx cause this function
      // to trigger
      let res = error.response
      if (res.status === 401 && res.config && !res.config.__isRetryRequest) {
        return new Promise((resolve, reject) => {
          axios
            .get(`${process.env.NEXT_PUBLIC_APP_NAME}/api/logout`)
            .then((data) => {
              dispatch({ type: 'LOGOUT' })
            })
            .catch((err) => {
              console.log('AXIOS INTERCEPTORS ERR', err)
              reject(error)
            })
        })
      }
      return Promise.reject(error)
    }
  )
  return (
    <UserContext.Provider value={{ state, dispatch }}>
      {children}
    </UserContext.Provider>
  )
}
const useUser = () => {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within UserContext')
  }
  return context
}
export default useUser
