import { FC, ReactNode } from 'react'
import styles from './MainLayout.module.scss'
import Head from 'next/head'

interface Props {
  children: ReactNode
}

const MainLayout: FC<Props> = ({ children }) => {
  return (
    <>
      <Head>
        <title>💥 Rank your friends for next party 🎊</title>
        <meta name='description' content='Rank your friends for next party' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <div className={styles.container}>
        <main>{children}</main>
      </div>
    </>
  )
}

export default MainLayout
