import React, { useState } from 'react';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import { makeApiRequest, url, respStatus, showMessage } from '../helper/api_helper';

const CategoryForm = ({ onAddCategory }) => {
  const [categoryName, setCategoryName] = useState('');
  const [type, setType] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!categoryName.trim()) {
      setMessage('Category name is required.');
      return;
    }
    const newCategory = {
      name: categoryName.trim(),
      type: type.trim(),
    };

    const response = await makeApiRequest(url.USER_API.addCategories, newCategory, url.API_EXTENSION)
    console.log("response ====>", response);
    if(response) {
        if(response.status !== respStatus['SUCCESS']) {
            showMessage(response)
            return
        }
        if (onAddCategory) onAddCategory(response?.data);

        setMessage('✅ Category added successfully!');
        setCategoryName('');
        setType('');

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
          <Form.Label>Category Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter category name"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3">
            <Form.Label>Type</Form.Label>
            <Form.Select
                value={type}
                onChange={(e) => setType(e.target.value)}
            >
                <option value="">Select type</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
            </Form.Select>
        </Form.Group>
        <div className="d-flex justify-content-center">
          <Button variant="primary" type="submit">
            Add Category
          </Button>
        </div>
      </Form>
    </Card>
  );
};

export default React.memo(CategoryForm);
