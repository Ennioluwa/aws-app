import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Layout } from '../components'
import NextNProgress from 'nextjs-progressbar'
import { UserProvider } from '../context'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
      <Layout>
        <NextNProgress color="#AA3939" options={{ showSpinner: false }} />
        <Component {...pageProps} />
      </Layout>
    </UserProvider>
  )
}

export default MyApp
