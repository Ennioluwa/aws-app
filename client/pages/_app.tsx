import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Layout } from '../components'
import NextNProgress from 'nextjs-progressbar'
import { UserProvider } from '../context'
import { Provider } from 'react-redux'
import store from '../context/store'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
      {/* <Provider store={store}> */}
      <Layout>
        <NextNProgress color="#AA3939" options={{ showSpinner: false }} />
        <Component {...pageProps} />
      </Layout>
      {/* </Provider> */}
    </UserProvider>
  )
}

export default MyApp
