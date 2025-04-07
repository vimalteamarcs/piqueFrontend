import React, { useEffect, useState } from "react";
import OtpInput from "react-otp-input";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";


export default function OtpVerification() {
  const [otp, setOtp] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || "";
  const storedUserDetails = JSON.parse(localStorage.getItem("userDetails"));
  // const email = storedUserDetails?.email || "";
  // console.log("email", email);
  
  const setIsEmailVerified = location.state?.setIsEmailVerified || (() => {});
  const [timeLeft, setTimeLeft] = useState(
    parseInt(localStorage.getItem("otpTimer")) || 90
  );
  const [verifying, setVerifying] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [verified, setVerified] = useState(false);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("userDetails"));
    const Usercase = localStorage.getItem("case"); 
  
    if (!storedData?.email && Usercase === "signup") {
      navigate("/signup/venue");
    } else {
      setUserDetails(storedData);
    }
  }, [navigate]);
  

  useEffect(() => {
    if (timeLeft > 0) {
      localStorage.setItem("otpTimer", timeLeft);
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      localStorage.removeItem("otpTimer"); // Remove when timer expires
    }
  }, [timeLeft]);

  // Function to format time as MM:SS
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setVerifying(true);
  
    const Usercase = localStorage.getItem("case");
    const body = { email, otp };
    const apiUrl =
      Usercase === "signup"
        ? `${import.meta.env.VITE_API_URL}auth/verify-otp`
        : `${import.meta.env.VITE_API_URL}auth/verify-email`;
  
    try {
      const response = await axios.post(apiUrl, body);
  
      const updatedData = { ...userDetails, emailVerified: true };
      localStorage.setItem("userDetails", JSON.stringify(updatedData));
  
      // Remove OTP timer
      localStorage.removeItem("otpTimer");
  
      setVerified(true);
      setIsEmailVerified(true);
  
      // Navigate based on case type
      if (Usercase === "signup") {
        setTimeout(() => navigate("/signup/venue"), 2000);
      } else {
        toast.success("Email verified successfully!", { position: "top-right" });
  
        const role = storedUserDetails?.role || "";
        if (role === "venue") {
          navigate("/venue");
        } else if (role === "entertainer") {
          navigate("/entertainer");
        } else {
          navigate("/error");
        }
      }

    } catch (error) {
      // console.log(error);
      toast.error("Invalid OTP, please try again.", { position: "top-center" });
    } finally {
      setVerifying(false);
    }
  };
  


  const handleResendOtp = async () => {
    setResending(true);
const body = {email}
    try {
    const response =  await axios.post(`${import.meta.env.VITE_API_URL}auth/send-otp`,body);
      toast.success("New OTP sent successfully!", { position: "top-right" });

      setTimeLeft(90);
      localStorage.setItem("otpTimer", 90);
    } catch (error) {
      toast.error("Failed to resend OTP. Please try again later.", {
        position: "top-center",
      });
    } finally {
      setResending(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="d-flex flex-column align-items-center justify-content-center vh-100">
        <p className="fw-bold text-danger fs-3 mb-2">
          Authenticate Your Account
        </p>
        <p className="text-secondary mb-4">
          Please enter the code sent to your email.
        </p>


        {/* OTP Input Wrapper */}
        <div className="d-flex justify-content-center">
          <OtpInput
            value={otp}
            onChange={setOtp}
            numInputs={6}
            renderSeparator={<span className="mx-2">-</span>}
            renderInput={(props) => (
              <input
                {...props}
                className="otp-input text-center mx-2 rounded-3"
                style={{
                  width: "60px",
                  height: "60px",
                  border: "1px solid #646464",
                }}
              />
            )}
          />
        </div>

        {/* Timer Display */}
        <p className="mt-3 fw-medium">Time Left: {formatTime(timeLeft)}</p>


<button className="btn btn-success rounded-3 mt-3" onClick={handleVerifyOtp} >Verify Otp</button>


<button className="btn btn-link btn-sm rounded-3 mt-3" onClick={handleResendOtp}>Resend Otp</button>
      </div>
    </>
  );
}


