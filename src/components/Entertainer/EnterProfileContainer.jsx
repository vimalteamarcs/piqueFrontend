import React, { useState } from "react";
import Input from "../Input";
import Select from "../Select";
import RadioButton from "../RadioButton";
import axios from "axios";

export default function EnterProfileContainer({
  formData,
  errors,
  categories,
  subcategories,
  performanceRole,
  options,
  isEditing,
  headshotUrl,
  handleInputChange,
  handleCategoryChange,
  handleSubCategoryChange,
  handleSubmit,
  headshot,
  setHeadshot,
  countries,
  states,
  cities,
  serviceInput,
  handleAddService,
  setServiceInput,
  handleRemoveService,
  formatDate,
  setFormData,
}) {
  const imagePath = import.meta.env.VITE_LOGGEDIN_IMAGE_PATH;

  return (
    <>
      <div className="entertainer-profile-container entrWrapper">
        <p className="subheadingPG mb-2 d-flex justify-content-between align-items-center">
          PROFILE
        </p>
        <hr className="mt-0" />
        <p className="dash-font text-muted">
          The contact information provided below is for Pique Entertainment's
          records only.
        </p>
        <form className="scrollable-container" onSubmit={handleSubmit}>
          <div className="row mb-3">
            <div className="col-md-6">
              <label className="dash-font fw-semibold">
                Contact Person Name
              </label>
              <Input
                type="text"
                name="contactPerson"
                className="form-control dash-font mb-3"
                value={formData.contactPerson || ""}
                placeholder="Enter Contact Person Name"
                onChange={handleInputChange}
              />
              <label className="dash-font fw-semibold">Contact Number</label>
              <Input
                type="text"
                name="contactNumber"
                value={formData.contactNumber || ""}
                placeholder="Enter your contact number."
                onChange={handleInputChange}
                className="form-control dash-font"
              />
            </div>
            {/* <div className="col-md-6">
              <div className="row">
                <div className="col-md-8">
                  <label className="dash-font fw-semibold">
                    Profile Headshot*
                  </label>
                  <p className="icon-font mb-0">Guidelines:</p>
                  <ol className="dash-navbar-font text-start mb-1">
                    <li>Choose an image where your face is recognizable.</li>
                    <li>
                      {" "}
                      Your profile photo should not contain text, logos, or
                      contact information.
                    </li>
                    <li>
                      Should be in .jpg or .png format. (max file size 10mb)
                    </li>
                  </ol>
                  <button
                    type="button"
                    className="btn enter-btn icon-font text-white rounded-3"
                  >
                    Upload
                  </button>
                </div>
                <div className="col-md-4">
                  <img
                    src={
                      headshotUrl
                        ? headshotUrl
                        : `${imagePath}magician-showing-trick.png`
                    }
                    style={{ height: "130px", width: "125px" }}
                    className="rounded-4"
                    alt="Profile Headshot"
                  />
                </div>
              </div>
            </div> */}

            <div className="col-md-6">
              <div className="row">
                <div className="col-md-8">
                  <label className="dash-font fw-semibold">
                    Profile Headshot*
                  </label>
                  <p className="icon-font mb-0">Guidelines:</p>
                  <ol className="dash-navbar-font text-start mb-1">
                    <li>Choose an image where your face is recognizable.</li>
                    <li>
                      Your profile photo should not contain text, logos, or
                      contact information.
                    </li>
                    <li>
                      Should be in .jpg or .png format. (max file size 10mb)
                    </li>
                  </ol>
                  <button
                    type="button"
                    className="btn enter-btn icon-font text-white rounded-3"
                    onClick={() =>
                      document.getElementById("headshotInput").click()
                    }
                  >
                    Upload
                  </button>

                  {/* Hidden input for file upload */}
                  <input
                    type="file"
                    id="headshotInput"
                    accept="image/jpeg, image/png"
                    style={{ display: "none" }}
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setHeadshot(file); // store file
                        const previewUrl = URL.createObjectURL(file);
                        setFormData((prev) => ({
                          ...prev,
                          headshotUrl: previewUrl, // temporary preview
                        }));
                      }
                    }}
                  />
                </div>

                {/* Image Preview */}
                <div className="col-md-4">
                  {(headshot && typeof headshot !== "string") || headshotUrl ? (
                    <img
                      src={
                        headshot && typeof headshot !== "string"
                          ? URL.createObjectURL(headshot)
                          : headshotUrl
                      }
                      style={{
                        height: "130px",
                        width: "125px",
                        objectFit: "cover",
                      }}
                      className="rounded-4"
                      alt="Profile Headshot"
                    />
                  ) : null}
                </div>
              </div>
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-md-6">
              <label className="dash-font fw-semibold">Stage Name</label>
              <Input
                type="text"
                name="stageName"
                value={formData.stageName || ""}
                placeholder="Enter your contact number."
                onChange={handleInputChange}
                className="form-control dash-font"
              />
            </div>
            <div className="col-md-6">
              <label className="dash-font fw-semibold">DOB</label>
              <Input
                type="date"
                name="dob"
                value={formData.dob ? formatDate(formData.dob) : ""}
                // placeholder="Enter another contact number."
                onChange={handleInputChange}
                className="form-control dash-font"
              />
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-6">
              <label className="dash-font fw-semibold">Main Category</label>
              <Select
                options={categories}
                value={formData.category || ""}
                onChange={(e) => handleCategoryChange(e.target.value)}
                placeholder="Select Category"
                className="form-control dash-font"
              />
            </div>
            <div className="col-md-6">
              <label className="dash-font fw-semibold">Sub Category</label>
              <Select
                options={subcategories}
                value={formData.specific_category || ""}
                onChange={(e) => handleSubCategoryChange(e.target.value)}
                placeholder="Select Subcategory"
                // isDisabled={!formData.category}
                className="form-control dash-font"
              />
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-6 dash-font">
              <label className="dash-font fw-semibold">Performance Role</label>
              <Select
                name="performanceRole"
                options={performanceRole}
                className="form-control dash-font"
                defaultOption="--Select Role--"
                value={formData.performanceRole || ""}
                onChange={handleInputChange}
              />
              {errors.performanceRole && (
                <div className="text-danger">{errors.performanceRole}</div>
              )}
            </div>

            <div className="col-md-6 dash-font">
              <label className="dash-font fw-semibold">Price Per Event</label>
              <Input
                type="number"
                name="pricePerEvent"
                className="form-control dash-font"
                value={formData.pricePerEvent || ""}
                placeholder="Rs."
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="row mb-3">
            {/* <div className="col-md-6 dash-font">
              <label className="dash-font fw-semibold">Business Email</label>
              <Input
                type="email"
                name="email"
                className="form-control dash-font"
                value={formData.email || ""}
                placeholder="Enter your mail"
                onChange={handleInputChange}
              />
            </div> */}
            <div className="col-md-6 dash-font">
              <label className="dash-font fw-semibold">Vaccinated?</label>

              <Select
                name="vaccinated"
                options={options}
                value={formData.vaccinated || ""}
                onChange={(e) => handleInputChange(e)} // just pass the event
              />
            </div>
            <div className="col-md-6">
              <label className="dash-font fw-semibold">Bio</label>
              <textarea
                className="form-control dash-font"
                name="bio"
                value={formData.bio || ""}
                onChange={handleInputChange}
                placeholder="Describe yourself"
                rows="1"
              />
            </div>
          </div>

          {/* <div className="row mb-3">
            <div className="col-md-12">
              <label className="dash-font fw-semibold">Bio</label>
              <textarea
                className="form-control dash-font"
                name="bio"
                value={formData.bio || ""}
                onChange={handleInputChange}
                placeholder="Describe yourself"
                rows="1"
              />
            </div>
          </div> */}

          <div className="row mb-3">
            <div className="col-md-6 dash-font">
              <label className="dash-font fw-semibold">Country</label>
              <Select
                name="country"
                options={countries}
                value={formData.country || 0}
                onChange={handleInputChange}
                defaultOption="--Select Country--"
                className="form-control profile-font"
              />
            </div>
            <div className="col-md-6 dash-font">
              <label className="dash-font fw-semibold">State</label>
              <Select
                name="state"
                options={states}
                value={formData.state || 0}
                onChange={handleInputChange}
                defaultOption="--Select State--"
                className="form-control profile-font"
              />
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-6 dash-font">
              <label className="dash-font fw-semibold">City</label>
              <Select
                name="city"
                options={cities}
                value={formData.city}
                onChange={handleInputChange}
                defaultOption="--Select City--"
                className="form-control profile-font"
              />
            </div>
            <div className="col-md-6 dash-font">
              <label className="dash-font fw-semibold">Address Line</label>
              <Input
                type="text"
                name="address"
                className="form-control dash-font"
                value={formData.address}
                placeholder="Enter your address line"
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-6 dash-font">
              <label className="dash-font fw-semibold">Zip Code</label>
              <Input
                type="text"
                name="zipCode"
                className="form-control dash-font"
                value={formData.zipCode}
                placeholder="Enter your zip code"
                onChange={handleInputChange}
              />
            </div>

            <div className="col-md-6 dash-font">
              <label className="dash-font fw-semibold">Social Links</label>
              <Input
                type="text"
                name="socialLinks"
                className="form-control dash-font"
                value={formData.socialLinks || ""}
                placeholder="Enter your social links"
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="row mb-3">
            <label className="dash-font fw-semibold">Services</label>
            <div className="col-md-11">
              <input
                type="text"
                className="form-control dash-font"
                placeholder="Enter services you provide"
                value={serviceInput}
                onChange={(e) => setServiceInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddService();
                  }
                }}
              />
            </div>
            <div className="col-md-1">
              <button
                type="button"
                className="btn enter-btn rounded-3"
                onClick={handleAddService}
              >
                <i className="fa fa-plus text-white"></i>
              </button>
            </div>

            {/* List of Services */}
            <div className="col-md-12 mt-2">
              {formData?.services?.length > 0 && (
                <ul className="ms-4">
                  {formData.services.map((service, index) => (
                    <li key={index} className="mb-1">
                      <div className="d-flex align-items-center">
                        <span className="me-2">{service}</span>
                        <button
                          type="button"
                          className="btn p-0 ms-2"
                          onClick={() => handleRemoveService(index)}
                          aria-label="Remove Service"
                        >
                          <i className="fa-solid fa-xmark text-danger fw-bold fs-6"></i>
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="row">
            <div className="col-md-6">
              <button
                type="submit"
                className="btn enter-btn icon-font text-white rounded-3"
              >
                Submit
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
