import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Input from "../components/Input";
import { toast, ToastContainer } from "react-toastify";
import OtpVerifyModal from "../components/Venue/OtpVerifyModal";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    cpassword: "",
    phoneNumber: "",
    role: "venue",
    emailVerified: localStorage.getItem("status") === "verified",
  });

  const [showOtpModal, setShowOtpModal] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showCPassword, setShowCPassword] = useState(false);
  const [countries, setCountries] = useState([]);
  const [selectedCode, setSelectedCode] = useState("");
  const [loading, setLoading] = useState(true);
  // const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(() => {
    return localStorage.getItem("status") === "verified";
  });



  useEffect(() => {
    fetchCountryCodes();
  }, []);

  useEffect(() => {
    if (countries.length > 0) {
      fetchUserCountryCode();
    }
  }, [countries]); // Runs only when 'countries' is updated

  const fetchCountryCodes = async () => {
    try {
      const response = await fetch(import.meta.env.VITE_COUNTRIES_API);
      const data = await response.json();

      // Filter only India (IN) and United States (US)
      // const filteredCountries = data
      //   .filter((country) => ["IN", "US"].includes(country.cca2))
      //   .map((country) => ({
      //     name: country.name.common,
      //     code: `${country.idd.root}${country.idd.suffixes ? country.idd.suffixes[0] : ""}`,
      //     cca2: country.cca2,
      //   }));

      const filteredCountries = [
        { name: "IN", code: "+91", cca2: "IN" },
        { name: "US", code: "+1", cca2: "US" },
      ];

      setCountries(filteredCountries);
    } catch (error) {
      console.error("Error fetching country codes:", error);
    }
  };

  const fetchUserCountryCode = async () => {
    try {
      const response = await fetch(import.meta.env.VITE_GEOLOCATION_API);
      const data = await response.json();
      const userCountry = data.country_code; // e.g., "IN"


      const foundCountry = countries.find(
        (country) => country.cca2 === userCountry
      );
      if (foundCountry) {
        setSelectedCode(foundCountry.code);
      } else {
        console.warn("Country not found in the list.");
      }
    } catch (error) {
      console.error("Error fetching user country:", error);
    } finally {
      setLoading(false); // Mark loading as complete
    }
  };

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("userDetails"));
    if (storedData) {
      setFormData((prev) => ({
        ...prev,
        ...storedData, // Merge saved values (name, phoneNumber, emailVerified, etc.)
      }));

      if (storedData.emailVerified) {
        setIsEmailVerified(true);
      }
    }
  }, []);

  useEffect(() => {
    const status = localStorage.getItem("status");
    if (status === "verified") {
      setIsEmailVerified(true);
    }
  }, []);

  useEffect(() => {
    const verified = localStorage.getItem("status") === "verified";
    setIsEmailVerified(verified);
    setFormData((prev) => ({
      ...prev,
      emailVerified: verified,
    }));
  }, []);


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const toggleCPasswordVisibility = () => {
    setShowCPassword((prevState) => !prevState);
  };

  const handleRoleSelection = (role) => {
    setFormData((prevData) => ({
      ...prevData,
      role,
    }));
    if (role === "venue") {
      navigate("/signup/venue", { replace: true });
    } else if (role === "entertainer") {
      navigate("/signup/entertainer", { replace: true });
    }
  };

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    cpassword: "",
    phoneNumber: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

 

  const handleVerification = async () => {
    const userDetails = {
      name: formData.name,
      email: formData.email,
      phone: formData.phoneNumber,
    };

    // Store user details in localStorage
    localStorage.setItem("userDetails", JSON.stringify(userDetails));
    localStorage.setItem("case", "signup");

    try {
      const body = { email: formData.email };
      await axios.post(`${import.meta.env.VITE_API_URL}auth/send-otp`, body);
      setShowOtpModal(true);
      toast.success("OTP sent successfully to your mail!", {
        position: "top-right",
      });
    }  catch (err) {
      const errorMessage =
        err.response?.data?.message || "Something went wrong. Please try again.";
      toast.error(errorMessage, {
        position: "top-right",
      });
    }
  };

  const handleEmailVerified = () => {
    setIsEmailVerified(true);
    setFormData((prevFormData) => ({
      ...prevFormData,
      emailVerified: true,
    }));
    localStorage.setItem("status", "verified");
    setShowOtpModal(false); // Close modal after success
  };



  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {
      name: formData.name ? "" : "Name is required.",
      email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
        formData.email
      )
        ? ""
        : "Please enter a valid email address.",
      password:
        formData.password.length >= 6
          ? ""
          : "Password must be at least 6 characters long.",
      cpassword:
        formData.password === formData.cpassword
          ? ""
          : "Passwords do not match.",
      phoneNumber: /^[0-9]{10}$/.test(formData.phoneNumber)
        ? ""
        : "Phone number must be exactly 10 digits.",
      termsAndServices: isChecked ? "" : "You must agree to the Terms and Conditions.",
    };


    setErrors(newErrors);

    if (Object.values(newErrors).some((error) => error !== "")) {
      return;
    }
    if (!isChecked) {
      toast.error("Please agree to the Terms of Services and Privacy Policy.");
      return;
    }
    const data = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      phoneNumber: formData.phoneNumber,
      role: formData.role,
    };
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}auth/register`,
        data
      );
      // localStorage.removeItem("userDetails");
      // toast.success("Registration Successful!", { position: "top-right" });
      const token = response.data.token;
      const role = response.data.data.role;
      const userId = response.data.data.id;
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("userId", userId);
      localStorage.setItem("status", response.data.data.status);
      localStorage.setItem("userName", response.data.data.name);
      localStorage.setItem("phone", response.data.data.phoneNumber);
      if (role === "venue") {
        navigate("/venue");
      } else if (role === "entertainer") {
        navigate("/entertainer");
      } else {
        navigate("/error");
      }
    } catch (error) {
      if (error.response) {
        console.error("Registration Failed", error.response.data);
        toast.error(error.response.data.message, { position: "top-right" });
      } else if (error.request) {
        console.error("No response from server", error.request);
        toast.error("No response from server. Please try again.", {
          position: "top-right",
        });
      } else {
        console.error("Error", error.message);
        toast.error("An unexpected error occurred. Please try again.", {
          position: "top-right",
        });
      }
    }
  };

  return (
    <div className="sign-up-page">
      <Helmet>
        <title>
          {formData.role === "venue"
            ? "SignUp as Venue"
            : "SignUp as Entertainer"}
        </title>
        <meta
          name="description"
          content={`Register as a new  ${formData.role} and get started with our platform.`}
        />
      </Helmet>
      <ToastContainer />
      {/* <PiqueNavbar /> */}
      <div className="container min-vh-100">
        <div className="row mt-5">
          <div className="col-md-6 col-sm-12 d-none d-md-block">
            <div className="image-container">
              <img
                key={formData.role}
                src={
                  formData.role === "venue"
                    ? "./../assets/pique/image/venueregister.png"
                    : "./../assets/pique/image/entertainerRegister.png"
                }
                className="image-fluid"
                style={{ width: "90%", height: "90%" }}
                alt="signup-banner"
              />
            </div>
          </div>
          <div className="col-md-6 col-sm-12">
            <div className="row d-flex justify-content-center">
              <img
                src="./../assets/pique/image/logo.png"
                className="w-auto mt-3"
                style={{ height: "40px" }}
              />
            </div>
            <div className="row d-flex justify-content-around">
              <h3 className="text-center mt-4 fw-semibold">Signup</h3>
              <div className="col-md-10 col-sm-12 p-3 ">
                <form onSubmit={handleSubmit}>
                  <div className="role-container w-100 p-2">
                    <div className="role-selection-box w-100">
                      <div
                        className={`role-indicator ${formData.role === "venue" ? "left" : "right"
                          }`}
                      ></div>
                      <button
                      type="button"
                        className={`role-btn ${formData.role === "venue" ? "active" : ""
                          }`}
                        onClick={() => handleRoleSelection("venue")}
                      >
                        <p className="fw-light profile-font pt-2">
                          Signup as Venue
                        </p>
                      </button>
                      <button
                      type="button"
                        className={`role-btn ${formData.role === "entertainer" ? "active" : ""
                          }`}
                        onClick={() => handleRoleSelection("entertainer")}
                      >
                        <p className="fw-light profile-font pt-2">
                          Signup as Entertainer
                        </p>
                      </button>
                    </div>
                  </div>

                  <div className="row mt-4 mb-2 profile-font">
                    <div className="col-md-6">
                      <label className="text-start fw-semibold">
                        Name
                        <span style={{ color: "red", display: "inline" }}>
                          *
                        </span>
                      </label>
                      <Input
                        type="text"
                        placeholder="Enter your name"
                        className="input-line text-dark profile-font"
                        name="name"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                      />
                      {errors.name && (
                        <p className="text-danger profile-font text-start">
                          {errors.name}
                        </p>
                      )}
                    </div>
                    <div className="col-md-6">
                      <label className="text-start fw-semibold">
                        Contact Number
                        <span style={{ color: "red", display: "inline" }}>
                          *
                        </span>
                      </label>
                      <div className="contact-input">
                        <select
                          className="country-code profile-font"
                          style={{ width: "80px", textAlign: "center" }}
                          value={loading ? "Loading..." : selectedCode}
                          onChange={(e) => setSelectedCode(e.target.value)}
                        >
                          {countries.map((country, index) => (
                            <option key={index} value={country.code}>
                              {country.name.slice(0, 3)}
                              {country.code}
                            </option>
                          ))}
                        </select>
                        <Input
                          type="text"
                          placeholder="Enter Contact Number"
                          className="input-line text-dark profile-font"
                          style={{ flex: "1" }}
                          name="phoneNumber"
                          value={formData.phoneNumber}
                          onChange={(e) =>
                            setFormData({ ...formData, phoneNumber: e.target.value })
                          }
                        />
                      </div>
                      {errors.phoneNumber && (
                        <p className="text-danger profile-font text-start">
                          {errors.phoneNumber}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="row mb-2 profile-font">
                    <div className="col-md-9">
                      <label className="text-start fw-semibold">
                        Email
                        <span style={{ color: "red", display: "inline" }}>
                          *
                        </span>
                      </label>

                      <Input
                        type="email"
                        placeholder="Enter Email address"
                        name="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="input-line text-dark profile-font"
                        readOnly={formData.emailVerified}
                        disabled={formData.emailVerified}
                      />
                      {errors.email && (
                        <p className="text-danger profile-font text-start">
                          {errors.email}
                        </p>
                      )}
                    </div>
                    {/* <div className="col-md-3">
                      {formData.emailVerified ? (
                        // <span className="btn ms-2 mt-2 text-success fw-bold" style={{cursor:"default"}}>
                        //   ✅ Verified
                        // </span>
                        <div className="d-flex">
                          <p className="mt-4 me-2 fs-6 fw-bold text-primary">Verified</p>
                          <img src="./../assets/pique/image/verifiedTag.avif" height="30px" className="mt-4" />
                        </div>
                      ) : (
                        <button
                          type="button"
                          className="btn btn-outline-danger mt-4 rounded-3 btn-sm profile-font"
                          onClick={handleVerification}
                        >
                          Verify Email
                        </button>
                      )}
                    </div> */}

                    <div className="col-md-3">
                      {isEmailVerified ? (
                        <div className="d-flex">
                          <p className="mt-4 me-2 fs-6 fw-bold text-primary">Verified</p>
                          <img src="./../assets/pique/image/verifiedTag.avif" height="30px" className="mt-4" />
                        </div>
                      ) : (
                        <button
                          type="button"
                          className="btn btn-outline-danger mt-4 rounded-3 btn-sm profile-font"
                          onClick={handleVerification}
                        >
                          Verify Email
                        </button>
                      )}

                      {/* OTP Modal */}
                      {showOtpModal && (
                        <OtpVerifyModal
                          email={formData.email}
                          onSuccess={handleEmailVerified}
                          onClose={() => setShowOtpModal(false)}
                        />
                      )}
                    </div>

                  </div>

                  <div className="row mb-2">
                    <label className="text-start fw-semibold profile-font">
                      Create Password
                      <span style={{ color: "red", display: "inline" }}>*</span>
                    </label>

                    <Input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      className="input-line text-dark profile-font"
                      placeholder="Enter Password"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      showPassword={showPassword}
                      togglePasswordVisibility={togglePasswordVisibility}
                      disabled={!formData?.emailVerified}
                    />
                    {errors.password && (
                      <p className="text-danger profile-font text-start">
                        {errors.password}
                      </p>
                    )}
                  </div>

                  <div className="row mb-3">
                    <label className="text-start fw-semibold profile-font">
                      Confirm Password
                      <span style={{ color: "red", display: "inline" }}>*</span>
                    </label>

                    <Input
                      type={showCPassword ? "text" : "password"}
                      name="cpassword"
                      className="input-line text-dark profile-font"
                      placeholder="Re-enter Password"
                      value={formData.cpassword}
                      onChange={(e) =>
                        setFormData({ ...formData, cpassword: e.target.value })
                      }
                      showPassword={showCPassword}
                      togglePasswordVisibility={toggleCPasswordVisibility}
                      disabled={!formData?.emailVerified}
                    />
                    {errors.cpassword && (
                      <p className="text-danger profile-font text-start">
                        {errors.cpassword}
                      </p>
                    )}
                  </div>
                  <div className="d-flex justify-content-between">
                    
                      
                        <input
                          type="checkbox"
                          id="terms&Services"
                          className="form-check-input me-2"
                          checked={isChecked}
                          onChange={(e) => setIsChecked(e.target.checked)}
                          name="termsAndServices"
                        />
                     
                      <div className="">
                        <label htmlFor="terms&Services" className="fw-light">
                          {/* <p className="termsServices">
                            By entering your information here, you affirm you
                            have read and agree to our
                            <Link to="">Terms of Services</Link>and{" "}
                            <Link to="">Privacy Policy</Link>
                          </p> */}
                          <p className="termsServices">
                            By entering your information here, you affirm you
                            have read and agree to our <Link to="/terms-and-conditions">
                               Terms of Services
                            </Link> and <Link to="/privacy-policy">Privacy Policy</Link>
                          </p>
                          {errors.termsAndServices && (
                            <p className="text-danger profile-font text-start">
                              {errors.termsAndServices}
                            </p>
                          )}
                        </label>
                      </div>

                    </div>
                  <button
                    type="submit"
                    className=" btn login-btn w-100"
                    label="Signup"
                    disabled={!formData?.emailVerified}
                  >
                    Signup
                  </button>
                </form>

                <hr />
                <p className="text-center profile-font">
                  Already have an account? <Link to="/login" className="text-primary fw-semibold" onClick={() => localStorage.removeItem("userDetails")}>
                    Login Now
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <PiqueFooter /> */}
    </div>
  );
};

export default Signup;
