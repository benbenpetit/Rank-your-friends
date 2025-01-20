import { Dispatch, FC, SetStateAction, useState } from 'react'
import styles from './ParticipantsDraggable.module.scss'
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy
} from '@dnd-kit/sortable'
import { useMemo } from 'react'
import dynamic from 'next/dynamic'
import ParticipantDraggable from '@/components/PartyQuestions/PartyQuestion/ParticipantsDraggable/ParticipantDraggable/ParticipantDraggable'

interface Props {
  participants: string[]
  setParticipants: Dispatch<SetStateAction<string[]>>
}

const DynamicParticipantPortal = dynamic(
  () =>
    import(
      '@/components/PartyQuestions/PartyQuestion/ParticipantsDraggable/DynamicParticipantPortal/DynamicParticipantPortal'
    ),
  { ssr: false }
)

const ParticipantsDraggable: FC<Props> = ({
  participants,
  setParticipants
}) => {
  const participantsIds = useMemo(
    () => participants.map((participant) => participant),
    [participants]
  )
  const [activeParticipant, setActiveParticipant] = useState<string | null>(
    null
  )

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3
      }
    })
  )

  const onDragStart = (event: DragStartEvent) => {
    setActiveParticipant(String(event.active.id))
  }

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over) return

    if (active.id !== over.id) {
      setParticipants((participants) => {
        const oldIndex = participants.indexOf(String(active.id))
        const newIndex = participants.indexOf(String(over.id))

        return arrayMove(participants, oldIndex, newIndex)
      })
    }
  }

  return (
    <div className={styles.container}>
      <DndContext
        id='unique-id'
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
      >
        <SortableContext
          items={participantsIds}
          strategy={verticalListSortingStrategy}
        >
          {participants.map((participant) => (
            <ParticipantDraggable key={participant} participant={participant} />
          ))}
        </SortableContext>
        {activeParticipant && (
          <DynamicParticipantPortal participant={activeParticipant} />
        )}
      </DndContext>
    </div>
  )
}

export default ParticipantsDraggable
