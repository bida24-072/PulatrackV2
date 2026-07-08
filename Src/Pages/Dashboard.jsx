import React, { useEffect, useState } from 'react';
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/ui';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function Dashboard() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [metrics, setMetrics] = useState({ income: 0, expense: 0, balance: 0 });

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, `users/${user.uid}/transactions`), orderBy('date', 'desc'));
    const unsubscribe = onSnapshot(q, (snap) => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setTransactions(data);
      
      const currMonth = new Date().getMonth();
      const currMonthData = data.filter(d => new Date(d.date).getMonth() === currMonth);
      
      const income = currMonthData.filter(d => d.type === 'Income').reduce((a, b) => a + Number(b.amount), 0);
      const expense = currMonthData.filter(d => d.type === 'Expense').reduce((a, b) => a + Number(b.amount), 0);
      setMetrics({ income, expense, balance: income - expense });
    });
    return () => unsubscribe();
  }, [user]);

  // Transform data for charts
  const expenseCategories = transactions
    .filter(t => t.type === 'Expense' && new Date(t.date).getMonth() === new Date().getMonth())
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + Number(t.amount);
      return acc;
    }, {});
  
  const pieData = Object.keys(expenseCategories).map(key => ({ name: key, value: expenseCategories[key] }));
  const COLORS = ['#0D4C5C', '#D4AF37', '#e11d48', '#16a34a', '#2563eb', '#9333ea'];

  return (
    <div className="space-y-6">
      <Card className="bg-teal-700 text-white p-6 border-none">
        <p className="text-teal-100 text-sm font-medium mb-1">This Month's Balance</p>
        <h2 className="text-3xl font-bold mb-6">P {metrics.balance.toFixed(2)}</h2>
        <div className="flex justify-between gap-4">
          <div className="bg-teal-600 p-3 rounded-lg flex-1">
            <p className="text-xs text-teal-200">Income</p>
            <p className="font-semibold">P {metrics.income.toFixed(2)}</p>
          </div>
          <div className="bg-teal-600 p-3 rounded-lg flex-1">
            <p className="text-xs text-teal-200">Expenses</p>
            <p className="font-semibold text-red-300">P {metrics.expense.toFixed(2)}</p>
          </div>
        </div>
      </Card>

      <div>
        <h3 className="font-semibold text-gray-800 mb-3">Expense Breakdown (This Month)</h3>
        <Card className="p-4 h-64 flex items-center justify-center">
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(value) => `P ${value}`} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
             <p className="text-gray-400 text-sm">No expenses this month</p>
          )}
        </Card>
      </div>
    </div>
  );
}
