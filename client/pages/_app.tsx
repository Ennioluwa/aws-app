import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Layout } from '../components'
import NextNProgress from 'nextjs-progressbar'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <NextNProgress color="#AA3939" options={{ showSpinner: false }} />
      <Component {...pageProps} />
    </Layout>
  )
}

export default MyApp
