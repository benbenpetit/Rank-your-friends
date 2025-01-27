import {
  createContext,
  FC,
  ReactNode,
  useContext,
  useEffect,
  useState
} from 'react'
import { auth, db } from '@/core/lib/firebase'
import { User as FirebaseUser, onAuthStateChanged } from 'firebase/auth'
import { collection, doc, getDocs, onSnapshot } from 'firebase/firestore'
import { IParty } from '@/core/types/party'

interface UserContextType {
  user: FirebaseUser | null
  setUser: React.Dispatch<React.SetStateAction<FirebaseUser | null>>
  parties: IParty[]
  userVotes: string[]
  isAdmin: boolean
  loading: boolean
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export const UserProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null)
  const [parties, setParties] = useState<any[]>([])
  const [userVotes, setUserVotes] = useState<string[]>([])
  const [isAdmin, setIsAdmin] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user)

        const idTokenResult = await user.getIdTokenResult()

        if (idTokenResult.claims.role === 'admin') {
          setIsAdmin(true)
        } else {
          setIsAdmin(false)
        }

        const partiesSnapshot = await getDocs(collection(db, 'parties'))
        const partiesData = partiesSnapshot.docs.map((doc) => {
          const data = doc.data()
          return {
            id: doc.id,
            ...data,
            date: data?.date?.toDate().toISOString() || ''
          }
        })
        setParties(partiesData)

        const userVotesRef = doc(db, 'userVotes', user.uid)
        const unsubscribeUserVotes = onSnapshot(userVotesRef, (docSnapshot) => {
          if (docSnapshot.exists()) {
            const data = docSnapshot.data()
            console.log(data)
            setUserVotes(data.votes || [])
          } else {
            setUserVotes([])
          }
        })

        return () => {
          unsubscribeUserVotes()
        }
      } else {
        setUser(null)
        setUserVotes([])
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  return (
    <UserContext.Provider
      value={{ user, setUser, parties, userVotes, isAdmin, loading }}
    >
      {children}
    </UserContext.Provider>
  )
}

// Custom hook to use the user context
export const useUserContext = (): UserContextType => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUserContext must be used within a UserProvider')
  }
  return context
}
