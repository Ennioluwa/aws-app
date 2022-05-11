import axios from 'axios'
import React from 'react'
import AdminAuth from '../../components/auth/adminAuth'
import Link from 'next/link'

const Admin = () => {
  return (
    <div className="container mx-auto flex flex-col gap-5 p-5">
      <h1 className=" mb-4 text-4xl font-semibold">Admin Dashboard</h1>
      <Link href={`/admin/category/create`}>
        <a className=" text-blue-400">Create Category</a>
      </Link>
      <Link href={`/user/link/create`}>
        <a className=" text-blue-400">Submit a Link</a>
      </Link>
      <Link href={`/admin/category/manage`}>
        <a className=" text-orange-400">Manage Categories</a>
      </Link>
      <Link href={`/admin/links/manage`}>
        <a className=" text-orange-400">Manage Links</a>
      </Link>
      <Link href={`/admin/profile/update`}>
        <a className=" text-green-400">Update Profile</a>
      </Link>
    </div>
  )
}

export default Admin
export const getServerSideProps = AdminAuth()
