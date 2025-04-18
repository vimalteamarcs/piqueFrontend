import React, { useState, useEffect } from "react";
import axios from "axios";
import DashLayoutEnter from "../../components/Entertainer/DashLayoutEnter";
import moment from "moment";
import EnterAccountSidebar from "../../components/Entertainer/EnterAccountSidebar";
import BookingDataContainer from "../../components/Entertainer/BookingDataContainer";
import { toast, ToastContainer } from "react-toastify";

export default function BookingRequest() {
  const [bookingRequests, setBookingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

  const fetchBookingRequests = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}entertainers/booking/request`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("booking",response.data)
      setBookingRequests(response.data.bookings || []);
    } catch (err) {
      console.error("Error fetching booking requests:", err);
      setError("Error fetching booking requests");
      setBookingRequests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookingRequests();
  }, []);



  const formatTime = (timeString) => {
    return timeString ? moment(timeString, "HH:mm:ss").format("hh:mm A") : "N/A";
  };
  
  
  const formatDate = (dateString) => {
    return dateString ? moment(dateString).format('MM/DD/YYYY') : "N/A";
  };

  // const handleBookingResponse = async (bookingId, isAccepted) => {
  //   try {
  //     const response = await axios.patch(
  //       `${import.meta.env.VITE_API_URL}entertainers/booking/response`,
  //       {
  //         bookingId,
  //         isAccepted,
  //       },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );
  //     console.log(response.data)
  //     setBookingRequests((prevRequests) =>
  //       prevRequests.map((request) =>
  //         request.id === bookingId ? { ...request, isAccepted } : request
  //       )
  //     );
  //     if (isAccepted === "accepted") {
  //       toast.success("Booking Accepted");
  //     } else {
  //       toast.error("Booking Rejected");
  //     }
  //   } catch (error) {
  //     console.error("Error updating booking status", error);
  //     toast.error("Failed to update booking status");
  //   }
  // };




  // const handleBookingResponse = async (bookingId, status) => {
  //   const body = {
  //     bookingId,
  //     status,
  //   };
  
  //   try {
  //     const response = await axios.patch(
  //       `${import.meta.env.VITE_API_URL}entertainers/booking/response`,
  //       body,
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${localStorage.getItem("token")}`,
  //         },
  //       }
  //     );
  //    console.log(response.data)
  //     toast.success(response.data.message);
  //     await fetchBookingRequests();
  //     // Update booking status in state
  //     setBookingRequests((prev) =>
  //       prev.map((booking) =>
  //         booking.id === bookingId ? { ...booking, status } : booking
  //       )
  //     );
  //   } catch (error) {
  //     console.error("Error updating booking status:", error);
  //     toast.error(error.response?.data?.message || "Failed to update booking status.");
  //   }
  // };
  
  
  const handleBookingResponse = async (bookingId, status) => {
    const body = {
      bookingId,
      status,
    };
  
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_API_URL}entertainers/booking/response`,
        body,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
  
      const { message, status: success } = response.data;
  
      if (success) {
        toast.success(message);
        await fetchBookingRequests();
        setBookingRequests((prev) =>
          prev.map((booking) =>
            booking.id === bookingId ? { ...booking, status } : booking
          )
        );
      } else {
        toast.warning(message); // show warning if already responded
      }
  
    } catch (error) {
      console.error("Error updating booking status:", error);
      toast.error(error.response?.data?.message || "Failed to update booking status.");
    }
  };
  
  
  

  return (
    <>
      <DashLayoutEnter title ="Booking Request" description="View and manage your bookings">
        
           <div className="container d-flex">
                    <EnterAccountSidebar/>
          <ToastContainer position="top-right" className="mt-5" />

                    <BookingDataContainer bookingRequests={bookingRequests} loading={loading} handleBookingResponse={handleBookingResponse} formatTime={formatTime}/>
                    </div>
      </DashLayoutEnter>
    </>
  );
}
