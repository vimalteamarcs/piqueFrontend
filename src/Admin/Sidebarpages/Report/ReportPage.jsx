import { useState, useEffect } from "react";
import axios from "axios";
import DashLayout from "../../DashLayout";
import * as XLSX from "xlsx";
import {
  CURRENCY_SIGN,
  DOWNLOAD_REPORT,
  GET_REPORT,
} from "../../../../constants";
import AdminSideBar from "../../../components/Venue/AdminSideBar";
import CustomTable from "../../../components/CustomTable";

const ReportPage = () => {
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [search, setSearch] = useState("");
  const [from, setFrom] = useState(new Date().toISOString().slice(0, 7));
  const [to, setTo] = useState(new Date().toISOString().slice(0, 7));
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  // Added  a Debouncing function
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500); // Adjust delay as needed

    return () => {
      clearTimeout(handler);
    };
  }, [search]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}${GET_REPORT}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            params: { from: from, to: to, search: search },
          }
        );
        console.log("Response Data ", response.data, Date.now());
        setReportData(response.data.data);

        setPagination({
          current: response.data.pagination.currentPage,
          pageSize: response.data.pagination.perPage,
          total: response.data.pagination.totalItems,
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [to, from, debouncedSearch]);

  useEffect(() => {
    if (from > to) {
      setError("To date cannot be earlier than From date.");
      return;
    } else {
      setError(null);
    }
  }, [reportData, from, to]);

  // Ant Table Column
  const columns = [
    {
      title: "Date",
      dataIndex: "event_startTime",
      key: "title",
      render: (text) => {
        if (!text) return "";
        const date = new Date(text);
        return `${date.getDate()}-${date.toLocaleString("en-GB", {
          month: "short",
        })}-${date.getFullYear()}`;
      },
    },
    {
      title: "Time",
      dataIndex: "event_startTime",
      key: "time",
      render: (text) => {
        if (!text) return "";
        const date = new Date(text);
        return `${date.getHours()}:${date
          .getMinutes()
          .toString()
          .padStart(2, "0")}`;
      },
    },
    {
      title: "Event",
      dataIndex: "event_title",
      key: "event",
      render: (text) => text ?? "",
    },
    {
      title: "Type",
      dataIndex: "event_recurring",
      key: "recurring",
      render: (text) => text ?? "",
    },
    {
      title: "Location",
      dataIndex: "venue_name",
      key: "location",
      render: (text) => text ?? "",
    },
    {
      title: "Entertainer",
      dataIndex: "entertainer_name",
      key: "ent",
      render: (text) => text ?? "",
    },
    {
      title: "Location Confirmation",
      dataIndex: "venue_confirmation_date",
      key: "loc_conf",
      render: (text) => {
        if (!text) return "";
        const date = new Date(text);
        return `${date.getDate()}-${date.toLocaleString("en-GB", {
          month: "short",
        })}-${date.getFullYear()}`;
      },
    },
    {
      title: "Entertainer Confirmation",
      dataIndex: "entertainer_confirmation_date",
      key: "ent_conf",
      render: (text) => {
        if (!text) return "";
        const date = new Date(text);
        return `${date.getDate()}-${date.toLocaleString("en-GB", {
          month: "short",
        })}-${date.getFullYear()}`;
      },
    },
    {
      title: "Venue Invoice No",
      dataIndex: "venue_invoice_number",
      key: "venue_invoice_number",
      render: (text) => text ?? "",
    },
    {
      title: "Amount",
      dataIndex: "venue_total_amount",
      key: "amount",
      render: (text) => text ?? "",
    },
    {
      title: "Payment Status",
      dataIndex: "venue_invoice_status",
      key: "payment_status",
      render: (text) => text ?? "",
    },
    {
      title: "Payment Date",
      dataIndex: "venue_payment_date",
      key: "payment_date",
      render: (text) => {
        if (!text) return "";
        const date = new Date(text);
        return `${date.getDate()}-${date.toLocaleString("en-GB", {
          month: "short",
        })}-${date.getFullYear()}`;
      },
    },
    {
      title: "Payment Method",
      dataIndex: "venue_payment_method",
      key: "payment_method",
      render: (text) => text ?? "",
    },
    {
      title: "Cheque/DD No",
      key: "cheque_or_dd_number",
      render: (text) => text ?? "",
    },
    {
      title: "Ent Invoice",
      dataIndex: "ent_invoice_number",
      key: "ent_invoice",
      render: (text) => text ?? "",
    },
    {
      title: "Ent Payment",
      dataIndex: "ent_total_amount",
      key: "ent_payment",
      render: (text) => text ?? "",
    },
    {
      title: "Ent Payment Status",
      dataIndex: "ent_invoice_status",
      key: "ent_payment_status",
      render: (text) => text ?? "",
    },
    {
      title: "Ent Payment Date",
      dataIndex: "ent_payment_date",
      key: "ent_payment_date",
      render: (text) => {
        if (!text) return "";
        const date = new Date(text);
        return `${date.getDate()}-${date.toLocaleString("en-GB", {
          month: "short",
        })}-${date.getFullYear()}`;
      },
    },
    {
      title: "Ent Payment Method",
      key: "ent_payment_method",
      render: (text) => text ?? "",
    },
    {
      title: "Ent Cheque/DD No",
      key: "ent_cheque",
      render: (text) => text ?? "",
    },
  ];

  const downloadExcel = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}${DOWNLOAD_REPORT}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          params: { from: from, to: to },
          responseType: "blob",
        }
      );
      console.log("Blob", new Blob([response.data]));
      const url = window.URL.createObjectURL(new Blob([response.data]));
      console.log("url", url);
      const a = document.createElement("a");
      a.href = url;
      a.download = "Annual_Report.xlsx";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error("Download failed", error);
    }
  };

  <button onClick={downloadExcel}>Download Report</button>;

  return (
    <>
      <DashLayout />
      <div className="container-fluid w-100 p-0">
        <div className="pageLayout">
          <div className="dash-sidebar-container">
            <AdminSideBar />
          </div>
          <div className="dash-profile-container">
            {loading ? (
              <div className="d-flex justify-content-center my-5">
                <div className="spinner-grow text-dark" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              <>
                <div className="d-flex justify-content-between my-3">
                  <div className="d-flex gap-2">
                    <input
                      type="month"
                      className="form-control w-auto"
                      value={from}
                      onChange={(e) => setFrom(e.target.value)}
                    />
                    <input
                      type="month"
                      className="form-control w-auto"
                      value={to}
                      onChange={(e) => setTo(e.target.value)}
                    />
                    <button
                      className="btn btn-success btn-sm h-50 mt-4 ms-3"
                      onClick={downloadExcel}
                    >
                      Download Excel
                    </button>
                  </div>
                </div>
                <CustomTable
                  columns={columns}
                  data={reportData}
                  pagination={pagination}
                  search={search}
                  onSearchChange={(value) => {
                    setSearch(value);
                    setPagination((prev) => ({
                      ...prev,
                      current: 1, // Reset to first page on search
                    }));
                  }}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ReportPage;
