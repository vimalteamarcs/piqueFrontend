import React, { useEffect, useState } from "react";
import axios from "axios";
import { UPDATE_CATEGORY } from "../../constants";
import { Button, Form, Modal } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import Toastify styles

export default function CategoryModal(props) {
  const { data, done, err, show, handleClose } = props;
  const [categoryName, setCategoryName] = useState("");

  useEffect(() => {
    if (data && data.name) {
      setCategoryName(data.name);
    }
  }, [data]);

  const handleUpdateCategory = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}${UPDATE_CATEGORY}`,
        {
          id: data.id,
          name: categoryName,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // Close the modal first
      handleClose();

      // Show the success toast after closing the modal
      toast.success("Category updated successfully ✅", {
        autoClose: 3000, // Toast auto-close after 3 seconds
      });

      console.log("Response:", response.data);
    } catch (error) {
      err("Error updating category");
      console.error("Error:", error.response ? error.response.data : error.message);
    }
  };

  if (!data) return <></>;

  return (
    <>
      {/* ToastContainer for React Toastify */}
      <ToastContainer />

      {/* Modal */}
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Update Category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Category Name</Form.Label>
              <Form.Control
                type="text"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                required
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="dark" onClick={handleUpdateCategory}>
            Save Changes
          </Button>
          <Button variant="danger" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}





