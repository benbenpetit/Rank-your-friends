import { FC, ReactNode } from 'react'
import styles from './ListQuestions.module.scss'

interface Props {
  questions: string[]
  handleRemoveQuestion: (question: string) => void
}

const ListQuestions: FC<Props> = ({ questions, handleRemoveQuestion }) => {
  return (
    <div className={styles.container}>
      <ul>
        {questions.map((question) => (
          <li key={question}>
            <span>{question}</span>
            <button onClick={() => handleRemoveQuestion(question)}>x</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ListQuestions
