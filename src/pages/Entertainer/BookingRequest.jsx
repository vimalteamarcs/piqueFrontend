import React, { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import DashLayoutEnter from "../../components/Entertainer/DashLayoutEnter";
import moment from "moment";
import EnterAccountSidebar from "../../components/Entertainer/EnterAccountSidebar";
import BookingDataContainer from "../../components/Entertainer/BookingDataContainer";

export default function BookingRequest() {
  const [bookingRequests, setBookingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
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
              console.log(response.data)
              setBookingRequests(response.data.bookings || []);
            //   setLoading(false);
          } catch (err) {
            console.error("Error fetching booking requests:", err);
            setError("Error fetching booking requests");
            setBookingRequests([]); 
          } finally {
            setLoading(false);
          }
        
    }

    fetchBookingRequests();
  }, [token]);

  const formatTime = (timeString) => {
    return timeString ? moment(timeString, "HH:mm:ss").format("hh:mm A") : "N/A";
  };
  
  
  const formatDate = (dateString) => {
    return dateString ? moment(dateString).format('MM/DD/YYYY') : "N/A";
  };

  const handleBookingResponse = async (bookingId, isAccepted) => {
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_API_URL}entertainers/booking/response`,
        {
          bookingId,
          isAccepted,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data)
      setBookingRequests((prevRequests) =>
        prevRequests.map((request) =>
          request.id === bookingId ? { ...request, isAccepted } : request
        )
      );
      if (isAccepted === "accepted") {
        toast.success("Booking Accepted");
      } else {
        toast.error("Booking Rejected");
      }
    } catch (error) {
      console.error("Error updating booking status", error);
      toast.error("Failed to update booking status");
    }
  };

  return (
    <>
      <DashLayoutEnter title ="Booking Request" description="View and manage your bookings">
          <Toaster position="top-center" reverseOrder={false} />
        
           <div className="container d-flex">
                    <EnterAccountSidebar/>
                    <BookingDataContainer bookingRequests={bookingRequests} loading={loading} formatTime={formatTime}/>
                    </div>
      </DashLayoutEnter>
    </>
  );
}
