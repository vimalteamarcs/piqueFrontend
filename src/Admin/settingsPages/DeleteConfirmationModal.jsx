// import React from "react";
// import { Modal, Button } from "react-bootstrap";

// export default function DeleteConfirmationModal({ show, handleClose, handleDelete, item, itemType }) {
//   return (
//     <Modal show={show} onHide={handleClose} centered>
//       <Modal.Header closeButton>
//         <Modal.Title>Confirm Deletion</Modal.Title>
//       </Modal.Header>
//       <Modal.Body>
//         <p>
//           Are you sure you want to delete this <strong>{itemType}</strong>: <strong>{item?.name}</strong>?
//         </p>
//       </Modal.Body>
//       <Modal.Footer>
//         <Button variant="secondary" onClick={handleClose}>
//           Cancel
//         </Button>
//         <Button variant="danger" onClick={() => handleDelete(item.id)}>
//           Delete
//         </Button>
//       </Modal.Footer>
//     </Modal>
//   );
// }

import React from "react";
import { Modal } from "antd"; // Import Modal from antd instead of react-bootstrap

export default function DeleteConfirmationModal({
  show,
  handleClose,
  handleDelete,
  item,
  itemType,
}) {
  const handleConfirmDelete = () => {
    handleDelete(item.id);
    handleClose();
  };

  return (
    <Modal
      className="w-25"
      title={<div style={{ textAlign: "center" }}>Confirm Delete</div>}
      open={show}
      onOk={handleConfirmDelete}
      onCancel={handleClose}
      okText="Yes, Delete"
      cancelText="Cancel"
      okType="danger"
      centered
      footer={[
        <button
          key="delete"
          onClick={handleConfirmDelete}
          className="btn btn-sm btn-danger"
        >
          Yes, Delete
        </button>,
        <button
          key="cancel"
          onClick={handleClose}
          className="btn btn-sm btn-secondary ms-2"
        >
          Cancel
        </button>,
      ]}
    >
      <p className="text-center">
        Are you sure you want to delete this {itemType}:{" "}
        <strong>{item?.name}</strong>?
      </p>
    </Modal>
  );
}
