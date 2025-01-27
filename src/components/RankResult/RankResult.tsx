import { FC, ReactNode } from 'react'
import styles from './RankResult.module.scss'

interface Props {
  title: string
  ranking: string[]
}

const RankResult: FC<Props> = ({ title, ranking }) => {
  return (
    <div className={styles.container}>
      <header>
        <h2>{title}</h2>
      </header>
      <div className={styles.ranking}>
        <ul>
          {ranking.map((participant, index) => (
            <li className={styles.participant} key={index}>
              <span className={styles.index}>{index + 1}.</span>
              <span>{participant}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default RankResult
