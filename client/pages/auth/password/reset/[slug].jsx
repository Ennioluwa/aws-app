import { useRouter } from 'next/router'
import jwt from 'jsonwebtoken'
import axios from 'axios'
import { useEffect, useState } from 'react'
const Reset = () => {
  const router = useRouter()
  const id = router.query.slug
  const [values, setValues] = useState({
    name: '',
    error: '',
    success: '',
    token: '',
    password: '',
    buttonText: 'Reset',
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setValues({ ...values, buttonText: 'Resetting' })
    await axios
      .post(`${process.env.NEXT_PUBLIC_APP_NAME}/api/password/reset`, {
        token: values.token,
        password: values.password,
      })
      .then((data) => {
        console.log(data)
        setValues({ ...values, buttonText: 'Completed' })
      })
      .catch((response) => {
        console.log(response)
        setValues({ ...values, buttonText: 'Reset' })
      })
  }
  let token = router.query.slug
  useEffect(() => {
    if (token) {
      const { name } = jwt.decode(token)
      setValues({ ...values, name, token })
    }
  }, [token])

  return (
    <div className=" mt-[-64px] h-screen bg-gray-200 pt-16">
      <div className="mx-auto grid h-full w-full max-w-md place-items-center gap-2">
        <div className="flex flex-col items-center gap-2 rounded-md bg-white p-10 text-base shadow-md ">
          <h1>
            Hello <span className=" font-semibold">{values.name}</span>
          </h1>
          <h1>Please input the new password</h1>
          <input
            type="text"
            value={values.password}
            onChange={(e) => setValues({ ...values, password: e.target.value })}
          />
          <button
            className="focus:shadow-outline mt-3 rounded bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700 focus:outline-none"
            onClick={handleSubmit}
          >
            {values.buttonText}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Reset
