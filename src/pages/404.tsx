import MainLayout from '@/components/MainLayout/MainLayout'
import { NextPage } from 'next'
import styles from '@/styles/layouts/404.module.scss'
import Link from 'next/link'

const Custom404: NextPage = () => {
  return (
    <MainLayout>
      <div className={styles.container}>
        <h1>Page introuvable</h1>
        <Link href='/'>Accueil</Link>
      </div>
    </MainLayout>
  )
}

export default Custom404
