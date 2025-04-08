import React, { useState } from "react";
import moment from "moment";
import CustomTable from "../CustomTable";

export default function BookingDataContainer({
  bookingRequests,
  loading,
  formatTime,
}) {
  const [search, setSearch] = useState("");

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
      title: "Type of Performance",
      dataIndex: "performanceRole",
      key : "performanceRole",
      width: 90,
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
    
        let result = '';
        if (hours) result += `${hours}hr `;
        if (minutes) result += `${minutes}m`;
    
        return result.trim() || '0m'; // fallback in case both are 0
      },
    },
    
    
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width:80,
      render: (status) => (
        <span
          className={`badge ${
            status === "confirmed"
              ? "badge-confirmed"
              : status === "pending"
              ? "badge-pending"
              : "badge-declined"
          }`}
        >
          {status || "N/A"}
        </span>
      ),
    },
    {
      title: "Action",
      key: "action",
      width:120,
      render: (_, record) => (
        <div className="d-flex">
        <a href="#" className="btn btn-outline-success btn-sm me-2 rounded-3">
          {/* <i className="fa-solid fa-check"></i> */}
          Approve
        </a>
        <a href="#" className="btn btn-outline-danger btn-sm rounded-3">
        {/* <i className="fa-solid fa-xmark"></i> */}
        Reject
      </a>
      </div>
      ),
    },
  ];

  const filteredData = bookingRequests.filter((item) =>
    item.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="entertainer-profile-container">
      <p className="fw-bold mb-0">BOOKINGS</p>
      <hr />
      <CustomTable
        data={filteredData}
        columns={columns}
        loading={loading}
        search={search}
        onSearchChange={setSearch}
        pagination={{
          current: 1,
          pageSize: 10,
          total: filteredData.length,
        }}
      />
    </div>
  );
}

