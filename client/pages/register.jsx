import { useEffect, useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'

const register = () => {
  const [values, setValues] = useState({
    name: '',
    email: '',
    password: '',
    error: '',
    buttonText: 'Register',
    text: '',
  })
  const { name, email, password, error, buttonText, text } = values
  console.log(process.env.NEXT_PUBLIC_APP_NAME)
  const router = useRouter()

  const handleChange = (name) => (e) => {
    setValues({
      ...values,
      [name]: e.target.value,
      buttonText: 'Register',
      error: '',
    })
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setValues({
        ...values,
        error: '',
        text: '',
      })
    }, 4000)
    return () => clearTimeout(timer)
  }, [error, text])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setValues({ ...values, buttonText: 'Registering' })
    await axios
      .post(`${process.env.NEXT_PUBLIC_APP_NAME}/api/register`, {
        name,
        email,
        password,
      })
      .then(({ data }) => {
        setValues({
          ...values,
          name: '',
          email: '',
          password: '',
          error: '',
          buttonText: 'Registered',
          text: data.message,
        })
      })
      .catch(({ response }) => {
        console.log(response.data.error)
        setValues({
          ...values,
          buttonText: 'Register',
          error: response.data.error,
        })
      })
  }

  return (
    <div className=" mt-[-64px] h-screen bg-gray-200 pt-16">
      <div className="mx-auto grid h-full w-full max-w-sm place-items-center">
        <form
          className="mb-4 flex w-full grow flex-col gap-3 rounded bg-white px-8 pt-6 pb-8 shadow-md"
          onSubmit={handleSubmit}
        >
          <h3 className="mb-3 text-4xl font-semibold">Register</h3>
          {values.text && (
            <p className=" rounded bg-green-400 p-3 text-white">
              {values.text}
            </p>
          )}
          <div className="mb-4">
            <label
              className="mb-2 block text-sm font-bold text-gray-700"
              htmlFor="username"
            >
              Username
            </label>
            <input
              className="focus:shadow-outline w-full appearance-none rounded border py-2 px-3 leading-tight text-gray-700 shadow focus:outline-none"
              id="username"
              type="text"
              placeholder="Username"
              value={name}
              onChange={handleChange('name')}
            />
          </div>
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
              onChange={handleChange('email')}
            />
          </div>
          <div className="mb-2">
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
              onChange={handleChange('password')}
            />
            {error && (
              <p className="mt-3 text-xs italic text-red-500">{error}</p>
            )}
          </div>
          <div className="flex items-center justify-between">
            <button
              className="focus:shadow-outline rounded bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700 focus:outline-none"
              type="submit"
            >
              {buttonText}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default register
