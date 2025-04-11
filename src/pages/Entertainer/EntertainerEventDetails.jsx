import React, { useEffect, useState } from "react";
import EnterAccountSidebar from "../../components/Entertainer/EnterAccountSidebar";
import DashLayoutEnter from "../../components/Entertainer/DashLayoutEnter";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import EntertainerCalendarSidebar from "../../components/Entertainer/EntertainerCalendarSidebar";

export default function EntertainerEventDetails() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);

  useEffect(() => {
    const id = state?.id;

    if (!id) {
      navigate("/entertainer/events");
      return;
    }
    const fetchEvent = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}entertainers/events/details/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("event detail", res.data)
        setEvent(res.data?.data);
      } catch (err) {
        console.error("Error fetching event:", err);
      }
    };

    fetchEvent();
  }, [state, navigate]);

  const renderSidebar = state?.from === 'events' ? (
    <EnterAccountSidebar />
  ) : (
    <EntertainerCalendarSidebar />
  );

  return (
    <>
      <DashLayoutEnter
        title=""
        description="View your all bookings in the calendar"
      >
        <div className="container d-flex">
          {renderSidebar}
          <div className="entertainer-profile-container entrWrapper">
            <p className="subheadingPG mb-2 d-flex justify-content-between align-items-center">
              {" "}
              EVENT DETAILS{" "}
            </p>
            <hr className="mt-0 mb-2" />
            <p
              onClick={() => {
                if (state?.from === 'calendar') {
                  navigate('/entertainer/calendar');
                } else {
                  navigate('/entertainer/events');
                }
                
              }}
              style={{ cursor: "pointer" }}
            >
              <i className="fa-solid fa-chevron-left me-2"></i>Back
            </p>


            {event ? (
              <div className="row">
                <div className="col-md-6 profile-font">
                  <p>
                    <strong>Title:</strong> {event.title}
                  </p>
                  <p>
                    <strong>Location:</strong> {event.location}
                  </p>
                  <p>
                    <strong>Description:</strong> {event.description}
                  </p>
                  <p>
                    <strong>Start Time:</strong>{" "}
                    {new Date(event.startTime).toLocaleDateString(
                      "en-GB",
                      {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      }
                    )}
                  </p>
                  <p>
                    <strong>End Time:</strong>{" "}
                    {new Date(event.endTime).toLocaleDateString(
                      "en-GB",
                      {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      }
                    )}
                  </p>
                  <p>
                    <strong>Recurring:</strong> {event.recurring}
                  </p>
                </div>
                <div className="col-md-6 profile-font">
                  <p>
                    <strong>Status:</strong> {event.status}
                  </p>
                  <p>
                    <strong>Venue:</strong> {event.name},{" "}
                    {event.addressLine1}, {event.addressLine2}
                  </p>
                  <p>
                    <strong>Created By:</strong>{" "}
                    {event.isAdmin === 1 ? "Admin" : "Venue"}
                  </p>
                </div>
              </div>
            ) : (
              <p>Loading event details...</p>
            )}
          </div>

        </div>
      </DashLayoutEnter>
    </>
  );
}
