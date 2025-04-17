

import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';

export default function EnterAccountSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const name = localStorage.getItem('userName')

  const isEventSubRoute = location.pathname.startsWith('/entertainer/bookingrequest') ||
    location.pathname.startsWith('/entertainer/events');

  const [isEventDropdownOpen, setIsEventDropdownOpen] = useState(isEventSubRoute);

  const handleNavigation = () => {
    navigate('/entertainer'); 
  };

  const toggleEventDropdown = () => {
    setIsEventDropdownOpen(!isEventDropdownOpen);
  };

  const isActiveSubRoute = (route) => location.pathname === route;

  return (
    <div className="custom-entertainer-sidebar">
      <div className="profile-font">
        <div className="d-flex cursor" onClick={handleNavigation}>
        <i class="fa-solid fa-chevron-left me-2 mt-2 fs-6"></i> <p className="fs-5 fw-medium mb-1">Account</p>

        </div>
        <p className="profile-font ms-3">{name}</p>

        <nav className="nav flex-column position-relative">
          {/* EVENTS Dropdown */}
          <div className="dropdown-section mb-3">
            <div
              className={`nav-link py-2 px-3 d-flex align-items-center justify-content-between sidebar-link ${isEventDropdownOpen ? 'enter-active-link' : ''
                }`}
              onClick={toggleEventDropdown}
              style={{ cursor: 'pointer', borderRadius: '6px' }}
            >
              <div className="d-flex align-items-center">
                <i className="fa-regular fa-bookmark icon-transition"></i>
                <span className="text-dark">EVENTS</span>
              </div>
              <i className={`fa-solid fa-chevron-${isEventDropdownOpen ? 'up' : 'down'}`}></i>
            </div>

            {isEventDropdownOpen && (
              <div className="dropdown-menu-sub ps-4 pt-2">
                <NavLink
                  to="/entertainer/bookingrequest"
                  className={({ isActive }) =>
                    `nav-link py-1 sidebar-sub-link d-flex align-items-center ${isActive ? 'active-sub' : 'inactive-sub'
                    }`
                  }
                >
                  <span className={`dot-indicator me-3 ${location.pathname === '/entertainer/bookingrequest' ? 'dot-blue' : 'dot-grey'}`}></span>
                  Bookings
                </NavLink>

                <NavLink
                  to="/entertainer/events"
                  className={({ isActive }) =>
                    `nav-link py-1 sidebar-sub-link d-flex align-items-center ${isActive ? 'active-sub' : 'inactive-sub'
                    }`
                  }
                >
                  <span className={`dot-indicator me-3 ${location.pathname === '/entertainer/events' ? 'dot-blue' : 'dot-grey'}`}></span>
                  Events List
                </NavLink>
              </div>
            )}

          </div>

          {/* Other links */}
          {[
            { to: "/entertainer/invoice", icon: "fa-clipboard", label: "INVOICES & PAYMENTS" },
            { to: "/entertainer/notifications", icon: "fa-bell", label: "NOTIFICATIONS" },
            { to: "/entertainer/reviews", icon: "fa-star", label: "RATINGS & REVIEWS" },
            { to: "/entertainer/gallery", icon: "fa-image", label: "GALLERY" },
            { to: "/entertainer/profile", icon: "fa-user", label: "PROFILE" }
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
      </div>
    </div>
  );
}

