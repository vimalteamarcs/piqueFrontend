import React, { useEffect } from "react";
import DashLayout from "../../Admin/DashLayout";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import {
  CREATE_VENUE,
  GET_CITIES,
  GET_COUNTRIES,
  GET_STATES,
} from "../../../constants";
import AdminSideBar from "../../components/Venue/AdminSideBar";

export default function AddLocation() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const location = useLocation();
  const venue = location.state || {};
  console.log(venue);
  const [errors, setErrors] = useState({});
  const [locations, setLocations] = useState([
    {
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      country: "",
      zipCode: "",
      // lat: "",
      // long: "",
      // amenities: [],
      // websiteUrl: "",
      // timings: "",
      // bookingPolicies: "",
    },
  ]);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  useEffect(() => {
    const fetchCountries = async () => {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}${GET_COUNTRIES}`
      );
      setCountries(data?.countries || []);
    };

    fetchCountries();
  }, []);

  const fetchStates = async (countryId) => {
    const { data } = await axios.get(
      `${import.meta.env.VITE_API_URL}${GET_STATES}${countryId}`
    );
    setStates(data?.states || []);
  };

  const fetchCities = async (stateId) => {
    const { data } = await axios.get(
      `${import.meta.env.VITE_API_URL}${GET_CITIES}${stateId}`
    );
    setCities(data?.cities || []);
  };

  useEffect(() => {
    const fetchLocationData = async () => {
      if (venue?.country) {
        await fetchStates(Number(venue?.country));
      }
      if (venue?.state) {
        await fetchCities(Number(venue?.state));
      }
    };

    if (venue) {
      fetchLocationData();
    }
  }, [venue]);

  const handleAddLocation = () => {
    setLocations([
      ...locations,
      {
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        country: "",
        zipCode: "",
        // lat: "",
        // long: "",
        // amenities: [],
        // websiteUrl: "",
        // timings: "",
        // bookingPolicies: "",
      },
    ]);
  };

  const handleChange = async (index, event) => {
    const { name, value } = event.target;
    const updatedLocations = [...locations];
    updatedLocations[index][name] = value;
    setLocations(updatedLocations);

    if (name === "country") {
      setStates([]);
      setCities([]);
      await fetchStates(value);
    } else if (name === "state") {
      setCities([]);
      await fetchCities(value);
    }
  };

  const validateFormData = () => {
    let newErrors = {};
    locations.forEach((loc, index) => {
      if (!loc.addressLine1.trim()) {
        newErrors[`addressLine1${index}`] = "Address Line 1 is required.";
      }
      if (!loc.addressLine2.trim()) {
        newErrors[`addressLine2${index}`] = "Address Line 2 is required.";
      }
      if (!loc.zipCode.trim()) {
        newErrors[`zipCode${index}`] = "Zip Code is required.";
      } else if (!/^[0-9]{5,6}$/.test(loc.zipCode)) {
        newErrors[`zipCode${index}`] = "Zip Code must be 5-6 digits.";
      }
      if (!loc.country) {
        newErrors[`country${index}`] = "Country is required.";
      }
      if (!loc.state) {
        newErrors[`state${index}`] = "State is required.";
      }
      if (!loc.city) {
        newErrors[`city${index}`] = "City is required.";
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateFormData()) return;
    try {
      for (const formData of locations) {
        const venueFormData = {
          // name: venue.name || "",
          // description: venue.description || "",
          // email: venue.email || "",
          phone: venue.phone || "",
          addressLine1: formData.addressLine1 || "",
          addressLine2: formData.addressLine2 || "",
          zipCode: formData.zipCode || "",
          city: Number(formData.city) || 0,
          state: Number(formData.state) || 0,
          country: Number(formData.country) || 0,
          // lat: formData.lat || "0.0",
          // long: formData.long || "0.0",
          // amenities: formData.amenities || [],
          // websiteUrl: formData.websiteUrl || "N/A",
          // timings: formData.timings || "N/A",
          // bookingPolicies: formData.bookingPolicies || "N/A",
          // userId: Number(localStorage.getItem("venueUserId")) || 0,
          venueId: Number(venue.id) || 0
          // isParent: false,
          // parentId: venue.id ? Number(venue.id) : 0,
        };
        console.log("venue form data", venueFormData);

        await axios.post(
          `${import.meta.env.VITE_API_URL}admin/venue/location`,
          venueFormData,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      toast.success("Location added successfully!");
      setTimeout(() => navigate(-1), 1000);

    } catch (error) {
      console.error("Error adding locations:", error);
      toast.error("Error adding locations. Please try again.");
    }
  };

  return (
    <>
      <DashLayout />
      <div className="container-fluid d-flex flex-column min-vh-100">
        <div className="pageLayout">
          <div className="dash-sidebar-container">
            <AdminSideBar />
          </div>
          <div className="dash-profile-container">
            <button
              onClick={() => navigate(-1)}
              className="btn btn-outline-dark btn-sm d-flex align-items-center mb-2"
            >
              <i className="fa fa-arrow-left"></i>
            </button>
            <div className="card">
              <div className="card-body">
                <p
                  className="subheadingPG mb-2 d-flex justify-content-between align-items-center"
                >
                  ADD LOCATION FOR - {venue.name}
                </p>
                <hr className="mt-0" />
                <form
                  onSubmit={handleSubmit}
                  className="profile-font event-form pt-2 pb-2"
                >
                  {locations.map((loc, index) => (
                    <div key={index} className="mb-3">
                      <div className="row">
                        <div className="col-md-6">
                          <label className="form-label label-font mb-0 fw-medium">
                            Address Line 1
                          </label>
                          <input
                            type="text"
                            className={`form-control ${errors[`addressLine1${index}`] ? "is-invalid" : ""}`}
                            placeholder="Enter address line 1"
                            name="addressLine1"
                            value={loc.addressLine1}
                            onChange={(e) => handleChange(index, e)}
                          />
                          {errors[`addressLine1${index}`] && <div className="invalid-feedback">{errors[`addressLine1${index}`]}</div>}
                        </div>

                        <div className="col-md-6">
                          <label className="form-label label-font mb-0 fw-medium">
                            Address Line 2
                          </label>
                          <input
                            type="text"
                            className={`form-control ${errors[`addressLine2${index}`] ? "is-invalid" : ""}`}
                            placeholder="Enter address line 2"
                            name="addressLine2"
                            value={loc.addressLine2}
                            onChange={(e) => handleChange(index, e)}
                          />
                          {errors[`addressLine2${index}`] && <div className="invalid-feedback">{errors[`addressLine2${index}`]}</div>}
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-md-6">
                          <label className="form-label label-font mt-3 mb-0 fw-medium">
                            Country
                          </label>
                          <select
                            className={`form-control label-font ${errors[`country${index}`] ? "is-invalid" : ""}`}
                            name="country"
                            value={loc.country}
                            onChange={(e) => handleChange(index, e)}
                          >
                            <option value="">Select Country</option>
                            {countries.map((c) => (
                              <option key={c.id} value={c.id}>
                                {c.name}
                              </option>
                            ))}
                          </select>
                          {errors[`country${index}`] && <div className="invalid-feedback">{errors[`country${index}`]}</div>}


                        </div>

                        <div className="col-md-6">
                          <label className="form-label label-font mt-3 mb-0 fw-medium">
                            State
                          </label>
                          <select
                            className={`form-control label-font ${errors[`state${index}`] ? "is-invalid" : ""}`}
                            name="state"
                            value={loc.state}
                            onChange={(e) => handleChange(index, e)}
                          >
                            <option value="">Select State</option>
                            {states.map((s) => (
                              <option key={s.id} value={s.id}>
                                {s.name}
                              </option>
                            ))}
                          </select>
                          {errors[`state${index}`] && <div className="invalid-feedback">{errors[`state${index}`]}</div>}


                        </div>

                      </div>

                      <div className="row">
                        <div className="col-md-6">
                          <label className="form-label label-font mt-3 mb-0 fw-medium">
                            City
                          </label>
                          <select
                            className={`form-control label-font ${errors[`city${index}`] ? "is-invalid" : ""}`}
                            name="city"
                            value={loc.city}
                            onChange={(e) => handleChange(index, e)}
                          >
                            <option value="">Select City</option>
                            {cities.map((c) => (
                              <option key={c.id} value={c.id}>
                                {c.name}
                              </option>
                            ))}
                          </select>
                          {errors[`city${index}`] && <div className="invalid-feedback">{errors[`city${index}`]}</div>}


                        </div>
                        <div className="col-md-6">
                          <label className="form-label label-font mt-3 mb-0 fw-medium">
                            Zip Code
                          </label>
                          <input
                            type="text"
                            className={`form-control label-font ${errors[`zipCode${index}`] ? "is-invalid" : ""}`}
                            placeholder="Enter zip code"
                            name="zipCode"
                            value={loc.zipCode}
                            onChange={(e) => handleChange(index, e)}
                          />
                          {errors[`zipCode${index}`] && <div className="invalid-feedback">{errors[`zipCode${index}`]}</div>}

                        </div>
                      </div>
                    </div>
                  ))}
                  <button type="submit" className="btn btn-dark label-font">
                    Submit
                  </button>
                </form>
                <ToastContainer />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
