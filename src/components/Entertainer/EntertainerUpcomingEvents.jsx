import React from 'react';
import moment from 'moment';
import CustomTable from '../CustomTable';

export default function EntertainerUpcomingEvents({ events = [], loading }) {
  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (text) => text || "N/A",
    },
    {
        title: "Location",
        dataIndex: "location",
        key: "location",
        render: (text) => text || "N/A",
      },

    {
      title: "Date",
      dataIndex: "startTime",
      key: "startTime",
      render: (date) => moment(date).format("DD-MMM-YYYY"),
    },
    {
        title: "Duration",
        key: "duration",
        render: (_, record) => {
          const start = moment(record.startTime);
          const end = moment(record.endTime);
          const duration = moment.duration(end.diff(start));
      
          const days = Math.floor(duration.asDays());
      
          if (days >= 1) {
            return `${days}d`;
          } else {
            const hours = duration.hours();
            const minutes = duration.minutes();
            let result = "";
      
            if (hours > 0) result += `${hours}hr `;
            if (minutes > 0) result += `${minutes}min`;
      
            return result.trim() || "0min";
          }
        },
      },
      {
        title: "Recurring",
        dataIndex: "recurring",
        key: "recurring",
        render: (text) => text || "N/A",
      },
      

    {
        title: "Status",
        dataIndex: "status",
        key: "status",
        width: 80,
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
            {status}
          </span>
        ),
      },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <button className="btn btn-outline-secondary btn-sm">
          <i className="fa-solid fa-eye"></i>
        </button>
      ),
    },
  ];

  return (
    <div className="entertainer-profile-container w-100">
      <p className="fw-bold mb-0">UPCOMING EVENTS</p>
      <hr />
      <CustomTable
        data={events}
        columns={columns}
        loading={loading}
        pagination={{
          current: 1,
          pageSize: 10,
          total: events.length,
        }}
      />
    </div>
  );
}
