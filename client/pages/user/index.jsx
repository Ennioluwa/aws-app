import axios from 'axios'
import UserAuth from '../../components/auth/UserAuth'
import moment from 'moment'
import Link from 'next/link'
import { useState } from 'react'

const User = ({ links, user }) => {
  const [linksFull, setLinksFull] = useState(links)
  const handleDelete = async (_id) => {
    const answer = window.confirm('Are you sure you want to delete this link?')
    if (answer) {
      await axios
        .delete(`${process.env.NEXT_PUBLIC_APP_NAME}/api/link/${_id}`)
        .then(({ data }) => {
          console.log(data)
          const updatedPost = [...linksFull]
          const linkId = updatedPost.map((upd, i) => upd._id)
          const index = linkId.indexOf(data._id)
          updatedPost.splice(index, 1)
          setLinksFull(updatedPost)
        })
        .catch(({ response }) => {
          console.log(response.data.error)
          // setValues({ ...values, error: response.data.error })
        })
    }
  }
  return (
    <div className=" container mx-auto p-5">
      <h2 className=" mb-5 text-3xl font-semibold">All my Links</h2>
      {linksFull?.map((link) => (
        <div
          key={link._id}
          className="mb-5 flex max-w-lg items-center justify-between gap-5 rounded-md bg-blue-200 p-5"
        >
          <div className=" flex flex-col gap-3 ">
            <a href={link.url} target="_blank">
              {link.title} {link.clicks}
            </a>

            <p>{moment(link.createdAt).fromNow()}</p>
            <p>
              <span>Submitted by {link.postedBy.name}</span>
            </p>
            <p className=" flex flex-wrap gap-3">
              <span className=" rounded bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-800">
                {link.type}
              </span>
              <span className=" rounded bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-800">
                {link.medium}
              </span>
              <span className=" flex flex-wrap gap-3">
                {link?.categories?.map((category) => (
                  <span
                    className=" rounded bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-800"
                    key={category._id}
                  >
                    {category.name}
                  </span>
                ))}
              </span>
            </p>
          </div>
          <div className=" flex flex-col gap-5">
            <Link href={`/user/link/${link._id}`}>
              <a>Update</a>
            </Link>
            <button onClick={() => handleDelete(link._id)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default User
export const getServerSideProps = UserAuth()
