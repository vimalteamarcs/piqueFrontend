import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Input from "../Input";
import Button from "../Button";
import { useNavigate } from "react-router-dom";

export default function AddLocationModal({ show, onClose, onSave }) {
  const [venue, setVenue] = useState({
    addressLine1: "",
    addressLine2: "",
    email: "",
    phone: "",
    city: "",
    state: "",
    country: "",
    zipCode: "",
  });

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  // Fetch countries when the component mounts
  useEffect(() => {
    fetchCountries();
  }, []);

  const fetchCountries = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}location/countries`
      );

      if (Array.isArray(response.data)) {
        setCountries(
          response.data.map((c) => ({ label: c.name, value: c.id }))
        );
      } else if (response.data && Array.isArray(response.data.countries)) {
        setCountries(
          response.data.countries.map((c) => ({ label: c.name, value: c.id }))
        );
      } else {
        console.error("Unexpected API response format:", response.data);
      }
    } catch (error) {
      console.error("Error fetching countries:", error);
    }
  };

  const fetchStates = async (countryId) => {
    if (!countryId) return;
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}location/states?countryId=${countryId}`
      );
      if (Array.isArray(response.data)) {
        setStates(response.data.map((s) => ({ label: s.name, value: s.id })));
      } else if (response.data && Array.isArray(response.data.states)) {
        setStates(
          response.data.states.map((s) => ({ label: s.name, value: s.id }))
        );
      } else {
        console.error("Unexpected API response format for states:", response.data);
      }
    } catch (error) {
      console.error("Error fetching states:", error);
    }
  };

  const fetchCities = async (stateId) => {
    if (!stateId) return;
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}location/cities?stateId=${stateId}`
      );
      if (Array.isArray(response.data)) {
        setCities(response.data.map((c) => ({ label: c.name, value: c.id })));
      } else if (response.data && Array.isArray(response.data.cities)) {
        setCities(
          response.data.cities.map((c) => ({ label: c.name, value: c.id }))
        );
      } else {
        console.error("Unexpected API response format for cities:", response.data);
      }
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };

  const handleCountryChange = (e) => {
    const selectedCountry = e.target.value;
    setVenue({ ...venue, country: selectedCountry });
    setStates([]); // Clear states when country changes
    setCities([]); // Clear cities when country changes
    fetchStates(selectedCountry); // Fetch new states for selected country
  };

  const handleStateChange = (e) => {
    const selectedState = e.target.value;
    setVenue({ ...venue, state: selectedState });
    setCities([]); // Clear cities when state changes
    fetchCities(selectedState); // Fetch new cities for selected state
  };

  const handleChange = (e) => {
    setVenue({ ...venue, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!venue.addressLine1.trim()) {
      newErrors.addressLine1 = "Address Line 1 is required.";
    }
    if (!venue.city.trim()) {
      newErrors.city = "City is required.";
    }
    if (!venue.state.trim()) {
      newErrors.state = "State is required.";
    }
    if (!venue.country.trim()) {
      newErrors.country = "Country is required.";
    }
    if (!venue.zipCode.trim()) {
      newErrors.zipCode = "Zip Code is required.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!venue.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!emailRegex.test(venue.email)) {
      newErrors.email = "Invalid email address.";
    }
    
    const phoneRegex = /^\d{10}$/;
    if (!venue.phone.trim()) {
      newErrors.phone = "Phone number is required.";
    } else if (!phoneRegex.test(venue.phone)) {
      newErrors.phone = "Enter a valid 10-digit number.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const addVenue = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const venueData = {
        phone: localStorage.getItem("phone") || venue.phone,
        email: localStorage.getItem("email") || venue.email,
        addressLine1: venue.addressLine1,
        addressLine2: venue.addressLine2,
        city: Number(venue.city),
        state: Number(venue.state),
        zipCode: venue.zipCode,
        country: Number(venue.country),
      };

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}venues/location/add`,
        venueData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status >= 200 && response.status < 300) {
        toast.success("Venue Location added successfully!");
        setTimeout(() => {
          navigate("/venue/locations");
        }, 1000);
        onSave(response.data); // Optionally, pass back the new venue data
        onClose(); // Close the modal after success
      }
    } catch (error) {
      console.error("Error adding venue:", error);
      toast.error(error.message || "Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  if (!show) return null;

  return (
    <>
      <div className="modal-backdrop fade show"></div>
      <div className="modal fade show d-block" tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content pt-0 ps-2">
            <div className="modal-header">
              <p className="modal-title">Add New Location</p>
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
                disabled={isLoading}
              ></button>
            </div>
            <div className="modal-body">
              <form onSubmit={addVenue}>
                <div className="row mb-2">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Country<span className="text-danger">*</span></label>
                    <select
                      name="country"
                      className={`form-control ${errors.country ? "is-invalid" : ""}`}
                      value={venue.country}
                      onChange={handleCountryChange}
                    >
                      <option value="">Select Country</option>
                      {countries.map((country) => (
                        <option key={country.value} value={country.value}>
                          {country.label}
                        </option>
                      ))}
                    </select>
                    {errors.country && <div className="text-danger">{errors.country}</div>}
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold">State<span className="text-danger">*</span></label>
                    <select
                      name="state"
                      className={`form-control ${errors.state ? "is-invalid" : ""}`}
                      value={venue.state}
                      onChange={handleStateChange}
                    >
                      <option value="">Select State</option>
                      {states.map((state) => (
                        <option key={state.value} value={state.value}>
                          {state.label}
                        </option>
                      ))}
                    </select>
                    {errors.state && <div className="text-danger">{errors.state}</div>}
                  </div>
                </div>

                <div className="row mb-2">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">City<span className="text-danger">*</span></label>
                    <select
                      name="city"
                      className={`form-control ${errors.city ? "is-invalid" : ""}`}
                      value={venue.city}
                      onChange={handleChange}
                    >
                      <option value="">Select City</option>
                      {cities.map((city) => (
                        <option key={city.value} value={city.value}>
                          {city.label}
                        </option>
                      ))}
                    </select>
                    {errors.city && <div className="text-danger">{errors.city}</div>}
                  </div>
                  {/* Add Address fields */}
                </div>

                <div className="modal-footer">
                  <Button className="btn btn-secondary" onClick={onClose} disabled={isLoading}>Cancel</Button>
                  <Button className="btn btn-dark" type="submit" disabled={isLoading}>
                    {isLoading ? "Saving..." : "Add Location"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
