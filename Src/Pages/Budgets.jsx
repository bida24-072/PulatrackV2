import React, { useState, useEffect } from 'react';
import { collection, query, onSnapshot, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { Card, Progress, Button, Input, Select } from '../components/ui';

export default function Budgets() {
  const { user } = useAuth();
  const [budgets, setBudgets] = useState([]);
  const [spent, setSpent] = useState({});
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ category: '', amount: '' });
  
  const expCats = ['Food', 'Transport', 'Rent', 'Airtime/Data', 'Shopping', 'Bills', 'Other'];

  useEffect(() => {
    // Load budgets
    const qb = query(collection(db, `users/${user.uid}/budgets`));
    const unsubB = onSnapshot(qb, snap => setBudgets(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
    
    // Load spent (current month)
    const qt = query(collection(db, `users/${user.uid}/transactions`));
    const unsubT = onSnapshot(qt, snap => {
      const currentMonth = new Date().getMonth();
      const currentSpent = {};
      snap.docs.forEach(d => {
        const t = d.data();
        if (t.type === 'Expense' && new Date(t.date).getMonth() === currentMonth) {
          currentSpent[t.category] = (currentSpent[t.category] || 0) + Number(t.amount);
        }
      });
      setSpent(currentSpent);
    });
    
    return () => { unsubB(); unsubT(); };
  }, [user]);

  const handleAdd = async (e) => {
    e.preventDefault();
    await addDoc(collection(db, `users/${user.uid}/budgets`), { ...form, amount: Number(form.amount), month: new Date().getMonth(), year: new Date().getFullYear() });
    setShowAdd(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Monthly Budgets</h2>
        <Button onClick={() => setShowAdd(!showAdd)} className="w-auto text-sm px-3 py-1 h-8">+ New Budget</Button>
      </div>

      {showAdd && (
        <Card className="p-4 bg-gray-50 mb-4">
          <form onSubmit={handleAdd} className="space-y-3">
            <Select label="Category" value={form.category} onChange={e => setForm({...form, category: e.target.value})} options={expCats} required />
            <Input label="Budget Amount (P)" type="number" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} required />
            <Button type="submit">Save Budget</Button>
          </form>
        </Card>
      )}

      {budgets.map(b => {
        const currentSpent = spent[b.category] || 0;
        const percent = (currentSpent / b.amount) * 100;
        return (
          <Card key={b.id} className="p-4">
            <div className="flex justify-between mb-2">
              <h3 className="font-semibold text-gray-800">{b.category}</h3>
              <p className="text-sm font-medium text-gray-500">P{currentSpent} / P{b.amount}</p>
            </div>
            <Progress value={currentSpent} max={b.amount} />
            {percent > 80 && <p className="text-xs text-red-500 mt-2">Warning: Approaching budget limit!</p>}
          </Card>
        );
      })}
    </div>
  );
}
