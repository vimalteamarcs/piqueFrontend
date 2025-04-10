import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

export default function EntertainerCalendarSidebar() {
  const location = useLocation();
  const isCalendarPage = location.pathname === "/entertainer/calendar";
  const [upcomingEvents, setUpcomingEvents] = useState([]);

  useEffect(() => {
    if (isCalendarPage) {
      fetchUpcomingEvents();
    }
  }, [isCalendarPage]);

  const fetchUpcomingEvents = async () => {
    const token = localStorage.getItem("token")
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}entertainers/events/upcoming`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data)
      setUpcomingEvents(response.data.data || []);
    } catch (error) {
      console.error("Failed to fetch upcoming events:", error);
    }
  };

  return (
    <>
      <div className="custom-entertainer-sidebar">
        <div className="profile-font">
          <p className="fs-5 fw-medium mb-1">
            <i className="fa-solid fa-chevron-left fs-6 me-2"></i>Calendar
          </p>
          <p className="profile-font ms-3">{moment().format('dddd, DD MMMM, YYYY')}</p>


          <nav className="nav flex-column position-relative">
            {[
              { to: "/entertainer/calendar", icon: "fa-calendar", label: "CALENDAR" },
              { to: "/entertainer/availabilityform", icon: "fa-calendar-check", label: "AVAILABILITY" },
              { to: "/ratings", icon: "fa-solid fa-arrows-rotate", label: "SYNC AN EXTERNAL CALENDAR" }
            ].map((item, idx) => (
              <NavLink
                key={idx}
                to={item.to}
                className={({ isActive }) =>
                  `nav-link py-2 px-3 d-flex align-items-center position-relative sidebar-link mb-2 ${isActive ? 'enter-active-link' : ''
                  }`
                }
              >
                <i className={`fa-regular ${item.icon} icon-transition`}></i>
                <span className="text-dark">{item.label}</span>
              </NavLink>
            ))}
          </nav>

          {/* Show Upcoming Events ONLY on the calendar page */}
          {isCalendarPage && (
            <div className="mt-2">
              <hr />
              <h6 className="fw-medium mb-3">Upcoming Events</h6>
              {upcomingEvents.length === 0 ? (
                <p className="text-muted">No upcoming events.</p>
              ) : (
                upcomingEvents.map((event, index) => (
                  // <div key={index}>
                  //   <p className="mb-1 fw-semibold">
                  //     {moment(event.startTime).format("DD-MMM-YYYY")}
                  //   </p>
                  //   <div className="d-flex align-item-center alert alert-primary">
                  //     <div className='d-flex flex-column'>
                  //       <p className="mb-1 text-muted">
                  //         <i className="fa-regular fa-clock me-2"></i>
                  //         {moment(event.startTime).format("hh:mm A")}
                  //       </p>
                  //     </div>
                  //     <p className="mb-1">{event.title}</p>
                  //     {/* <button className="btn btn-sm btn-outline-primary">View event</button> */}
                  //   </div>
                  // </div>

                  <div key={index} className="">
                    <p className="mb-1 fw-semibold">{moment(event.startTime).format("DD-MMM-YYYY")}</p>
                    <div className="mb-3 p-2 rounded alert alert-primary d-flex justify-content-between align-items-center">
                      <div className="">
                        <p className="mb-1 text-muted">
                          <i className="fa-regular fa-clock me-2"></i>
                          {moment(event.startTime).format("hh:mm A")}
                        </p>
                        <p className="mb-1">{event.title}</p>
                      </div>
                      <span className="badge bg-primary rounded-pill p-2 cursor">View event</span>
                    </div>
                  </div>

                ))
              )}

            </div>
          )}
        </div>
      </div>
    </>
  );
}

