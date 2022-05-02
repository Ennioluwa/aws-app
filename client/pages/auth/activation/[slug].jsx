import { useRouter } from 'next/router'

const Activation = async () => {
  const router = useRouter()
  await axios
  return (
    <div>
      <p>{router.query.slug}</p>
    </div>
  )
}

export default Activation
