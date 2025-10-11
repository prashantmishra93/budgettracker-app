import React, { useState } from 'react';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import { makeApiRequest, url, respStatus, showMessage } from '../helper/api_helper';

const BudgetForm = ({ onAddBudget }) => {
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!year.trim()) {
      setMessage('Budget name is required.');
      return;
    }
    const newCategory = {
      year: year.trim(),
      month: month.trim(),
      amount: amount.trim(),
    };

    const response = await makeApiRequest(url.USER_API.addBudget, newCategory, url.API_EXTENSION)
    console.log("response ====>", response);
    if(response) {
        if(response.status !== respStatus['SUCCESS']) {
            showMessage(response)
            return
        }
        if (onAddBudget) onAddBudget(response?.data);

        setMessage('✅ Budget added successfully!');
        setYear('')
        setMonth('')
        setAmount('')

        setTimeout(() => setMessage(''), 2000);
    }
  };

  return (
    <Card className="shadow p-4 rounded-3">
      <Card.Title className="mb-3 text-center fs-4 fw-bold">
        Add New Category
      </Card.Title>
      {message && (
        <Alert variant={message.includes('successfully') ? 'success' : 'danger'}>
          {message}
        </Alert>
      )}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Year</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Year"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Month</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Amount</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </Form.Group>
        <div className="d-flex justify-content-center">
          <Button variant="primary" type="submit">
            Add Budget
          </Button>
        </div>
      </Form>
    </Card>
  );
};

export default React.memo(BudgetForm);