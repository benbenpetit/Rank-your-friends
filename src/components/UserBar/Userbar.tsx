import { FC } from 'react'
import styles from './Userbar.module.scss'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { getAuth, signOut } from 'firebase/auth'
import nookies from 'nookies'

interface Props {
  username?: string | null
  imgSrc?: string | null
}

const Userbar: FC<Props> = ({ username, imgSrc }) => {
  const router = useRouter()

  const handleDisconnect = async () => {
    const auth = getAuth()
    try {
      await signOut(auth)
      nookies.destroy(null, 'token', { path: '/' })
      router.push('/')
    } catch (error) {
      console.error('Error during sign out:', error)
    }
  }

  return (
    <div className={styles.container}>
      <Image
        src={imgSrc ?? '/img/default-avatar.png'}
        alt='Image de profil'
        width={40}
        height={40}
        quality={90}
        priority
      />
      <span>{username ?? 'username.name@email.com'}</span>
      <button onClick={handleDisconnect}>Déconnecter</button>
    </div>
  )
}

export default Userbar
