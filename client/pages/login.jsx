import axios from 'axios'
import Router, { useRouter } from 'next/router'
import { useContext, useEffect, useState } from 'react'
import { authenticate, isAuth } from '../helpers'
import useUser, { UserContext } from '../context'
const Login = () => {
  const [values, setValues] = useState({
    email: '',
    password: '',
    error: '',
    buttonText: 'Login',
    text: '',
  })
  const { email, password, error, buttonText, text } = values
  const { state, dispatch } = useUser()
  const { user } = state
  const router = useRouter()

  useEffect(() => {
    if (isAuth()) router.push('/')
  }, [isAuth()])
  const handleChange = (name) => (e) => {
    setValues({
      ...values,
      [name]: e.target.value,
      buttonText: 'Login',
      error: '',
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    await axios
      .post(`${process.env.NEXT_PUBLIC_APP_NAME}/api/login`, {
        email,
        password,
      })
      .then(({ data }) => {
        // window.localStorage.setItem('user', JSON.stringify(data.user))
        // console.log(data.user)
        dispatch({ type: 'LOGIN', payload: data.user })
        authenticate(data.user, () => {
          isAuth() && isAuth().role === 'admin'
            ? router.push('/admin')
            : router.push('/user')
        })
      })
      .catch(({ response }) => {
        console.log(response)
        setValues({
          ...values,
          error: response.data.error,
        })
      })
  }
  return (
    <div className=" mt-[-64px] h-screen bg-gray-200 pt-16">
      <div className="mx-auto grid h-full w-full max-w-sm place-items-center">
        <form
          className="mb-4 flex w-full grow flex-col rounded bg-white px-8 pt-6 pb-8 shadow-md"
          onSubmit={handleSubmit}
        >
          <h3 className=" mb-10 text-4xl font-semibold">Login</h3>
          {values.text && (
            <p className=" rounded bg-green-400 p-3 text-white">
              {values.text}
            </p>
          )}
          <div className="mb-4">
            <label
              className="mb-2 block text-sm font-bold text-gray-700"
              htmlFor="email"
            >
              Email
            </label>
            <input
              className="focus:shadow-outline w-full appearance-none rounded border py-2 px-3 leading-tight text-gray-700 shadow focus:outline-none"
              id="email"
              type="email"
              placeholder="Email"
              value={email}
              required
              onChange={handleChange('email')}
            />
          </div>
          <div className="mb-6">
            <label
              className="mb-2 block text-sm font-bold text-gray-700"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className="focus:shadow-outline mb-3 w-full appearance-none rounded border py-2 px-3 leading-tight text-gray-700 shadow focus:outline-none"
              id="password"
              type="password"
              placeholder="Password"
              value={password}
              required
              onChange={handleChange('password')}
            />
            {error && <p className="text-xs italic text-red-500">{error}</p>}
          </div>
          <div className="flex items-center justify-between">
            <button
              className="focus:shadow-outline rounded bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700 focus:outline-none"
              type="submit"
            >
              {buttonText}
            </button>
          </div>
          {/* <p>{JSON.stringify(values)}</p> */}
        </form>
      </div>
    </div>
  )
}

export default Login
