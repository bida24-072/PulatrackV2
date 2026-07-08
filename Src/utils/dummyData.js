import { collection, addDoc, doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

export const generateDummyData = async (userId) => {
  const transactions = [
    { type: 'Income', amount: 15000, category: 'Salary', date: new Date().toISOString(), note: 'Monthly Salary' },
    { type: 'Expense', amount: 3500, category: 'Rent', date: new Date().toISOString(), note: 'Gaborone Apartment' },
    { type: 'Expense', amount: 800, category: 'Groceries', date: new Date().toISOString(), note: 'Choppies' },
    { type: 'Expense', amount: 200, category: 'Airtime/Data', date: new Date().toISOString(), note: 'Mascom' }
  ];
  
  for (let t of transactions) {
    await addDoc(collection(db, `users/${userId}/transactions`), { ...t, createdAt: new Date() });
  }

  await addDoc(collection(db, `users/${userId}/budgets`), { category: 'Groceries', amount: 1500, month: new Date().getMonth(), year: new Date().getFullYear() });
  await addDoc(collection(db, `users/${userId}/goals`), { title: 'New Phone', targetAmount: 8000, currentAmount: 2500, deadline: '2026-12-01', icon: 'Smartphone' });
};
