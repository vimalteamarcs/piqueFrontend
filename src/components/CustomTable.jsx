


import React, { useState } from "react";

export default function CustomTable({
  data,
  columns,
  onEdit,
  onView,
  onDelete,
  search,
  onSearchChange,
}) {
  // console.log("columns", columns)
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

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

  // Add Sr. No. Column
  const tableColumns = [
    { title: "SrNo", key: "srNo" }, // Auto-increment column
    ...columns,
    { title: "Actions", key: "actions" },
  ];

  return (
     <div className="">
      {/* Search Input */}
      <div className="col-md-3 col-12 mb-3">
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="form-control"
        />
      </div>

      {/* Data Table */}
       <div className="event-form">
        <div className="table-responsive">
          <table className="table table-bordered1 table-hover dataTableUI">
            <thead className="table-light1">
              <tr>
                {tableColumns.map((col, index) => (
                  <th key={index}>{col.title}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((record, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  {columns.map((col, colIndex) => (
                    <td key={colIndex}>
                      {col.render ? col.render(record[col.dataIndex], record) : record[col.dataIndex]}
                    </td>
                  ))}
                  <td>
                    <div className="btn-group">
                      <button type="button" className="btn btn-outline-primary" onClick={() => onView(record)}>
                        <i className="fas fa-eye"></i>
                      </button>
                      <button type="button" className="btn btn-outline-primary" onClick={() => onEdit(record)}>
                        <i className="fas fa-edit"></i>
                      </button>
                      <button type="button" className="btn btn-outline-primary" onClick={() => handleDeleteClick(record)}>
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>

                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div> 

      {/* Delete Confirmation Modal */}
       {isModalVisible && (
        <div
          className="modal fade show d-flex align-items-center justify-content-center"
          style={{
            position: "fixed",
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.5)",
            zIndex: 1050,
          }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title text-center">Confirm Delete</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCancel}
                ></button>
              </div>
              <div className="modal-body text-center">
                <p>Are you sure you want to delete this item?</p>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-sm btn-danger"
                  onClick={handleConfirmDelete}
                >
                  Yes, Delete
                </button>
                <button
                  className="btn btn-sm btn-secondary ms-2"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )} 


    </div>
  );
}





