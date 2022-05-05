import axios from 'axios'
import UserAuth from '../../components/auth/UserAuth'

const User = () => {
  return <h3>hi</h3>
}

export default User
export const getServerSideProps = UserAuth(async (ctx) => {})
