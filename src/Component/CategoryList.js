import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import CategoryForm from '../SubComponent/CategoryForm';
import { makeApiRequest, respStatus, showMessage, url } from '../helper/api_helper';

const CategoryList = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategory()
  }, [])

  const fetchCategory = async () => {
    const response = await makeApiRequest(url.USER_API.categories, {}, url.API_EXTENSION)
    console.log("response ====>", response);
    if(response.status !== respStatus['SUCCESS']) {
        showMessage(response)
        return
    }
    setCategories(response?.data);
  }

  const handleAddCategory = (newCategory) => {
    setCategories((prev) => [...prev, newCategory]);
  };

  return (
    <div className="container mt-4">
      <CategoryForm onAddCategory={handleAddCategory} />

        <Table striped bordered hover responsive className="mt-4">
          <thead>
            <tr className="text-center">
              <th><h5>No</h5></th>
              <th><h5>Category</h5></th>
              <th><h5>Type</h5></th>
            </tr>
          </thead>
          <tbody>
            {categories.length > 0 ? (
                categories.map((cat, ind) => (
                    <tr key={cat?.id}>
                        <td>{ind + 1}</td>
                        <td>{cat?.name}</td>
                        <td>{cat?.type || '—'}</td>
                    </tr>
                ))
            ) : (
                <tr className="text-center">
                    <td colSpan="3">
                        <h6>No Data Found</h6>
                    </td>
                </tr>
            )}
          </tbody>
        </Table>
    </div>
  );
};

export default React.memo(CategoryList);
