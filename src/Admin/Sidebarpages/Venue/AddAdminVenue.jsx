import React, { useState } from "react";
import AdminSideBar from "../../../components/Venue/AdminSideBar";
import { ToastContainer } from "react-toastify";
import DashLayout from "../../DashLayout";
import Input from "../../../components/Input";
import CustomTable from "../../../components/CustomTable";

export default function AddAdminVenue() {
  const [showCredentials, setShowCredentials] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    zipCode: "",
    email: "",
    password: "",
  });
  
  const [formErrors, setFormErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleEdit = () => {

  }

  const handleDelete = () => {

  }

  const handleNeighbourhoodSubmit = (e) => {
    e.preventDefault();
    console.log("Neighbourhood added");
    setShowModal(false);
  };

  const handleCheckboxChange = (e) => {
    setShowCredentials(e.target.checked);
  };

  const columns = [
    {
      title: "Neighbourhood Name",
      dataIndex: "name",
      key: "name",
      render: (text, record) => {
        return <p>{text}</p>;
      },
    },

    {
      title: "Contact Person",
      dataIndex: "contactPerson",
      key: "contactPerson",
    },
    {
      title: "Contact Number",
      dataIndex: "phone",
      key: "contactInfo",
    },
  ];

  const validateForm = () => {
    let errors = {};
  
    if (!formData.name.trim()) errors.name = "Venue name is required";
    if (!formData.addressLine1.trim()) errors.addressLine1 = "Street Address 1 is required";
    if (!formData.city.trim()) errors.city = "City is required";
    if (!formData.state.trim()) errors.state = "State is required";
    if (!formData.zipCode.trim()) errors.zipCode = "Zip Code is required";
  
    if (showCredentials) {
      if (!formData.email.trim()) {
        errors.email = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        errors.email = "Invalid email format";
      }
  
      if (!formData.password.trim()) {
        errors.password = "Password is required";
      } else if (formData.password.length < 6) {
        errors.password = "Password must be at least 6 characters";
      }
    }
  
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Form data is valid:", formData);
    } else {
      console.log("Validation errors:", formErrors);
    }
  };
  
  

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
            {/* <button
              onClick={() => navigate(-1)}
              className="btn btn-outline-dark btn-sm d-flex align-items-center mb-2"
            >
              <i className="fa fa-arrow-left"></i>
            </button> */}
             <p className="headingPG mb-2 d-flex justify-content-between align-items-center">
                      ADD VENUE
                    </p>
                    {/* <hr className="mt-0" /> */}
            <div className="card">
              <div className="card-body">
                <div className="row">
                  <div className="col-md-12">
                    {/* <p className="subheadingPG mb-2 d-flex justify-content-between align-items-center">
                      ADD VENUE
                    </p>
                    <hr className="mt-0" /> */}
                    <form onSubmit={handleFormSubmit}>
                      <div className="row mb-3">
                        <div className="col-md-6">
                          <label className="fw-medium">Venue Name</label>
                          <Input type="text" name="name" value={formData.name} onChange={handleInputChange}/>
                          {formErrors.name && <small className="text-danger">{formErrors.name}</small>}
                        </div>
                        <div className="col-md-6">
                          <label className="fw-medium">Street Address 1</label>
                          <Input type="text" name="addressLine1" value={formData.addressLine1} onChange={handleInputChange}/>
                          {formErrors.addressLine1 && <small className="text-danger">{formErrors.addressLine1}</small>}
                        </div>
                      </div>
                      <div className="row mb-3">
                        <div className="col-md-6">
                          <label className="fw-medium">
                            Street Address 2 (Optional)
                          </label>
                          <Input type="text" name="addressLine2" value={formData.addressLine2} onChange={handleInputChange}/>
                          {formErrors.addressLine2 && <small className="text-danger">{formErrors.addressLine2}</small>}
                        </div>
                        <div className="col-md-6">
                          <label className="fw-medium">City</label>
                          <Input type="text" name="city" value={formData.city} onChange={handleInputChange}/>
                          {formErrors.city && <small className="text-danger">{formErrors.city}</small>}
                        </div>
                      </div>
                      <div className="row mb-3">
                        <div className="col-md-6">
                          <label className="fw-medium">State</label>
                          <Input type="text" name="state" value={formData.state} onChange={handleInputChange}/>
                          {formErrors.state && <small className="text-danger">{formErrors.state}</small>}
                        </div>

                        <div className="col-md-6">
                          <label className="fw-medium">Zip Code</label>
                          <Input type="text" name="zipCode" value={formData.zipCode} onChange={handleInputChange}/>
                          {formErrors.zipCode && <small className="text-danger">{formErrors.zipCode}</small>}
                        </div>
                      </div>
                      <div className="form-check mb-2">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="showCredentials"
                          checked={showCredentials}
                          onChange={handleCheckboxChange}
                        />
                        <label
                          className="form-check-label fw-medium"
                          htmlFor="showCredentials"
                        >
                          Add Login Account
                        </label>
                      </div>

                      <div
                        className={`row mb-2 transition-box ${
                          showCredentials ? "open" : ""
                        }`}
                      >
                        <div className="col-md-6">
                          <label className="fw-medium">Email</label>
                          <Input type="email" name="email" />
                        </div>
                        <div className="col-md-6">
                          <label className="fw-medium">Password</label>
                          <Input type="password" name="password" />
                        </div>
                      </div>
                      <button
                        type="button"
                        className="btn mybtn"
                        onClick={handleOpenModal}
                      >
                        Add Neighbourhood
                      </button>
                      <p className="subheadingPG mb-2 d-flex justify-content-between align-items-center mt-4">
                        NEIGHBOURHOODS
                      </p>
                      <hr />
                      <CustomTable
                        //   data={venuedata}
                        columns={columns}
                          onEdit={handleEdit}
                        showActions={true}
                          onDelete={handleDelete}
                        //   onView={handleView}
                        //   loading={loading}
                        //   pagination={{
                        //     current: pagination.current,
                        //     pageSize: pagination.pageSize,
                        //     total: pagination.total,
                        //     showSizeChanger: false,
                        //   }}
                        //   onTableChange={(pagination) => {
                        //     // Trigger API call with new page and pageSize
                        //     fetchVenues(
                        //       pagination.current,
                        //       pagination.pageSize,
                        //       search
                        //     );
                        //   }}
                        //   search={search}
                        //   onSearchChange={(value) => {
                        //     setSearch(value);
                        //     fetchVenues(1, pagination.pageSize, value); // Reset to the first page on search
                        //   }}
                        //   showPageSizeDropdown={true}
                      />

                      <button type="submit" className="btn mybtn mt-3">
                        Submit
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          role="dialog"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add Neighbourhood</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseModal}
                ></button>
              </div>
              <form onSubmit={handleNeighbourhoodSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Neighbourhood Name</label>
                    <Input type="text" name="neighbourhoodName" />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Contact Person</label>
                    <Input type="text" name="description" />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Contact Number</label>
                    <Input type="text" name="description" />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="submit" className="btn btn-primary">
                    Save
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleCloseModal}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
