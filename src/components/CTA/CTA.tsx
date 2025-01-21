import { FC } from 'react'
import styles from './CTA.module.scss'
import Link from 'next/link'
import Spinner from '@/components/Spinner/Spinner'
import clsx from 'clsx'

interface Props {
  text: string
  onClick?: () => void
  href?: string
  isLoading?: boolean
}

const CTA: FC<Props> = ({ text, onClick, href, isLoading }) => {
  return href ? (
    <Link className={styles.container} href={href}>
      {text}
    </Link>
  ) : (
    <button
      className={clsx(styles.container, isLoading && styles.loading)}
      onClick={onClick}
    >
      <div className={styles.inside} style={{ minHeight: 30 }}>
        {!isLoading ? (
          <span>{text}</span>
        ) : (
          <Spinner size={0.3} strokeWidth={1} />
        )}
      </div>
    </button>
  )
}

export default CTA
