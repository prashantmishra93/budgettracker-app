import React, { useState } from 'react';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import { makeApiRequest, url, respStatus, showMessage } from '../helper/api_helper';

const BudgetForm = ({ onAddBudget }) => {
  const initForm = {year:'', month:'', amount:''}
  const [form, setForm] = useState(initForm);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const yearVal = form.year.trim();
    const monthVal = form.month.trim();
    const amountVal = form.amount.trim();

    if (!/^\d{4}$/.test(yearVal)) {
      setMessage("❌ Please enter a valid 4-digit year (e.g., 2025).");
      return;
    }

    const monthNum = parseInt(monthVal, 10);
    if (!monthVal || isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
      setMessage("❌ Please enter a valid month (1–12).");
      return;
    }

    if (!/^\d+(\.\d+)?$/.test(amountVal) || parseFloat(amountVal) <= 0) {
      setMessage("❌ Please enter a valid positive amount.");
      return;
    }

    const response = await makeApiRequest(url.USER_API.addBudget, form, url.API_EXTENSION)
    if(response) {
        if(response.status !== respStatus['SUCCESS']) {
            showMessage(response)
            return
        }
        if (onAddBudget) onAddBudget(response?.data);

        setMessage('✅ Budget added successfully!');
        setForm(initForm)

        setTimeout(() => setMessage(''), 2000);
    }
  };

  const handleOnChange = (name, value) => {
    setForm({
      ...form,
      [name] : value
    })
    setMessage('')
  }

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
            value={form.year}
            onChange={(e) => handleOnChange('year', e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Month</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Month"
            value={form.month}
            onChange={(e) => handleOnChange('month', e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Amount</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Amount"
            value={form.amount}
            onChange={(e) => handleOnChange('amount', e.target.value)}
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