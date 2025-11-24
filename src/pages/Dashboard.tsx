// Dashboard.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../App'; // Corrected path from previous fix
import { RotaEntry, User } from '../types'; // Import RotaEntry and User
import { getUpcomingRota } from '../services/firestore'; // ✅ FIX 1: Corrected function name to getUpcomingRota

// Component Imports - Ensure these paths are also correct relative to 'pages/'
import RotaCard from '../components/RotaCard';
import AnnouncementsList from '../components/AnnouncementsList';
import RotaList from '../components/RotaList';
import AssetsList from '../components/AssetsList';
import RichAnnouncementForm from '../components/RichAnnouncementForm';
import RotaForm from '../components/RotaForm';

import BulkMessagingModal from '../components/BulkMessagingModal';

// Interface for UserInfoCard Props (Resolves Error 7031)
interface UserInfoCardProps {
  user: User;
}

// -----------------------------------------------------------------
// Simple Component: UserInfoCard (✅ FIX 2: Added typing to 'user')
// NOTE: I am assuming you have updated RotaCard to handle a RotaEntry type
// or you will create a separate component for the RotaEntry display.
const UserInfoCard = ({ user }: UserInfoCardProps) => (
  <div className="user-info-card">
    <h2>Karibu, {user.name || 'Ndugu/Dada'}!</h2>
    <p>
      Wadhifa: <strong>{user.role}</strong>
    </p>
    {/* Simple Logout button placeholder */}
    <button onClick={() => { /* Implement logout function from auth.ts */ }}>
      Toka (Logout)
    </button>
  </div>
);
// -----------------------------------------------------------------


export default function Dashboard() {
  const navigate = useNavigate(); // 👈 Initialize hook
  const { currentUser, loading } = useUser();

  // 1. Local State for Data specific to the Dashboard View
  // Changed state type to RotaEntry | null to match getUpcomingRota function.
  const [nextRotaEntry, setNextRotaEntry] = useState<RotaEntry | null>(null);

  // 2. Local State for Modals

  const [showBulkMessagingModal, setShowBulkMessagingModal] = useState(false);
  const [showRotaForm, setShowRotaForm] = useState(false);
  const [showAnnouncementForm, setShowAnnouncementForm] = useState(false);

  const isLeader = currentUser?.role === 'Leader';

  // 3. Fetching Dashboard-specific Data
  useEffect(() => {
    if (currentUser) {
      // ✅ FIX 1: Call the correctly named function, and take the first item
      getUpcomingRota()
        .then(rotaEntries => {
            // We take the first item as the "upcoming rota"
            setNextRotaEntry(rotaEntries[0] || null);
        })
        .catch(console.error);
    }
  }, [currentUser]);

  // 4. Loading and Access Checks
  if (loading) {
    return (
      <div className="login-container">
        <div className="login-card">
          <h1 className="login-title">Maria Magdalena</h1>
          <p className="login-subtitle">Jumuiya ya Kikristo</p>
          <div style={{ textAlign: 'center', color: '#667eea' }}>
            Inapakia...
          </div>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    navigate('/login');
    return null;
  }

  return (
    <div className="dashboard-content">

      {/* 🔴 Section 1: User Info & Main Upcoming Rota (RotaCard) */}
      <UserInfoCard user={currentUser} />

      {/* NOTE: RotaCard may need internal updates to accept RotaEntry type */}
      {nextRotaEntry && (
        <div className="card">
          <h3>Kazi Ijayo (Ratiba)</h3>
          {/* Currently passing RotaEntry to a RotaCard designed for HouseRota - this may require a component update on your side */}
          <RotaCard rota={nextRotaEntry as any} />
        </div>
      )}

      {/* 🟢 Section 2: Leader Actions / Quick Access Buttons */}
      {isLeader && (
        <div className="leader-actions">
          <h3>Vitendo vya Kiongozi</h3>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {/* 👈 BUTTON MPYA: Kiungo cha Roster Management */}
            <button onClick={() => navigate('/roster')}>
                Usimamizi wa Jumuiya
            </button>


            <button onClick={() => navigate('/bulk-messaging')}>📱 Tuma Ujumbe</button>
            <button onClick={() => navigate('/add-rota')}>+ Weka Kazi Mpya</button>
            <button onClick={() => navigate('/add-announcement')}>+ Tangazo Jipya</button>

          </div>
        </div>
      )}

      {/* 🔵 Section 3: Data Lists (The main Grid Layout) */}
      <div className="grid-layout">

        <div>
          <AnnouncementsList />
        </div>

        <div>
          <RotaList currentUser={currentUser} />
        </div>

        <div>
          <AssetsList currentUser={currentUser} />
        </div>

      </div>

      {/* 🔴 Section 4: Modals (Conditionally Rendered) */}



      {showRotaForm && (
        <div className="modal-overlay">
            <div className="modal-content">
              <h3>Weka Kazi Mpya Kwenye Ratiba</h3>
              <RotaForm onSuccess={() => setShowRotaForm(false)} />
              <button onClick={() => setShowRotaForm(false)}>
                Funga
              </button>
            </div>
        </div>
      )}

      {showAnnouncementForm && (
        <div className="modal-overlay">
            <div className="modal-content">
              <h3>Tuma Tangazo Jipya</h3>
              <RichAnnouncementForm currentUser={currentUser} />
              <button onClick={() => setShowAnnouncementForm(false)}>
                Funga
              </button>
            </div>
        </div>
      )}

      {showBulkMessagingModal && (
        <BulkMessagingModal
          isOpen={showBulkMessagingModal}
          onClose={() => setShowBulkMessagingModal(false)}
        />
      )}

    </div>
  );
}
