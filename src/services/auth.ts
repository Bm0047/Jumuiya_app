import { getAuth, onAuthStateChanged, signInAnonymously, signOut, User as FirebaseUser, createUserWithEmailAndPassword } from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { auth } from '../firebaseConfig'
import { getFirestore } from 'firebase/firestore'
import { User, ROLES } from '../types'

const db = getFirestore()

export function onAuthChange(cb: (user: User | null) => void) {
  return onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      try {
        // Get user from members collection
        const userDocRef = doc(db, 'members', firebaseUser.uid)
        const userDoc = await getDoc(userDocRef)

        if (userDoc.exists()) {
          const userData = userDoc.data()
          const user: User = {
            id: firebaseUser.uid,
            email: firebaseUser.email || undefined,
            role: userData.role || ROLES.MEMBER,
            name: userData.name || firebaseUser.displayName || undefined,
          }
          cb(user)
        } else {
          // New user, assign member role by default
          const user: User = {
            id: firebaseUser.uid,
            email: firebaseUser.email || undefined,
            role: ROLES.MEMBER,
            name: firebaseUser.displayName || undefined,
          }
          cb(user)
        }
      } catch (error) {
        console.error('Error fetching user data:', error)
        // Fallback to member role if Firestore fails
        const user: User = {
          id: firebaseUser.uid,
          email: firebaseUser.email || undefined,
          role: ROLES.MEMBER,
          name: firebaseUser.displayName || undefined,
        }
        cb(user)
      }
    } else {
      cb(null)
    }
  })
}

export async function loginAnonymously(role?: 'leader' | 'member'): Promise<User | null> {
  try {
    const result = await signInAnonymously(auth)
    // User will be handled by onAuthChange
    // The role parameter can be used to set the role in the user document
    // For now, we'll let the onAuthChange handle role assignment
    return null
  } catch (error) {
    console.error('Anonymous login failed:', error)
    throw error
  }
}

export async function createUserProfile(userId: string, userData: Partial<User>) {
  const userDocRef = doc(db, 'members', userId)
  return setDoc(userDocRef, {
    ...userData,
    createdAt: new Date(),
  }, { merge: true })
}

export async function createUserCredentials(role: 'leader' | 'member'): Promise<{ loginName: string; password: string }> {
  // Generate unique login name
  const timestamp = Date.now()
  const randomSuffix = Math.random().toString(36).substring(2, 8)
  const loginName = `${role}_${timestamp}_${randomSuffix}`

  // Generate secure password
  const password = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)

  return { loginName, password }
}

export async function createUserAccount(email: string, password: string) {
  return createUserWithEmailAndPassword(auth, email, password)
}

export function logout() {
  return signOut(auth)
}

export function isLeader(user: User | null): boolean {
  return user?.role === ROLES.LEADER
}

export { auth }
