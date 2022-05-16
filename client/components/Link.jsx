import axios from 'axios'
import moment from 'moment'
import { useEffect, useState } from 'react'
import { RiThumbUpFill } from 'react-icons/ri'
import { RiThumbUpLine } from 'react-icons/ri'

const Link = ({ link, setAllLinks, user, allLinks }) => {
  const checkLike = (likes) => {
    let match = likes.indexOf(user?._id) !== -1
    // console.log(likes)

    // console.log(user, match)
    return match
  }
  const [values, setValues] = useState({
    like: checkLike(link.likes),
    likes: link.likes.length,
  })

  const handleClick = async (_id) => {
    try {
      const { data } = await axios.put(
        `${process.env.NEXT_PUBLIC_APP_NAME}/api/link-count`,
        { _id }
      )
      const newa = allLinks.map((link) => (link._id === data._id ? data : link))
      setAllLinks(newa)
      console.log(newa)
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    const match = checkLike(link.likes)
    setValues({ ...values, like: match })
  }, [user])

  const clickLike = async (_id) => {
    const isLike = values.like ? 'unlike' : 'like'
    await axios
      .put(`${process.env.NEXT_PUBLIC_APP_NAME}/api/link/${isLike}/${_id}`)
      .then(({ data }) => {
        console.log(data)
        const newa = allLinks.map((link) =>
          link._id === data._id ? data : link
        )
        setAllLinks(newa)
        setValues({
          ...values,
          like: !values.like,
          likes: data.likes.length,
        })
      })
      .catch(({ response }) => {
        console.log(response)
      })
  }
  return (
    <div
      key={link._id}
      className="mb-4 flex items-start justify-start gap-4 rounded-md bg-blue-200 p-5 "
    >
      <button className=" flex h-20 w-20 flex-col items-center justify-center rounded bg-gray-100 p-5 text-lg font-semibold text-gray-600 hover:bg-gray-200">
        <span onClick={() => clickLike(link._id)}>
          {values.like ? <RiThumbUpFill /> : <RiThumbUpLine />}
        </span>
        <span>{values.likes}</span>
      </button>
      <div className=" flex flex-col gap-3 ">
        <a
          href={link.url}
          target="_blank"
          onClick={() => handleClick(link._id)}
        >
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
    </div>
  )
}

export default Link
