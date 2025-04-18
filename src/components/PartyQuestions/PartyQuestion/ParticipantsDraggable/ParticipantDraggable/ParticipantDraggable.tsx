import { FC } from 'react'
import styles from './ParticipantDraggable.module.scss'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import clsx from 'clsx'
import { VscGrabber } from 'react-icons/vsc'
import isMobile from 'is-mobile'

interface Props {
  participant: string
}

const ParticipantDraggable: FC<Props> = ({ participant }) => {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: participant
  })

  const isMobileDevice = isMobile()

  const style = {
    transition,
    transform: CSS.Transform.toString(transform)
  }

  return (
    <div
      className={clsx(styles.container, isDragging && styles.dragging)}
      ref={setNodeRef}
      style={style}
      {...(!isMobileDevice ? { ...listeners, ...attributes } : {})}
    >
      <span className={styles.title}>{participant}</span>
      <div
        className={styles.dragger}
        {...(isMobileDevice ? { ...listeners, ...attributes } : {})}
      >
        <VscGrabber size={28} />
      </div>
    </div>
  )
}

export default ParticipantDraggable
