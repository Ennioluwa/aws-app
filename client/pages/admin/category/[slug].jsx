import { useEffect, useState } from 'react'
import axios from 'axios'
import Resizer from 'react-image-file-resizer'
import dynamic from 'next/dynamic'
import 'react-quill/dist/quill.snow.css'
import { useRouter } from 'next/router'
import useUser from '../../../context'
import AdminAuth from '../../../components/auth/adminAuth'
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })
const create = ({ oldCategories }) => {
  const [values, setValues] = useState({
    name: oldCategories.name,
    error: '',
    buttonText: 'Update',
    imageName: '',
    previewImage: oldCategories.image.url,
    text: '',
    photo: '',
    success: '',
  })
  const [content, setContent] = useState(oldCategories.content)
  const {
    name,
    error,
    buttonText,
    text,
    photo,
    success,
    imageName,
    previewImage,
  } = values
  const router = useRouter()
  const resizeFile = (file) =>
    new Promise((resolve) => {
      Resizer.imageFileResizer(
        file,
        300,
        300,
        'JPEG',
        100,
        0,
        (uri) => {
          resolve(uri)
        },
        'base64'
      )
    })
  const handleImage = async (event) => {
    try {
      const file = event.target.files[0]
      const image = await resizeFile(file)
      setValues({
        ...values,
        photo: image,
        imageName: event.target.files[0].name,
      })
    } catch (err) {
      console.log(err)
    }
  }
  const handleChange = (name) => (e) => {
    // const value = name === 'image' ? e.target.files[0] : e.target.value
    // const imageName = name === 'image' ? e.target.files[0].name : ''
    // formData.set(name, value)
    setValues({
      ...values,
      [name]: e.target.value,
      buttonText: 'Update',
      error: '',
    })
  }
  const handleContent = (e) => {
    setContent(e)
    setValues({
      ...values,
      buttonText: 'Update',
      error: '',
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setValues({ ...values, buttonText: 'Updating' })
    try {
      const { data } = await axios.put(
        `${process.env.NEXT_PUBLIC_APP_NAME}/api/category/${router.query.slug}`,
        {
          name,
          image: photo,
          content,
        }
      )
      console.log(data.success)
      setValues({
        ...values,
        success: data.message,
        buttonText: 'Updated',
        error: '',
        name: data.success.name,
        photo: '',
        imageName: '',
        previewImage: data.success.image.url,
      })
      setContent(data.success.content)
      return
    } catch ({ response }) {
      setValues({
        ...values,
        buttonText: 'Update',
        error: response.data.error,
      })
    }
  }

  return (
    <div className=" mt-[-64px] h-screen bg-gray-200 pt-16">
      <div className="mx-auto grid h-full w-full max-w-sm place-items-center p-5">
        <form
          className="mb-4 flex w-full grow flex-col gap-3 rounded bg-white px-8 pt-6 pb-8 shadow-md"
          onSubmit={handleSubmit}
        >
          <h3 className="mb-3 text-4xl font-semibold">Update Category</h3>
          {success && (
            <p className=" rounded bg-green-400 p-3 text-white">{success}</p>
          )}
          <div className="mb-4">
            <label
              className="mb-2 block text-sm font-bold text-gray-700"
              htmlFor="username"
            >
              Name
            </label>
            <input
              className="focus:shadow-outline w-full appearance-none rounded border py-2 px-3 leading-tight text-gray-700 shadow focus:outline-none"
              id="username"
              type="text"
              placeholder="Name"
              required
              value={name}
              onChange={handleChange('name')}
            />
          </div>

          <div>
            <label
              className="mb-2 block text-sm font-bold text-gray-700"
              htmlFor="content"
            >
              Content
            </label>
            <ReactQuill
              className="focus:shadow-outline mb-3 w-full appearance-none rounded border leading-tight text-gray-700 shadow focus:outline-none"
              id="content"
              type="text"
              placeholder="Content"
              required
              value={content}
              onChange={handleContent}
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <label
              className="mb-2 cursor-pointer overflow-hidden rounded border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-2 text-base font-normal   text-gray-700 transition ease-in-out focus:border-blue-600 focus:bg-white focus:text-gray-700 focus:outline-none"
              htmlFor="image"
            >
              Upload Image
              <input
                className="cursor-pointer rounded border border-solid border-gray-300 bg-white bg-clip-padding text-base font-normal text-gray-700 transition  ease-in-out focus:border-blue-600 focus:bg-white focus:text-gray-700 focus:outline-none"
                type="file"
                id="image"
                accept="image/*"
                hidden
                onChange={handleImage}
              />
            </label>
            <img
              src={previewImage}
              alt="former image"
              className=" h-14 rounded"
            />
          </div>
          <p className=" mt-2">{imageName}</p>

          {error && <p className="mb-2 text-xs italic text-red-500">{error}</p>}
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

export default create

export const getServerSideProps = AdminAuth(async (ctx) => {
  try {
    const { data } = await axios.post(
      `${process.env.NEXT_PUBLIC_APP_NAME}/api/category/${ctx.params.slug}`
    )
    return {
      props: {
        oldCategories: data.category,
      },
    }
  } catch (error) {
    return {
      props: {
        oldCategories: {},
      },
    }
  }
})
