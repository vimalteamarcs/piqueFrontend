import React from "react";
import AdminSideBar from "../../../components/Venue/AdminSideBar";
import { ToastContainer } from "react-toastify";
import DashLayout from "../../DashLayout";

export default function VenueRequestApproval() {
  return (
    <>
      <DashLayout />
      <ToastContainer />
      <div className="container-fluid w-100 p-0">
        <div className="pageLayout">
          <div className="dash-sidebar-container">
            <AdminSideBar />
          </div>
          <div className="dash-profile-container">
            <p className="headingPG mb-2 d-flex justify-content-between align-items-center">
              APPROVE REQUESTS
            </p>
            <div className="card">
              <div className="card-body">
                <div className="row">
                  <div className="col-md-12"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
