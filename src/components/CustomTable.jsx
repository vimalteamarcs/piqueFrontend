import React, { useState } from "react";
import { Table, Button, Input } from "antd";
import {
  SearchOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import DeleteConfirmationModal from "../Admin/settingsPages/DeleteConfirmationModal";

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
  filterComponent,
}) {
  const [showDeleteModal, setShowDeleteModal] = useState(false); // Track modal visibility
  const [selectedRecord, setSelectedRecord] = useState(null); // Track the selected record
  const [deleteType, setDeleteType] = useState(""); // Track item type (e.g., "category")

  const handleEdit = (record) => onEdit && onEdit(record);
  const handleView = (record) => onView && onView(record);

  const handleDeleteClick = (record) => {
    console.log(record);
    setSelectedRecord(record);
    setDeleteType();
    setShowDeleteModal(true);
  };

  const handleDeleteCategory = (id) => {
    if (onDelete) {
      onDelete(id); // Perform delete action
    }
    setShowDeleteModal(false); // Close modal after delete
    setSelectedRecord(null); // Clear selected record
  };

  const actionColumn =
    onView || onEdit || onDelete
      ? {
        title: "Action",
        dataIndex: "actions",
        render: (_, record) => (
          <div className="btn-group" role="group">
            {onView && (
              <Button
                className="btn btn-outline-primary"
                onClick={() => handleView(record)}
                size="small"
                icon={<EyeOutlined />}
              />
            )}
            {onEdit && (
              <Button
                className="btn btn-outline-primary"
                onClick={() => handleEdit(record)}
                size="small"
                icon={<EditOutlined />}
              />
            )}
            {onDelete && (
              <Button
                className="btn btn-outline-primary"
                onClick={() => handleDeleteClick(record)}
                size="small"
                icon={<DeleteOutlined />}
              />
            )}
          </div>
        ),
      }
      : null;

  const columnsWithActions = [
    {
      title: "SNo",
      dataIndex: "srNo",
      key: "srNo",
      render: (text, record, index) => {
        const { current, pageSize } = pagination; // Get current page and page size
        return (current - 1) * pageSize + index + 1;
      },
    },
    ...columns,
    actionColumn, // Only adds if actionColumn exists
  ].filter(Boolean); // Removes null values

  return (
    <div className="card11">
      <div className="card-body11">
      <div className="row justify-content-between align-items-center">
          <div className="col-auto">
            {filterComponent}
          </div>
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

        {/* Use the DeleteConfirmationModal */}
        <DeleteConfirmationModal
          show={showDeleteModal}
          handleClose={() => setShowDeleteModal(false)}
          handleDelete={handleDeleteCategory}
          item={selectedRecord}
          itemType={deleteType}
        />
      </div>
    </div>
  );
}