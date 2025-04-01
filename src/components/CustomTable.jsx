import React, { useState } from "react";
import { Table, Button, Modal, Input } from "antd";
import {
  SearchOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

export default function CustomTable({
  data,
  columns,
  onEdit,
  onView,
  onDelete,
  loading,
  pagination,
  onTableChange,
  search,
  onSearchChange,
}) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const handleEdit = (record) => onEdit && onEdit(record);
  const handleView = (record) => onView && onView(record);
  const handleDeleteClick = (record) => {
    setSelectedRecord(record);
    setIsModalVisible(true);
  };
  const handleConfirmDelete = () => {
    if (onDelete && selectedRecord) onDelete(selectedRecord);
    setIsModalVisible(false);
    setSelectedRecord(null);
  };
  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedRecord(null);
  };

  const columnsWithActions = [
    {
      title: "SNo",
      dataIndex: "srNo",
      key: "srNo",
      render: (text, record, index) => index + 1,
    },
    ...columns,
    {
      title: "Actions",
      dataIndex: "actions",
      render: (_, record) => (
        <>
          {onView && (
            <Button
              onClick={() => handleView(record)}
              size="small"
              style={{ marginRight: 3 }}
              icon={<EyeOutlined />}
            />
          )}
          {onEdit && (
            <Button
              onClick={() => handleEdit(record)}
              size="small"
              style={{ marginRight: 3 }}
              icon={<EditOutlined />}
            />
          )}
          {onDelete && (
            <Button
              onClick={() => handleDeleteClick(record)}
              size="small"
              icon={<DeleteOutlined />}
            />
          )}
        </>
      ),
    },
  ];

  return (
    <div className="card11">
      <div className="card-body11">
        <div className="row">
          <div className="col dataTableSearch text-end mb-2">
            <Input
              placeholder="Search..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              style={{ width: 200 }}
              prefix={<SearchOutlined />}
            />
          </div>
        </div>

        <div className="table-responsive dataTableUI">
          <Table
            columns={columnsWithActions}
            dataSource={data}
            pagination={pagination}
            loading={loading}
            onChange={onTableChange}
            rowKey="id"
          />
        </div>

        <Modal
          className="w-25"
          title={<div style={{ textAlign: "center" }}>Confirm Delete</div>}
          open={isModalVisible}
          onOk={handleConfirmDelete}
          onCancel={handleCancel}
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
              onClick={handleCancel}
              className="btn btn-sm btn-secondary ms-2"
            >
              Cancel
            </button>,
          ]}
        >
          <p className="text-center">
            Are you sure you want to delete this item?
          </p>
        </Modal>
      </div>
    </div>
  );
}

// import React, { useState } from "react";
// import { Table, Button, Input } from "antd";
// import {
//   SearchOutlined,
//   EyeOutlined,
//   EditOutlined,
//   DeleteOutlined,
// } from "@ant-design/icons";
// import DeleteConfirmationModal from "../Admin/settingsPages/DeleteConfirmationModal";

// export default function CustomTable({
//   data,
//   columns,
//   onEdit,
//   onView,
//   onDelete,
//   loading,
//   pagination,
//   onTableChange,
//   search,
//   onSearchChange,
// }) {
//   const [showDeleteModal, setShowDeleteModal] = useState(false); // Track modal visibility
//   const [selectedRecord, setSelectedRecord] = useState(null); // Track the selected record
//   const [deleteType, setDeleteType] = useState(""); // Track item type (e.g., "category")

//   const handleEdit = (record) => onEdit && onEdit(record);
//   const handleView = (record) => onView && onView(record);

//   const handleDeleteClick = (record) => {
//     setSelectedRecord(record);
//     setDeleteType("item"); // Set the item type dynamically (could be "category", "product", etc.)
//     setShowDeleteModal(true); // Show the modal
//   };

//   const handleDeleteCategory = (id) => {
//     if (onDelete) {
//       onDelete(id); // Perform delete action
//     }
//     setShowDeleteModal(false); // Close modal after delete
//     setSelectedRecord(null); // Clear selected record
//   };

//   const columnsWithActions = [
//     {
//       title: "SNo",
//       dataIndex: "srNo",
//       key: "srNo",
//       render: (text, record, index) => index + 1,
//     },
//     ...columns,
//     {
//       title: "Actions",
//       dataIndex: "actions",
//       render: (_, record) => (
//         <>
//           {onView && (
//             <Button
//               onClick={() => handleView(record)}
//               size="small"
//               style={{ marginRight: 3 }}
//               icon={<EyeOutlined />}
//             />
//           )}
//           {onEdit && (
//             <Button
//               onClick={() => handleEdit(record)}
//               size="small"
//               style={{ marginRight: 3 }}
//               icon={<EditOutlined />}
//             />
//           )}
//           {onDelete && (
//             <Button
//               onClick={() => handleDeleteClick(record)}
//               size="small"
//               icon={<DeleteOutlined />}
//             />
//           )}
//         </>
//       ),
//     },
//   ];

//   return (
//     <div className="card11">
//       <div className="card-body11">
//         <div className="row">
//           <div className="col dataTableSearch text-end mb-2">
//             <Input
//               placeholder="Search..."
//               value={search}
//               onChange={(e) => onSearchChange(e.target.value)}
//               style={{ width: 200 }}
//               prefix={<SearchOutlined />}
//             />
//           </div>
//         </div>

//         <div className="table-responsive dataTableUI">
//           <Table
//             columns={columnsWithActions}
//             dataSource={data}
//             pagination={pagination}
//             loading={loading}
//             onChange={onTableChange}
//             rowKey="id"
//           />
//         </div>

//         {/* Use the DeleteConfirmationModal */}
//         <DeleteConfirmationModal
//           show={showDeleteModal}
//           handleClose={() => setShowDeleteModal(false)}
//           handleDelete={handleDeleteCategory}
//           item={selectedRecord}
//           itemType={deleteType}
//         />
//       </div>
//     </div>
//   );
// }
