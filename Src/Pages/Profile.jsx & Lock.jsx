// src/pages/Profile.jsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button, Card, Input } from '../components/ui';
import { generateDummyData } from '../utils/dummyData';

export default function Profile() {
  const { user, logout } = useAuth();
  const [pin, setPin] = useState('');

  const savePin = () => {
    if (pin.length === 4) {
      localStorage.setItem(`pin_${user.uid}`, btoa(pin));
      alert("App Lock PIN Saved!");
      setPin('');
    } else {
      alert("PIN must be 4 digits");
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-20 h-20 bg-teal-100 rounded-full mx-auto flex items-center justify-center text-3xl mb-3 overflow-hidden">
          {user.photoURL ? <img src={user.photoURL} alt="Profile" /> : '👤'}
        </div>
        <h2 className="text-xl font-bold">{user.name || 'PulaTrack User'}</h2>
        <p className="text-gray-500 text-sm">{user.email}</p>
      </div>

      <Card className="p-4 space-y-4">
        <h3 className="font-semibold border-b pb-2">Security Setting: App Lock</h3>
        <p className="text-xs text-gray-500">Set a 4-digit PIN to lock the app after 15 minutes of inactivity.</p>
        <div className="flex gap-2">
          <Input type="password" maxLength={4} placeholder="1234" value={pin} onChange={e => setPin(e.target.value)} />
          <Button onClick={savePin} className="mt-6 w-auto">Save</Button>
        </div>
      </Card>

      <Card className="p-4 space-y-4">
        <h3 className="font-semibold border-b pb-2">Developer Tools</h3>
        <Button variant="secondary" onClick={() => generateDummyData(user.uid)}>Generate Dummy Data</Button>
      </Card>

      <Button variant="danger" onClick={logout}>Sign Out</Button>
    </div>
  );
}

// src/pages/Lock.jsx
export function Lock() {
  const { user, setIsLocked } = useAuth();
  const [entry, setEntry] = useState('');
  const [error, setError] = useState('');

  const handleUnlock = () => {
    const stored = localStorage.getItem(`pin_${user?.uid}`);
    if (stored && atob(stored) === entry) {
      setIsLocked(false);
    } else {
      setError('Incorrect PIN');
      setEntry('');
    }
  };

  return (
    <div className="min-h-screen bg-teal-700 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm text-center">
        <div className="w-16 h-16 bg-gold-500 rounded-full mx-auto flex items-center justify-center text-3xl font-bold text-teal-900 mb-6">🔒</div>
        <h2 className="text-2xl font-bold mb-2">App Locked</h2>
        <p className="text-gray-500 text-sm mb-6">Enter your 4-digit PIN to continue</p>
        
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        
        <Input type="password" maxLength={4} className="text-center text-2xl tracking-[1em]" value={entry} onChange={e => setEntry(e.target.value)} />
        <Button onClick={handleUnlock} className="mt-4">Unlock PulaTrack</Button>
      </div>
    </div>
  );
}
