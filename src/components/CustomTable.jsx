// import React, { useState } from "react";
// import { Table, Button, Popconfirm, Input, Select, Modal } from "antd";
// import { SearchOutlined } from "@ant-design/icons";
// import { EyeOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
// const { Option } = Select;

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
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [selectedRecord, setSelectedRecord] = useState(null);

//   const handleEdit = (record) => {
//     if (onEdit) {
//       onEdit(record);
//     }
//   };

//   // const handleDelete = (record) => {
//   //   if (onDelete) {
//   //     onDelete(record);
//   //   }
//   // };
//   const handleView = (record) => {
//     if (onView) {
//       onView(record);
//     }
//   };

//   const handleDeleteClick = (record) => {
//     setSelectedRecord(record);
//     setIsModalVisible(true);
//   };

//   const handleConfirmDelete = () => {
//     if (onDelete && selectedRecord) {
//       onDelete(selectedRecord);
//     }
//     setIsModalVisible(false);
//     setSelectedRecord(null);
//   };

//   const handleCancel = () => {
//     setIsModalVisible(false);
//     setSelectedRecord(null);
//   };

//   const columnsWithActions = columns.map((col) => {
//     if (col.actions) {
//       return {
//         ...col,
//         render: (text, record) => (
//           <>
//             <Button
//               onClick={() => handleView(record)}
//               type=""
//               size="small"
//               style={{ marginRight: 3 }}
//               icon={<EyeOutlined />}
//             ></Button>
//             <Button
//               onClick={() => handleEdit(record)}
//               type=""
//               size="small"
//               style={{ marginRight: 3 }}
//               icon={<EditOutlined />}
//             ></Button>
//             {/* <Popconfirm
//               title="Are you sure delete this item?"
//               onConfirm={() => handleDeleteClick(record)}
//             >
//               <Button
//                 type="danger"
//                 size="small"
//                 icon={<DeleteOutlined />}
//               ></Button>
//             </Popconfirm> */}
//             <Button
//               onClick={() => handleDeleteClick(record)}
//               type=""
//               size="small"
//               icon={<DeleteOutlined />}
//             ></Button>
//           </>
//         ),
//       };
//     }

//     return col;
//   });

//   return (
//     <div style={{ borderRadius: "10px", padding: "0px" }}>
//       {/* Search Input */}
//       <div
//         style={{ borderRadius: "10px" }}
//         className="d-flex float-start m-2"
//       >
//         <Input
//           placeholder="Search..."
//           value={search}
//           onChange={(e) => onSearchChange(e.target.value)}
//           style={{ width: 200 }}
//           prefix={<SearchOutlined />}
//         />
//       </div>

//       {/* Data Table */}
//       <div className="event-form p-2">
//         <Table
//           columns={columnsWithActions}
//           dataSource={data}
//           pagination={pagination}
//           loading={loading}
//           onChange={onTableChange} // Triggered on pagination or sorting
//           rowKey="id"
//         />
//       </div>

//       <Modal
//         className="w-25"
//         title={
//           <div style={{ textAlign: "center" }}>
//             Confirm Delete
//           </div>
//         }
//         open={isModalVisible}
//         onOk={handleConfirmDelete}
//         onCancel={handleCancel}
//         okText="Yes, Delete"
//         cancelText="Cancel"
//         okType="danger"
//         centered
//         footer={[
//           <button
//             key="delete"
//             onClick={handleConfirmDelete}
//             className="btn btn-sm btn-danger"
//           >
//             Yes, Delete
//           </button>,
//           <button
//             key="cancel"
//             onClick={handleCancel}
//             className="btn btn-sm btn-secondary ms-2"
//           >
//             Cancel
//           </button>,
//         ]}
//       >
//         <p className="text-center">
//           Are you sure you want to delete this item?
//         </p>
//       </Modal>
//     </div>
//   );
// }







// import React, { useState } from "react";

// export default function CustomTable({
//   data,
//   columns,
//   onEdit,
//   onView,
//   onDelete,
//   search,
//   onSearchChange,
// }) {
//   // console.log("columns", columns)
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [selectedRecord, setSelectedRecord] = useState(null);

//   const handleDeleteClick = (record) => {
//     setSelectedRecord(record);
//     setIsModalVisible(true);
//   };

//   const handleConfirmDelete = () => {
//     if (onDelete && selectedRecord) {
//       onDelete(selectedRecord);
//     }
//     setIsModalVisible(false);
//     setSelectedRecord(null);
//   };

//   const handleCancel = () => {
//     setIsModalVisible(false);
//     setSelectedRecord(null);
//   };

//   // Add Sr. No. Column
//   const tableColumns = [
//     { title: "SrNo", key: "srNo" }, // Auto-increment column
//     ...columns,
//     { title: "Actions", key: "actions" },
//   ];

//   return (
//     // <div className="">
//       {/* Search Input */}
//       {/*<div className="col-md-3 col-12 mb-3">
//         <input
//           type="text"
//           placeholder="Search..."
//           value={search}
//           onChange={(e) => onSearchChange(e.target.value)}
//           className="form-control"
//         />
//       </div>*/}

//       {/* Data Table */}
//       {/* <div className="event-form">
//         <div className="table-responsive">
//           <table className="table table-bordered1 table-hover dataTableUI">
//             <thead className="table-light1">
//               <tr>
//                 {tableColumns.map((col, index) => (
//                   <th key={index}>{col.title}</th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody>
//               {data.map((record, index) => (
//                 <tr key={index}>
//                   <td>{index + 1}</td>
//                   {columns.map((col, colIndex) => (
//                     <td key={colIndex}>
//                       {col.render ? col.render(record[col.dataIndex], record) : record[col.dataIndex]}
//                     </td>
//                   ))}
//                   <td>
//                     <div className="btn-group">
//                       <button type="button" className="btn btn-outline-primary" onClick={() => onView(record)}>
//                         <i className="fas fa-eye"></i>
//                       </button>
//                       <button type="button" className="btn btn-outline-primary" onClick={() => onEdit(record)}>
//                         <i className="fas fa-edit"></i>
//                       </button>
//                       <button type="button" className="btn btn-outline-primary" onClick={() => handleDeleteClick(record)}>
//                         <i className="fas fa-trash"></i>
//                       </button>
//                     </div>
//                     {/* <button
//                     className="btn btn-sm btn-primary me-1"
//                     onClick={() => onView(record)}
//                   >
//                     <i className="fas fa-eye"></i>
//                   </button> */}
//                     {/* <button
//                     className="btn btn-sm btn-warning me-1"
//                     onClick={() => onEdit(record)}
//                   >
//                     <i className="fas fa-edit"></i>
//                   </button> */}
//                     {/* <button
//                     className="btn btn-sm btn-danger"
//                     onClick={() => handleDeleteClick(record)}
//                   >
//                     <i className="fas fa-trash"></i>
//                   </button> */}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div> */}

//       {/* Delete Confirmation Modal */}
//       {/* {isModalVisible && (
//         <div
//           className="modal fade show d-flex align-items-center justify-content-center"
//           style={{
//             position: "fixed",
//             width: "100vw",
//             height: "100vh",
//             background: "rgba(0,0,0,0.5)",
//             zIndex: 1050,
//           }}
//         >
//           <div className="modal-dialog modal-dialog-centered">
//             <div className="modal-content">
//               <div className="modal-header">
//                 <h5 className="modal-title text-center">Confirm Delete</h5>
//                 <button
//                   type="button"
//                   className="btn-close"
//                   onClick={handleCancel}
//                 ></button>
//               </div>
//               <div className="modal-body text-center">
//                 <p>Are you sure you want to delete this item?</p>
//               </div>
//               <div className="modal-footer">
//                 <button
//                   className="btn btn-sm btn-danger"
//                   onClick={handleConfirmDelete}
//                 >
//                   Yes, Delete
//                 </button>
//                 <button
//                   className="btn btn-sm btn-secondary ms-2"
//                   onClick={handleCancel}
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )} */}


//     </div>
//   );
// }


import React, { useEffect, useRef } from "react";
import ReactDOMServer from "react-dom/server";
import $ from "jquery";
import "datatables.net-bs5"; // Bootstrap 5 styling
import "datatables.net-responsive-bs5"; // Optional: Makes table responsive


export default function CustomTable({
  data = [],
  columns = [],
  onEdit,
  onView,
  onDelete,
  pagination = { current: 1, pageSize: 10, total: 0 },
  onTableChange,
}) {
  const tableRef = useRef(null);
  const tableInstance = useRef(null);

  useEffect(() => {
    if ($.fn.DataTable.isDataTable(tableRef.current)) {
      tableInstance.current.destroy();
    }

    tableInstance.current = $(tableRef.current).DataTable({
      destroy: true,
      data: data,
      columns: [
        {
          title: "SrNo",
          data: null,
          render: (data, type, row, meta) => meta.row + 1,
        },
        ...columns.map((col) => ({
          title: typeof col.title === "string" ? col.title : "Untitled",
          data: col.dataIndex || null,
          render: col.render
            ? (data, type, row) =>
              ReactDOMServer.renderToString(col.render(data, row) || "")
            : (data) => (data ? data.toString() : ""),
        })),
        {
          title: "Actions",
          data: null,
          orderable: false,
          render: function (data, type, row) {
            return `
              <div class="btn-group">
          <button class="btn btn-outline-primary btn-view"><i class="fas fa-eye"></i></button>
          <button class="btn btn-outline-primary btn-edit"><i class="fas fa-edit"></i></button>
          <button class="btn btn-outline-primary btn-delete"><i class="fas fa-trash"></i></button>
        </div>`;
          },
        },
      ],
      paging: true,
      searching: true,
      ordering: true,
      pageLength: pagination.pageSize,
      displayStart: (pagination.current - 1) * pagination.pageSize,
      drawCallback: function (settings) {
        const newPage =
          Math.ceil(settings._iDisplayStart / settings._iDisplayLength) + 1;
        if (pagination.current !== newPage) {
          onTableChange({
            current: newPage,
            pageSize: settings._iDisplayLength,
            total: pagination.total,
          });
        }
      },
    });

    // Apply custom styles after DataTables applies its default styles
    setTimeout(() => {
      $('.dataTableUI').removeAttr('style');
    }, 100);

    // Event bindings for actions
    $(tableRef.current).on("click", ".btn-view", function () {
      const rowData = tableInstance.current.row($(this).parents("tr")).data();
      onView(rowData);
    });

    $(tableRef.current).on("click", ".btn-edit", function () {
      const rowData = tableInstance.current.row($(this).parents("tr")).data();
      onEdit(rowData);
    });

    $(tableRef.current).on("click", ".btn-delete", function () {
      const rowData = tableInstance.current.row($(this).parents("tr")).data();
      onDelete(rowData);
    });

    return () => {
      if (tableInstance.current) {
        tableInstance.current.destroy();
      }
    };
  }, [data, columns, pagination]);


  return (
    <div>
      <table
        ref={tableRef}
        className="display table dataTableUI"
      />
    </div>
  );
}
