import React, { useEffect, useState } from "react";
import axios from "axios";
import DashLayout from "../../DashLayout";
import { ALL_VENUE, DELETE_VENUE } from "../../../../constants";
import CustomTable from "../../../components/CustomTable";
import { useNavigate } from "react-router-dom";
import AdminSideBar from "../../../components/Venue/AdminSideBar";
import { toast, ToastContainer } from "react-toastify";

export default function AllVenues() {
  const [venuedata, setVenuedata] = useState([]);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1, // Current page
    pageSize: 10, // Records per page
    total: 0, // Total number of records
  });
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const fetchVenues = async (page, pageSize, search) => {
    setLoading(true);

    const token = localStorage.getItem("token");
    if (!token) {
      setError("No token found. Please log in again.");
      setLoading(false);
      return;
    }

    try {
      const url = `${import.meta.env.VITE_API_URL}${ALL_VENUE}`;
      const response = await axios.get(url, {
        params: {
          page,
          pageSize,
          search,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response);
      if (response.data && response.data.records) {
        setVenuedata(response.data.records); // Update table data
        setPagination((prev) => ({
          ...prev,
          current: page,
          pageSize,
          total: response.data.total, // Update total count
        }));
      }
    } catch (err) {
      setError("Failed to load Venues");
    } finally {
      setLoading(false);
      console.log(venuedata);
    }
  };

  useEffect(() => {
    fetchVenues(pagination.current, pagination.pageSize, search);
  }, [pagination.current, pagination.pageSize, search]);

  const handleView = async (record) => {
    navigate("/admin/viewdetails", { state: record });
  };

  const handleEdit = (record) => {
    console.log(`Edit venue with id: ${record.id}`);
    navigate("/admin/editvenue", { state: { venueData: record } });
  };

  const handleDelete = async (record) => {
    console.log(`Delete venue with id: ${record.id}`);

    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}${DELETE_VENUE}${record}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("Venue deleted successfully:", response.data);
      toast.success("Venue deleted successfully!");
      setTimeout(() => {
        setSuccessMessage("");
      }, 2000);
    } catch (error) {
      console.error("Error deleting venue:", error);
    }
    fetchVenues(pagination.current, pagination.pageSize, search);
  };

  const handleTableChange = (pagination) => {
    fetchVenues(pagination.current, pagination.pageSize, search);
  };

  const handleSearch = (value) => {
    setSearch(value);
    fetchVenues(1, pagination.pageSize, value); // Reset to first page on new search
  };

  // Define columns for Table
  const columns = [
    // {
    //   title: "SNo",
    //   dataIndex: "serialNumber",
    //   key: "serialNumber",
    //   render: (text, record, index) =>
    //     (pagination.current - 1) * pagination.pageSize + index + 1,
    // },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text, record) => {
        return (
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              navigate("/admin/viewdetails", { state: record });
            }}
            className="text-decoration-none text-black"
          >
            {text}
          </a>
        );
      },
    },

    {
      title: "Location",
      dataIndex: "addressLine1",
      key: "location",
    },
    {
      title: "Contact",
      dataIndex: "phone",
      key: "contactInfo",
    },

    // {
    //   title: "Actions",
    //   key: "actions",
    //   actions: true, // Custom flag to add action buttons
    // },
  ];

  return (
    <>
      <DashLayout />
      <div className="container-fluid w-100 p-0">
        <div className="pageLayout">
          <div className="dash-sidebar-container">
            <AdminSideBar />
          </div>
          <div className="dash-profile-container">
            <p className="headingPG">VENUES</p>
            <div className="card">
              <div className="card-body">
                <ToastContainer />
                {error ? (
                  <div className="alert alert-danger">{error}</div>
                ) : (
                  <div className="">
                    <CustomTable
                      data={venuedata}
                      columns={columns}
                      onEdit={handleEdit}
                      showActions={true}
                      onDelete={handleDelete}
                      onView={handleView}
                      loading={loading}
                      pagination={{
                        current: pagination.current,
                        pageSize: pagination.pageSize,
                        total: pagination.total,
                        showSizeChanger: false,
                      }}
                      onTableChange={(pagination) => {
                        // Trigger API call with new page and pageSize
                        fetchVenues(
                          pagination.current,
                          pagination.pageSize,
                          search
                        );
                      }}
                      search={search}
                      onSearchChange={(value) => {
                        setSearch(value);
                        fetchVenues(1, pagination.pageSize, value); // Reset to the first page on search
                      }}
                      showPageSizeDropdown={true}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
