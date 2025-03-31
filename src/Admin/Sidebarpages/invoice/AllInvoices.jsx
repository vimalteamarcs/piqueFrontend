

import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DashLayout from "../../DashLayout";
import CustomTable from "../../../components/CustomTable";
import { DELETE_INVOICE, GENERATE_INVOICE, GET_ALL_INVOICES } from "../../../../constants";
import AdminSideBar from "../../../components/Venue/AdminSideBar";
import debounce from "lodash.debounce";

const AllInvoices = () => {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [search, setSearch] = useState("");
  const [flag, setFlag] = useState(false);

  useEffect(() => {
    fetchInvoices(pagination.current, pagination.pageSize, search);
  }, [pagination.current, pagination.pageSize, flag]);

  const fetchInvoices = async (page, pageSize, search) => {
    if (search.length > 0 && search.length < 2) return; // Prevent API calls for 1 character

    setLoading(true);
    setError(null);

    const token = localStorage.getItem("token");
    if (!token) {
      setError("No token found. Please log in again.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}${GET_ALL_INVOICES}`,
        {
          params: { page, pageSize, search },
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data && response.data.records) {
        setInvoices(response.data.records);
        setPagination((prev) => ({ ...prev, total: response.data.total }));
      }
    } catch (err) {
      setError("Failed to load invoices");
      toast.error("Failed to load invoices");
    } finally {
      setLoading(false);
    }
  };

  const handleView = (record) => {
    navigate("/admin/viewinvoice", { state: record });
  };

  const handleDelete = async (record) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}${DELETE_INVOICE}${record.id}`
      );
      if (response.status === 200) {
        toast.success("Invoice deleted successfully", { autoClose: 1000 });
        setFlag(!flag);
      }
    } catch (error) {
      console.error(
        "Failed to delete invoice:",
        error.response?.data || error.message
      );
    }
  };

  const handleGenerateInvoice = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}${GENERATE_INVOICE}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      if (response.status === 200) {
        toast.success("Invoice generated successfully", { autoClose: 1000 });
        setFlag(!flag);
      }
    } catch (error) {
      console.error(
        "Failed to generate invoice:",
        error.response?.data || error.message
      );
      toast.error("Failed to generate invoice:", error.response?.data || error.message);
    }
  };

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((value) => {
      fetchInvoices(1, pagination.pageSize, value);
    }, 500),
    [pagination.pageSize]
  );

  const handleSearchChange = (value) => {
    setSearch(value);
    if (value.length === 0 || value.length >= 2) {
      debouncedSearch(value);
    }
  };

  const columns = [
    { title: "Invoice Number", dataIndex: "invoice_number", key: "invoice_number" },
    { title: "User Type", dataIndex: "user_type", key: "user_type" },
    { title: "Total Amount", dataIndex: "total_amount", key: "total_amount" },
    { title: "Tax Amount", dataIndex: "tax_amount", key: "tax_amount" },
    { title: "Total With Tax", dataIndex: "total_with_tax", key: "total_with_tax" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const normalizedStatus = status?.toString().trim().toLowerCase();
        let statusClass = "badge bg-warning text-dark";

        if (normalizedStatus === "paid") {
          statusClass = "badge bg-success";
        } else if (normalizedStatus === "pending") {
          statusClass = "badge bg-secondary";
        } else if (normalizedStatus === "overdue") {
          statusClass = "badge bg-danger";
        }

        return <span className={statusClass}>{status}</span>;
      },
    },
  ];

  return (
    <>
      <DashLayout />
      <div className="container-fluid w-100 p-0">
        <div className="d-flex mt-0">
          <div className="dash-sidebar-container">
            <AdminSideBar />
          </div>
          <div className="dash-profile-container">
            <div className="d-flex justify-content-between">
              <h5 className="text-secondary text-start mb-3">All Invoices</h5>
              <button type="button" className="btn btn-dark btn-sm rounded-3" onClick={handleGenerateInvoice}>Generate Invoice</button>
            </div>
            <ToastContainer />
            {loading ? (
              <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              <CustomTable
                data={invoices}
                columns={columns}
                onView={handleView}
                showActions={true}
                onDelete={handleDelete}
                loading={loading}
                pagination={pagination}
                onTableChange={(pagination) => {
                  fetchInvoices(pagination.current, pagination.pageSize, search);
                }}
                search={search}
                onSearchChange={handleSearchChange}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AllInvoices;