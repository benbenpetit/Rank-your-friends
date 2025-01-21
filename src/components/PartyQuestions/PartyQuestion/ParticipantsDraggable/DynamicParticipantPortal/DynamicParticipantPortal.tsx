import { FC } from 'react'
import { createPortal } from 'react-dom'
import { DragOverlay } from '@dnd-kit/core'
import ParticipantDraggable from '@/components/PartyQuestions/PartyQuestion/ParticipantsDraggable/ParticipantDraggable/ParticipantDraggable'

interface Props {
  participant: string
}

const DynamicParticipantPortal: FC<Props> = ({ participant }) => {
  if (!participant) return null

  return createPortal(
    <DragOverlay>
      <ParticipantDraggable participant={participant} />
    </DragOverlay>,
    document.body
  )
}

export default DynamicParticipantPortal
