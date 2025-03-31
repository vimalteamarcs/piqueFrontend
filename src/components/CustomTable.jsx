import React, { useState } from "react";
import { Table, Button, Popconfirm, Input, Select, Modal } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { EyeOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
const { Option } = Select;

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

  const handleEdit = (record) => {
    if (onEdit) {
      onEdit(record);
    }
  };

  // const handleDelete = (record) => {
  //   if (onDelete) {
  //     onDelete(record);
  //   }
  // };
  const handleView = (record) => {
    if (onView) {
      onView(record);
    }
  };

  const handleDeleteClick = (record) => {
    setSelectedRecord(record);
    setIsModalVisible(true);
  };

  const handleConfirmDelete = () => {
    if (onDelete && selectedRecord) {
      onDelete(selectedRecord);
    }
    setIsModalVisible(false);
    setSelectedRecord(null);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedRecord(null);
  };

  const columnsWithActions = columns.map((col) => {
    if (col.actions) {
      return {
        ...col,
        render: (text, record) => (
          <>
            <Button
              onClick={() => handleView(record)}
              type=""
              size="small"
              style={{ marginRight: 3 }}
              icon={<EyeOutlined />}
            ></Button>
            <Button
              onClick={() => handleEdit(record)}
              type=""
              size="small"
              style={{ marginRight: 3 }}
              icon={<EditOutlined />}
            ></Button>
            {/* <Popconfirm
              title="Are you sure delete this item?"
              onConfirm={() => handleDeleteClick(record)}
            >
              <Button
                type="danger"
                size="small"
                icon={<DeleteOutlined />}
              ></Button>
            </Popconfirm> */}
            <Button
              onClick={() => handleDeleteClick(record)}
              type=""
              size="small"
              icon={<DeleteOutlined />}
            ></Button>
          </>
        ),
      };
    }

    return col;
  });

  return (
    <div className="card11">
      <div className="card-body11">
        {/* Search Input */}
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

        {/* Data Table */}
        <div className="table-responsive dataTableUI">
          <Table
            columns={columnsWithActions}
            dataSource={data}
            pagination={pagination}
            loading={loading}
            onChange={onTableChange} // Triggered on pagination or sorting
            rowKey="id"
          />
        </div>

        <Modal
          className="w-25"
          title={
            <div style={{ textAlign: "center" }}>
              Confirm Delete
            </div>
          }
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

