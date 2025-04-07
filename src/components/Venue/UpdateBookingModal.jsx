import React, { useState } from "react";
import axios from "axios";
import moment from "moment";
import Input from "../Input";
import { toast } from "react-toastify";

export default function UpdateBookingModal({ booking, onClose, refreshBookings }) {
  const [newShowDate, setNewShowDate] = useState(moment.utc(booking.showDate).format("YYYY-MM-DD"));
  const [newShowTime, setNewShowTime] = useState(
    moment(booking.showTime, "HH:mm:ss").format("HH:mm")
  );
  

  const handleUpdateBooking = async () => {
    const updatedBookingData = {
      bookingId: Number(booking.id),
      reqShowDate: newShowDate, // Format: YYYY-MM-DD
      reqShowTime: newShowTime, // Format: HH:mm
    };
  
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}venues/request-change`,
        updatedBookingData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      console.log("req response:", response);
  
      if (response.status === 201) {
        toast.success("Your Request has been registered successfully.");
        onClose();
        refreshBookings();
      } else {
        toast.error("Unexpected response from the server. Please try again.");
      }
    } catch (error) {
      console.error("Error updating booking:", error);
      toast.error("Failed to update booking. Please try again.");
    }
  };
  

  return (
    <>
<div className="modal-backdrop fade show"></div>
    <div className="modal fade show d-block" tabIndex="-1" role="dialog">
      <div className="modal-dialog" role="document">
        <div className="modal-content p-1">
          <div className="modal-header">
            <h6 className="modal-title">Update Show Date & Time</h6>
            <button
                      type="button"
                      className="btn-close"
                      onClick={onClose}
                      // disabled={isLoading}
                    ></button>
          </div>
          <div className="modal-body">
            <div className="form-group">
              <label className="profile-font fw-semibold">Show Date</label>
              <Input
                type="date"
                className="form-control profile-font"
                value={newShowDate}
                onChange={(e) => setNewShowDate(e.target.value)}
              />
            </div>
            <div className="form-group mt-2">
              <label className="profile-font fw-semibold">Show Time</label>
              <Input
                type="time"
                className="form-control profile-font"
                value={newShowTime}
                onChange={(e) => setNewShowTime(e.target.value)}
              />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-danger" onClick={onClose}>
              Close
            </button>
            <button type="button" className="btn btn-dark" onClick={handleUpdateBooking}>
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
