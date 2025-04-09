import React from 'react';
import moment from 'moment';
import CustomTable from '../CustomTable';

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
      <p className="subheadingPG mb-2 d-flex justify-content-between align-items-center">INVOICE LIST</p>
      <hr className='mt-0' />
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
