import { CSSProperties, FC } from 'react'
import styles from './PartiesList.module.scss'
import PartyCard from '@/components/PartyCard/PartyCard'
import { IParty } from '@/core/types/party'
import Link from 'next/link'
import { useUserContext } from '@/core/context/UserContext'

interface Props {
  parties: IParty[]
  isAdmin?: boolean
  style?: CSSProperties
}

const PartiesList: FC<Props> = ({ parties, isAdmin, style }) => {
  const { user } = useUserContext()

  return (
    <div className={styles.container} style={{ ...style }}>
      <div className={styles.title}>
        <h2>Parties</h2>
        {isAdmin && <Link href='host'>Créer une partie</Link>}
      </div>
      <div className={styles.list}>
        <ul className={styles.parties}>
          {parties
            .sort((a, b) => {
              const dateA = new Date(a.date ?? 0).getTime()
              const dateB = new Date(b.date ?? 0).getTime()
              return dateB - dateA
            })
            .map((party) => (
              <li key={party.name}>
                <Link href={`/party/${party.id}`}>
                  <PartyCard
                    party={party}
                    isVoted={party?.voters?.includes(user?.uid ?? '')}
                  />
                </Link>
              </li>
            ))}
        </ul>
      </div>
    </div>
  )
}

export default PartiesList
