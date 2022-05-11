import { useEffect, useState } from 'react'
import axios from 'axios'
import useUser from '../../../context'

const create = () => {
  const [values, setValues] = useState({
    url: '',
    title: '',
    categories: [],
    chosenCategory: [],
    error: '',
    success: '',
    medium: '',
    type: '',
  })
  const {
    url,
    title,
    categories,
    error,
    success,
    medium,
    type,
    chosenCategory,
  } = values
  const { state } = useUser()
  const { user } = state
  useEffect(async () => {
    await axios
      .get(`${process.env.NEXT_PUBLIC_APP_NAME}/api/categories`)
      .then(({ data }) => {
        setValues({ ...values, categories: data.data })
      })
      .catch(({ response }) => {
        setValues({ ...values, error: response.data.error })
      })
  }, [])
  const handleChange = (name) => (e) => {
    setValues({
      ...values,
      [name]: e.target.value,
      error: '',
    })
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    await axios
      .post(`${process.env.NEXT_PUBLIC_APP_NAME}/api/link/create`, {
        title,
        url,
        medium,
        type,
        categories: chosenCategory,
      })
      .then(({ data }) => {
        console.log(data)
      })
      .catch(({ response }) => {
        console.log(response.data.error)

        setValues({ ...values, error: response.data.error })
      })
  }
  const handleToggle = (c) => () => {
    const clickedCategory = chosenCategory.indexOf(c)
    console.log(clickedCategory)
    const all = [...chosenCategory]
    if (clickedCategory === -1) {
      all.push(c)
    } else {
      all.splice(clickedCategory, 1)
    }
    setValues({ ...values, chosenCategory: all })
    console.log(all)
  }
  console.log(medium)
  //   console.log(categories)
  return (
    <div className=" mt-[-64px] h-screen bg-gray-200 pt-16">
      <div className="container mx-auto grid w-full grid-cols-1 gap-6 p-5 md:grid-cols-12">
        <div className=" col-span-1 flex flex-col gap-5 md:col-span-4">
          <div>
            <h2>Category</h2>
            <ul className=" max-h-24 overflow-y-scroll">
              {categories &&
                categories.map((category) => (
                  <li key={category._id}>
                    <input
                      type="checkbox"
                      name="category"
                      id="category"
                      onChange={handleToggle(category._id)}
                      className=" mr-2"
                    />
                    <label>{category.name}</label>
                  </li>
                ))}
            </ul>
          </div>

          <div>
            <h2>Medium</h2>
            <div>
              <input
                type="radio"
                name="book"
                value="book"
                checked={medium === 'book'}
                onChange={() => setValues({ ...values, medium: 'book' })}
                id="book"
                className=" mr-2"
              />
              <label htmlFor="book">Book</label>
            </div>
            <div>
              <input
                type="radio"
                name="video"
                id="video"
                value="video"
                className=" mr-2"
                checked={medium === 'video'}
                onChange={() => setValues({ ...values, medium: 'video' })}
              />
              <label htmlFor="video">Video</label>
            </div>
          </div>
          <div>
            <h2>Type</h2>
            <div>
              <input
                type="radio"
                value="free"
                checked={type === 'free'}
                onChange={() => setValues({ ...values, type: 'free' })}
                name="free"
                id="free"
                className=" mr-2"
              />
              <label htmlFor="free">Free</label>
            </div>
            <div>
              <input
                type="radio"
                name="paid"
                id="paid"
                value="paid"
                checked={type === 'paid'}
                onChange={() => setValues({ ...values, type: 'paid' })}
                className=" mr-2"
              />
              <label htmlFor="paid">Paid</label>
            </div>
          </div>
        </div>

        <div className=" col-span-1 md:col-span-8">
          <form onSubmit={handleSubmit}>
            {success && (
              <p className=" rounded bg-green-400 p-3 text-white">{success}</p>
            )}
            <div className="mb-4">
              <label
                className="mb-2 block text-sm font-bold text-gray-700"
                htmlFor="title"
              >
                Title
              </label>
              <input
                className="focus:shadow-outline w-full appearance-none rounded border py-2 px-3 leading-tight text-gray-700 shadow focus:outline-none"
                id="title"
                type="text"
                placeholder="Title"
                value={title}
                required
                onChange={handleChange('title')}
              />
            </div>
            <div className="mb-4">
              <label
                className="mb-2 block text-sm font-bold text-gray-700"
                htmlFor="title"
              >
                URL
              </label>
              <input
                className="focus:shadow-outline w-full appearance-none rounded border py-2 px-3 leading-tight text-gray-700 shadow focus:outline-none"
                id="url"
                type="text"
                placeholder="Url"
                value={url}
                required
                onChange={handleChange('url')}
              />
              {error && <p className="text-xs italic text-red-500">{error}</p>}
            </div>

            <button
              className="focus:shadow-outline rounded bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700 focus:outline-none"
              disabled={!user}
              type="submit"
            >
              {!user ? 'Login to post' : 'Submit'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
export default create
