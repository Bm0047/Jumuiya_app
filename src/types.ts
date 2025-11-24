export type Role = 'Leader' | 'Member'

export const ROLES = {
  LEADER: 'Leader' as const,
  MEMBER: 'Member' as const,
} as const

export type Group = 'WAWATA' | 'UWAKA' | 'Vijana' | 'Watoto'

export const GROUPS = {
  WAWATA: 'WAWATA' as const,
  UWAKA: 'UWAKA' as const,
  VIJANA: 'Vijana' as const,
  WATOTO: 'Watoto' as const,
} as const


export interface User {
  id: string
  email?: string
  role: Role
  name?: string
  loginName?: string
  password?: string
}

export interface RotaEntry {
  id: string
  task: string
  assignedTo: string
  date: string // YYYY-MM-DD
  createdAt: Date
  updatedAt: Date
}

export interface Asset {
  id: string
  name: string
  status: 'available' | 'borrowed' | 'in_use'
  quantity: number
  description?: string
  createdAt: Date
  updatedAt: Date
}

export interface HouseRota {
  id: string
  hostName: string
  date: string // YYYY-MM-DD
  addressText: string
  mapLink?: string
}

export interface Member {
  id: string
  name: string
  role: Role
  group: Group
  joinDate: string // ISO
  familyName?: string
  phoneNumber?: string
  whatsappNumber?: string
  registeredBy?: string
  registrationDate?: Date
}

export interface Attendance {
  id: string
  rotaId: string
  attendanceDate: string
  attendedMembers: string[]
}

export interface Announcement {
  id: string
  message: string
  type: 'TEXT' | 'IMAGE' | 'LINK'
  mediaUrl?: string
  authorId: string
  authorRole: Role
  timestamp: Date
}

export interface LiturgicalInfo {
  color: string
  name: string
}
