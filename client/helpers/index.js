export const setLocalStorage = (key, value) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, JSON.stringify(value))
  }
}
export const removeLocalStorage = (key) => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(key)
  }
}
export const authenticate = (response, cb) => {
  setLocalStorage('user', response)
  cb()
}
export const isAuth = () => {
  if (typeof window !== 'undefined') {
    if (localStorage.getItem('user')) {
      return JSON.parse(localStorage.getItem('user'))
    }
    return false
  }
}
