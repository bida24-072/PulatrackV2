import React, { useState, useEffect } from 'react';
import { collection, addDoc, query, onSnapshot, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { Button, Input, Select, Card } from '../components/ui';
import { Trash2, Plus } from 'lucide-react';

export default function Transactions() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ type: 'Expense', amount: '', category: '', note: '', date: new Date().toISOString().split('T')[0] });

  const incCats = ['Salary', 'Business', 'Gift', 'Other'];
  const expCats = ['Food', 'Transport', 'Rent', 'Airtime/Data', 'Shopping', 'Bills', 'Other'];

  useEffect(() => {
    const q = query(collection(db, `users/${user.uid}/transactions`), orderBy('date', 'desc'));
    const unsub = onSnapshot(q, snap => {
      setTransactions(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addDoc(collection(db, `users/${user.uid}/transactions`), { ...form, amount: Number(form.amount), createdAt: new Date().toISOString() });
    setShowAdd(false);
    setForm({ type: 'Expense', amount: '', category: '', note: '', date: new Date().toISOString().split('T')[0] });
  };

  const exportCSV = () => {
    const header = "Date,Type,Category,Amount,Note\n";
    const csv = transactions.map(t => `${t.date},${t.type},${t.category},${t.amount},${t.note}`).join('\n');
    const blob = new Blob([header + csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions_${new Date().toLocaleDateString()}.csv`;
    a.click();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">Transactions</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportCSV} className="text-xs px-2 py-1 h-8">CSV</Button>
          <Button onClick={() => setShowAdd(!showAdd)} className="px-2 py-1 h-8 w-8"><Plus size={16} /></Button>
        </div>
      </div>

      {showAdd && (
        <Card className="p-4 bg-gray-50 mb-4">
          <form onSubmit={handleSubmit} className="space-y-3">
            <Select label="Type" value={form.type} onChange={e => setForm({...form, type: e.target.value, category: ''})} options={['Income', 'Expense']} required />
            <Input label="Amount (P)" type="number" step="0.01" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} required />
            <Select label="Category" value={form.category} onChange={e => setForm({...form, category: e.target.value})} options={form.type === 'Income' ? incCats : expCats} required />
            <Input label="Date" type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} required />
            <Input label="Note" type="text" value={form.note} onChange={e => setForm({...form, note: e.target.value})} />
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => setShowAdd(false)}>Cancel</Button>
              <Button type="submit">Save</Button>
            </div>
          </form>
        </Card>
      )}

      <div className="space-y-3">
        {transactions.map(t => (
          <Card key={t.id} className="p-3 flex justify-between items-center">
            <div className="flex gap-3 items-center">
              <div className={`w-2 h-10 rounded-full ${t.type === 'Income' ? 'bg-teal-500' : 'bg-red-400'}`}></div>
              <div>
                <p className="font-semibold text-gray-800">{t.category}</p>
                <p className="text-xs text-gray-500">{t.date} {t.note && `• ${t.note}`}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <p className={`font-bold ${t.type === 'Income' ? 'text-teal-600' : 'text-gray-900'}`}>
                {t.type === 'Income' ? '+' : '-'}P{t.amount.toFixed(2)}
              </p>
              <button onClick={() => deleteDoc(doc(db, `users/${user.uid}/transactions`, t.id))} className="text-gray-400 hover:text-red-500 transition-colors">
                <Trash2 size={16} />
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
