import '@/styles/globals.css'
import 'react-toastify/dist/ReactToastify.css';
import {ToastContainer} from "react-toastify";
import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import LoadingOverlay from '@speedy4all/react-loading-overlay';
import {ConfigProvider} from "antd";


export default function App({ Component, pageProps }) {
    const [loading, setLoading] = useState(false)
    const router = useRouter()


    useEffect(() => {
        const handleRouteChange = (url) => {
            setLoading(true)
        }

        const handleRouteChangeComplete = () => {
            setLoading(false)
        }

        router.events.on('routeChangeStart', handleRouteChange)
        router.events.on('routeChangeComplete', handleRouteChangeComplete)

        return () => {
            router.events.off('routeChangeStart', handleRouteChange)
            router.events.off('routeChangeComplete', handleRouteChangeComplete)
        }
    }, [router.events])


    return (
          <ConfigProvider>

          <LoadingOverlay
              active={loading}
              spinner
              text='Loading...'
              styles={{
                  overlay: (base) => ({
                      ...base,
                      background: 'rgba(96, 160, 217, 0.4)'
                  })
              }}
          >
              <ToastContainer />
                  <Component {...pageProps} />
          </LoadingOverlay>
          </ConfigProvider>
      )
}

