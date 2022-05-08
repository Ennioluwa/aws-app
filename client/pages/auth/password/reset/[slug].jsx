import { useRouter } from 'next/router'
import jwt from 'jsonwebtoken'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { isAuth } from '../../../../helpers'
import useUser from '../../../../context'
const Reset = () => {
  const router = useRouter()
  const [values, setValues] = useState({
    name: '',
    error: '',
    success: '',
    token: '',
    password: '',
    buttonText: 'Reset',
  })
  const { name, error, success, token, password, buttonText } = values
  let id = router.query.slug
  const { state, dispatch } = useUser()
  const { user } = state
  const handleSubmit = async (e) => {
    e.preventDefault()
    setValues({ ...values, buttonText: 'Resetting' })
    console.log(token)
    await axios
      .put(`${process.env.NEXT_PUBLIC_APP_NAME}/api/reset-password`, {
        token,
        newPassword: password,
      })
      .then(({ data }) => {
        console.log(data)
        setValues({
          ...values,
          buttonText: 'Completed',
          password: '',
          success: data.message,
          error: '',
        })
        // router.push('/login')
      })
      .catch(({ response }) => {
        console.log(response)
        setValues({
          ...values,
          buttonText: 'Reset',
          error: response.data.error,
        })
      })
  }
  useEffect(() => {
    if (id) {
      const { name } = jwt.decode(id)
      setValues({ ...values, name, token: id })
    }
  }, [id])

  if (user) {
    router.push('/')
    return null
  }
  return (
    <div className=" mt-[-64px] h-screen bg-gray-200 pt-16">
      <div className="mx-auto grid h-full w-full max-w-md place-items-center gap-2">
        <div className="flex flex-col items-center gap-4 rounded-md bg-white p-10 text-base shadow-md ">
          <h1>
            Hello <span className=" font-semibold">{name}</span>
          </h1>
          <h1>Please input the new password</h1>
          {success && (
            <p className=" rounded bg-green-400 p-3 text-white">{success}</p>
          )}
          <input
            type="text"
            value={password}
            className=" bg-gray-100 p-3"
            onChange={(e) => setValues({ ...values, password: e.target.value })}
          />
          {error && <p className="text-xs italic text-red-500">{error}</p>}
          <button
            className="focus:shadow-outline mt-3 rounded bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700 focus:outline-none"
            onClick={handleSubmit}
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Reset
