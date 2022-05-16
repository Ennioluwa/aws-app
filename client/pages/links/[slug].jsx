import { Router, useRouter } from 'next/router'
import axios from 'axios'
import moment from 'moment'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useEffect, useState } from 'react'
import LinkComp from '../../components/Link'
import useUser from '../../context'
import { useSelector } from 'react-redux'
import { userValue } from '../../context/reducer'

const Link = ({
  links,
  category,
  totalLinks,
  linksLimit,
  popular,
  linksSkip,
  // user,
}) => {
  const router = useRouter()
  const [limit, setLimit] = useState(linksLimit)
  const [skip, setSkip] = useState(linksSkip)
  const [poplimit, setPopLimit] = useState(linksLimit)
  const [popskip, setPopSkip] = useState(linksSkip)
  const [allLinks, setAllLinks] = useState(links)
  const [size, setSize] = useState(totalLinks)
  const [updated, setUpdated] = useState({})
  const [text, setText] = useState(null)
  const [popularLinks, setPopularLinks] = useState([])
  const [values, setValues] = useState({
    medium: '',
    type: '',
  })
  const { medium, type } = values
  const {
    state: { user },
    dispatch,
  } = useUser()
  const loadMore = async () => {
    let toSkip = skip + limit
    await axios
      .post(
        `${process.env.NEXT_PUBLIC_APP_NAME}/api/link/filter/${router.query.slug}`,
        {
          limit,
          skip: toSkip,
          medium,
          type,
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
  const loadPopular = async () => {
    let toSkip = popskip + poplimit
    await axios
      .post(
        `${process.env.NEXT_PUBLIC_APP_NAME}/api/link/filter/${router.query.slug}`,
        {
          limit: poplimit,
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

  useEffect(async () => {
    setText(category.content)
  }, [])
  useEffect(async () => {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_APP_NAME}/api/category/popular/${router.query.slug}`
    )
    setPopularLinks(data)
  }, [])
  const handleSubmit = async (e) => {
    e.preventDefault()
    await axios
      .post(
        `${process.env.NEXT_PUBLIC_APP_NAME}/api/link/filter/${router.query.slug}`,
        {
          medium,
          type,
        }
      )
      .then(({ data }) => {
        setAllLinks(data.links)
      })
      .catch(({ response }) => {
        console.log(response.data.error)

        setValues({
          ...values,
          error: response.data.error,
        })
      })
  }
  return (
    <div className=" mt-[-64px] pt-16">
      <div className=" container mx-auto min-h-screen w-full p-5 ">
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
          <div className="top-7 col-span-1 hidden self-start border border-blue-400 p-5 md:sticky md:col-span-4 md:block">
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
            <button onClick={handleSubmit}>submit</button>
          </div>
          <div className=" col-span-1 flex flex-col md:col-span-8">
            <h2 className=" mb-4 text-3xl font-semibold">Recent Links</h2>
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
                <LinkComp
                  key={link._id}
                  link={link}
                  setAllLinks={setAllLinks}
                  user={user}
                  allLinks={allLinks}
                />
              ))}
            </InfiniteScroll>
            <h2 className=" mb-8 text-3xl font-semibold">Popular Links</h2>
            {popularLinks?.map((link) => (
              <LinkComp
                key={link._id}
                setAllLinks={setPopularLinks}
                link={link}
                user={user}
                allLinks={popularLinks}
              />
            ))}
            {size > 0 && size >= limit && (
              <button
                onClick={loadMore}
                className=" self-center rounded bg-gray-300 px-2 py-1 text-lg font-semibold text-gray-800 hover:bg-gray-200"
              >
                Load More
              </button>
            )}
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
    let limit = 3
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_APP_NAME}/api/category/${ctx.params.slug}`,
      {
        limit,
        skip,
      }
    )
    const data = await axios.get(
      `${process.env.NEXT_PUBLIC_APP_NAME}/api/category/popular/${ctx.params.slug}`,
      {
        limit,
        skip,
      }
    )

    return {
      props: {
        links: response.data.links,
        category: response.data.category,
        totalLinks: response.data.links.length,
        popular: data.data,
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
