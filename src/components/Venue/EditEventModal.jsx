import React, { useEffect, useState } from "react";
import axios from "axios";
import Input from "../Input";
import Select from "../Select";

export default function EditEventModal({ event, onClose, fetchEvents }) {
  const [errors, setErrors] = useState({});
  const formatDateTimeLocal = (dateTime) => {
    if (!dateTime) return "";
    const date = new Date(dateTime);
    return date.toISOString().slice(0, 16);
  };

  const [formData, setFormData] = useState({
    title: event.title || "",
    startTime: formatDateTimeLocal(event.startTime),
    endTime: formatDateTimeLocal(event.endTime),
    location: event.location || "",
    status: event.status || "pending",
    recurring: event.recurring || "none",
    description: event.description || "",
    eventId: Number(event.id) || 0,
    isAdmin: false,
  });

  useEffect(() => {
    setFormData({
      title: event.title || "",
      startTime: formatDateTimeLocal(event.startTime),
      endTime: formatDateTimeLocal(event.endTime),
      location: event.location || "",
      status: event.status || "pending",
      recurring: event.recurring || "none",
      eventId: Number(event.id) || 0,
      isAdmin: false,
    });
  }, [event]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: value.trim() ? "" : prevErrors[name] // Clears error when value is valid
    }));
  };
  

  const validateForm = () => {
    let newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Event title is required.";
    }

    if (!formData.startTime) {
      newErrors.startTime = "Start time and date is required.";
    }

    if (!formData.endTime) {
      newErrors.endTime = "End time and date is required.";
    } else {
      const startDateTime = new Date(formData.startTime);
      const endDateTime = new Date(formData.endTime);
  
      if (endDateTime < startDateTime) {
        newErrors.endTime = "End date and time must be after the start date and time.";
      } else {
        const startDate = formData.startTime.split("T")[0];
        const endDate = formData.endTime.split("T")[0];
  
        if (startDate === endDate) {
          const startTime = formData.startTime.split("T")[1];
          const endTime = formData.endTime.split("T")[1];
  
          if (endTime <= startTime) {
            newErrors.endTime = "End time must be after the start time when the date is the same.";
          }
        }
      }
    }

    if (!formData.recurring) {
      newErrors.recurring = "Recurring type is required.";
    }

    if (!formData.status) {
      newErrors.status = "Status is required.";
    }

    if (!formData.location) {
      newErrors.location = "Location is required.";
    }

    if (!formData.description) {
      newErrors.description = "Description is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return; 
    }
    const token = localStorage.getItem("token");
    console.log("data:", formData)
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}event`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      fetchEvents();
      onClose();
    } catch (error) {
      console.error("Error updating event:", error);
    }
  };

  return (
    <>
    <div className="modal-backdrop fade show"></div>
    <div
      className="modal fade show d-block"
      tabIndex="-1"
     
    >
      <div className="modal-dialog" >
        <div className="modal-content pe-2 ps-2">
          <div className="modal-header">
            <h5 className="modal-title">Edit Event</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            <div className="mb-3">
              <label className="form-label profile-font fw-semibold">
                Event Name<span style={{ color: "red", display: "inline" }}>*</span>
              </label>
              <Input
                type="text"
                className={`form-control profile-font ${errors.title ? "is-invalid" : ""}`}
                name="title"
                value={formData.title}
                onChange={handleChange}
              />
              {errors.title && <div className="text-danger">{errors.title}</div>}
            </div>

            <div className="mb-3">
              <label className="form-label profile-font fw-semibold">
                Start Time<span style={{ color: "red", display: "inline" }}>*</span>
              </label>
              <Input
                type="datetime-local"
                className={`form-control profile-font ${errors.startTime ? "is-invalid" : ""}`}
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
              />
              {errors.startTime && <div className="text-danger">{errors.startTime}</div>}
            </div>

            <div className="mb-3">
              <label className="form-label profile-font fw-semibold">
                End Time<span style={{ color: "red", display: "inline" }}>*</span>
              </label>
              <Input
                type="datetime-local"
                className={`form-control profile-font ${errors.endTime ? "is-invalid" : ""}`}
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
              />
              {errors.endTime && <div className="text-danger">{errors.endTime}</div>}
            </div>

            <div className="mb-3">
              <label className="form-label profile-font fw-semibold">
                Location<span style={{ color: "red", display: "inline" }}>*</span>
              </label>
              <Input
                type="text"
                className={`form-control profile-font ${errors.location ? "is-invalid" : ""}`}
                name="location"
                value={formData.location}
                onChange={handleChange}
              />
              {errors.location && <div className="text-danger">{errors.location}</div>}
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold profile-font">Status<span style={{ color: "red", display: "inline" }}>*</span></label>
              <Select
                name="status"
                value={formData.status}
                className={`form-control profile-font ${errors.status ? "is-invalid" : ""}`}
                onChange={handleChange}
                options={[
                  { value: "pending", label: "Pending" },
                  { value: "confirmed", label: "Confirmed" },
                  { value: "cancelled", label: "Cancelled" },
                  { value: "completed", label: "Completed" },
                ]}
                defaultOption="--Select Status--"
              />
              {errors.status && <div className="text-danger">{errors.status}</div>}
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold profile-font">
                Recurring<span style={{ color: "red", display: "inline" }}>*</span>
              </label>
              <Select
                name="recurring"
                value={formData.recurring}
                className={`form-control profile-font ${errors.recurring ? "is-invalid" : ""}`}
                onChange={handleChange}
                options={[
                  { value: "none", label: "None" },
                  { value: "daily", label: "Daily" },
                  { value: "weekly", label: "Weekly" },
                  { value: "monthly", label: "Monthly" },
                ]}
                defaultOption="--Select Recurring Type--"
              />
              {errors.recurring && <div className="text-danger">{errors.recurring}</div>}
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Close
            </button>
            <button
              type="button"
              className="btn btn-primary mybtn"
              onClick={handleSave}
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
