import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  FC
} from 'react'
import { getAuth, onAuthStateChanged } from 'firebase/auth'

interface AdminContextType {
  isAdmin: boolean
  isAuthenticated: boolean
}

// Create the context object
const AdminContext = createContext<AdminContextType | undefined>(undefined)

// Define the props for the AdminProvider
interface AdminProviderProps {
  children: ReactNode
}

// AdminProvider component
const AdminProvider: FC<AdminProviderProps> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const auth = getAuth()

    onAuthStateChanged(auth, async (user) => {
      if (user) {
        setIsAuthenticated(true)
        const token = await user.getIdToken()

        // Check admin status via API
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/check-admin`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        )

        if (res.ok) {
          setIsAdmin(true)
        }
      } else {
        setIsAuthenticated(false)
        setIsAdmin(false)
      }
    })
  }, [])

  return (
    <AdminContext.Provider value={{ isAdmin, isAuthenticated }}>
      {children}
    </AdminContext.Provider>
  )
}

// Custom hook to use the AdminContext
const useAdmin = () => {
  const context = useContext(AdminContext)

  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider')
  }

  return context
}

export { AdminProvider, useAdmin }
