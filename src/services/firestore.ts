import {
  getFirestore,
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  onSnapshot,
  query,
  orderBy,
  where,
  limit,
  Timestamp
} from 'firebase/firestore'
import { app } from '../firebaseConfig'
import { RotaEntry, Asset, Announcement, Member } from '../types'

export const db = getFirestore(app)
const appId = 'default-app-id' // This should match the app ID used in firestore rules

// Legacy collections (for backward compatibility) - keeping for migration
export const rotaCollection = collection(db, 'rota')
export const assetsCollection = collection(db, 'assets')

// New collections using specified database tables
export const houseRotaCollection = collection(db, 'rota_tasks')
export const announcementsCollection = collection(db, 'announcements')
export const communityAssetsCollection = collection(db, 'community_assets')
export const membersCollection = collection(db, 'members')

// Rota Operations (Legacy)
export async function addRotaEntry(entry: Omit<RotaEntry, 'id' | 'createdAt' | 'updatedAt'>) {
  const now = Timestamp.now()
  return addDoc(rotaCollection, {
    ...entry,
    createdAt: now,
    updatedAt: now,
  })
}

export async function updateRotaEntry(id: string, updates: Partial<RotaEntry>) {
  const rotaRef = doc(db, 'rota', id)
  return updateDoc(rotaRef, {
    ...updates,
    updatedAt: Timestamp.now(),
  })
}

export async function deleteRotaEntry(id: string) {
  return deleteDoc(doc(db, 'rota', id))
}

export function subscribeToRota(callback: (rota: RotaEntry[]) => void) {
  const q = query(rotaCollection, orderBy('date', 'asc'))
  return onSnapshot(q, (snapshot) => {
    const rota = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    })) as RotaEntry[]
    callback(rota)
  })
}

// House Rota Operations (New)
export async function addHouseRotaEntry(entry: Omit<RotaEntry, 'id' | 'createdAt' | 'updatedAt'>) {
  const now = Timestamp.now()
  return addDoc(houseRotaCollection, {
    ...entry,
    createdAt: now,
    updatedAt: now,
  })
}

export function subscribeToHouseRota(callback: (rota: RotaEntry[]) => void) {
  const q = query(houseRotaCollection, orderBy('date', 'asc'))
  return onSnapshot(q, (snapshot) => {
    const rota = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    })) as RotaEntry[]
    callback(rota)
  })
}

// Assets Operations
export async function addAsset(asset: Omit<Asset, 'id' | 'createdAt' | 'updatedAt'>) {
  const now = Timestamp.now()
  return addDoc(assetsCollection, {
    ...asset,
    createdAt: now,
    updatedAt: now,
  })
}

export async function updateAsset(id: string, updates: Partial<Asset>) {
  const assetRef = doc(db, 'assets', id)
  return updateDoc(assetRef, {
    ...updates,
    updatedAt: Timestamp.now(),
  })
}

export async function deleteAsset(id: string) {
  return deleteDoc(doc(db, 'assets', id))
}

export function subscribeToAssets(callback: (assets: Asset[]) => void) {
  const q = query(assetsCollection, orderBy('name', 'asc'))
  return onSnapshot(q, (snapshot) => {
    const assets = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    })) as Asset[]
    callback(assets)
  })
}

// Announcement Operations
export async function addAnnouncement(announcement: Omit<Announcement, 'id' | 'timestamp'>) {
  return addDoc(announcementsCollection, {
    ...announcement,
    timestamp: Timestamp.now(),
  })
}

export function subscribeToAnnouncements(callback: (announcements: Announcement[]) => void) {
  const q = query(announcementsCollection, orderBy('timestamp', 'desc'), limit(10))
  return onSnapshot(q, (snapshot) => {
    const announcements = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate(),
    })) as Announcement[]
    callback(announcements)
  })
}

// Member Operations
export async function addMember(memberData: Omit<Member, 'id' | 'registrationDate'>) {
  return addDoc(membersCollection, {
    ...memberData,
    registrationDate: Timestamp.now(),
  })
}

export async function updateMember(id: string, updates: Partial<Member>) {
  const memberRef = doc(db, 'members', id)
  return updateDoc(memberRef, {
    ...updates,
    updatedAt: Timestamp.now(),
  })
}

export async function deleteMember(id: string) {
  const memberRef = doc(db, 'members', id)
  return deleteDoc(memberRef)
}

export function subscribeToMembers(callback: (members: Member[]) => void) {
  const q = query(membersCollection, orderBy('registrationDate', 'desc'))
  return onSnapshot(q, (snapshot) => {
    const members = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      registrationDate: doc.data().registrationDate?.toDate(),
    })) as Member[]
    callback(members)
  })
}

export function subscribeToMember(userId: string, callback: (member: Member | null) => void) {
  const memberRef = doc(db, 'members', userId)
  return onSnapshot(memberRef, (docSnap) => {
    if (docSnap.exists()) {
      const data = docSnap.data()
      const member: Member = {
        id: docSnap.id,
        ...data,
        registrationDate: data.registrationDate?.toDate(),
      } as Member
      callback(member)
    } else {
      callback(null)
    }
  })
}

// Utility functions
export async function getUpcomingRota() {
  const now = new Date()
  const today = now.toISOString().split('T')[0]
  const q = query(rotaCollection, where('date', '>=', today), orderBy('date', 'asc'))
  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate(),
    updatedAt: doc.data().updatedAt?.toDate(),
  })) as RotaEntry[]
}

// Note: do not commit real credentials. Replace firebaseConfig with your project's values.
