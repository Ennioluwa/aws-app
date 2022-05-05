import axios from 'axios'
import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useContext, useEffect } from 'react'
import useUser, { UserContext } from '../context'
import { authenticate, isAuth } from '../helpers'

const Home = () => {
  const { state, dispatch } = useUser()
  const { user } = state
  return (
    <div className="container mx-auto p-5">
      {user && <h3>Hello</h3>}
      {!user && <h4>Please Authenticate</h4>}
    </div>
  )
}

export default Home
