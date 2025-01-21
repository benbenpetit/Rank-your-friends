import { FC } from 'react'
import styles from './Spinner.module.scss'

interface Props {
  size?: number
  strokeWidth?: number
}

const Spinner: FC<Props> = ({ size = 1, strokeWidth = 2 }) => {
  return (
    <div className={styles.container} style={{ width: `${size * 100}px` }}>
      <div className={styles.loader}>
        <svg
          className={styles.circular}
          viewBox={`${25 * size} ${25 * size} ${50 * size} ${50 * size}`}
        >
          <circle
            className={styles.path}
            cx={50 * size}
            cy={50 * size}
            r={20 * size}
            fill='none'
            strokeWidth={strokeWidth}
            strokeMiterlimit={10}
          />
        </svg>
      </div>
    </div>
  )
}

export default Spinner
