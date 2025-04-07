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
      title: "Venue",
      dataIndex: "name",
      key: "name",
      render: (text) => text || "N/A",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
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
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (date) => moment(date).format("DD-MMM-YYYY"),
    },
    {
      title: "Time",
      dataIndex: "showTime",
      key: "showTime",
      render: (time) => formatTime(time),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <a href="#" className="btn btn-outline-secondary btn-sm">
          <i className="fa-solid fa-eye"></i>
        </a>
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

