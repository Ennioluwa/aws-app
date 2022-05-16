import axios from 'axios'
import Head from 'next/head'
import Link from 'next/link'
import Router, { useRouter } from 'next/router'
import { useContext, useEffect } from 'react'
import useUser from '../context'
import { isAuth, removeLocalStorage } from '../helpers'

const Layout = ({ children }) => {
  //navbar component

  const { state, dispatch } = useUser()
  const { user } = state
  const router = useRouter()

  const handleSignout = async () => {
    await axios
      .get(`${process.env.NEXT_PUBLIC_APP_NAME}/api/logout`)
      .then(({ data }) => {
        dispatch({ type: 'LOGOUT', payload: data.message })
        removeLocalStorage('user')
        console.log(data.message)
        Router.push('/login')
      })
      .catch((err) => {
        console.log(err)
      })
  }
  const nav = () => (
    <nav className=" relative overflow-hidden bg-blue-500 text-sm font-semibold text-white shadow-lg">
      <div className=" container mx-auto flex h-16 items-center gap-2">
        <Link href="/">
          <a className=" rounded-md px-5 py-2 hover:bg-gray-100 hover:text-black">
            Home
          </a>
        </Link>
        <Link href="/user/link/create">
          <a className=" rounded-md px-5 py-2 hover:bg-gray-100 hover:text-black">
            Submit a link
          </a>
        </Link>
        {!user && (
          <Link href="/login">
            <a className="ml-auto rounded-md px-5 py-2 hover:bg-gray-100 hover:text-black">
              Login
            </a>
          </Link>
        )}

        {!user && (
          <Link href="/register">
            <a className=" rounded-md px-5 py-2 hover:bg-gray-100 hover:text-black">
              Register
            </a>
          </Link>
        )}
        {user && user.role === 'admin' && (
          <Link href="/admin">
            <a className="ml-auto rounded-md px-5 py-2 hover:bg-gray-100 hover:text-black">
              {user && user.name}
            </a>
          </Link>
        )}
        {user && user.role === 'subscriber' && (
          <Link href="/user">
            <a className="ml-auto rounded-md px-5 py-2 hover:bg-gray-100 hover:text-black">
              {user && user.name}
            </a>
          </Link>
        )}
        {user && (
          <button
            onClick={handleSignout}
            className=" rounded-md px-5 py-2 hover:bg-gray-100 hover:text-black"
          >
            Signout
          </button>
        )}
      </div>
    </nav>
  )
  // head component
  const head = () => (
    <Head>
      <title>Enimantus</title>
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>
  )

  return (
    <>
      {head()}
      {nav()}
      {children}
    </>
  )
}

export default Layout
