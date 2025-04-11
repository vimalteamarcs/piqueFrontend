import React, { useState } from "react";
import moment from "moment";
import CustomTable from "../CustomTable";
import { Modal, Select } from "antd";
import { ToastContainer } from "react-toastify";
const { Option } = Select;
export default function BookingDataContainer({
  bookingRequests,
  loading,
  formatTime,
  handleBookingResponse,
}) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleStatusChange = (value) => {
    setStatusFilter(value);
  };

  const showConfirmation = (id, action) => {
    const actionLabel = action === "accepted" ? "accept" : "reject";
  
    Modal.confirm({
      mask: false,
      title: `Are you sure you want to ${actionLabel} this booking?`,
      okText: actionLabel.charAt(0).toUpperCase() + actionLabel.slice(1),
      cancelText: "Cancel",
      onOk() {
        handleBookingResponse(id, action);
      },
      okButtonProps: {
        className: "btn btn-primary",
      },
      cancelButtonProps: {
        className: "btn btn-secondary",
      },
    });
  };
  
  // const filteredData = bookingRequests.filter((item) => {
  //   const searchText = search.toLowerCase();
  
  //   const userName = item?.user?.fullName?.toLowerCase() || "";
  //   const venueName = item?.name?.toLowerCase() || "";
  //   const eventTitle = item?.event_title?.toLowerCase() || "";
  //   const performanceRole = item?.performanceRole?.toLowerCase() || "";
  //   const status = item?.status?.toLowerCase() || "";
  
  //   const formattedDate = moment(item?.date).format("DD-MMM-YYYY").toLowerCase();
  
  //   const start = moment(item.event_startTime);
  //   const end = moment(item.event_endTime);
  //   const duration = moment.duration(end.diff(start));
  //   const hours = duration.hours();
  //   const minutes = duration.minutes();
  //   let durationText = "";
  //   if (hours) durationText += `${hours}hr `;
  //   if (minutes) durationText += `${minutes}m`;
  //   durationText = durationText.trim() || "0m";
  
  //   return (
  //     userName.includes(searchText) ||
  //     venueName.includes(searchText) ||
  //     eventTitle.includes(searchText) ||
  //     performanceRole.includes(searchText) ||
  //     status.includes(searchText) ||
  //     formattedDate.includes(searchText) ||
  //     durationText.includes(searchText)
  //   );
  // });
  
  const filteredData = bookingRequests.filter((item) => {
    const searchText = search.toLowerCase();
  
    const eventTitle = item?.event_title?.toLowerCase() || "";
    const venueName = item?.name?.toLowerCase() || "";
    const status = item?.status?.toLowerCase() || "";
    const performanceRole = item?.performanceRole?.toLowerCase() || "";
    const city = item?.city_name?.toLowerCase() || "";
    const state = item?.state_name?.toLowerCase() || "";
    const country = item?.country_name?.toLowerCase() || "";
    const phone = item?.phone?.toLowerCase() || "";
    const email = item?.email?.toLowerCase() || "";
    const description = item?.description?.toLowerCase() || "";
    const specialNotes = item?.specialNotes?.toLowerCase() || "";
  
    // Format show date
    const formattedDate = moment(item?.showDate).format("DD-MMM-YYYY").toLowerCase();
    const formattedTime = item?.showTime?.toLowerCase() || "";
  
    // Calculate event duration
    const start = moment(item?.event_startTime);
    const end = moment(item?.event_endTime);
    const duration = moment.duration(end.diff(start));
    const hours = duration.hours();
    const minutes = duration.minutes();
    let durationText = "";
    if (hours) durationText += `${hours}hr `;
    if (minutes) durationText += `${minutes}m`;
    durationText = durationText.trim() || "0m";
  
    return (
      eventTitle.includes(searchText) ||
      venueName.includes(searchText) ||
      status.includes(searchText) ||
      performanceRole.includes(searchText) ||
      city.includes(searchText) ||
      state.includes(searchText) ||
      country.includes(searchText) ||
      phone.includes(searchText) ||
      email.includes(searchText) ||
      description.includes(searchText) ||
      specialNotes.includes(searchText) ||
      formattedDate.includes(searchText) ||
      formattedTime.includes(searchText) ||
      durationText.includes(searchText)
    );
  });
  
  

  const paginatedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (date) => moment(date).format("DD-MMM-YYYY"),
    },
    {
      title: "Venue",
      dataIndex: "name",
      key: "name",
      render: (text) => text || "N/A",
    },
    {
      title: "Event",
      dataIndex: "event_title",
      key: "event_title",
      render: (text) => text || "N/A",
    },
    {
      title: "Type of Performance",
      dataIndex: "performanceRole",
      key: "performanceRole",
      render: (text) => text || "N/A",
    },
    {
      title: "Duration",
      key: "duration",
      render: (_, record) => {
        const start = moment(record.event_startTime);
        const end = moment(record.event_endTime);
        const duration = moment.duration(end.diff(start));
        const hours = duration.hours();
        const minutes = duration.minutes();

        let result = "";
        if (hours) result += `${hours}hr `;
        if (minutes) result += `${minutes}m`;

        return result.trim() || "0m"; // fallback in case both are 0
      },
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
    
        // Capitalize the first letter of status
        const capitalizedStatus = status ? status.charAt(0).toUpperCase() + status.slice(1).toLowerCase() : "N/A";
    
        return <span className={`badge ${badgeClass}`}>{capitalizedStatus}</span>;
      },
    },
    

    {
      title: "Action",
      key: "action",
      width: 120,
      render: (_, record) => {
        if (record.status === "pending") {
          return (
            <div className="d-flex gap-2" style={{ flexDirection: "row" }}>
              <span
                type="button"
                className="badge badgeSucessBH text-black rounded-pill text-bg-success"
                onClick={() => showConfirmation(record.id, "accepted")}
              >
                Accept
              </span>
              <span
                type="button"
                className="badge badge-declined rounded-pill text-black text-bg-danger"
                onClick={() => showConfirmation(record.id, "rejected")}
              >
                Reject
              </span>
            </div>
          );
        }
        return <span className="text-muted">Responded</span>;
      }
      
    },
    
  ];

  const filterComponent = (
    <Select
      value={statusFilter}
      onChange={handleStatusChange}
      style={{ width: 120 }}
    >
      <Option value="all">All</Option>
      <Option value="pending">Pending</Option>
      <Option value="confirmed">Confirmed</Option>
      <Option value="accepted">Accepted</Option>
      <Option value="rejected">Rejected</Option>


    </Select>
  );

  return (
    <div className="entertainer-profile-container entrWrapper">
      {/* <ToastContainer position="top-right" /> */}
      <p className="subheadingPG mb-2 d-flex justify-content-between align-items-center">
        BOOKINGS
      </p>
      <hr className="mt-0" />
      <CustomTable
        data={filteredData}
        columns={columns}
        loading={loading}
        search={search}
        onSearchChange={setSearch}
        filterComponent={filterComponent}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: filteredData.length,
          onChange: handlePageChange,
        }}
      />
    </div>
  );
}
