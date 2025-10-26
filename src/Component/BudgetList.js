import React, { useEffect, useState } from 'react';
import { Row, Spinner, Table } from 'react-bootstrap';
import BudgetForm from '../SubComponent/BudgetForm';
import { makeApiRequest, respStatus, showMessage, url } from '../helper/api_helper';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import WLPagination from '../Common/WLPagination';

const BudgetList = () => {
  const initForm = {per_page:10, page:1}
  const [formData, setFormData] = useState(initForm)
  const [budget, setBudget] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategory()
  }, [formData])

  const fetchCategory = async () => {
    try {
      setLoading(true);
      const response = await makeApiRequest(url.USER_API.getBudgets, formData, url.API_EXTENSION)
      if(response.status !== respStatus['SUCCESS']) {
          showMessage(response)
          return
      }
      setBudget(response?.data || { entries: [] });
    } catch (error) {
      showMessage({ message: "Something went wrong!" });
    } finally {
      setLoading(false);
    }
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

  
  // Handle per-page change
  const perPageChange = (newPerPage) => {
    setFormData(prev => ({
      ...prev,
      per_page: parseInt(newPerPage),
    }));
  };

  // Handle page change
  const pageChange = (newPage) => {
    setFormData(prev => ({
      ...prev,
      page: newPage
    }));
  };

  return (
    <>
      <BudgetForm onAddBudget={handleAddBudget} />
      <Row>
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
          <tbody className="text-center">
            {loading ? (
              <td colSpan="6" className="py-4">
                <Spinner animation="border" variant="primary" />
              </td>
            ) : (
              (budget && budget?.entries && budget?.entries.length > 0) ? (
                budget?.entries.map((cat, ind) => (
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
              )
            )}
          </tbody>
        </Table>
      </Row>
      {!loading && budget && (
        <Row className="filter-pagination">
          <WLPagination
            pageData={budget}
            perPageChange={perPageChange}
            pageChange={pageChange}
          />
        </Row>
      )}
    </>
  );
};

export default React.memo(BudgetList);
