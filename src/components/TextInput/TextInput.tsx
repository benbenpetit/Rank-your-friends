import { FC } from 'react'
import styles from './TextInput.module.scss'

interface Props {
  placeholder?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  cta?: {
    text: string
    onClick: () => void
  }
}

const TextInput: FC<Props> = ({ value, onChange, placeholder, cta }) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    cta?.onClick()
  }

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit}>
        <input
          type='text'
          placeholder={placeholder || ''}
          value={value}
          onChange={onChange}
        />
        {cta && <button>{cta.text}</button>}
      </form>
    </div>
  )
}

export default TextInput
