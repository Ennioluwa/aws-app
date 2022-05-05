import axios from 'axios'
import { createContext, useContext, useEffect, useReducer } from 'react'

const initialState = {
  user: null,
}
export const UserContext = createContext(initialState)

const userReducer = (state, action) => {
  const { type, payload } = action
  switch (type) {
    case 'LOGIN':
      return { ...state, user: payload }
    case 'LOGOUT':
      console.log('Logout')
      return { ...state, user: null }
    default:
      throw new Error('No case for this type in userReducer')
  }
}

export const UserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialState)

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
  useEffect(() => {
    dispatch({
      type: 'LOGIN',
      payload: JSON.parse(window.localStorage.getItem('user')),
    })
  }, [])

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
