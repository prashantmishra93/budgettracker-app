import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import BudgetForm from '../SubComponent/BudgetForm';
import { makeApiRequest, respStatus, showMessage, url } from '../helper/api_helper';

const BudgetList = () => {
  const [budget, setBudget] = useState([]);

  useEffect(() => {
    fetchCategory()
  }, [])

  const fetchCategory = async () => {
    const response = await makeApiRequest(url.USER_API.getBudgets, {}, url.API_EXTENSION)
    console.log("response ====>", response);
    if(response.status !== respStatus['SUCCESS']) {
        showMessage(response)
        return
    }
    setBudget(response?.data);
  }

  const handleAddBudget = (newCategory) => {
    setBudget((prev) => [...prev, newCategory]);
  };

  return (
    <div className="container mt-4">
      <BudgetForm onAddBudget={handleAddBudget} />

        <Table striped bordered hover responsive className="mt-4">
          <thead>
            <tr className="text-center">
              <th><h5>No</h5></th>
              <th><h5>Year</h5></th>
              <th><h5>Month</h5></th>
              <th><h5>Amount</h5></th>
            </tr>
          </thead>
          <tbody>
            {budget.length > 0 ? (
                budget.map((cat, ind) => (
                    <tr key={cat?.id}>
                        <td>{ind + 1}</td>
                        <td>{cat?.year}</td>
                        <td>{cat?.month || '—'}</td>
                        <td>{cat?.amount || '—'}</td>
                    </tr>
                ))
            ) : (
                <tr className="text-center">
                    <td colSpan="4">
                        <h6>No Data Found</h6>
                    </td>
                </tr>
            )}
          </tbody>
        </Table>
    </div>
  );
};

export default React.memo(BudgetList);
