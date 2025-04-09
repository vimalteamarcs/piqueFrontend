// import React from 'react'
// import { NavLink } from 'react-router-dom'

// export default function EnterAccountSidebar() {
//     const imagePath = import.meta.env.VITE_LOGGEDIN_IMAGE_PATH;
//   return (
//     <>
//      <div className="custom-entertainer-sidebar">
//     <div className="p-2 profile-font">
//       <p className="fs-5 fw-medium mb-1">Account</p>
//       <p className="profile-font">Olivia Andrews, California, USA</p>
//       <nav className="nav flex-column position-relative">

//         {/* events */}
//         <NavLink to="/entertainer"
//         className="nav-link py-2 px-3 d-flex align-items-center position-relative sidebar-link mb-3">
//         <i className="fa-regular fa-bookmark icon-transition fs-5 ms-1"></i>
//         <span className="text-dark ms-4">EVENTS</span>
//         </NavLink>

//         {/* invoices */}
//         <NavLink to="./EntertainerInvoice.html" className="nav-link py-2 px-3 d-flex align-items-center position-relative sidebar-link mb-3">
//            <i className="fa-regular fa-clipboard ms-1 fs-5 icon-transition"></i> 
//           {/* <img src={`${imagePath}Icon fa-solid-file-invoice.svg`} className="me-3 fs-5 icon-transition"/> */}
//           <span className="text-dark ms-4">INVOICES & PAYMENTS</span>
//         </NavLink>

//         {/* notifications */}
//         <NavLink to="#" className="nav-link py-2 px-3 d-flex align-items-center position-relative sidebar-link mb-3">
//            <i className="fa-regular fa-bell ms-1 fs-5 icon-transition"></i> 
//           {/* <img src={`${imagePath}Icon fa-solid-bell.svg`} className="me-3 fs-5 icon-transition"/> */}
//           <span className="text-dark ms-4">NOTIFICATIONS</span>
//         </NavLink>

//         {/* ratings and reviews */}
//         <NavLink to="./EntertainerRatingsPage.html" className="nav-link py-2 px-3 d-flex align-items-center position-relative sidebar-link mb-3">
//           <i className="fa-regular fa-star fs-5 icon-transition"></i> 
//           {/* <img src={`${imagePath}Icon material-reviews.svg`} className="me-3 fs-5 icon-transition"/> */}
//           <span className="text-dark ms-4">RATINGS & REVIEWS</span>
//         </NavLink>


//         {/* gallery */}
//         <NavLink to="#"
//           className="nav-link py-2 px-3 d-flex align-items-center position-relative sidebar-link mb-3">
//             <i className="fa-regular fa-image fs-5 icon-transition ms-1"></i>
//           {/* <img src={`${imagePath}Icon ion-images.svg`} className="me-3 fs-5 icon-transition"/> */}
//           <span className="text-dark ms-4">GALLERY</span>
//         </NavLink>


//         {/* profile */}
//         <NavLink to="/entertainer/profile"
//           className="nav-link py-2 px-3 d-flex align-items-center position-relative sidebar-link mb-3">
//             <i className="fa-regular fa-user fs-5 icon-transition ms-1"></i>
//           {/* <img src={`${imagePath}Icon fa-solid-circle-user.svg`}/> */}
//           <span className="text-dark ms-4">PROFILE</span>
//         </NavLink>

//         {/* <NavLink to="/entertainer/bookingrequest"
//           className="nav-link py-2 px-3 d-flex align-items-center position-relative sidebar-link mb-3">
//           <img src={`${imagePath}Icon fa-solid-building.svg`} className="me-3 fs-5 icon-transition"/>
//           <span className="text-dark">BOOKINGS</span>
//         </NavLink> */}



//       </nav>
//     </div>
//   </div>
//     </>
//   )
// }

import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

export default function EnterAccountSidebar() {
  const location = useLocation();

  const isEventSubRoute = location.pathname.startsWith('/entertainer/bookingrequest') ||
    location.pathname.startsWith('/entertainer/events');

  const [isEventDropdownOpen, setIsEventDropdownOpen] = useState(isEventSubRoute);

  const toggleEventDropdown = () => {
    setIsEventDropdownOpen(!isEventDropdownOpen);
  };

  const isActiveSubRoute = (route) => location.pathname === route;

  return (
    <div className="custom-entertainer-sidebar">
      <div className="profile-font">
        <p className="fs-5 fw-medium mb-1">Account</p>
        <p className="profile-font">Olivia Andrews, California, USA</p>

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
            { to: "/notification", icon: "fa-bell", label: "NOTIFICATIONS" },
            { to: "/ratings", icon: "fa-star", label: "RATINGS & REVIEWS" },
            { to: "/gallery", icon: "fa-image", label: "GALLERY" },
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

