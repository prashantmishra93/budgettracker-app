import React, { useEffect, useState } from 'react';
import { Row, Spinner, Table } from 'react-bootstrap';
import CategoryForm from '../SubComponent/CategoryForm';
import { makeApiRequest, respStatus, showMessage, url } from '../helper/api_helper';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencil } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import WLPagination from '../Common/WLPagination';
import Popup from '../Common/Popup';

const CategoryList = () => {
  const initForm = {per_page:10, page:1}
  const [formData, setFormData] = useState(initForm)
  const [categories, setCategories] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showCategoryPopup, setShowCategoryPopup] = useState(false);
  const [categoryId, setCategoryId] = useState(null)

  useEffect(() => {
    fetchCategory()
  }, [formData])

  const fetchCategory = async () => {
    try {
      setLoading(true);
      const response = await makeApiRequest(url.USER_API.categories, formData, url.API_EXTENSION)
      if(response.status !== respStatus['SUCCESS']) {
          showMessage(response)
          return
      }
      setCategories(response?.data || { entries: [] });
    } catch (error) {
      showMessage({ message: "Something went wrong!" });
    } finally {
      setLoading(false);
    }
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

  const handleEditCat = (id) => {
    setCategoryId(id);
    setShowCategoryPopup(true);
  }

  return (
    <>
      <CategoryForm onAddCategory={handleAddCategory} />
      <Row>
        <Table striped bordered hover responsive className="mt-4">
          <thead>
            <tr className="text-center">
              <th><h5>No</h5></th>
              <th><h5>Category</h5></th>
              <th><h5>Type</h5></th>
              <th><h5>Action</h5></th>
            </tr>
          </thead>
          <tbody className='text-center'>
            {loading ? (
              <td colSpan="6" className="py-4">
                <Spinner animation="border" variant="primary" />
              </td>
            ) : (
              (categories && categories?.entries && categories?.entries.length > 0) ? (
                  categories?.entries.map((cat, ind) => (
                      <tr key={cat?.id}>
                          <td>{ind + 1}</td>
                          <td>{cat?.name}</td>
                          <td>{cat?.type || '—'}</td>
                          <td>
                            <FontAwesomeIcon onClick={() => handleDeleteCat(cat?.id)} icon={faTrash} />
                            &nbsp;
                            <FontAwesomeIcon onClick={() => handleEditCat(cat?.id)} icon={faPencil} />
                          </td>
                      </tr>
                  ))
              ) : (
                  <tr className="text-center">
                      <td colSpan="4">
                          <h6>No Data Found</h6>
                      </td>
                  </tr>
              )
            )}
          </tbody>
        </Table>
      </Row>
      {!loading && categories && (
        <Row className="filter-pagination">
          <WLPagination
            pageData={categories}
            perPageChange={perPageChange}
            pageChange={pageChange}
          />
        </Row>
      )}
      {(showCategoryPopup && categoryId) && (
        <Popup 
          onClose={() => setShowCategoryPopup(false)} 
          popupType="categoryPopup"
          title="Edit Category"
          query={categoryId} 
          onRefresh={fetchCategory} />
      )}
    </>
  );
};

export default React.memo(CategoryList);
