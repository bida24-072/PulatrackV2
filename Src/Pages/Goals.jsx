import React, { useState, useEffect } from 'react';
import { collection, query, onSnapshot, addDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { Card, Progress, Button, Input } from '../components/ui';

export default function Goals() {
  const { user } = useAuth();
  const [goals, setGoals] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ title: '', targetAmount: '', currentAmount: 0, deadline: '' });

  useEffect(() => {
    const q = query(collection(db, `users/${user.uid}/goals`));
    const unsub = onSnapshot(q, snap => setGoals(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
    return () => unsub();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addDoc(collection(db, `users/${user.uid}/goals`), { 
      ...form, targetAmount: Number(form.targetAmount), currentAmount: Number(form.currentAmount), createdAt: new Date().toISOString() 
    });
    setShowAdd(false);
  };

  const addFunds = async (goalId, current, addition) => {
    const ref = doc(db, `users/${user.uid}/goals`, goalId);
    await updateDoc(ref, { currentAmount: current + addition });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Savings Goals</h2>
        <Button onClick={() => setShowAdd(!showAdd)} className="w-auto text-sm px-3 py-1 h-8">+ New Goal</Button>
      </div>

      {showAdd && (
        <Card className="p-4 bg-gray-50 mb-4">
          <form onSubmit={handleSubmit} className="space-y-3">
            <Input label="Goal Title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />
            <Input label="Target Amount (P)" type="number" value={form.targetAmount} onChange={e => setForm({...form, targetAmount: e.target.value})} required />
            <Input label="Deadline" type="date" value={form.deadline} onChange={e => setForm({...form, deadline: e.target.value})} required />
            <Button type="submit">Create Goal</Button>
          </form>
        </Card>
      )}

      {goals.map(g => (
        <Card key={g.id} className="p-4">
          <div className="flex justify-between mb-2">
            <div>
              <h3 className="font-semibold text-gray-800">{g.title}</h3>
              <p className="text-xs text-gray-500">Target: {g.deadline}</p>
            </div>
            <p className="text-sm font-medium text-teal-600">P{g.currentAmount} / P{g.targetAmount}</p>
          </div>
          <Progress value={g.currentAmount} max={g.targetAmount} className="mb-4" />
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => addFunds(g.id, g.currentAmount, 50)} className="text-xs py-1 h-8">+ P50</Button>
            <Button variant="outline" onClick={() => addFunds(g.id, g.currentAmount, 100)} className="text-xs py-1 h-8">+ P100</Button>
            <Button variant="outline" onClick={() => addFunds(g.id, g.currentAmount, 500)} className="text-xs py-1 h-8">+ P500</Button>
          </div>
        </Card>
      ))}
    </div>
  );
}
