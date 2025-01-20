import { GetServerSideProps, NextPage } from 'next'
import { verifyIdToken } from '@/core/lib/firebaseAdmin'
import nookies from 'nookies'
import { useUserContext } from '@/core/context/UserContext'
import Userbar from '@/components/UserBar/Userbar'
import PartiesList from '@/components/PartiesList/PartiesList'
import MainLayout from '@/components/MainLayout/MainLayout'
import Login from '@/components/Login/Login'

interface HomePageProps {
  initialIsAuth: boolean
  initialIsAdmin: boolean
}

const Home: NextPage<HomePageProps> = ({ initialIsAuth, initialIsAdmin }) => {
  const { user, parties, isAdmin } = useUserContext()

  return (
    <MainLayout>
      {initialIsAuth || user ? (
        <>
          <Userbar username={user?.email} imgSrc={user?.photoURL} />
          <PartiesList
            parties={parties}
            style={{ marginTop: '2rem' }}
            isAdmin={initialIsAdmin || isAdmin}
          />
        </>
      ) : (
        <Login />
      )}
    </MainLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const token = nookies.get(context).token || ''
  let initialIsAuth = false
  let initialIsAdmin = false

  if (token) {
    try {
      const decodedToken = await verifyIdToken(token)
      initialIsAuth = true
      initialIsAdmin = decodedToken.role === 'admin'
    } catch (error) {
      console.error('Authentication error:', error)
    }
  }

  return {
    props: {
      initialIsAuth,
      initialIsAdmin
    }
  }
}

export default Home
