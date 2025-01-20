import { FC, ReactNode } from 'react'
import styles from './CTA.module.scss'
import Link from 'next/link'

interface Props {
  text: string
  onClick?: () => void
  href?: string
}

const CTA: FC<Props> = ({ text, onClick, href }) => {
  return href ? (
    <Link className={styles.container} href={href}>
      {text}
    </Link>
  ) : (
    <button className={styles.container} onClick={onClick}>
      {text}
    </button>
  )
}

export default CTA
