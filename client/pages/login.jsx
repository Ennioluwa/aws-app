import { useState } from 'react'
const Login = () => {
  const [values, setValues] = useState({
    email: '',
    password: '',
    error: '',
    buttonText: 'Register',
    text: '',
  })
  const { email, password, error, buttonText, text } = values

  const handleChange = (name) => (e) => {
    setValues({
      ...values,
      [name]: e.target.value,
      buttonText: 'Login',
      error: '',
    })
  }
  const handleSubmit = (e) => {
    e.preventDefault()
    console.log(values)
    setValues({
      ...values,
      name: '',
      email: '',
      password: '',
      error: '',
      buttonText: 'Logging in',
      text: '',
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
