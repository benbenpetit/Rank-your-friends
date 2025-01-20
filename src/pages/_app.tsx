import '@/styles/globals.scss'
import type { AppProps } from 'next/app'
import { AdminProvider } from '@/core/context/AdminContext'
import { UserProvider } from '@/core/context/UserContext'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AdminProvider>
      <UserProvider>
        <Component {...pageProps} />
      </UserProvider>
    </AdminProvider>
  )
}
