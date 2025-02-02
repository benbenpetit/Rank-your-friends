import { FC, ReactNode } from 'react'
import styles from './MainLayout.module.scss'
import Head from 'next/head'
import { Toaster } from 'react-hot-toast'

interface Props {
  children: ReactNode
}

const MainLayout: FC<Props> = ({ children }) => {
  return (
    <>
      <Head>
        <title>💥 Rank your friends</title>
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <div className={styles.container}>
        <Toaster position='top-left' reverseOrder={false} />
        <main>{children}</main>
      </div>
    </>
  )
}

export default MainLayout
