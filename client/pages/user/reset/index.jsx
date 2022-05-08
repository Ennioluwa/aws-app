import axios from 'axios'
import Router from 'next/router'
import { useEffect, useState } from 'react'
import UserAuth from '../../../components/auth/UserAuth'
import useUser from '../../../context'
import { isAuth } from '../../../helpers'

const index = () => {
  const [values, setValues] = useState({
    email: '',
    error: '',
    buttonText: 'Submit',
    text: '',
  })
  const { email, error, buttonText, text } = values
  const { state, dispatch } = useUser()
  const { user } = state
  const handleEmail = (e) => {
    setValues({ ...values, email: e.target.value })
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    setValues({ ...values, buttonText: 'Submitting' })
    await axios
      .put(`${process.env.NEXT_PUBLIC_APP_NAME}/api/forgot-password`, {
        email,
      })
      .then(({ data }) => {
        // window.localStorage.setItem('user', JSON.stringify(data.user))
        console.log(data.message)
        setValues({
          ...values,
          text: data.message,
          error: '',
          buttonText: 'Submitted',
        })
      })
      .catch(({ response }) => {
        console.log(response)
        setValues({
          ...values,
          error: response.data.error,
          buttonText: 'Submit',
        })
      })
  }
  useEffect(() => {
    if (isAuth()) {
      Router.push('/')
    }
  }, [])
  if (!user) {
    return (
      <div className=" mt-[-64px] h-screen bg-gray-200 pt-16">
        <div className="mx-auto grid h-full w-full max-w-sm place-items-center">
          <form
            className=" flex w-full grow flex-col gap-5 rounded bg-white px-8 pt-6 pb-8 shadow-md"
            onSubmit={handleSubmit}
          >
            <h3 className=" text-2xl font-semibold">
              Enter email to reset password
            </h3>
            {text && (
              <p className=" rounded bg-green-400 p-3 text-white">{text}</p>
            )}
            <div className="">
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
                onChange={handleEmail}
              />
            </div>

            {error && <p className="text-xs italic text-red-500">{error}</p>}
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
  return null
}

export default index
