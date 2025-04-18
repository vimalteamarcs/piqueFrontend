import React, { useEffect, useState } from "react";
import Input from "../Input";
import Select from "../Select";
import Button from "../Button";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import MapView from "./MapView";

export default function ProfileCard() {
  const [isEditing, setIsEditing] = useState(false);
  const [headshot, setHeadshot] = useState(null);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [countries, setCountries] = useState([]);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [venue, setVenue] = useState({
    name: "",
    addressLine1: "",
    addressLine2: "",
    country: 0,
    state: 0,
    city: 0,
    zipCode: "",
    phone: "",
    email: "",
  });
  const navigate = useNavigate();
  const [coordinates, setCoordinates] = useState(null);

  const cityName = cities.find(c => c.value === Number(venue.city))?.label || "";
  const stateName = states.find(s => s.value === Number(venue.state))?.label || "";
  const countryName = countries.find(c => c.value === Number(venue.country))?.label || "";


  
  const fullAddress = [
    venue.addressLine1,
    venue.addressLine2,
    cityName,
    stateName,
    countryName
  ]
    .filter(Boolean)
    .join(", ") + (venue.zipCode ? ` - ${venue.zipCode}` : "");

  console.log("fulladdress", fullAddress);

  console.log("coordinates", coordinates);


  useEffect(() => {
    const fetchCoordinates = async () => {
      if (!venue.addressLine1 || !venue.city || !venue.state || !venue.country) return;
  
      const cityName = cities.find(c => c.value === Number(venue.city))?.label || "";
      const stateName = states.find(s => s.value === Number(venue.state))?.label || "";
      const countryName = countries.find(c => c.value === Number(venue.country))?.label || "";
  
      const fullAddress = [venue.addressLine1, cityName, stateName, countryName, venue.zipCode]
        .filter(Boolean)
        .join(", ");
  
      
  
      try {
        let url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fullAddress)}`;
        let res = await fetch(url);
        let data = await res.json();
        
  
        if (data.length > 0) {
          setCoordinates([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
        } else {
          console.warn("⚠️ No coordinates found for the full address. Trying city, state, country...");
          
          // Fallback to city, state, country if the full address fails
          const fallbackAddress = [cityName, stateName, countryName].filter(Boolean).join(", ");
          let fallbackUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fallbackAddress)}`;
          let fallbackRes = await fetch(fallbackUrl);
          let fallbackData = await fallbackRes.json();
          
  
          if (fallbackData.length > 0) {
            setCoordinates([parseFloat(fallbackData[0].lat), parseFloat(fallbackData[0].lon)]);
          } else {
            console.error("❌ No coordinates found for fallback address.");
          }
        }
      } catch (err) {
        console.error("❌ Geocoding API error:", err);
      }
    };
  
    const debounceFetch = setTimeout(fetchCoordinates, 500); // Debounce to prevent frequent API calls
    return () => clearTimeout(debounceFetch); // Cleanup function
  
  }, [venue.addressLine1, venue.city, venue.state, venue.country, venue.zipCode, cities, states, countries]);
  



  const validateForm = () => {
    let newErrors = {};
    if (!venue.name.trim()) newErrors.name = "Residence Name is required";
    if (!venue.addressLine1.trim()) newErrors.addressLine1 = "Address Line 1 is required";
    if (!venue.addressLine2) newErrors.addressLine2 = "Address Line 2 is required";
    if (!venue.country) newErrors.country = "Country is required";
    if (!venue.state) newErrors.state = "State is required";
    if (!venue.city) newErrors.city = "City is required";
    if (!venue.zipCode.trim() || isNaN(venue.zipCode)) newErrors.zipCode = "ZIP code is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // const fetchVenues = async () => {
  //   setLoading(true);
  //   try {
  //     const token = localStorage.getItem("token");
  //     const response = await axios.get(
  //       `${import.meta.env.VITE_API_URL}venues`,
  //       {
  //         headers: { Authorization: `Bearer ${token}` },
  //       }
  //     );

  //     console.log("Venue Response:", response.data);
  //     localStorage.setItem("venueId", response.data.venues[0].id);

  //     if (response.data?.status && Array.isArray(response.data.venues)) {
  //       const venueData = response.data.venues[0] || {};

  //       setVenue({
  //         name: venueData.name || "",
  //         addressLine1: "",
  //         addressLine2: "",
  //         country: 0,
  //         state: 0,
  //         city: 0,
  //         zipCode: "",
  //         phone: "",
  //         email: "",
  //         description: "",
  //       });

  //       setIsEditing(true);
  //       setHeadshot(venueData.media?.[0]?.url || null);
  //       fetchStates(venueData.country);
  //       fetchCities(venueData.state);
  //     } else {
  //       console.warn("No venues found.");
  //     }
  //   } catch (error) {
  //     console.error("Error fetching venues:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const fetchVenues = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}venues`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      console.log("Venue Response:", response.data);
  
      const parentVenue = response.data.venues.find(venue => venue.isParent);
  
      if (parentVenue) {
        localStorage.setItem("venueId", parentVenue.id);
  
        setVenue({
          name: parentVenue.name || "",
          addressLine1: parentVenue.addressLine1 || "",
          addressLine2: parentVenue.addressLine2 || "",
          country: parentVenue.country || 0,
          state: parentVenue.state || 0,
          city: parentVenue.city || 0,
          zipCode: parentVenue.zipCode || "",
          phone: parentVenue.phone || "",
          email: parentVenue.email || "",
          description: parentVenue.description || "",
        });
  
        setIsEditing(true);
        setHeadshot(parentVenue.media?.[0]?.url || null);
        fetchStates(parentVenue.country);
        fetchCities(parentVenue.state);
      } else {
        console.warn("No parent venue found.");
      }
    } catch (error) {
      console.error("Error fetching venues:", error);
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    fetchVenues();
  }, []);

  useEffect(() => {
    fetchCountries();
  }, []);

  const fetchCountries = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}location/countries`
      );

      console.log("API Response:", response.data); // Debugging line

      if (Array.isArray(response.data)) {
        setCountries(
          response.data.map((c) => ({ label: c.name, value: c.id }))
        );
      } else if (response.data && Array.isArray(response.data.countries)) {
        // If the data is wrapped in an object
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
      console.log("States API Response:", response.data);

      if (Array.isArray(response.data)) {
        setStates(response.data.map((s) => ({ label: s.name, value: s.id })));
      } else if (response.data && Array.isArray(response.data.states)) {
        setStates(
          response.data.states.map((s) => ({ label: s.name, value: s.id }))
        );
      } else {
        console.error(
          "Unexpected API response format for states:",
          response.data
        );
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
      console.log("Cities API Response:", response.data);

      if (Array.isArray(response.data)) {
        setCities(response.data.map((c) => ({ label: c.name, value: c.id })));
      } else if (response.data && Array.isArray(response.data.cities)) {
        setCities(
          response.data.cities.map((c) => ({ label: c.name, value: c.id }))
        );
      } else {
        console.error(
          "Unexpected API response format for cities:",
          response.data
        );
      }
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setVenue((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));

    if (name === "country") {
      setStates([]);
      setCities([]);
      fetchStates(value);
    }

    if (name === "state") {
      setCities([]);
      fetchCities(value);
    }


  };


  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${import.meta.env.VITE_API_MEDIA_URL}media/uploads`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status && response.data.fileUrl) {
        setVenue({ ...venue, imageUrl: response.data.fileUrl });
        setHeadshot(response.data.fileUrl);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };


const handleSubmit = async (e) => {
  e.preventDefault();

  // setLoading(true);
  let venueId = localStorage.getItem("venueId");

  try {
    if (!venueId) {
      const token = localStorage.getItem("token");
    const venueData = {
      name: venue.name,
      addressLine1: venue.addressLine1,
      addressLine2: venue.addressLine2,
      country: Number(venue.country),
      state: Number(venue.state),
      city: Number(venue.city),
      zipCode: venue.zipCode,
      phone: localStorage.getItem("phone"),
      email: localStorage.getItem("email"),
      isParent: true,
    };
    console.log("venue data",venueData)

    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}venues/add`,
      venueData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status === 201 || response.status === 200) {
      localStorage.setItem("venueId", response.data.id);
      console.log("✅ Venue created:", response.data);
      toast.success("Venue created successfully!");
      setVenue(venueData);
      setIsEditing(true);
    }
  } else{
    const token = localStorage.getItem("token");
    const venueData = {
      name: venue.name,
      addressLine1: venue.addressLine1,
      addressLine2: venue.addressLine2,
      country: Number(venue.country),
      state: Number(venue.state),
      city: Number(venue.city),
      zipCode: venue.zipCode,
      phone: localStorage.getItem("phone"),
      email: localStorage.getItem("email"),
      isParent: true,
      parentId: null,
      venueId: Number(localStorage.getItem("venueId")),
    };

    const response = await axios.put(
      `${import.meta.env.VITE_API_URL}venues`,
             
             venueData,
             {
               headers: {
                 "Content-Type": "application/json",
                 Authorization: `Bearer ${token}`,
               },
             }
           );
           console.log(response.data);
           if (response.status >= 200 && response.status < 300) {
             toast.success(
               `Venue ${isEditing ? "updated" : "created"} successfully!`
             )}

  }
} catch (error) {
    console.error("❌ Error creating venue:", error);
  }
}



  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="d-flex justify-content-between align-items-center mb-0">
          <div className="div">
            <p className="fw-semibold profilecard-font mb-0">PROFILE</p>
          </div>
          <div className="div">
            {/* <button type="button" className="btn btn-dark rounded-3 label-font" onClick={addVenue}>Add Location</button> */}

            <button type="submit" className="btn venue-btn label-font mb-0 ms-2">
              Submit
            </button>


          </div>

        </div>
        <hr />
        <ToastContainer position="top-right" reverseOrder={false} />
        <p className="text-muted label-font" style={{ color: "#525252" }}>
          This information will be shared with entertainers who are booked for
          Pique.
        </p>
        {loading ? (
          <div className="d-flex justify-content-center my-5">
            <div className="spinner-grow text-dark" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <>
            <div className="row mb-3 profile-font">
              <div className="col-md-12 col-sm-12">
                <label className="fw-medium label-font">Residence Name<span style={{ color: "red", display: "inline" }}>*</span></label>
                <Input
                  type="text"
                  className={`form-control ${errors.name ? "is-invalid" : ""}`}
                  name="name"
                  value={venue.name ?? ""}
                  onChange={handleChange}
                  placeholder="Enter your venue Name"
                />
                {errors.name && <div className="invalid-feedback">{errors.name}</div>}
              </div>
            </div>

            <div className="row mb-3 profile-font">
              <div className="col-md-6 col-sm-12">
                <label className=" fw-medium label-font mb-0">Address Line 1<span style={{ color: "red", display: "inline" }}>*</span></label>
                <p className="card-font mb-0">Street address, P.O. box, c/o</p>
                <Input
                  type="text"
                  name="addressLine1"
                  value={venue.addressLine1}
                  onChange={handleChange}
                  className={`form-control ${errors.addressLine1 ? "is-invalid" : ""}`}
                  placeholder="Street Address, P.O.box,c/o"
                />
                {errors.addressLine1 && <div className="text-danger">{errors.addressLine1}</div>}
              </div>
              <div className="col-md-6 col-sm-12">
                <label className="fw-medium label-font mb-0">Address Line 2<span style={{ color: "red", display: "inline" }}>*</span></label>
                <p className="card-font mb-0">Apartment, suite, unit, building, floor, etc.</p>
                <Input
                  type="text"
                  name="addressLine2"
                  value={venue.addressLine2}
                  onChange={handleChange}
                  className={`form-control ${errors.addressLine2 ? "is-invalid" : ""}`}
                  placeholder="Apartment,suite,unit,building,floor,etc."
                />
                {errors.addressLine2 && <div className="text-danger">{errors.addressLine2}</div>}
              </div>
            </div>

            <div className="row mb-3 profile-font">
              <div className="col-md-6 col-sm-12">
                <label className="fw-medium label-font">Country<span style={{ color: "red", display: "inline" }}>*</span></label>
                <Select
                  name="country"
                  options={countries}
                  value={venue.country}
                  onChange={handleChange}
                  defaultOption="--Select Country--"
                  className={`form-control ${errors.country ? "is-invalid" : ""}`}
                />
                {errors.country && <div className="text-danger">{errors.country}</div>}
              </div>
              <div className="col-md-6 col-sm-12">
                <label className="fw-medium label-font">State/Province<span style={{ color: "red", display: "inline" }}>*</span></label>
                <Select
                  name="state"
                  options={states}
                  value={venue.state}
                  onChange={handleChange}
                  defaultOption="--Select State--"
                  className={`form-control ${errors.state ? "is-invalid" : ""}`}
                />
                {errors.state && <div className="text-danger">{errors.state}</div>}
              </div>
            </div>

            <div className="row mb-3 profile-font">
              <div className="col-md-6 col-sm-12">
                <label className="fw-medium label-font">City<span style={{ color: "red", display: "inline" }}>*</span></label>
                <Select
                  name="city"
                  options={cities}
                  value={venue.city}
                  onChange={handleChange}
                  defaultOption="--Select City--"
                  className={`form-control ${errors.city ? "is-invalid" : ""}`}
                />
                {errors.city && <div className="text-danger">{errors.city}</div>}
              </div>
              <div className="col-md-6 col-sm-12">
                <label className="fw-medium label-font">ZIP/Postal Code<span style={{ color: "red", display: "inline" }}>*</span></label>
                <Input
                  name="zipCode"
                  value={venue.zipCode}
                  onChange={handleChange}
                  className={`form-control ${errors.zipCode ? "is-invalid" : ""}`}
                  placeholder="Enter zip code"
                />
                {errors.zipCode && <div className="text-danger">{errors.zipCode}</div>}
              </div>
            </div>

            <div className="row profile-font mb-2">
              <div className="col-md-6 col-sm-12">
                <label className=" fw-medium label-font">Contact Person Name</label>
                <Input
                  type="text"
                  name="name"
                  value={localStorage.getItem("userName")}
                  onChange={handleChange}
                  className="form-control label-font ps-3"
                  placeholder="Enter your email address"
                  disabled
                />
              </div>
              <div className="col-md-6 col-sm-12">
                <label className="fw-medium label-font">Contact Number</label>
                <Input
                  type="text"
                  name="phone"
                  value={localStorage.getItem("phone")}
                  onChange={handleChange}
                  className="form-control label-font ps-3"
                  placeholder="Enter phone number"
                  disabled
                />
              </div>
            </div>


          </>
        )}
      </form>
      {coordinates && (
  <div className="mt-4">
    <h5 className="mb-3">Map Location</h5>
    <MapView key={coordinates?.join(",")} coordinates={coordinates} />
  </div>
)}


    </>
  );
}
