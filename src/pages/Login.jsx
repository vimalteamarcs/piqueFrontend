import React, { useEffect, useState } from "react";
import axios from "axios";
import { Helmet } from "react-helmet-async";
import Button from "../components/Button";
import { Link, useNavigate } from "react-router-dom";
import Input from "../components/Input";
import { getFcmToken } from "../notifications/registerToken";
import { toast, ToastContainer } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const checkPasswordReset = () => {
      if (localStorage.getItem("passwordResetSuccess") === "true") {
        toast.success("Password reset successfully! Please log in.", {
          position: "top-center",
        });
        navigate("/login"); // Redirect to login page
        localStorage.removeItem("passwordResetSuccess"); // Remove flag
      }
    };

    window.addEventListener("storage", checkPasswordReset);

    return () => {
      window.removeEventListener("storage", checkPasswordReset);
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const validateForm = () => {
    let newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Enter a valid email address.";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required.";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Returns true if no errors
  };

  const handleResetPsw = async (e) => {
    e.preventDefault();

    if (!formData.email.trim()) {
      toast.error("Email is required", {
        position: "top-right",
      });
      return;
    }

    const body = { email: formData.email };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}auth/forgot-password`,
        body
      );
      console.log(response.data)
      toast.success("Password reset link sent to your registered  email", {
        position: "top-right",
      });

      // navigate("/reset-password", { state: { email: formData.email } });
    } catch (error) {
      // Check if the error has a response and a message, otherwise fallback to a generic message
      const errorMessage = error.response?.data?.message || error.message || "An error occurred. Please try again.";
    
      toast.error(errorMessage, {
        position: "top-right",
      });
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    const fcmToken = await getFcmToken();
    console.log("fcmtoken", fcmToken);
    
    const body = {
      email: formData.email,
      password: formData.password,
      fcmToken
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}auth/login`,
        body
      );


      const { access_token, data } = response.data;
      const { user } = data;
      const { isVerified, role, id, status, name, phone, email } = user;
      localStorage.setItem("token", access_token);
      localStorage.setItem("role", role);
      localStorage.setItem("userId", id);
      localStorage.setItem("status", status);
      localStorage.setItem("userName", name);
      localStorage.setItem("phone", phone);
      localStorage.setItem("email", email);
      window.dispatchEvent(new Event("storage"));

      if (!isVerified) {
        await axios.post(`${import.meta.env.VITE_API_URL}auth/user-verification`, {
          email,
        });

        localStorage.setItem("email", email);
        localStorage.setItem("case", "login");

        toast.success("Verification OTP sent to your email.");

        navigate("/otpverification", { state: { email: formData.email } });
        return;
      }

      // Store user data in local storage


      // Navigate based on role
      if (role === "venue") {
        navigate("/venue");
      } else {
        navigate("/entertainer");
      }
    } catch (error) {
      console.error("Login error", error);
      toast.error(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    }
  };




  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <Helmet>
        <title>Login</title>
        <meta
          name="description"
          content="Login to your account to access personalized features and services."
        />
      </Helmet>
      <ToastContainer />
      {/* <PiqueNavbar/> */}
      <div className="container min-vh-100 ">
        <div className="row d-flex justify-content-around mt-5">
          <div className="col-md-6 col-sm-12 d-none d-md-block">
            <img
              src="./assets/pique/image/login.png"
              className="img-fluid"
              style={{ height: "90%" }}
            />
          </div>
          <div className="col-md-6 col-sm-12">
            <div className="row mt-5 d-flex justify-content-center">
              <img
                src="./assets/pique/image/logo.png"
                className="w-auto mt-5"
                style={{ height: "40px" }}
              />
            </div>
            <div className="row d-flex justify-content-center">
              <h3 className="text-center mt-5 fw-semibold">Login</h3>
              <div className="col-md-10 col-sm-12 p-3 ">
                {/* {errorMessage && (
                  <div className="alert alert-danger" role="alert">
                    {errorMessage}
                  </div>
                )} */}
                <form onSubmit={handleSubmit} className="profile-font">
                  <div className="row ">
                    <label className="fw-semibold">
                      Email
                      <span style={{ color: "red", display: "inline" }}>*</span>
                    </label>
                    <Input
                      type="email"
                      placeholder="Enter email address"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="input-line text-dark profile-font"
                      error={errors.email}
                    />
                  </div>

                  <div className="row mt-2">
                    <label className="fw-semibold">
                      Password
                      <span style={{ color: "red", display: "inline" }}>*</span>
                    </label>
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      showPassword={showPassword}
                      togglePasswordVisibility={togglePasswordVisibility}
                      className="input-line text-dark profile-font"
                      error={errors.password}
                    />
                  </div>

                  <div className="d-flex justify-content-between mb-3 mt-3">
                    <div>
                      <input type="checkbox" id="rememberMe" className="m-1" />
                      <label htmlFor="rememberMe" className="profile-font">
                        Remember Me
                      </label>
                    </div>
                    <Button
                      className="btn btn-link text-primary profile-font"
                      onClick={handleResetPsw}
                    >
                      Forgot Password?
                    </Button>
                  </div>
                  <div className="row">
                    <div className="col d-flex justify-content-center">
                      <button
                        type="submit"
                        className="btn w-100 fw-bold login-btn rounded-3"
                        label="Login"
                      >
                        Login
                      </button>
                    </div>
                  </div>
                </form>
                <p className="text-center mt-3 profile-font">
                  Don't have an account? <Link to="/signup/venue" className="text-primary fw-semibold">
                    Signup Now
                  </Link>
                </p>

                <p className="text-center fw-semibold" style={{ fontSize: "12px" }}>
                  <Link to = "/terms-and-conditions" className="text-decoration-none text-black"> T&C</Link> |  <Link to="/privacy-policy" className="text-decoration-none text-black">Privacy Policy</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <PiqueFooter/> */}
    </>
  );
};

export default Login;
