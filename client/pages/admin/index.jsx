import axios from 'axios'
import React from 'react'
import AdminAuth from '../../components/auth/adminAuth'

const Admin = ({ user }) => {
  if (user) {
    return (
      <div>
        <h3>Please authenticate</h3>
      </div>
    )
  }
  return <h3>hi</h3>
}

export default Admin
export const getServerSideProps = AdminAuth(async (ctx) => {})
