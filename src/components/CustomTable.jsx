import React, { useState } from "react";
import { Table, Button, Input, Select } from "antd";
import {
  SearchOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import DeleteConfirmationModal from "../Admin/settingsPages/DeleteConfirmationModal";

export default function CustomTable({
  data = [], // ✅ fallback if undefined
  columns = [],
  onView,
  onEdit,
  onDelete,
  pagination,
  onTableChange,
  search,
  onSearchChange,
  loading,
  selectedRowKeys = [], // ✅ fallback if undefined
  handleRowSelect,
  handleSelectAll,
  showActions = false,
  filterComponent = null,
  showCheckboxes = false,
  showPageSizeDropdown = false,

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
    showCheckboxes
      ? {
        title: (
          <input
            type="checkbox"
            onChange={(e) => handleSelectAll(e.target.checked)}
            checked={selectedRowKeys.length === data.length && data.length > 0}
          />
        ),
        dataIndex: "select",
        key: "select",
        render: (_, record) => (
          <input
            type="checkbox"
            checked={selectedRowKeys.includes(record.id)}
            onChange={(e) => handleRowSelect(record.id, e.target.checked)}
          />
        ),
        width: 50,
      }
      : null,
    {
      title: "SNo",
      dataIndex: "srNo",
      key: "srNo",
      render: (text, record, index) => {
        const current = pagination?.current || 1;
        const pageSize = pagination?.pageSize || 10;
        return (current - 1) * pageSize + index + 1;
      },
    },
    ...columns,
    actionColumn,
  ].filter(Boolean);

  const handlePageSizeChange = (value) => {
    if (onTableChange) {
      onTableChange({ current: pagination.current, pageSize: value });
    }
  };


  return (
    <div className="card11">
      <div className="card-body11">
        {/* <div className="row justify-content-between align-items-center">
          <div className="col-auto">
            {filterComponent}
          </div>
          <div className="d-flex align-items-center justify-content-between">
          {showPageSizeDropdown && (
              <Select
                defaultValue={pagination.pageSize}
                onChange={handlePageSizeChange}
                style={{ width: 120 }}
              >
                {[10, 20, 30, 50].map((size) => (
                  <Select.Option key={size} value={size}>
                    {size} per page
                  </Select.Option>
                ))}
              </Select>
            )}
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
          </div> */}

        <div className="row justify-content-between align-items-center mb-2">
          <div className="col d-flex gap-2 align-items-center">
            {filterComponent && <div>{filterComponent}</div>}
            {showPageSizeDropdown && (
              <Select
                defaultValue={pagination.pageSize}
                onChange={handlePageSizeChange}
                style={{ width: 140 }}
              >
                {[10, 20, 30, 50].map((size) => (
                  <Select.Option key={size} value={size}>
                    {size} per page
                  </Select.Option>
                ))}
              </Select>
            )}
          </div>
          <div className="col-auto dataTableSearch text-end">
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
            pagination={{
              ...pagination,
              showSizeChanger: false,
            }}
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