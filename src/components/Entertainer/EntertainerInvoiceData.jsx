// import React from 'react'
// import CustomTable from '../CustomTable';

// export default function EntertainerInvoiceData() {
//       const columns = [
//         {
//           title: "Invoice Number",
//           dataIndex: "date",
//           key: "date",
//           render: (date) => moment(date).format("DD-MMM-YYYY"),
//         },
//         {
//           title: "Status",
//           dataIndex: "name",
//           key: "name",
//           render: (text) => text || "N/A",
//         },
//         {
//           title: "Date",
//           dataIndex: "performanceRole",
//           key : "performanceRole",
//           render: (text) => text || "N/A",
//         },
//         {
//           title: "Belong To",
//           key: "duration",
//           render: (_, record) => {
//             const start = moment(record.event_startTime);
//             const end = moment(record.event_endTime);
//             const duration = moment.duration(end.diff(start));
//             const hours = duration.hours();
//             const minutes = duration.minutes();
        
//             let result = '';
//             if (hours) result += `${hours}hr `;
//             if (minutes) result += `${minutes}m`;
        
//             return result.trim() || '0m'; // fallback in case both are 0
//           },
//         },
        
        
//         {
//           title: "Total",
//           dataIndex: "status",
//           key: "status",
//           width:120,
//           render: (status) => (
//             <span
//               className={`badge ${
//                 status === "confirmed"
//                   ? "badge-confirmed"
//                   : status === "pending"
//                   ? "badge-pending"
//                   : "badge-declined"
//               }`}
//             >
//               {status || "N/A"}
//             </span>
//           ),
//         },
//         {
//           title: "Action",
//           key: "action",
//           width:80,
//           render: (_, record) => (
//             <a href="#" className="btn btn-outline-secondary btn-sm">
//               <i className="fa-solid fa-eye"></i>
//             </a>
//           ),
//         },
//       ];
//   return (
//     <>
//         <div className="entertainer-profile-container">
//       <p className="fw-bold mb-0">INVOICE LIST</p>
//       <hr />
//       <CustomTable
//             //   data={filteredData}
//               columns={columns}
//             //   loading={loading}
//             //   search={search}
//             //   onSearchChange={setSearch}
//               pagination={{
//                 current: 1,
//                 pageSize: 10,
//                 // total: filteredData.length,
//               }}
//       />
//       </div>
//     </>
//   )
// }

import React from 'react';
import moment from 'moment';
import CustomTable from '../CustomTable';
import { width } from '@fortawesome/free-solid-svg-icons/fa0';

export default function EntertainerInvoiceData({ invoices = [], loading }) {
    const columns = [
        {
          title: "Invoice Number",
          dataIndex: "invoice_number",
          key: "invoice_number",
          render: (text) => text || "N/A",
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
                {status}
              </span>
            ),
          },
        {
          title: "Date",
          dataIndex: "issue_date",
          key: "issue_date",
          render: (date) => moment(date).format("DD-MMM-YYYY"),
        },
        {
          title: "Belong To",
          dataIndex: "user_type",
          key: "user_type",
          render: (text) => text || "N/A",
        },
        {
            title: "Total",
            dataIndex: "total_with_tax",
            key: "total_with_tax",
            render: (text) => `$${text}`,
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
      

  return (
    <div className="entertainer-profile-container w-100">
      <p className="fw-bold mb-0">INVOICE LIST</p>
      <hr />
      <CustomTable
        data={invoices}
        columns={columns}
        loading={loading}
        pagination={{
          current: 1,
          pageSize: 10,
          total: invoices.length,
        }}
      />
    </div>
  );
}
