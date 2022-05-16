import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import useUser from '../../../context'

const update = ({ categor }) => {
  const [values, setValues] = useState({
    url: '',
    title: '',
    categories: categor,
    chosenCategory: [],
    error: '',
    success: '',
    medium: '',
    type: '',
    buttonText: 'Update',
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
    buttonText,
  } = values
  const { state } = useUser()
  const { user } = state

  const router = useRouter()
  let slug = router.query.slug

  // useEffect(async () => {
  //   await axios
  //     .get(`${process.env.NEXT_PUBLIC_APP_NAME}/api/categories`)
  //     .then(({ data }) => {
  //       setValues({ ...values, categories: data.data })
  //     })
  //     .catch(({ response }) => {
  //       setValues({ ...values, error: response.data.error })
  //     })
  // }, [])
  useEffect(async () => {
    await axios
      .get(`${process.env.NEXT_PUBLIC_APP_NAME}/api/link/${slug}`)
      .then(({ data }) => {
        console.log(data)
        const { medium, url, type, title, categories } = data
        setValues({
          ...values,
          medium,
          url,
          type,
          title,
          chosenCategory: categories,
        })
      })
      .catch(({ response }) => {
        console.log(response.data.error)
        // setValues({ ...values, error: response.data.error })
      })
  }, [slug])

  const handleChange = (name) => (e) => {
    setValues({
      ...values,
      [name]: e.target.value,
      error: '',
    })
  }

  const handleSubmit = async (e) => {
    setValues({ ...values, buttonText: 'Updating' })
    e.preventDefault()
    await axios
      .put(`${process.env.NEXT_PUBLIC_APP_NAME}/api/link/${slug}`, {
        title,
        url,
        medium,
        type,
        categories: chosenCategory,
      })
      .then(({ data }) => {
        const { title, type, url, medium } = data
        setValues({
          ...values,
          success: data.message,
          title,
          type,
          url,
          medium,
          error: '',
          buttonText: 'Updated',
        })
      })
      .catch(({ response }) => {
        console.log(response.data.error)

        setValues({
          ...values,
          error: response.data.error,
          buttonText: 'Update',
        })
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
  // console.log(medium)
  return (
    <div className=" mt-[-64px] h-screen bg-gray-200 pt-16">
      <div className="container mx-auto grid w-full grid-cols-12 gap-6 p-5">
        <div className="col-span-4 flex flex-col gap-5">
          <div>
            <h2>Category</h2>
            <ul className=" max-h-24 overflow-y-scroll">
              {categories.map((category) => (
                <li key={category._id}>
                  <input
                    type="checkbox"
                    name="category"
                    id="category"
                    checked={chosenCategory.includes(category._id)}
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

        <div className="col-span-8">
          <form onSubmit={handleSubmit}>
            {success && (
              <p className=" mb-3 rounded bg-green-400 p-3 text-white">
                {success}
              </p>
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
              {!user ? 'Login to post' : buttonText}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
export default update

export const getServerSideProps = async () => {
  const data = await axios.get(
    `${process.env.NEXT_PUBLIC_APP_NAME}/api/categories`
  )
  if (!data) {
    return {
      props: {
        categor: [],
      },
    }
  }
  return {
    props: {
      categor: data.data.data,
    },
  }
}
