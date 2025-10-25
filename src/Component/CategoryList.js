import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import CategoryForm from '../SubComponent/CategoryForm';
import { makeApiRequest, respStatus, showMessage, url } from '../helper/api_helper';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";

const CategoryList = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategory()
  }, [])

  const fetchCategory = async () => {
    const response = await makeApiRequest(url.USER_API.categories, {}, url.API_EXTENSION)
    if(response.status !== respStatus['SUCCESS']) {
        showMessage(response)
        return
    }
    setCategories(response?.data);
  }

  const handleAddCategory = (newCategory) => {
    setCategories((prev) => [...prev, newCategory]);
  };

  const handleDeleteCat = async (id) => {
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
    const response = await makeApiRequest(url.USER_API.deleteCategory, {id:id}, url.API_EXTENSION)
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
      <CategoryForm onAddCategory={handleAddCategory} />

        <Table striped bordered hover responsive className="mt-4">
          <thead>
            <tr className="text-center">
              <th><h5>No</h5></th>
              <th><h5>Category</h5></th>
              <th><h5>Type</h5></th>
              <th><h5>Action</h5></th>
            </tr>
          </thead>
          <tbody>
            {categories.length > 0 ? (
                categories.map((cat, ind) => (
                    <tr key={cat?.id}>
                        <td>{ind + 1}</td>
                        <td>{cat?.name}</td>
                        <td>{cat?.type || '—'}</td>
                        <td>
                          <FontAwesomeIcon onClick={() => handleDeleteCat(cat?.id)} icon={faTrash} />
                        </td>
                    </tr>
                ))
            ) : (
                <tr className="text-center">
                    <td colSpan="4">
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
