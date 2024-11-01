import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { AppProps } from 'next/app'
import { Toaster } from 'react-hot-toast'

import { IframeProvider } from '@/providers/IframeProvider'

const queryClient = new QueryClient()

import { Page } from '../utils/types/page'

type AppPropsWithLayout = AppProps & {
  Component: Page
}

function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout || ((page) => page)
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <IframeProvider>
          {getLayout(<Component {...pageProps} />)}
          <Toaster />
        </IframeProvider>
      </QueryClientProvider>
    </>
  )
}

export default App
