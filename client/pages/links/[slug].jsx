import { Router, useRouter } from 'next/router'
import axios from 'axios'
import moment from 'moment'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useEffect, useState } from 'react'

const Link = ({ links, category, totalLinks, linksLimit, linksSkip }) => {
  const router = useRouter()
  const [limit, setLimit] = useState(linksLimit)
  const [skip, setSkip] = useState(linksSkip)
  const [allLinks, setAllLinks] = useState(links)
  const [size, setSize] = useState(totalLinks)
  const [updated, setUpdated] = useState({})
  const [text, setText] = useState(null)

  const handleClick = (_id) => async () => {
    const { data } = await axios.put(
      `${process.env.NEXT_PUBLIC_APP_NAME}/api/link-count`,
      { _id }
    )
    console.log(data)
    setUpdated(data)
    setAllLinks(allLinks.map((link) => (link._id === data._id ? data : link)))
    // setAllLinks([])
    setAllLinks(newa)
  }

  const loadMore = async () => {
    let toSkip = skip + limit
    await axios
      .post(
        `${process.env.NEXT_PUBLIC_APP_NAME}/api/category/${router.query.slug}`,
        {
          limit,
          skip: toSkip,
        }
      )
      .then(({ data }) => {
        setAllLinks([...allLinks, ...data.links])
        setSize(data.links.length)
        setSkip(toSkip)
      })
      .catch(({ response }) => {
        setSize(0)
      })
  }
  console.log(size, limit)
  useEffect(() => {
    setText(category.content)
  }, [])
  return (
    <div className=" mt-[-64px] pt-16">
      <div className=" container mx-auto w-full p-5 ">
        <h1 className=" mb-4 text-2xl font-semibold">{category.name}</h1>
        <div className="mb-5 flex w-full flex-col justify-between gap-5 sm:flex-row">
          <div className="flex flex-wrap overflow-hidden rounded-md bg-gray-200 p-5 text-black sm:w-2/3">
            <p dangerouslySetInnerHTML={{ __html: text }} />
          </div>
          <img
            src={category.image.url}
            alt="link image"
            className=" max-h-64 rounded-md bg-bottom object-cover object-top sm:w-1/3"
          />
        </div>
        <div className=" grid grid-cols-1 gap-5 md:grid-cols-12">
          <div className=" col-span-1 flex flex-col gap-5 md:col-span-8">
            <h2 className=" mb-4 text-3xl font-semibold">Recent Links</h2>
            <InfiniteScroll
              dataLength={allLinks.length} //This is important field to render the next data
              next={loadMore}
              hasMore={size >= limit}
              loader={
                <img
                  className=" h-20 w-20 fill-blue-200 "
                  src="/spinner.svg"
                  alt="Loading"
                />
              }
              endMessage={
                <p style={{ textAlign: 'center' }}>
                  <b>Yay! You have seen it all</b>
                </p>
              }
            >
              {allLinks.map((link) => (
                <div
                  key={link._id}
                  className=" mb-5 flex flex-col gap-3 rounded-md bg-blue-200 p-5"
                >
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
              ))}
            </InfiniteScroll>
            {/* {size > 0 && size >= limit && (
              <button
                onClick={loadMore}
                className=" self-center rounded bg-gray-300 px-2 py-1 text-lg font-semibold text-gray-800 hover:bg-gray-200"
              >
                Load More
              </button>
            )} */}
          </div>
          <div className=" col-span-1 md:col-span-4">
            <h2 className=" mb-4 text-3xl font-semibold">Popular Categories</h2>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Link

export const getServerSideProps = async (ctx) => {
  try {
    let skip = 0
    let limit = 2
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_APP_NAME}/api/category/${ctx.params.slug}`,
      {
        limit,
        skip,
      }
    )
    console.log(response.data)
    return {
      props: {
        links: response.data.links,
        category: response.data.category,
        totalLinks: response.data.links.length,
        linksLimit: limit,
        linksSkip: skip,
      },
    }
  } catch (error) {
    return {
      props: {
        links: [],
        category: {},
      },
    }
  }
}
