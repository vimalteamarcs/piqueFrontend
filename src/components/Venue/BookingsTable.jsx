// import React, { useState } from "react";
// import moment from "moment";
// import CustomTable from "../CustomTable";
// import { Button } from "antd";

// export default function BookingsTable({
//   bookings,
//   loading,
//   error,
//   onViewEntertainer,
// }) {
//   const [search, setSearch] = useState(""); // For search input
//   const [currentPage, setCurrentPage] = useState(1); // For current page in pagination
//   const pageSize = 10; // Page size

//   // Filtered bookings based on search input (search across all fields)
//   const filteredBookings = bookings.filter((booking) => {
//     return (
//       Object.values(booking)
//         .join(" ") // Combine all values as a single string
//         .toLowerCase()
//         .includes(search.toLowerCase())
//     );
//   });

//   // Handle page change
//   const handleTableChange = (pagination) => {
//     setCurrentPage(pagination.current);
//   };


//   const columns = [
//     {
//       title: "Entertainer",
//       dataIndex: "name",
//       key: "name",
//     },
//     {
//       title: "Event Title",
//       dataIndex: "event_title",
//       key: "event_title",
//     },
//     {
//       title: "Status",
//       dataIndex: "status",
//       key: "status",
//       render: (status) => (
//         <span
//           className={`status-badge status-${status.replace(" ", "-").toLowerCase()}`}
//         >
//           {status}
//         </span>
//       ),
//     },
//     {
//       title: "Date",
//       dataIndex: "showDate",
//       key: "showDate",
//       render: (showDate) =>
//         moment.utc(showDate).format("DD-MMM-YYYY").toUpperCase(),
//     },
//     {
//       title: "Time",
//       dataIndex: "showTime",
//       key: "showTime",
//       render: (showTime) =>
//         new Date(`1970-01-01T${showTime}`).toLocaleTimeString([], {
//           hour: "2-digit",
//           minute: "2-digit",
//           hour12: true,
//         }),
//     },
//     {
//       title: "Price Per Event",
//       dataIndex: "pricePerEvent",
//       key: "pricePerEvent",
//       render: (price) => `$${price}`,
//     },
//     {
//       title: "Action",
//       dataIndex: "actions",
//       key: "actions",
//       render: (_, record) => (
//         <Button
//           type="button"
//           className="btn btn-outline-dark btn-sm"
//           onClick={() => onViewEntertainer(record)}
//         >
//           <i className="fa-regular fa-pen-to-square"></i>
//         </Button>
//       ),
//     },
//   ];

//   return (

//     <div className="row">
//       <div className="col-md-12">
//         {loading ? (
//           <div className="d-flex justify-content-center my-5">
//             <div className="spinner-grow text-dark" role="status">
//               <span className="visually-hidden">Loading...</span>
//             </div>
//           </div>
//         ) : error ? (
//           <p className="text-center text-danger">{error}</p>
//         ) : bookings.length > 0 ? (
//           <CustomTable
//           data={filteredBookings.slice(
//             (currentPage - 1) * pageSize,
//             currentPage * pageSize
//           )}
//           columns={columns}
//           loading={loading}
//           pagination={{
//             current: currentPage,
//             pageSize: pageSize,
//             total: filteredBookings.length,
//             onChange: handleTableChange,
//             showSizeChanger: false,
//           }}
//           search={search}
//           onSearchChange={(value) => setSearch(value)}
//         />
//         ) : (
//           <div className="text-danger">No bookings yet.</div>
//         )}
//       </div>
//     </div>
//   );
// }

import React, { useState } from "react";
import moment from "moment";
import CustomTable from "../CustomTable";
import { Button } from "antd";

export default function BookingsTable({
  bookings,
  loading,
  error,
  onViewEntertainer,
  handleBookingResponse
}) {
  const [search, setSearch] = useState(""); // For search input
  const [currentPage, setCurrentPage] = useState(1); // For current page in pagination
  const pageSize = 10; // Page size

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
    // {
    //   title: "Status",
    //   dataIndex: "status",
    //   key: "status",
    //   render: (status) => (
    //     <span
    //       className={`status-badge status-${status.replace(" ", "-").toLowerCase()}`}
    //     >
    //       {status}
    //     </span>
    //   ),
    // },



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
    },
    
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
    <div className="row">
      <div className="col-md-12">
        {loading ? (
          <div className="d-flex justify-content-center my-5">
            <div className="spinner-grow text-dark" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : error ? (
          <p className="text-center text-danger">{error}</p>
        ) : bookings.length > 0 ? (
          <CustomTable
          data={filteredBookings.slice((currentPage - 1) * pageSize, currentPage * pageSize)}
          columns={columns}  // Assuming your columns do not define actions already
          loading={loading}
          onEdit={handleBookingResponse}  // Ensure this is passed down as expected
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: filteredBookings.length,
            onChange: handleTableChange,
            showSizeChanger: false,
          }}
          search={search}
          onSearchChange={(value) => setSearch(value)}
        />
        
        ) : (
          <div className="text-danger">No bookings yet.</div>
        )}
      </div>
    </div>
  );
}


