import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';

export default function EntertainerCalendarSidebar() {
  const location = useLocation();
  const isCalendarPage = location.pathname === "/entertainer/calendar";

  const upcomingEvents = [
    {
      date: "19-MAR-2025",
      time: "12:30pm",
      title: "Facing the Reality",
    },
    {
      date: "20-MAR-2025",
      time: "12:30pm",
      title: "Facing the Reality",
    },
    {
      date: "20-MAR-2025",
      time: "12:30pm",
      title: "Facing the Reality",
    }
  ];

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
            <div className="mt-2"><hr />
              <h6 className="fw-medium mb-3">Upcoming Events</h6>
              {upcomingEvents.map((event, index) => (
                <div key={index} className="mb-3 p-2 rounded bg-light border">
                  <p className="mb-1 fw-semibold">{event.date}</p>
                  <p className="mb-1 text-muted">
                    <i className="fa-regular fa-clock me-2"></i>
                    {event.time}
                  </p>
                  <p className="mb-1">{event.title}</p>
                  <button className="btn btn-sm btn-outline-primary">View event</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
