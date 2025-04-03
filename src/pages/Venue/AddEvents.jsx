import React, { useState } from "react";
import DashLayoutVenue from "../../components/Venue/DashLayoutVenue";
import SearchBar from "../../components/Venue/SearchBar";
import ProfileSidebar from "../../components/Venue/ProfileSidebar";
import { useNavigate } from "react-router-dom";
import Input from "../../components/Input";
import Button from "../../components/Button";
import axios from "axios";
import Select from "../../components/Select";

export default function AddEvents() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    startTime: "",
    endTime: "",
    location: "",
    description: "",
    status: "",
    recurring:"",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setErrors({
      ...errors,
      [e.target.name]: "",
    });
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

    if (!formData.location.trim()) {
      newErrors.location = "Location is required.";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return; 
    }

    setLoading(true);

    const requestBody = {
      venueId: Number(localStorage.getItem('venueId')),
      title: formData.title,
      startTime: `${formData.startTime}:00Z`,
      endTime: `${formData.endTime}:00Z`,
      location: formData.location,
      description: formData.description,
      recurring: formData.recurring,
      status: formData.status,
      isAdmin: false,
    };
    console.log("Request body:", requestBody);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(`${import.meta.env.VITE_API_URL}event`, requestBody, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("Event added successfully:", response.data);
      navigate('/venue/events')
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <DashLayoutVenue
        title="Profile"
        description="View and manage your profile"
      >
        <div className="container-fluid d-flex flex-column min-vh-100 p-0">
          <SearchBar />
          <div className="d-flex">
            <div className="sidebar-container">
              <ProfileSidebar />
            </div>
            <div className="profile-container">
              <p className="fw-semibold">ADD EVENT FORM</p>
              <hr />
              <p
                className="fw-semibold icon-font mt-3 text-muted"
                onClick={() => navigate(-1)}
                style={{ cursor: "pointer" }}
              >
                <i className="fa-solid fa-angle-left me-2"></i>Back to Events
                List
              </p>

              {/* event form */}
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-12">
                    <label className="profile-font fw-semibold">Event Title<span style={{ color: "red", display: "inline" }}>*</span></label>
                    <Input
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      className={`form-control profile-font ${errors.title ? "is-invalid" : ""}`}
                      placeholder="Enter event title"
                    />
                    {errors.title && <div className="text-danger">{errors.title}</div>}
                  </div>
                </div>

                <div className="row mt-3">
                  <div className="col-md-6">
                    <label className="profile-font fw-semibold">Start Time and Date<span style={{ color: "red", display: "inline" }}>*</span></label>
                    <Input
                      type="datetime-local"
                      name="startTime"
                      value={formData.startTime}
                      onChange={handleChange}
                      className={`form-control profile-font ${errors.startTime ? "is-invalid" : ""}`}
                    />
                    {errors.startTime && <div className="text-danger">{errors.startTime}</div>}
                  </div>

                  <div className="col-md-6">
                    <label className="profile-font fw-semibold">End Time and Date<span style={{ color: "red", display: "inline" }}>*</span></label>
                    <Input
                      type="datetime-local"
                      name="endTime"
                      value={formData.endTime}
                      onChange={handleChange}
                      className={`form-control profile-font ${errors.endTime ? "is-invalid" : ""}`}
                    />
                    {errors.endTime && <div className="text-danger">{errors.endTime}</div>}
                  </div>
                </div>

                <div className="row mt-3">
                  <div className="col-md-6">
                    <label className="fw-semibold profile-font">Recurring<span style={{ color: "red", display: "inline" }}>*</span></label>
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

                  <div className="col-md-6">
                    <label className="fw-semibold profile-font">Status<span style={{ color: "red", display: "inline" }}>*</span></label>
                    <Select
                      name="status"
                      value={formData.status}
                      className={`form-control profile-font ${errors.status ? "is-invalid" : ""}`}
                      onChange={handleChange}
                      options={[
                        { value: "unpublished", label: "Unpublished" },
                        { value: "scheduled", label: "Scheduled" },
                        { value: "cancelled", label: "Cancelled" },
                        { value: "confirmed", label: "Confirmed" },
                        { value: "completed", label: "Completed" },
                      ]}
                      defaultOption="--Select Status--"
                    />
                  {errors.status && <div className="text-danger">{errors.status}</div>}
                  </div>
                </div>

                <div className="row mt-3">
                  <div className="col-md-6">
                    <label className="fw-semibold profile-font">Location<span style={{ color: "red", display: "inline" }}>*</span></label>
                    <Input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className={`form-control profile-font ${errors.location ? "is-invalid" : ""}`}
                      placeholder="Enter event location"
                    />
                    {errors.location && <div className="text-danger">{errors.location}</div>}
                  </div>
                  <div className="col-md-6">
                    <label className="fw-semibold profile-font">Description<span style={{ color: "red", display: "inline" }}>*</span></label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      className={`form-control profile-font ${errors.description ? "is-invalid" : ""}`}
                      placeholder="Enter event description"
                      rows="1"
                    />
                    {errors.description && <div className="text-danger">{errors.description}</div>}
                  </div>
                </div>
                <Button type="submit" className="btn venue-btn btn-sm profile-font mt-3" label="Submit" />
              </form>
            </div>
          </div>
        </div>
      </DashLayoutVenue>
    </>
  );
}
