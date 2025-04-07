import React, { useEffect, useState } from "react";
import OtpInput from "react-otp-input";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

export default function OtpVerifyModal({ email,  onSuccess, onClose }) {
  const [otp, setOtp] = useState("");
//   const location = useLocation();
  const navigate = useNavigate();
//   const email = location.state?.email || "";
  const storedUserDetails = JSON.parse(localStorage.getItem("userDetails"));
//   const setIsEmailVerified = location.state?.setIsEmailVerified || (() => {});
  const [timeLeft, setTimeLeft] = useState(parseInt(localStorage.getItem("otpTimer")) || 90);
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
      localStorage.removeItem("otpTimer");
    }
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 90);
    const secs = seconds % 90;
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
          
            if (response.data.status) {
              toast.success(response.data.message || "Email verified successfully!");
              toast.success("Email verified!", { position: "top-right" });
              localStorage.setItem("userDetails", JSON.stringify({ ...userDetails, emailVerified: true }));
              localStorage.setItem("status", "verified");
              localStorage.removeItem("otpTimer");
              
              setVerified(true);
            //   setIsEmailVerified(true);
              if (onSuccess) onSuccess();

              if (onClose) onClose();

          
            //   if (Usercase === "signup") {
            //     setTimeout(() => navigate("/signup/venue"), 2000);
            //   } else {
            //     const role = storedUserDetails?.role || "";
            //     if (role === "venue") {
            //       navigate("/venue");
            //     } else if (role === "entertainer") {
            //       navigate("/entertainer");
            //     } else {
            //       navigate("/error");
            //     }
            //   }
            } else {
              toast.error("Invalid OTP, please try again.", { position: "top-center" });
            }
          } catch (error) {
            console.error("OTP Verification Error:", error);
            toast.error("Something went wrong. Please try again later.", { position: "top-center" });
          }
          
  };

  const handleResendOtp = async () => {
    setResending(true);
    try {
      const body = { email };
      const response = await axios.post(`${import.meta.env.VITE_API_URL}auth/send-otp`, body);
      console.log(response)
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

      {/* Bootstrap Modal */}
      <div className="modal fade show d-block" tabIndex="-1" role="dialog">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content p-4">
            <div className="modal-header border-0">
              <h5 className="modal-title fw-bold text-danger">Authenticate Your Account</h5>
            </div>

            <div className="modal-body">
              <p className="text-secondary mb-4">
                Please enter the code sent to your email.
              </p>

              <div className="d-flex justify-content-center">
                <OtpInput
                  value={otp}
                  onChange={setOtp}
                  numInputs={6}
                  renderSeparator={<span className="mx-2">-</span>}
                  renderInput={(props) => (
                    <input
                      {...props}
                      className="otp-input text-center mx-1 rounded-3"
                      style={{
                        width: "45px",
                        height: "50px",
                        border: "1px solid #646464",
                      }}
                    />
                  )}
                />
              </div>

              <p className="mt-3 fw-medium text-center">Time Left: {formatTime(timeLeft)}</p>

              <div className="d-grid gap-2 mt-4">
                <button
                  className="btn btn-success rounded-3"
                  onClick={handleVerifyOtp}
                  disabled={verifying}
                >
                  {verifying ? "Verifying..." : "Verify OTP"}
                </button>

                <button
                  className="btn btn-outline-secondary rounded-3"
                  onClick={handleResendOtp}
                  disabled={resending || timeLeft > 0}
                >
                  {resending ? "Resending..." : "Resend OTP"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Optional Modal Backdrop */}
      <div className="modal-backdrop fade show"></div>
    </>
  );
}