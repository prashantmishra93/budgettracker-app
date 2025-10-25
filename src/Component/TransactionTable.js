// TransactionTable.js
import React, { useEffect, useState } from 'react';
import WLPagination from '../Common/WLPagination';
import { Col, Form, Row, Table, Spinner, Button } from 'react-bootstrap';
import { makeApiRequest, respStatus, url, showMessage } from '../helper/api_helper';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";

const TransactionTable = () => {
  const [filter, setFilter] = useState({ category: '', amount: '', date: '' });
  const initForm = {category: '', amount: '', date: '', per_page:10, page:1}
  const [formData, setFormData] = useState(initForm)
  const [transactions, setTransactions] = useState(null);
  const [loading, setLoading] = useState(false);
  
  useEffect(()=>{
      fetchCategory()
  }, [formData]);
  
  const fetchCategory = async () => {
    try {
      setLoading(true);
      const response = await makeApiRequest(url.USER_API.getEntries, formData, url.API_EXTENSION);
      if (response.status !== respStatus['SUCCESS']) {
        showMessage(response);
        return;
      }
      setTransactions(response?.data || { entries: [] });
    } catch (error) {
      showMessage({ message: "Something went wrong!" });
    } finally {
      setLoading(false);
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

  const handleFilter = () => {
    let editForm = {...formData}
    editForm['category'] = filter?.category;
    editForm['date'] = filter?.date
    editForm['amount'] = filter?.amount
    setFormData(editForm);
  }
  
  const handleDeleteTransation = async (id) => {
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
    const response = await makeApiRequest(url.USER_API.deleteTransaction, {id:id}, url.API_EXTENSION)
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
    <>
      <Row className="filter-row">
        <Form className="d-flex flex-wrap gap-2 trans-form">
          <Col>
            <Form.Control
              type="text"
              placeholder="Category"
              className="me-2"
              onChange={e => setFilter({ ...filter, category: e.target.value })}
            />
          </Col>
          <Col>
            <Form.Control
              type="number"
              placeholder="Amount"
              className="me-2"
              onChange={e => setFilter({ ...filter, amount: e.target.value })}
            />
          </Col>
          <Col>
            <Form.Control
              type="date"
              onChange={e => setFilter({ ...filter, date: e.target.value })}
            />
          </Col>
          <Col>
            <Button
              className="btn btn-primary"
              onClick={() => handleFilter()}
            >
              {"Search"}
            </Button>
          </Col>
        </Form>
      </Row>
      <Row>
        <Table striped bordered hover responsive className="mt-4">
          <thead>
            <tr className="text-center">
              <th>No</th>
              <th>Date</th>
              <th>Category</th>
              <th>Type</th>
              <th>Amount</th>
              <th className="trans-note">Note</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {loading ? (
              <td colSpan="6" className="py-4">
                <Spinner animation="border" variant="primary" />
              </td>
            ) : (
              (transactions && transactions?.entries && transactions?.entries?.length > 0) ? (
                transactions?.entries.map((t,i) => (
                  <tr key={i}>
                    <td>{i+1}</td>
                    <td>{t.date}</td>
                    <td>{t.category_name}</td>
                    <td>{t.type}</td>
                    <td>{t.amount}</td>
                    <td className="trans-note">
                      {t.note}
                    </td>
                    <td>
                      <FontAwesomeIcon onClick={() => handleDeleteTransation(t?.id)} icon={faTrash} />
                    </td>
                  </tr>
              ))) : (
                <tr className="text-center">
                  <td colSpan="7">No Data Found</td>
                </tr>
              )
            )}
          </tbody>
        </Table>
      </Row>
      {!loading && transactions && (
        <Row className="filter-pagination">
          <WLPagination
            pageData={transactions}
            perPageChange={perPageChange}
            pageChange={pageChange}
          />
        </Row>
      )}
    </>
  );
};

export default TransactionTable;