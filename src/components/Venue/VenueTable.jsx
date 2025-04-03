import React, { useEffect, useState } from "react";
import Button from "../Button";
import Input from "../Input";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function VenueTable({
  venues,
  selectedVenue,
  setSelectedVenue,
  handleEditClick,
  setVenues,
  loading,
}) {
  const [formData, setFormData] = useState({
    addressLine1: "",
    addressLine2: "",
    email: "",
    phone: "",
  });
  const [errors, setErrors] = useState({});
  const [venueToDelete, setVenueToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (selectedVenue) {
      setFormData({
        addressLine1: selectedVenue?.addressLine1 || "",
        addressLine2: selectedVenue?.addressLine2 || "",
        email: selectedVenue?.email || "",
        phone: selectedVenue?.phone || "",
      });
    }
  }, [selectedVenue]);

  // Handle input change
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
  
    if (!formData.addressLine1.trim()) {
      newErrors.addressLine1 = "Address Line 1 is required.";
    }
  
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }
  
    const phoneRegex = /^\d{10}$/;
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required.";
    } else if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = "Enter a valid 10-digit phone number.";
    }
  
    setErrors(newErrors);
  
    return Object.keys(newErrors).length === 0; // Returns true if no errors
  };

  // Function to handle API call
  const handleSaveChanges = async () => {
    if (!validateForm()) {
      return; // Stop submission if validation fails
    }
    setIsLoading(true);
    // console.log("isLoading set to true"); 

    const updatedData = {
      addressLine1: formData.addressLine1,
      addressLine2: formData.addressLine2,
      email: formData.email,
      phone: formData.phone,
      venueId: Number(selectedVenue.id),
    };
    console.log("updated data", updatedData)
    try {
      const token = localStorage.getItem("token");

      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}venues`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.status) {
        toast.success("Location updated successfully!");
        setVenues((prevVenues) => {
          if (!Array.isArray(prevVenues)) {
            console.error("prevVenues is not an array:", prevVenues);
            return [];
          }

          return prevVenues.map((venue) =>
            venue.id === selectedVenue.id ? { ...venue, ...formData } : venue
          );
        });

        setSelectedVenue(null);
      } else {
        toast.error("Failed to update location.");
      }
    } catch (error) {
      console.error("Error updating venue:", error);
      toast.error("An error occurred while updating the venue.");
    }finally {
      // console.log("isLoading set to false"); 
      setIsLoading(false);
    }
  };

  const handleDeleteVenue = async (venueId) => {
    console.log(venueId)
    if (!venueId) {
      toast.error("Invalid venue ID.");
      return;
    }
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}venues/${venueId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status) {
        toast.success("Venue deleted successfully!");

        // Remove venue from state
        setVenues((prevVenues) => prevVenues.filter((venue) => venue.id !== venueId));
      } else {
        toast.error("Failed to delete venue.");
      }
    } catch (error) {
      console.error("Error deleting venue:", error);
      toast.error("An error occurred while deleting the venue.");
    } finally {
      setIsLoading(false);
      setShowDeleteModal(false);
      setVenueToDelete(null);
    }
  };


  return (
    <>
    <div className="d-flex justify-content-between mb-0">
    <p className="fw-bold">LOCATIONS</p>
<button className="btn btn-dark" onClick={() => navigate("/venue/profile")}>Add Location</button>
    </div>
      <hr />
      <div className="row">
        <ToastContainer position="top-right" reverseOrder={false} />
        {loading ? (
          <div className="d-flex justify-content-center my-5">
            <div className="spinner-grow text-dark" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : venues?.length > 0 ? (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr className="profile-font">
                  <th>Sr.No.</th>
                  <th>Address Line 1</th>
                  <th>Address Line 2</th>
                  <th>Email</th>
                  <th>Contact Number</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody className="profile-font text-secondary">
                {venues.map((venue, index) => (
                  <tr key={venue.id}>
                    <td>{index + 1}</td>
                    <td>{venue.addressLine1} </td>
                    <td>{venue.addressLine2}</td>
                    <td>{venue.email}</td>
                    <td>{venue.phone}</td>
                    <td>
                      <Button
                        className="btn btn-outline-secondary rounded-3 btn-sm"
                        onClick={() => handleEditClick(venue)}
                      >
                        <i className="fa-solid fa-pen-to-square"></i>
                      </Button>
                      <Button
                        className="btn btn-outline-secondary ms-1 rounded-3 btn-sm"
                        onClick={() => {
                          setVenueToDelete(venue.id);
                          setShowDeleteModal(true);
                        }}
                      >
                        <i className="fa-solid fa-trash"></i>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}

        {selectedVenue && (
          <>
            <div className="modal-backdrop fade show"></div>
            <div className="modal fade show d-block" tabIndex="-1">
              <div className="modal-dialog">
                <div className="modal-content pt-0 ps-2">
                  <div className="modal-header">
                    <p className="modal-title">Edit Details</p>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => setSelectedVenue(null)}
                      disabled={isLoading}
                    ></button>
                  </div>
                  <div className="modal-body">
                    {isLoading ? (
                      <div className="d-flex justify-content-center my-5">
                        <div className="spinner-grow text-dark" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                      </div>
                    ) : (
                      <form>
                        <div className="row mb-2">
                          <div className="col-md-6">
                            <label className="form-label profile-font fw-semibold">
                              Address Line 1<span style={{ color: "red", display: "inline" }}>*</span>
                            </label>
                            <Input
                              type="text"
                              name="addressLine1"
                              className={`form-control profile-font ${errors.addressLine1 ? "is-invalid" : ""}`}
                              value={formData.addressLine1}
                              onChange={handleChange}
                            />
                            {errors.addressLine1 && <div className="text-danger">{errors.addressLine1}</div>}
                          </div>
                          <div className="col-md-6">
                            <label className="form-label profile-font fw-semibold">
                              Address Line 2<span style={{ color: "red", display: "inline" }}>*</span>
                            </label>
                            <Input
                              type="text"
                              name="addressLine2"
                              className={`form-control profile-font ${errors.addressLine2 ? "is-invalid" : ""}`}
                              value={formData.addressLine2}
                              onChange={handleChange}
                            />
                            {errors.addressLine2 && <div className="text-danger">{errors.addressLine2}</div>}
                          </div>
                        </div>

                        <div className="row mb-2">
                          <div className="col-md-6">
                            <label className="form-label profile-font fw-semibold">
                              Email<span style={{ color: "red", display: "inline" }}>*</span>
                            </label>
                            <Input
                              type="email"
                              name="email"
                              className={`form-control profile-font ${errors.email ? "is-invalid" : ""}`}
                              value={formData.email}
                              onChange={handleChange}
                            />
                            {errors.email && <div className="text-danger">{errors.email}</div>}
                          </div>
                          <div className="col-md-6">
                            <label className="form-label profile-font fw-semibold">
                              Contact Number<span style={{ color: "red", display: "inline" }}>*</span>
                            </label>
                            <Input
                              type="text"
                              name="phone"
                              className={`form-control profile-font ${errors.phone ? "is-invalid" : ""}`}
                              value={formData.phone}
                              onChange={handleChange}
                            />
                            {errors.phone && <div className="text-danger">{errors.phone}</div>}
                          </div>
                        </div>
                        <div className="modal-footer">
                          <Button
                            className="btn btn-danger btn-sm rounded-3"
                            onClick={() => setSelectedVenue(null)}
                            disabled={isLoading}
                          >
                            Discard
                          </Button>
                          <Button
                            className="btn btn-sm venue-btn"
                            type="button"
                            onClick={handleSaveChanges}
                            disabled={isLoading}
                          >
                            Save Changes
                          </Button>
                        </div>
                      </form>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {showDeleteModal && (
          <>
            <div className="modal-backdrop fade show"></div>
            <div className="modal fade show d-block" tabIndex="-1">
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Delete Venue?</h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => setShowDeleteModal(false)}
                      disabled={isLoading}
                    ></button>
                  </div>
                  <div className="modal-body">
                    {isLoading ? (
                      <div className="d-flex justify-content-center my-5">
                        <div className="spinner-grow text-dark" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                      </div>
                    ) : (
                      <p className="profile-font">
                        Are you sure you want to delete this venue?
                      </p>
                    )}
                  </div>
                  <div className="modal-footer">
                    <Button
                      className="btn btn-secondary profile-font"
                      onClick={() => setShowDeleteModal(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="btn btn-danger profile-font"
                      onClick={() => handleDeleteVenue(venueToDelete)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
