import React, { useState, useEffect } from "react";
import { Card, Form, Button, Alert, Spinner } from "react-bootstrap";
import { makeApiRequest, respStatus, showMessage, url } from "../helper/api_helper";

const EditTransaction = ({id, onClose, onRefresh}) => {
    const initForm = {id: id, date:'', category_name:'', type:'', amount:'', category_id:'', note:''}
    const [message, setMessage] = useState('')
    const [form, setForm] = useState(initForm)
    const [transactionData, setTransactionData] = useState({})
    const [loading, setLoading] = useState(false)
    const [categories, setCategories] = useState([]);
    const [filterCategories, setFilterCategories] = useState([]);

    useEffect(() => {
        fetchCategory()
        fetchTransaction()
    }, [])

    const fetchCategory = () => {
        makeApiRequest(url.USER_API.categories, {}, url.API_EXTENSION).then(response => {
            if(response.status !== respStatus['SUCCESS']) {
                showMessage(response)
                return
            }
            setCategories(response?.data?.entries || []);
        })
        .catch(err => {
            showMessage(err)
        })
    }

    useEffect(() => {
        const filterData = categories.filter(cat => cat.type === form.type);
        setFilterCategories(filterData)
    }, [categories, form?.type])

    const fetchTransaction = async () => {
        try {
            setLoading(true)
            const response = await makeApiRequest(url.USER_API.getTransactionById, {id:id}, url.API_EXTENSION)
            if(response) {
                if(response.status !== respStatus['SUCCESS']) {
                    showMessage(response);
                    return
                }
                setTransactionData(response.data)
                if(response?.data) {
                    let changeF = {...form}
                    changeF['note'] = response?.data?.note ?? ''
                    changeF['category_name'] = response?.data?.category_name ?? ''
                    changeF['type'] = response?.data?.type ?? ''
                    changeF['amount'] = response?.data?.amount ?? ''
                    changeF['category_id'] = response?.data?.category?.id ?? ''
                    changeF['date'] = response?.data?.date ?? ''
                    setForm(changeF);
                }
            }
        } catch (error) {
            showMessage({ message: "Something went wrong!" });
        } finally {
            setLoading(false);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        let validate = false;
        let typeVal = form.type.trim();
        let catVal = form.category_name.trim();
        let amountVal = form.amount.trim();

        if(!catVal) {
            setMessage('Please Category define properly')
            validate = true
        }

        if(!typeVal) {
            setMessage('Please Type define properly')
            validate = true
        }

        if (!/^\d+(\.\d+)?$/.test(amountVal) || parseFloat(amountVal) <= 0) {
            setMessage("❌ Please enter a valid positive amount.");
            return;
        }

        if(
            form.category_name === transactionData.category_name && form.type === transactionData.type &&
            form.amount === transactionData.amount && form.date === transactionData.date &&
            form.note === transactionData.note
        ) {
            setMessage("No change Found")
            validate = true
        }

        if(validate) {
            setTimeout(() => setMessage(''), 2000)
            return
        }

        let payLoad = {}
        payLoad['id'] = form.id
        payLoad['category_id'] = form.category_id
        payLoad['type'] = form.type
        payLoad['note'] = form.note
        payLoad['date'] = form.date

        const response = await makeApiRequest(url.USER_API.updateTransaction, payLoad, url.API_EXTENSION)
        if(response) {
            if(response.status !== respStatus['SUCCESS']) {
                showMessage(response);
                return
            }
            setMessage('Category Update Successfully');

            setTimeout(() => {
                setMessage('')
                onClose()
                onRefresh()
            }, 2000)
        }
    }

    const handleChangeForm = (name, value, extra=null) => {
        const change = {...form}
        change[name] = value
        if(extra !== null && extra !== undefined) {
            change["category_name"] = extra
        }
        setForm(change);
    }

    return (
        <Card className="shado p-2 rounded-3">
            <Card.Title className="mb-3 text-center fs-4 fw-bold">
               Update Category
            </Card.Title>
            {message && (
                <Alert variant={message.includes('successfully') ? 'success' : 'danger'}>
                    {message}
                </Alert>
            )}
            {loading ? (
                <div className="py-4 text-center">
                    <Spinner animation="border" variant="primary" />
                </div>
            ) : (
                transactionData && (
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Type</Form.Label>
                            <Form.Select
                                value={form.type}
                                onChange={(e) => handleChangeForm('type', e.target.value)}
                            >
                                <option value="">Select type</option>
                                <option value="income" selected={transactionData.type === "income" ? true : false}>Income</option>
                                <option value="expense" selected={transactionData.type === "expense" ? true : false}>Expense</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Category Name</Form.Label>
                            <Form.Select
                                value={form.category_id}
                                onChange={(e) => handleChangeForm('category_id', e.target.value, e.target.name)}
                            >
                                <option value="" disabled>Select type</option>
                                {filterCategories && (
                                    filterCategories.map((item) => (
                                        <option value={item?.id} name={item?.name} selected={transactionData.category_name === item?.name ? true : false}>{item?.name}</option>
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
                                onChange={e => handleChangeForm("amount", e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Date</Form.Label>
                            <Form.Control
                                type="date"
                                placeholder="Enter Date"
                                value={form.date}
                                onChange={e => handleChangeForm("date", e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                        <Form.Label>Note</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}  // controls height (number of text lines)
                                placeholder="Enter your note"
                                value={form.note}
                                onChange={e => handleChangeForm("note", e.target.value)}
                            />
                        </Form.Group>
                        <div className="d-flex justify-content-center">
                        <Button variant="primary" type="submit">
                            Update
                        </Button>
                        </div>
                    </Form>
                )
            )}
        </Card>
    );
};

export default EditTransaction;