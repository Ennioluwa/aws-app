import axios from 'axios'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import AdminAuth from '../../../components/auth/adminAuth'

const manage = () => {
  const [categories, setCategories] = useState([])

  useEffect(async () => {
    await axios
      .get(`${process.env.NEXT_PUBLIC_APP_NAME}/api/categories`)
      .then(({ data }) => {
        setCategories(data.data)
      })
      .catch(({ response }) => {
        console.log(response)
      })
  }, [])
  //   const categories = data?.data
  const deleteCategory = async (_id) => {
    let answer = window.confirm('Are you sure you want to delete?')
    answer &&
      (await axios
        .delete(`${process.env.NEXT_PUBLIC_APP_NAME}/api/category/${_id}`)
        .then(({ data }) => {
          removeCategory(data.data)
          console.log(data)
        })
        .catch(({ response }) => {
          console.log(response)
        }))
  }
  const removeCategory = (category) => {
    const updatedPost = [...categories]
    const postId = updatedPost.map((upd, i) => upd._id)
    const index = postId.indexOf(category._id)
    updatedPost.splice(index, 1)
    setCategories(updatedPost)
  }
  return (
    <div className=" container mx-auto p-5">
      <h1 className=" text-3xl font-semibold">Categories</h1>
      <div className="grid grid-cols-1   border border-black md:grid-cols-3">
        {categories?.map((category, i) => (
          <div
            key={i}
            className="col-span-1 w-full border border-black bg-gray-200 p-5 hover:bg-gray-100"
          >
            <div className=" flex items-center gap-3">
              <img
                src={category.image.url}
                alt="image"
                className=" h-32 w-32 object-cover"
              />
              <div className=" flex flex-col gap-2">
                <Link href={`/links/${category.slug}`}>
                  <a className=" text-lg font-semibold">{category.name}</a>
                </Link>
                <Link href={`/admin/category/${category.slug}`}>
                  <a className=" ">Update</a>
                </Link>

                <button onClick={() => deleteCategory(category._id)}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default manage
export const getServerSideProps = AdminAuth()
