import React, { useEffect, useState } from "react";
import axios from "axios";
import DashLayoutVenue from "../../components/Venue/DashLayoutVenue";
import PiqueFooter from "../../components/PiqueComponents/PiqueFooter";
import SearchBar from "../../components/Venue/SearchBar";
import ProfileSidebar from "../../components/Venue/ProfileSidebar";
import BookingsTable from "../../components/Venue/BookingsTable";
import UpdateBookingModal from "../../components/Venue/UpdateBookingModal";
import moment from "moment";
import { ToastContainer } from "react-toastify";
import CustomTable from "../../components/CustomTable";

export default function AllBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState(""); // For search input
  const [currentPage, setCurrentPage] = useState(1); // For current page in pagination
  const pageSize = 10; // Page size



  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}venues/booking/request`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("bookings", response.data)
      setBookings(response.data.bookings || []);
    } catch (err) {
      setError("Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  };

  const handleViewEntertainer = (booking) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBooking(null);
  };

  // Filtered bookings based on search input (search across all fields)
  const filteredBookings = bookings.filter((booking) => {
    return (
      Object.values(booking)
        .join(" ") // Combine all values as a single string
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  });

  // Handle page change
  const handleTableChange = (pagination) => {
    setCurrentPage(pagination.current);
  };

  const columns = [
    {
      title: "Entertainer",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Event Title",
      dataIndex: "event_title",
      key: "event_title",
    },

    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 60,
      render: (status) => {
        let badgeClass = "";

        switch (status) {
          case "confirmed":
            badgeClass = "badge-confirmed";
            break;
          case "pending":
            badgeClass = "badge-pending";
            break;
          case "rejected":
            badgeClass = "badge-declined";
            break;
          case "accepted":
            badgeClass = "bg-success badgeSucessBH text-black";
            break;
          default:
            badgeClass = "bg-secondary text-white";
        }

        return (
          <span className={`badge ${badgeClass}`}>
            {status}
          </span>
        );
      },
    }
    ,
    {
      title: "Date",
      dataIndex: "showDate",
      key: "showDate",
      render: (showDate) =>
        moment.utc(showDate).format("DD-MMM-YYYY").toUpperCase(),
    },
    {
      title: "Time",
      dataIndex: "showTime",
      key: "showTime",
      render: (showTime) =>
        new Date(`1970-01-01T${showTime}`).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
    },
    {
      title: "Price Per Event",
      dataIndex: "pricePerEvent",
      key: "pricePerEvent",
      render: (price) => `$${price}`,
    },
  ];

  return (
    <DashLayoutVenue title="All Bookings" description="View all bookings made">
      <div className="container-fluid d-flex flex-column min-vh-100 p-0">
        <SearchBar />
        <div className="d-flex">
          <div className="sidebar-container">
            <ProfileSidebar />
          </div>
          <div className="profile-container">
            <p className="profile-font fw-bold">BOOKINGS</p>
            <hr />

            <CustomTable
              data={filteredBookings}
              columns={columns}  // Assuming your columns do not define actions already
              loading={loading}
              onEdit={handleViewEntertainer}  // Ensure this is passed down as expected
              pagination={{
                current: currentPage,
                pageSize: pageSize,
                total: filteredBookings.length,
                onChange: handleTableChange,
                showSizeChanger: false,
              }}
              onTableChange={handleTableChange}
              search={search}
              onSearchChange={(value) => setSearch(value)}
            />
          </div>
        </div>
      </div>
      <ToastContainer
        position="top-right"
        reverseOrder={false}
      />
      {isModalOpen && selectedBooking && (
        <UpdateBookingModal
          booking={selectedBooking}
          onClose={handleCloseModal}
          refreshBookings={fetchBookings}
        />
      )}

    </DashLayoutVenue>
  );
}
