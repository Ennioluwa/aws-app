import { useRouter } from 'next/router'
import axios from 'axios'
import jwt from 'jsonwebtoken'
import { useEffect, useState } from 'react'
const Activation = () => {
  const router = useRouter()
  let token = router.query.slug
  const [values, setValues] = useState({
    name: '',
    error: '',
    success: '',
    token: '',
    buttonText: 'Activate',
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setValues({ ...values, buttonText: 'Activating' })
    await axios
      .post(`${process.env.NEXT_PUBLIC_APP_NAME}/api/activate`, {
        token: values.token,
      })
      .then((data) => {
        console.log(data)
        setValues({ ...values, buttonText: 'Activated' })
      })
      .catch(({ response }) => {
        console.log(response.data.error)
        setValues({ ...values, buttonText: 'Activate' })
      })
  }
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
            Hello <span className=" font-semibold">{values.name}</span>{' '}
          </h1>
          <h1>Are you ready to complete your registration?</h1>
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

export default Activation
