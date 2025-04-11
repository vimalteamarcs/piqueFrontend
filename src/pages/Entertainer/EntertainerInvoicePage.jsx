import React from 'react'
import DashLayoutEnter from '../../components/Entertainer/DashLayoutEnter'
import EnterAccountSidebar from '../../components/Entertainer/EnterAccountSidebar'
import { useLocation, useNavigate } from 'react-router-dom';
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { ToastContainer } from 'react-toastify';

export default function EntertainerInvoicePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const invoicedata = location.state;

  const handleDownloadPDF = () => {
    const invoiceDiv = document.querySelector(".invoice-container");

    if (!invoiceDiv) {
      alert("Invoice data is missing!");
      return;
    }

    html2canvas(invoiceDiv, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("invoice.pdf");
    });
  };
  return (
    <>
              <DashLayoutEnter
        title="Profile"
        description="View and manage your profile"
      >
        <div className="container d-flex">
          <EnterAccountSidebar/>
          <div className="entertainer-profile-container entrWrapper">
          <p className="subheadingPG mb-2 d-flex justify-content-between align-items-center">
            {" "}
            INVOICE PAGE{" "}
          </p>
          <hr className="mt-0 mb-2" />
          <div className="mb-2">
              <p
                className=" d-flex align-items-center"
                onClick={() => navigate('/entertainer/invoice')}
                style={{ cursor: "pointer" }}
              >
                <i
                  className="fa-solid fa-chevron-left me-2"
                ></i>Back
              </p>
            </div>
            <div className="card">
              <div className="card-body">

                <div className="d-flex justify-content-between mb-2 mt-1">
                  <p className="fw-semibold profile-font mt-1">
                    INVOICE: {invoicedata.invoice_number}
                  </p>
                  <button
                    className="btn mybtn"
                    onClick={handleDownloadPDF}
                  >
                    Download <i className="fa fa-download"></i>
                  </button>
                </div>

                <ToastContainer />
                <div
                  className="mt-3"
                // style={{ maxHeight: "400px", overflowY: "auto" }}
                >
                  {invoicedata ? (
                    <div className="invoice-container profile-font">
                      <div className="border p-3 bg-light">
                        <h3 className="m-0" style={{ color: "darkblue" }}>
                          Invoice
                        </h3>
                        <div className="row align-items-center">
                          <div className="col-3">
                            <p className="text-wrap mb-0">
                              {invoicedata.name}
                              <br />
                              <small>
                                {invoicedata.addressLine1},{" "}
                                {invoicedata.addressLine2}, {invoicedata.zipCode}
                              </small>
                            </p>
                          </div>
                          <div className="col-3 text-start">
                            <small>
                              Email: {localStorage.getItem('email')}
                              <br />
                              Mobile: {localStorage.getItem('phone')}
                            </small>
                          </div>
                          <div className="col-6 text-end">
                            <img
                              src={`${import.meta.env.VITE_BASE
                                }assets/images/piquelogo.png`}
                              alt="logo"
                              className="img"
                            />
                          </div>
                        </div>
                        <br />
                        <br />
                        <div className="row">
                          <div className="col">
                            <h5 className="fw-bold" style={{ color: "darkblue" }}>
                              {invoicedata.event_name}
                            </h5>
                            <h6 className="fw-bold">Bill to</h6>
                            <p>
                              {invoicedata.entertainer_name} <br />{" "}
                              {invoicedata.name}
                            </p>
                          </div>
                          <div className="col text-end">
                            <h6 className="fw-bold">Ship to</h6>
                            <p>
                              {invoicedata.entertainer_name} <br />{" "}
                              {invoicedata.name}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="border p-3 my-3">
                        <h6 className="fw-bold">Invoice details</h6>
                        <p>Invoice no.: {invoicedata.invoice_number}</p>
                        <p>
                          Invoice date:{" "}
                          {/* {new Date(invoicedata.issue_date).toLocaleDateString()} */}
                          {new Date(invoicedata.issue_date).toLocaleString(
                            "en-GB",
                            {
                              day: "numeric",
                              month: "short", // "Mar" instead of "03"
                              year: "numeric",
                            }
                          )}
                        </p>
                        <p>
                          Due date:{" "}
                          {/* {new Date(invoicedata.due_date).toLocaleDateString()} */}
                          {new Date(invoicedata.due_date).toLocaleString("en-GB", {
                            day: "numeric",
                            month: "short", // "Mar" instead of "03"
                            year: "numeric",
                          })}
                        </p>
                      </div>

                      <table className="table">
                        <thead className="table-light">
                          <tr>
                            <th>#</th>
                            <th>Date</th>
                            <th>Product or service</th>
                            <th>Qty</th>
                            <th>Tax Rate</th>
                            <th>Tax Amount</th>
                            <th>Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>1</td>
                            <td>
                              {/* {new Date(invoicedata.issue_date).toLocaleDateString()} */}
                              {new Date(invoicedata.issue_date).toLocaleString(
                                "en-GB",
                                {
                                  day: "numeric",
                                  month: "short", // "Mar" instead of "03"
                                  year: "numeric",
                                }
                              )}
                            </td>
                            <td>
                              <strong className="text-warp">
                                {invoicedata.event_name}
                              </strong>
                            </td>
                            <td>1</td>
                            <td>{invoicedata.tax_rate}%</td>
                            <td>${invoicedata.tax_amount}</td>
                            <td>${invoicedata.total_amount}</td>
                          </tr>
                        </tbody>
                      </table>

                      <div className="text-end">
                        <h5 className="fw-bold">
                          Total: ${invoicedata.total_with_tax}
                        </h5>
                      </div>

                      <p className="mt-3 text-muted">
                        Thank you for your business. Checks can be mailed to my
                        company address, or I am happy to set up direct deposit with
                        ACH payments.
                      </p>
                    </div>
                  ) : (
                    <div className="alert alert-danger">
                      No invoice data available
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          </div>
          </DashLayoutEnter>
    </>
  )
}
