// TransactionForm.js
import React, { useState } from 'react';

const TransactionForm = () => {
  const [form, setForm] = useState({ type: 'income', category: '', amount: '', date: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    setForm({ type: 'income', category: '', amount: '', date: '' });
    console.log("checck form ===>", form);
    
  };

  return (
    <form onSubmit={handleSubmit}>
      <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
        <option value="income">Income</option>
        <option value="expense">Expense</option>
      </select>
      <input type="text" placeholder="Category" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} required />
      <input type="number" placeholder="Amount" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} required />
      <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} required />
      <button type="submit">Add Transaction</button>
    </form>
  );
};

export default React.memo(TransactionForm);
