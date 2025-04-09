import React, { useState } from "react";
import moment from "moment";
import CustomTable from "../CustomTable";
import { Select } from "antd";
const { Option } = Select;
export default function BookingDataContainer({
  bookingRequests,
  loading,
  formatTime,
}) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const handleStatusChange = (value) => {
    setStatusFilter(value);
  };

  const filteredData = bookingRequests.filter((item) => {
    const matchesSearch = item.name?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || item.status?.toLowerCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
      title:"Event",
      dataIndex: "event_title",
      key: "event_title",
      render: (text) => text || "N/A",
    },
    {
      title: "Type of Performance",
      dataIndex: "performanceRole",
      key : "performanceRole",
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
      width:60,
      render: (status) => (
        <span
          className={`badge ${status === "confirmed"
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
      width: 120,
      render: (_, record) => (
        <div className="d-flex">
        <button type="button" className="btn btn-outline-success btn-sm me-2 rounded-3">
          {/* <i className="fa-solid fa-check"></i> */}
          Approve
        </button>
        <button type="button" className="btn btn-outline-danger btn-sm rounded-3">
        {/* <i className="fa-solid fa-xmark"></i> */}
        Reject
      </button>
      </div>
      ),
    },
  ];

  const filterComponent = (
    <Select
      value={statusFilter}
      onChange={handleStatusChange}
      style={{ width: 100 }}
    >
      <Option value="all">Filter</Option>
      <Option value="pending">Pending</Option>
      <Option value="confirmed">Confirmed</Option>
      <Option value="declined">Declined</Option>
    </Select>
  );

  // const filteredData = bookingRequests.filter((item) =>
  //   item.name?.toLowerCase().includes(search.toLowerCase())
  // );

  return (
    <div className="entertainer-profile-container">
      <p className="subheadingPG mb-2 d-flex justify-content-between align-items-center">BOOKINGS</p>
      <hr className="mt-0" />
      <CustomTable
        data={filteredData}
        columns={columns}
        loading={loading}
        search={search}
        onSearchChange={setSearch}
        filterComponent={filterComponent}
        pagination={{
          current: 1,
          pageSize: 10,
          total: filteredData.length,
        }}
      />
    </div>
  );
}

