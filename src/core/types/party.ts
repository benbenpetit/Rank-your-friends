import { Timestamp } from 'firebase/firestore'

export interface IParty {
  id: string
  name: string
  participants: string[]
  createdAt: Timestamp
  date?: string
}

export interface IQuestion {
  id: string
  text: string
}
