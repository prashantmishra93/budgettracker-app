import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import BudgetForm from '../SubComponent/BudgetForm';
import { makeApiRequest, respStatus, showMessage, url } from '../helper/api_helper';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";

const BudgetList = () => {
  const [budget, setBudget] = useState([]);

  useEffect(() => {
    fetchCategory()
  }, [])

  const fetchCategory = async () => {
    const response = await makeApiRequest(url.USER_API.getBudgets, {}, url.API_EXTENSION)
    if(response.status !== respStatus['SUCCESS']) {
        showMessage(response)
        return
    }
    setBudget(response?.data);
  }

  const handleAddBudget = (newCategory) => {
    setBudget((prev) => [...prev, newCategory]);
  };
  
  const handleDeleteBudget = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, delete it!",
    });

    // If user cancels, stop here
    if (!result.isConfirmed) return;
    const response = await makeApiRequest(url.USER_API.deleteBudget, {id:id}, url.API_EXTENSION)
    if(response) {
      if(response.status !== respStatus['SUCCESS']) {
          showMessage(response)
          return
      }
      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "Budget deleted successfully.",
        timer: 1500,
        showConfirmButton: false,
      });

      if (fetchCategory) fetchCategory();
    }
  }

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
              <th><h5>Action</h5></th>
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
                        <td>
                          <FontAwesomeIcon onClick={() => handleDeleteBudget(cat?.id)} icon={faTrash} />
                        </td>
                    </tr>
                ))
            ) : (
                <tr className="text-center">
                    <td colSpan="5">
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
