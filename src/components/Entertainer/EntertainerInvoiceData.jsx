import React, { useState } from 'react';
import moment from 'moment';
import CustomTable from '../CustomTable';
import { useNavigate } from 'react-router-dom';

export default function EntertainerInvoiceData({ invoices = [], loading }) {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState("");
 
  const handleView = (record) => {
    console.log("Viewing event:", record);
    navigate('/entertainer/invoicepage',{ state: record })
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value.toLowerCase());
  };

  const filteredData = invoices.filter((item) => {
    const searchText = searchTerm.toLowerCase();

    const invoiceNumber = item.invoice_number?.toLowerCase() || "";
    const status = item.status?.toLowerCase() || "";
    const date = item.issue_date ? moment(item.issue_date).format("DD-MMM-YYYY").toLowerCase() : "";
    const userType = item.user_type?.toLowerCase() || "";
    const total = item.total_with_tax?.toString().toLowerCase() || "";

    return (
      invoiceNumber.includes(searchText) ||
      status.includes(searchText) ||
      date.includes(searchText) ||
      userType.includes(searchText) ||
      total.includes(searchText)
    );
  });

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
      width: 80,
      render: (status) => (
        <span
          className={`badge ${status === "confirmed"
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
    // {
    //   title: "Action",
    //   key: "action",
    //   render: (_, record) => (
    //     <a href="#" className="btn btn-outline-secondary btn-sm">
    //       <i className="fa-solid fa-eye"></i>
    //     </a>
    //   ),
    // },
  ];


  return (
    <div className="entertainer-profile-container entrWrapper">
      <p className="subheadingPG mb-2 d-flex justify-content-between align-items-center">INVOICE LIST</p>
      <hr className='mt-0' />
      <CustomTable
        data={filteredData}
        columns={columns}
        loading={loading}
        search={searchTerm}
        onSearchChange={handleSearchChange}
        onView={handleView}
        pagination={{
          current: 1,
          pageSize: 10,
          total: invoices.length,
        }}
      />
    </div>
  );
}
