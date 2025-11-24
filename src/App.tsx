// App.tsx
import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  query,
  onSnapshot,
} from 'firebase/firestore';

// ✅ FIX 1: Ongeza ugani wa .ts kwenye imports zote
import { firebaseConfig } from './firebaseConfig';
import AppRoutes from './AppRoutes';
import { User, Member } from './types';
import { useNotifications } from './components/NotificationBar';
// =========================================================
// FIREBASE INITIALIZATION
// =========================================================
let app: any = null;
let db: any = null;

try {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
} catch (error) {
  console.error('Failed to initialize Firebase:', error);
}

const appId = 'default-app-id'; // Tumia hii kwa collections za artifacts

// =========================================================
// CONTEXT
// =========================================================
interface AppContextType {
  currentUser: User | null;
  loading: boolean;
  roster: Member[];
  addNotification: (message: string, type: 'success' | 'error' | 'info') => void;
}

const AppContext = React.createContext<AppContextType>({
  currentUser: null,
  loading: false,
  roster: [],
  addNotification: () => {},
});

export const useUser = () => React.useContext(AppContext);
const AppProvider = AppContext.Provider;

// =========================================================
// MAIN APP COMPONENT
// =========================================================
export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [roster, setRoster] = useState<Member[]>([]);
  const { addNotification, NotificationContainer } = useNotifications();

  // 🔴 useEffect 1: Authentication
  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      try {
        const { onAuthChange } = await import('./services/auth');
        const unsubscribe = onAuthChange((user: User | null) => {
          if (mounted) {
            setCurrentUser(user);
            setLoading(false); // Set loading to false when auth state is determined
          }
        });
        return unsubscribe;
      } catch (error) {
        console.error('Failed to initialize auth:', error);
        if (mounted) {
          setLoading(false); // Set loading to false even on error
        }
      }
    };

    const unsubscribePromise = initAuth();

    return () => {
      mounted = false;
      unsubscribePromise.then(unsubscribe => {
        if (unsubscribe) unsubscribe();
      });
    };
  }, []);

  // 🔴 useEffect 2: Kusajili Orodha ya Wanajumuiya (Jumuiya)
  useEffect(() => {
    if (!db) {
      console.warn('Firestore not initialized, skipping roster subscription');
      return;
    }

    const membersCollection = collection(db, 'members');
    const q = query(membersCollection);

    const unsubscribeRoster = onSnapshot(q, (snapshot) => {
      const members: Member[] = snapshot.docs.map(doc => ({
        id: doc.id,
        // Tumia data ya doc, na hakikisha aina inalingana na Member
        ...(doc.data() as Omit<Member, 'id'>),
        group: doc.data().group || 'UWAKA' // Default to UWAKA if no group specified
      }));
      setRoster(members);
    }, (error) => {
      console.error("Error subscribing to roster:", error);
    });

    // Ondoa usajili wakati component inafungwa
    return () => unsubscribeRoster();
  }, []);

  return (
    <div className="app">
      <AppProvider value={{ currentUser, loading, roster, addNotification }}>
        <AppRoutes />
        <NotificationContainer />
      </AppProvider>
    </div>
  );
}
