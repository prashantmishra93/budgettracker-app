// TransactionForm.js
import React, { useEffect, useState } from 'react';
import { Alert, Button, Card, Form } from 'react-bootstrap';
import { makeApiRequest, respStatus, showMessage, url } from '../helper/api_helper';

const TransactionForm = () => {
  const initForm = { type: '', category: '', amount: '', date: '', note: '' }
  const [form, setForm] = useState(initForm);
  const [message, setMessage] = useState("")
  const [categories, setCategories] = useState([]);
  const [filterCategories, setFilterCategories] = useState([]);
  
  useEffect(()=>{
      fetchCategory()
  }, []);
  
  const fetchCategory = async () => {
    const response = await makeApiRequest(url.USER_API.categories, {}, url.API_EXTENSION)
    if(response.status !== respStatus['SUCCESS']) {
        showMessage(response)
        return
    }
    setCategories(response?.data);
  }

  useEffect(() => {
    const result2 = categories.filter((item) => item.type === form.type).map(({ id, name }) => ({ id, name }));
    setFilterCategories(result2)
  }, [categories, form.type])

  const handleSubmit = async (e) => {
    setMessage('')
    let payLoad = {...form}
    e.preventDefault();
    if (!form.type.trim()) {
      setMessage('Type must required.');
      return;
    }
    if (!form.category.trim()) {
      setMessage('Category must required.');
      return;
    }
    if (!form.amount.trim()) {
      setMessage('Amount must required.');
      return;
    }
    if (!form.date.trim()) {
      setMessage('Date must required.');
      return;
    }
    if(form.category) {
      payLoad['category_id'] = form.category
      delete payLoad['category'];
    }
    const response = await makeApiRequest(url.USER_API.entries, payLoad, url.API_EXTENSION)
    if(response) {
      if(response.status !== respStatus['SUCCESS']) {
        showMessage(response)
        return
      }
      setForm(initForm);
    }
  };

  return (
    <Card className="shadow p-4 rounded-3">
      <Card.Title className="mb-3 text-center fs-4 fw-bold">
        Add New Transaction
      </Card.Title>
      {message && (
        <Alert variant={message.includes('successfully') ? 'success' : 'danger'}>
          {message}
        </Alert>
      )}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Type</Form.Label>
          <Form.Select
              value={form.type}
              onChange={e => setForm({ ...form, type: e.target.value })}
          >
              <option value="">Select type</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
          </Form.Select>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Category</Form.Label>
          <Form.Select
              value={form.category}
              onChange={e => setForm({ ...form, category: e.target.value })}
          >
              <option value="" disabled selected>Select category</option>
              {filterCategories && (
                filterCategories.map((item, ind) => (
                  <option key={ind} value={item.id}>{item.name}</option>
                ))
              )}
          </Form.Select>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Amount</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Amount"
            value={form.amount}
            onChange={e => setForm({ ...form, amount: e.target.value })}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Amount</Form.Label>
          <Form.Control
            type="date"
            placeholder="Enter Amount"
            value={form.date}
            onChange={e => setForm({ ...form, date: e.target.value })}
          />
        </Form.Group>
        <Form.Group className="mb-3">
        <Form.Label>Note</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}  // controls height (number of text lines)
            placeholder="Enter your note"
            value={form.note}
            onChange={e => setForm({ ...form, note: e.target.value })}
          />
        </Form.Group>
        <div className="d-flex justify-content-center">
          <Button variant="primary" type="submit">
            Add Transaction
          </Button>
        </div>
      </Form>
    </Card>
  );
};

export default React.memo(TransactionForm);
