import axios from 'axios'
import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useContext, useEffect } from 'react'
import useUser, { UserContext } from '../context'
import { authenticate, isAuth } from '../helpers'

const Home = ({ categories }) => {
  const { state } = useUser()
  const { user } = state
  console.log(categories)

  return (
    <div className=" container mx-auto p-5">
      <h1 className=" text-3xl font-semibold">Categories</h1>
      <div className="grid grid-cols-2   border border-black md:grid-cols-3">
        {categories.map((category, i) => (
          <Link href={`/`} key={i}>
            <a className="col-span-1 w-full border border-black bg-gray-200 p-5 hover:bg-gray-100">
              <div className=" flex flex-col gap-3">
                <img
                  src={category.image.url}
                  alt="image"
                  className=" h-32 w-32 object-cover"
                />
                <h3 className=" text-lg font-semibold">{category.name}</h3>
              </div>
            </a>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default Home

export const getStaticProps = async () => {
  try {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_APP_NAME}/api/categories`
    )
    return {
      props: {
        categories: data.data,
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
