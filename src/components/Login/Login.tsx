import styles from './Login.module.scss'
import { auth } from '@/core/lib/firebase'
import {
  GithubAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
  TwitterAuthProvider
} from 'firebase/auth'
import nookies from 'nookies'
import Image from 'next/image'
import toast from 'react-hot-toast'

const Login = () => {
  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider()
    try {
      const result = await signInWithPopup(auth, provider)
      const user = result.user
      const idToken = await user.getIdToken()
      nookies.set(null, 'token', idToken, {
        path: '/',
        maxAge: 60 * 60 * 24 * 7
      })
    } catch (error) {
      toast.error(String(error))
      console.error('Login error:', error)
    }
  }

  const loginWithTwitter = async () => {
    const provider = new TwitterAuthProvider()
    try {
      const result = await signInWithPopup(auth, provider)
      const user = result.user
      const idToken = await user.getIdToken()
      nookies.set(null, 'token', idToken, {
        path: '/',
        maxAge: 60 * 60 * 24 * 7
      })
    } catch (error) {
      toast.error(String(error))
      console.error('Login error:', error)
    }
  }

  const loginWithGithub = async () => {
    const provider = new GithubAuthProvider()
    try {
      const result = await signInWithPopup(auth, provider)
      const user = result.user
      const idToken = await user.getIdToken()
      nookies.set(null, 'token', idToken, {
        path: '/',
        maxAge: 60 * 60 * 24 * 7
      })
    } catch (error) {
      toast.error(String(error))
      console.error('Login error:', error)
    }
  }

  return (
    <div className={styles.container}>
      <h2>Se connecter</h2>
      <button onClick={loginWithGoogle}>
        <Image
          src={'/img/google-logo.svg'}
          alt='Google logo'
          width={20}
          height={20}
        />
        <span>Sign in with Google</span>
      </button>
      <button onClick={loginWithTwitter}>
        <Image
          src={'/img/twitter-logo.svg'}
          alt='Twitter logo'
          width={20}
          height={20}
        />
        <span>Sign in with Twitter</span>
      </button>
      <button onClick={loginWithGithub}>
        <Image
          src={'/img/github-logo.svg'}
          alt='Github logo'
          width={20}
          height={20}
        />
        <span>Sign in with Github</span>
      </button>
    </div>
  )
}

export default Login
