import axios from 'axios'
import moment from 'moment'
import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useContext, useEffect, useState } from 'react'
import useUser, { UserContext } from '../context'
import { authenticate, isAuth } from '../helpers'
interface Categories {
  readonly _id: number
  name: string
  image: {
    url: string
  }
  slug: string
}
interface Links {
  readonly _id: number
  title: string
  createdAt: 'string'
  categories: []
  url: string
  clicks: number
  postedBy: {
    name: string
    _id: number
  }
  type: string
  medium: string
  slug: string
}
const Home = ({ categories, links }) => {
  // const { state } = useUser()
  // const { user } = state

  const [allLinks, setAllLinks] = useState(links)
  const handleClick = async (_id: number) => {
    try {
      const { data } = await axios.put(
        `${process.env.NEXT_PUBLIC_APP_NAME}/api/link-count`,
        { _id }
      )
      console.log(data)
      const newa = allLinks.map((link: Links) =>
        link._id === data._id ? data : link
      )
      setAllLinks(newa)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className=" container mx-auto p-5">
      <p className=" mb-5 text-4xl font-semibold">
        Find the Best Programming Courses & Tutorials.
      </p>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {categories.map((category: Categories, i: number) => (
          <Link href={`/links/${category.slug}`} key={i}>
            <a className="col-span-1 w-full rounded-md border border-gray-200 p-5 shadow-sm hover:translate-y-[-2px] hover:shadow-md">
              <div className=" flex grow items-center justify-center gap-3">
                <img
                  src={category.image.url}
                  alt="image"
                  className=" h-10 w-10 rounded object-cover"
                />
                <h3 className=" text-lg font-semibold">{category.name}</h3>
              </div>
            </a>
          </Link>
        ))}
      </div>
      <div className=" mt-5">
        <h2 className=" mb-4 text-3xl font-semibold">Trending Links</h2>
        {allLinks?.map((link: Links) => (
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
                {link?.categories?.map((category: Categories) => (
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
      </div>
    </div>
  )
}

export default Home

export const getServerSideProps = async (context) => {
  try {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_APP_NAME}/api/categories`
    )
    const popular = await axios.get(
      `${process.env.NEXT_PUBLIC_APP_NAME}/api/link/trending`
    )

    return {
      props: {
        categories: data.data,
        links: popular.data,
      },
    }
  } catch (error) {
    return {
      props: {
        categories: [],
      },
    }
  }
}
