import React, { useState, useEffect } from "react";
import { Card, Form, Button, Alert, Spinner } from "react-bootstrap";
import { makeApiRequest, respStatus, showMessage, url } from "../helper/api_helper";

const EditCategory = ({id, onClose, onRefresh}) => {
    const [message, setMessage] = useState('')
    const [form, setForm] = useState({id: id, category:'', type:''})
    const [categoryData, setCategoryData] = useState({})
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        fetchCategory()
    }, [])

    const fetchCategory = async () => {
        try {
            setLoading(true)
            const response = await makeApiRequest(url.USER_API.getByIdCategory, {id:id}, url.API_EXTENSION)
            if(response) {
                if(response.status !== respStatus['SUCCESS']) {
                    showMessage(response);
                    return
                }
                setCategoryData(response.data)
                if(response?.data) {
                    let changeF = {...form}
                    changeF['category'] = response?.data.name ?? ''
                    changeF['type'] = response?.data.type ?? ''
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
        let catVal = form.category.trim();

        if(!catVal) {
            setMessage('Please category define properly')
            validate = true
        }
        if(form.category === categoryData.name && form.type === categoryData.type) {
            setMessage("No change Found")
            validate = true
        }

        if(validate) {
            setTimeout(() => setMessage(''), 2000)
            return
        }

        let payLoad = {}
        payLoad['id'] = form.id
        payLoad['name'] = form.category
        payLoad['type'] = form.type

        const response = await makeApiRequest(url.USER_API.updateCategory, payLoad, url.API_EXTENSION)
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

    const handleChangeForm = (name, value) => {
        setForm({
            ...form,
            [name]: value
        })
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
                categoryData && (
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Category Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter category name"
                                value={form.category}
                                onChange={(e) => handleChangeForm('category', e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Type</Form.Label>
                            <Form.Select
                                value={form.type}
                                onChange={(e) => handleChangeForm('type', e.target.value)}
                            >
                                <option value="">Select type</option>
                                <option value="income" selected={categoryData.type === "income" ? true : false}>Income</option>
                                <option value="expense" selected={categoryData.type === "expense" ? true : false}>Expense</option>
                            </Form.Select>
                        </Form.Group>
                        <div className="d-flex justify-content-center">
                        <Button variant="primary" type="submit">
                            Add Category
                        </Button>
                        </div>
                    </Form>
                )
            )}
        </Card>
    );
};

export default EditCategory;