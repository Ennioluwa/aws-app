import { Router, useRouter } from 'next/router'
import axios from 'axios'
import moment from 'moment'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useEffect, useState } from 'react'
import AdminAuth from '../../../components/auth/adminAuth'
import Link from 'next/link'

const links = ({ link, linksLimit, linksSkip, totalLinks }) => {
  const router = useRouter()
  const [limit, setLimit] = useState(linksLimit)
  const [skip, setSkip] = useState(linksSkip)
  const [allLinks, setAllLinks] = useState(link)
  const [size, setSize] = useState(totalLinks)

  const loadMore = async () => {
    let toSkip = skip + limit
    await axios
      .post(`${process.env.NEXT_PUBLIC_APP_NAME}/api/links/admin`, {
        limit,
        skip: toSkip,
      })
      .then(({ data }) => {
        console.log(data)
        setAllLinks([...allLinks, ...data])
        setSize(data.length)
        setSkip(toSkip)
      })
      .catch(({ response }) => {
        setSize(0)
      })
  }
  const handleDelete = async (_id) => {
    const answer = window.confirm('Are you sure you want to delete this link?')
    if (answer) {
      await axios
        .delete(`${process.env.NEXT_PUBLIC_APP_NAME}/api/link/admin/${_id}`)
        .then(({ data }) => {
          console.log(data)
          const updatedPost = [...allLinks]
          const linkId = updatedPost.map((upd, i) => upd._id)
          const index = linkId.indexOf(data._id)
          updatedPost.splice(index, 1)
          setAllLinks(updatedPost)
        })
        .catch(({ response }) => {
          console.log(response.data.error)
          // setValues({ ...values, error: response.data.error })
        })
    }
  }

  return (
    <div className=" mt-[-64px] pt-16">
      <div className=" container mx-auto min-h-screen w-full p-5 ">
        <h1 className=" mb-4 text-2xl font-semibold"></h1>
        <div className="mb-5 flex w-full flex-col justify-between gap-5 sm:flex-row"></div>
        <div className=" grid grid-cols-1 gap-5 md:grid-cols-12">
          <div className=" col-span-1 flex flex-col gap-5 md:col-span-8">
            <h2 className=" mb-4 text-3xl font-semibold">All Links</h2>
            <InfiniteScroll
              dataLength={allLinks?.length} //This is important field to render the next data
              next={loadMore}
              hasMore={size >= limit}
              loader={<h1>loading</h1>}
              endMessage={
                <p style={{ textAlign: 'center' }}>
                  <b>Yay! You have seen it all</b>
                </p>
              }
            >
              {allLinks?.map((link) => (
                <div
                  key={link._id}
                  className=" mb-5 flex  items-center justify-between  rounded-md bg-blue-200 p-5"
                >
                  <div className="flex flex-col gap-3">
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
                    <Link href={`/admin/links/${link._id}`}>
                      <a>Update</a>
                    </Link>
                    <button onClick={() => handleDelete(link._id)}>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </InfiniteScroll>
          </div>
        </div>
      </div>
    </div>
  )
}

export default links

export const getServerSideProps = AdminAuth(async (context) => {
  try {
    let skip = 0
    let limit = 5
    const { data } = await axios.post(
      `${process.env.NEXT_PUBLIC_APP_NAME}/api/links/admin`,
      { skip, limit },
      {
        headers: {
          cookie: context.req.headers.cookie,
          contentType: 'application/json',
        },
      }
    )
    console.log(data)
    return {
      props: {
        link: data,
        totalLinks: data.length,
        linksLimit: limit,
        linksSkip: skip,
      },
    }
  } catch (error) {
    return {
      props: {
        link: [],
      },
    }
  }
})
