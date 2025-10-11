// TransactionTable.js
import React, { useEffect, useState } from 'react';
import WLPagination from '../Common/WLPagination';

const TransactionTable = ({ transactions }) => {
  const initialPagination = {per_page:10, current_page:1, last_page:1}
  const [filter, setFilter] = useState({ category: '', amount: '', date: '' });
  const allData = [
    { type: "Nikhil", category: 708040799, date: "03/08/2024", amount: 1 },
    { type: "Himanshu", category: 8546754862, date: "03/08/2024", amount: 1 },
    { type: "Vaibhav", category: 7395846215, date: "08/08/2024", amount: 1 },
    { type: "Prakash", category: 9584675480, date: "08/08/2024", amount: 0 },
    { type: "Vinod", category: 9005026548, date: "08/08/2024", amount: 1 },
    { type: "Ankita", category: 7008065859, date: "23/08/2024", amount: 0 },
    { type: "Sneha", category: 7080471584, date: "23/08/2024", amount: 1 },
    { type: "Digvijay", category: 708040799, date: "23/08/2024", amount: 1 },
    { type: "Suhail Shekh", category: 708040799, date: "23/08/2024", amount: 1 },
    { type: "Salman", category: 708040799, date: "25/08/2024", amount: 1 },
    { type: "Sarukh", category: 708040799, date: "25/08/2024", amount: 0 },
    { type: "Nikita", category: 708040799, date: "08/09/2024", amount: 1 },
    { type: "Saif Ali Khan", category: 708040799, date: "09/09/2024", amount: 1 },
    { type: "Suhail Khan", category: 708040799, date: "10/09/2024", amount: 1 },
    { type: "Nandani", category: 708040799, date: "23/09/2024", amount: 1 },
    { type: "Nitin", category: 708040799, date: "23/09/2024", amount: 0 },
    { type: "Nilanjan", category: 708040799, date: "23/10/2024", amount: 1 },
    { type: "Nurah", category: 708040799, date: "23/10/2024", amount: 1 },
    { type: "Harpreet", category: 708040799, date: "23/10/2024", amount: 1 },
    { type: "Ameer Khan", category: 708040799, date: "23/11/2024", amount: 1 },
  ];

  const [pagination, setPagination] = useState({
    ...initialPagination,
    last_page: Math.ceil(allData.length / initialPagination.per_page)
  });

  const [currentData, setCurrentData] = useState([]);

  // Apply filtering and pagination
  useEffect(() => {
    // Step 1: Filter
    let filtered = allData.filter(item => {
      const matchCategory = filter.category ? item.category.toString().includes(filter.category) : true;
      const matchAmount = filter.amount ? item.amount.toString().includes(filter.amount) : true;
      const matchDate = filter.date ? item.type.includes(filter.date) : true;
      return matchCategory && matchAmount && matchDate;
    });

    // Step 2: Update last_page based on filtered result
    const totalPages = Math.ceil(filtered.length / pagination.per_page);

    // Step 3: Slice data for current page
    const start = (pagination.current_page - 1) * pagination.per_page;
    const end = start + pagination.per_page;
    const sliced = filtered.slice(start, end);
    
    setCurrentData(sliced);
    setPagination(prev => ({ ...prev, last_page: totalPages }));
  }, [filter, pagination.current_page, pagination.per_page]);

  // Handle per-page change
  const perPageChange = (newPerPage) => {
    setPagination(prev => ({
      ...prev,
      per_page: parseInt(newPerPage),
      current_page : 1
    }));
  };

  // Handle page change
  const pageChange = (newPage) => {
    console.log("newPage ===>", newPage);
    setPagination(prev => ({
      ...prev,
      current_page: newPage
    }));
  };
  return (
    <div>
      <input placeholder="Category" onChange={e => setFilter({ ...filter, category: e.target.value })} />
      <input placeholder="Amount" onChange={e => setFilter({ ...filter, amount: e.target.value })} />
      <input type="date" onChange={e => setFilter({ ...filter, date: e.target.value })} />

      <table className='table' border="1">
        <thead>
          <tr>
            <th>Date</th><th>Category</th><th>Type</th><th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {currentData.map((t,i) => (
            <tr key={i}>
              <td>{t.date}</td>
              <td>{t.category}</td>
              <td>{t.type}</td>
              <td>{t.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <WLPagination
          pageData={pagination}
          perPageChange={perPageChange}
          pageChange={pageChange}
      />
    </div>
  );
};

export default TransactionTable;