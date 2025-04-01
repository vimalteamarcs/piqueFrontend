// import React, { useCallback, useEffect, useState } from "react";
// import axios from "axios";
// import DashLayout from "../DashLayout";
// import { ALL_USER, DELETE_USER, UPDATE_USER_STATUS } from "../../../constants";
// import CustomTable from "../../components/CustomTable";
// import { useNavigate } from "react-router-dom";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import debounce from "lodash.debounce";
// import AdminSideBar from "../../components/Venue/AdminSideBar";

// export default function AllUser() {
//   const navigate = useNavigate();
//   const [userdata, setuserdata] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [selectedRowKeys, setSelectedRowKeys] = useState([]); // Track selected rows
//   const [pagination, setPagination] = useState({
//     current: 1,
//     pageSize: 10,
//     total: 0,
//   });
//   const [search, setSearch] = useState("");
//   const [status, setStatus] = useState(""); // Track selected status for the dropdown
//   const token = localStorage.getItem("token");
//   // Fetch users from API
//   const fetchusers = async (page = 1, pageSize = 5, search = "") => {
//     setLoading(true);

//     if (!token) {
//       setError("No token found. Please log in again.");
//       setLoading(false);
//       return;
//     }

//     try {
//       const url = `${import.meta.env.VITE_API_URL}${ALL_USER}`;
//       const response = await axios.get(url, {
//         params: { page, pageSize, search },
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       console.log(response.data)
//       if (response.data && response.data.records) {
//         setuserdata(response.data.records);

//         setPagination((prev) => ({
//           ...prev,
//           current: page,
//           pageSize,
//           total: response.data.total,
//         }));
//       }
//     } catch (err) {
//       setError("Failed to load users");
//       console.log(err)
//     } finally {
//       setLoading(false);
//     }
//   };


//   useEffect(() => {
//     fetchusers(pagination.current, pagination.pageSize, search);
//   }, [pagination.current, pagination.pageSize, search]);

//   const debouncedSearch = useCallback(
//     debounce((value) => {
//       if (value.length >= 3) {
//         fetchusers(1, pagination.pageSize, value);
//       }
//     }, 500),
//     [pagination.pageSize]
//   );

//   const handleTableChange = (page, pageSize) => {
//     setPagination((prev) => ({
//       ...prev,
//       current: page,
//       pageSize,
//     }));

//     fetchusers(page, pageSize, search);
//   };



//   // Handle search input
//   const handleSearch = (value) => {
//     setSearch(value);
//     // fetchusers(1, pagination.pageSize, value);
//     debouncedSearch(value);
//   };

//   // Handle individual row selection
//   const handleRowSelect = (id, checked) => {
//     setSelectedRowKeys((prev) =>
//       checked ? [...prev, id] : prev.filter((rowId) => rowId !== id)
//     );
//   };

//   // Handle "Select All"
//   const handleSelectAll = (e) => {
//     if (e.target.checked) {
//       setSelectedRowKeys(userdata.map((user) => user.id)); // Select all IDs
//     } else {
//       setSelectedRowKeys([]); // Deselect all
//     }
//   };

//   // Handle status change
//   const handleStatusChange = async () => {
//     if (selectedRowKeys.length === 0 || !status) {
//       return; // Do nothing if no rows are selected or no status is selected
//     }

//     try {
//       const response = await axios.patch(
//         `${import.meta.env.VITE_API_URL}${UPDATE_USER_STATUS}`,
//         {
//           ids: selectedRowKeys, // Pass the selected IDs
//           status, // Pass the selected status
//         },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       if (response.status === 200) {
//         // After updating, fetch users again to reflect changes
//         fetchusers(pagination.current, pagination.pageSize, search);
//         toast.success("User status Updated successfully!", { autoClose: 1000 });
//       }
//     } catch (error) {
//       toast.error("Error updating status:", error);
//     }
//   };

//   // Define columns
//   const columns = [
//     {
//       title: (
//         <input
//           type="checkbox"
//           onChange={handleSelectAll}
//           checked={
//             selectedRowKeys.length === userdata.length && userdata.length > 0
//           }
//         />
//       ),
//       dataIndex: "id",
//       key: "select",
//       render: (_, record) => (
//         <input
//           type="checkbox"
//           checked={selectedRowKeys.includes(record.id)}
//           onChange={(e) => handleRowSelect(record.id, e.target.checked)}
//         />
//       ),
//     },
//     {
//       title: "Name",
//       dataIndex: "name",
//       key: "name",
//     },
//     {
//       title: "Email",
//       dataIndex: "email",
//       key: "email",
//     },
//     {
//       title: "Phone Number",
//       dataIndex: "phoneNumber",
//       key: "phoneNumber",
//     },
//     {
//       title: "Role",
//       dataIndex: "role",
//       key: "role",
//     },
//     {
//       title: "Status",
//       dataIndex: "status",
//       key: "status",
//       render: (text) => (
//         <span
//           className={
//             text.toLowerCase() === "pending"
//               ? "text-capitalize badge bg-danger"
//               : "text-capitalize badge bg-success px-3"
//           }
//         >
//           {text}
//         </span>
//       ),
//     },

//   ];

//   const handleView = async (record) => {
//     if (record && record.role && record.role.toLowerCase() === "venue") {
//       navigate("/admin/viewvenue", { state: record });
//     } else {
//       navigate("/admin/viewentertainer", { state: record });
//     }
//   };
//   const handleEdit = async (record) => {
//     navigate("/admin/edituser", { state: record });
//   };

//   const handleDelete = async (record) => {
//     try {
//       const response = await axios.delete(
//         `${import.meta.env.VITE_API_URL}${DELETE_USER}${record.id}`,

//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       console.log(response.data)
//       if (response.status === 200) {
//         // After updating, fetch users again to reflect changes
//         fetchusers(pagination.current, pagination.pageSize, search);
//         console.log("Status updated successfully");
//         toast.success("User deleted successfully!", { autoClose: 1000 });
//       }
//     } catch (error) {
//       console.error("Error updating status:", error);
//     }
//   };
//   return (
//     <>
//       <DashLayout />
//       <ToastContainer />
//       <div className="container-fluid w-100 p-0">
//         <div className="pageLayout">
//           <div className="dash-sidebar-container">
//             <AdminSideBar />
//           </div>
//           <div className="dash-profile-container">
//             {error ? (
//               <div className="alert alert-danger">{error}</div>
//             ) : (
//               <div className="m-2">
//                 {/* Status Dropdown */}
//                 {selectedRowKeys.length > 0 && (
//                   <div className=" d-flex justify-content-end float-center">
//                     <div className="col-md-3 ">
//                       <select
//                         id="status"
//                         className="form-control"
//                         value={status}
//                         onChange={(e) => setStatus(e.target.value)}
//                       >
//                         <option value="" selected>
//                           --Select--
//                         </option>
//                         <option value="active">Active</option>
//                         {/* <option value="inactive">Inactive</option> */}
//                         <option value="pending">Pending</option>
//                       </select>
//                     </div>
//                     <div className="col-md-3">
//                       <button
//                         className="btn btn-primary"
//                         onClick={handleStatusChange}
//                       >
//                         Update Status
//                       </button>
//                     </div>
//                   </div>
//                 )}


//                 <button
//                   className="btn btn-primary float-end gap-2"
//                   onClick={() => {
//                     navigate("/admin/adduser");
//                   }}
//                 >
//                   <i className="bi bi-plus"></i> Add User
//                 </button>

//                 {/* Custom Table Component */}
//                 {loading ? (
//                   <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
//                     <div className="spinner-border text-primary" role="status">
//                       <span className="visually-hidden">Loading...</span>
//                     </div>
//                   </div>
//                 ) : (

//                   <CustomTable
//                     data={userdata}
//                     columns={columns}
//                     loading={loading}
//                     onView={handleView}
//                     onEdit={handleEdit}
//                     showActions={true}
//                     onDelete={handleDelete}
//                     pagination={{
//                       current: pagination.current,
//                       pageSize: pagination.pageSize,
//                       total: pagination.total,
//                       showSizeChanger: true,
//                     }}
//                     onTableChange={(pagination) => handleTableChange(pagination.current, pagination.pageSize)}
//                     search={search}
//                     onSearchChange={handleSearch}
//                   />
//                 )}
//               </div>

//             )}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }


import React, { useState, useEffect } from "react";
import axios from "axios";
import DashLayout from "../DashLayout";
import { ALL_USER, DELETE_USER, UPDATE_USER_STATUS } from "../../../constants";
import CustomTable from "../../components/CustomTable";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import debounce from "lodash.debounce";
import AdminSideBar from "../../components/Venue/AdminSideBar";

export default function AllUser() {
  const navigate = useNavigate();
  const [userdata, setuserdata] = useState([]);
  const [error, setError] = useState(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [tableLoading, setTableLoading] = useState(true); // Add table loading state
  const token = localStorage.getItem("token");

  // State for debounced search
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  // Debounce logic
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500); // Adjust delay as needed

    return () => {
      clearTimeout(handler);
    };
  }, [search]);

  // Fetch users from API
  const fetchusers = async (page = 1, pageSize = 5, search = "") => {
    if (!token) {
      setError("No token found. Please log in again.");
      return;
    }

    setTableLoading(true); // Set table loading to true when fetching data
    try {
      const url = `${import.meta.env.VITE_API_URL}${ALL_USER}`;
      const response = await axios.get(url, {
        params: { page, pageSize, search },
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data && response.data.records) {
        setuserdata(response.data.records);

        setPagination((prev) => ({
          ...prev,
          current: page,
          pageSize,
          total: response.data.total,
        }));
      }
    } catch (err) {
      setError("Failed to load users");
    } finally {
      setTableLoading(false); // Set table loading to false after data is fetched
    }
  };

  // Effect to fetch data whenever debounced search or pagination changes
  useEffect(() => {
    fetchusers(pagination.current, pagination.pageSize, debouncedSearch);
  }, [pagination.current, pagination.pageSize, debouncedSearch]);

  const handleTableChange = (page, pageSize) => {
    setPagination((prev) => ({
      ...prev,
      current: page,
      pageSize,
    }));
  };

  // Handle search input
  const handleSearch = (value) => {
    setSearch(value); // Trigger the search state update
  };

  // Handle individual row selection
  const handleRowSelect = (id, checked) => {
    setSelectedRowKeys((prev) =>
      checked ? [...prev, id] : prev.filter((rowId) => rowId !== id)
    );
  };

  // Handle "Select All"
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedRowKeys(userdata.map((user) => user.id));
    } else {
      setSelectedRowKeys([]);
    }
  };

  // Handle status change
  const handleStatusChange = async () => {
    if (selectedRowKeys.length === 0 || !status) {
      return;
    }

    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_API_URL}${UPDATE_USER_STATUS}`,
        {
          ids: selectedRowKeys,
          status,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        fetchusers(pagination.current, pagination.pageSize, debouncedSearch);
        toast.success("User status updated successfully!", { autoClose: 1000 });
      }
    } catch (error) {
      toast.error("Error updating status:", error);
    }
  };

  // Define columns
  const columns = [
    {
      title: (
        <input
          type="checkbox"
          onChange={handleSelectAll}
          checked={selectedRowKeys.length === userdata.length && userdata.length > 0}
        />
      ),
      dataIndex: "id",
      key: "select",
      render: (_, record) => (
        <input
          type="checkbox"
          checked={selectedRowKeys.includes(record.id)}
          onChange={(e) => handleRowSelect(record.id, e.target.checked)}
        />
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone Number",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text) => (
        <span
          className={
            text.toLowerCase() === "pending"
              ? "text-capitalize badge bg-danger"
              : "text-capitalize badge bg-success px-3"
          }
        >
          {text}
        </span>
      ),
    },
  ];

  const handleView = async (record) => {
    if (record && record.role && record.role.toLowerCase() === "venue") {
      navigate("/admin/viewvenue", { state: record });
    } else {
      navigate("/admin/viewentertainer", { state: record });
    }
  };

  const handleEdit = async (record) => {
    navigate("/admin/edituser", { state: record });
  };

  const handleDelete = async (record) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}${DELETE_USER}${record.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status === 200) {
        fetchusers(pagination.current, pagination.pageSize, debouncedSearch);
        toast.success("User deleted successfully!", { autoClose: 1000 });
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <>
      <DashLayout />
      <ToastContainer />
      <div className="container-fluid w-100 p-0">
        <div className="pageLayout">
          <div className="dash-sidebar-container">
            <AdminSideBar />
          </div>
          <div className="dash-profile-container">
            <p className="headingPG"> Users </p>
            {error ? (
              <div className="alert alert-danger">{error}</div>
            ) : (
              <div className="card">
                <div className="card-body">
                  <div className="row mb-2">
                    <div className="col-md-6">
                      {selectedRowKeys.length > 0 && (
                        <div className="d-flex justify-content-start align-items-center">
                          <div className="col-md-7">
                            <select
                              id="status"
                              className="form-control"
                              value={status}
                              onChange={(e) => setStatus(e.target.value)}
                            >
                              <option value="">--Select--</option>
                              <option value="active">Active</option>
                              <option value="pending">Pending</option>
                            </select>
                          </div>
                          <div className="col-md-5">
                            <button
                              className="btn mybtn ms-1"
                              onClick={handleStatusChange}
                            >
                              Update Status
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="col-md-6 text-end">
                      <button
                        className="btn mybtn gap-2"
                        onClick={() => navigate("/admin/adduser")}
                      >
                        <i className="bi bi-plus"></i> Add User
                      </button>
                    </div>

                  </div>

                  <CustomTable
                    data={userdata}
                    columns={columns}
                    onView={handleView}
                    onEdit={handleEdit}
                    showActions={true}
                    onDelete={handleDelete}
                    pagination={{
                      current: pagination.current,
                      pageSize: pagination.pageSize,
                      total: pagination.total,
                      showSizeChanger: true,
                    }}
                    onTableChange={(pagination) => handleTableChange(pagination.current, pagination.pageSize)}
                    search={search}
                    onSearchChange={handleSearch}
                    loading={tableLoading} // Pass table loading state to CustomTable
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
