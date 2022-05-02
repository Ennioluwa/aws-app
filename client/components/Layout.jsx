import Head from 'next/head'
import Link from 'next/link'

const Layout = ({ children }) => {
  //navbar component
  const nav = () => (
    <nav className=" relative bg-blue-500 text-sm font-semibold text-white shadow-lg">
      <ul className=" container mx-auto flex h-16 items-center gap-2">
        <li>
          <Link href="/">
            <a className=" rounded-md px-5 py-2 hover:bg-gray-100 hover:text-black">
              Home
            </a>
          </Link>
        </li>
        <li>
          <Link href="/">
            <a className=" rounded-md px-5 py-2 hover:bg-gray-100 hover:text-black">
              Submit a link
            </a>
          </Link>
        </li>
        <li className=" ml-auto">
          <Link href="/login">
            <a className="rounded-md px-5 py-2 hover:bg-gray-100 hover:text-black">
              Login
            </a>
          </Link>
        </li>
        <li>
          <Link href="/register">
            <a className=" rounded-md px-5 py-2 hover:bg-gray-100 hover:text-black">
              Register
            </a>
          </Link>
        </li>
      </ul>
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
