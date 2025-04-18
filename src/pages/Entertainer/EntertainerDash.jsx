import React, { useEffect, useState } from "react";
import DashLayoutEnter from "../../components/Entertainer/DashLayoutEnter";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function EntertainerDash() {
  const imagePath = import.meta.env.VITE_LOGGEDIN_IMAGE_PATH;
  const apiUrl = import.meta.env.VITE_API_URL; // make sure this is set in your .env file
  const [dashboardData, setDashboardData] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [entertainer, setEntertainer] = useState(null);
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');



  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${apiUrl}entertainers/dashboard`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.data.status) {
          setDashboardData(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      }
    };

    const fetchBookings = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}entertainers/booking/request/pending`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
          
        );
        console.log(res.data);
        if (res.data?.status && Array.isArray(res.data.bookings)) {
          setBookings(res.data.bookings);
        }
      } catch (err) {
        console.error("Failed to fetch bookings:", err);
      }
    };

    fetchDashboardData();
    fetchBookings();
    fetchEntertainer();
  }, []);

  useEffect(() => {
    const fetchUpcomingEvents = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}entertainers/events/upcoming`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("events", response.data)
        setEvents(response.data?.data || []);
      } catch (error) {
        console.error("Failed to fetch events", error);
      }
    };

    fetchUpcomingEvents();
  }, []);


  const fetchEntertainer = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${apiUrl}entertainers`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data?.status) {
        setEntertainer(response.data.data);
      }
    } catch (err) {
      console.error("Error fetching entertainer", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <DashLayoutEnter
        title="Entertainer Dashboard"
        description="View and manage your data"
      >
        <div className="container">
          <div className="row gx-5">
            <div className="col-md-3 col-sm-12 col-12 position-relative profile-card" style={{marginTop:"30px"}}>
              {isLoading ? (
                <div className="image-container skeleton-loader rounded-4" />
              ) : (
                <div className="image-container position-relative">
                  <img
                    src={
                      entertainer?.headshotUrl ||
                      `${imagePath}magician-showing-trick.png`
                    }
                    alt="Entertainer"
                    className="w-100 h-100 rounded-4"
                    style={{
                      objectFit: "cover",
                      aspectRatio: "4/3",
                    }}
                  />
                  <button className="btn enter-btn text-white position-absolute end-0 me-4 mt-3" onClick={() => navigate("/entertainer/profile")}>
                    <i className="fa-solid fa-pen-to-square"></i>
                  </button>
                  <div className="overlay-content p-3 text-white position-absolute bottom-0 start-0">
                    <h5 className="fw-bold mb-1">
                      {entertainer?.category_name || "Category Name"}
                    </h5>
                    <p className="mb-0">
                      By {entertainer?.stageName || "Stage Name"}
                    </p>
                  </div>
                </div>
              )}

              <div className="col earned-dollars p-2 mt-2 rounded-4">
                <div className="d-flex justify-content-between">
                  <div className="details">
                    <p className="profile-font fw-semibold mb-0">
                      Earned Dollars
                    </p>
                    <p className="icon-font">Earnings this month</p>
                    <p className="chart-font fw-semibold mt-4 mb-0">
                      ${dashboardData?.revenue?.currentMonthRevenue ?? 0}
                    </p>
                  </div>
                  {dashboardData && dashboardData?.revenue && (
                    <div className="dollar-img">
                      <img
                        src={`${imagePath}dollarIcon.svg`}
                        className="pe-2"
                      />
                      <p className="percent-font mt-5 mb-0">
                        {dashboardData?.revenue?.revenueTrend !== "same" && (
                          <i
                            className={`fa-solid fa-arrow-${dashboardData.revenue.revenueTrend === "increase"
                              ? "up"
                              : "down"
                              }`}
                          ></i>
                        )}{" "}
                        {dashboardData.revenue.revenueChangePercentage ?? 0}%
                      </p>
                    </div>
                  )}
                </div>
              </div>
              <div className="col earned-dollars p-2 mt-2 rounded-4">
                <div className="d-flex justify-content-between">
                  <div className="details">
                    <p className="profile-font fw-semibold mb-0">Leads</p>
                    <p className="icon-font">Leads this month</p>
                    <p className="chart-font fw-semibold mt-4 mb-0">
                      {dashboardData?.bookings?.total?.currentMonthBookings ??
                        0}
                    </p>
                  </div>
                  {dashboardData && dashboardData?.bookings?.total && (
                    <div className="dollar-img">
                      <img src={`${imagePath}leadsIcon.svg`} />
                      <p className="percent-font mt-5 mb-0">
                        {dashboardData?.bookings?.total?.bookingTrend !==
                          "same" && (
                            <i
                              className={`fa-solid fa-arrow-${dashboardData.bookings.total.bookingTrend ===
                                "increase"
                                ? "up"
                                : "down"
                                }`}
                            ></i>
                          )}{" "}
                        {dashboardData?.bookings?.total
                          ?.bookingChangePercentage ?? 0}
                        %
                      </p>
                    </div>
                  )}
                </div>
              </div>
              <div className="col earned-dollars p-2 mt-2 rounded-4">
                <div className="d-flex justify-content-between">
                  <div className="details">
                    <p className="profile-font fw-semibold mb-0">Bookings</p>
                    <p className="icon-font">Requests this month</p>
                    <p className="chart-font fw-semibold mt-4 mb-0">
                      {dashboardData?.bookings?.pending?.currentMonthBookings ??
                        0}
                    </p>
                  </div>
                  {dashboardData?.bookings?.pending && (
                    <div className="dollar-img">
                      <img src={`${imagePath}savedIcon.svg`} />
                      <p className="percent-font mt-5 mb-0">
                        {dashboardData?.bookings?.pending?.bookingTrend !==
                          "same" && (
                            <i
                              className={`fa-solid fa-arrow-${dashboardData.bookings.pending.bookingTrend ===
                                "increase"
                                ? "up"
                                : "down"
                                }`}
                            ></i>
                          )}{" "}
                        {dashboardData?.bookings?.pending
                          ?.bookingChangePercentage ?? 0}
                        %
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="col earned-dollars p-2 mt-2 mb-2 rounded-4">
                <div className="d-flex justify-content-between">
                  <div className="details">
                    <p className="profile-font fw-semibold mb-0">
                      Bookings Closed
                    </p>
                    <p className="icon-font">Events this month</p>
                    <p className="chart-font fw-semibold mt-4 mb-0">
                      {dashboardData?.bookings?.completed
                        ?.currentMonthBookings ?? 0}
                    </p>
                  </div>
                  {dashboardData?.bookings?.completed && (
                    <div className="dollar-img">
                      <img
                        src={`${imagePath}closedBookingIcon.svg`}
                        className="pe-2"
                      />
                      <p className="percent-font mt-5 mb-0">
                        {dashboardData?.bookings?.completed?.bookingTrend !==
                          "same" && (
                            <i
                              className={`fa-solid fa-arrow-${dashboardData.bookings.completed.bookingTrend ===
                                "increase"
                                ? "up"
                                : "down"
                                }`}
                            ></i>
                          )}{" "}
                        {dashboardData?.bookings?.completed
                          ?.bookingChangePercentage ?? 0}
                        %
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* <div className=" col-md-4">
              <div className="d-flex justify-content-between">
                <p className="fw-semibold" style={{ fontSize: "16px" }}>
                  New Booking Requests
                </p>
                <a href="#" className="profile-font fw-semibold">
                  View All<i className="fa-solid fa-chevron-right"></i>
                  <i className="fa-solid fa-chevron-right"></i>
                </a>
              </div>

              <div className="row booking-request-table p-1">
                <table className="table table-responsive mb-4">
                  <thead className="profile-font">
                    <tr>
                      <th>Venue</th>
                      <th>Location</th>
                      <th>Date</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody className="profile-font">
                {bookings.length > 0 ? (
                  bookings.map((booking) => (
                    <tr key={booking.id}>
                      <td>{booking.name || "N/A"}</td>
                      <td>{`${booking.city ?? "City"}, ${booking.state ?? "State"}`}</td>
                      <td>{moment(booking.showDate).format("DD-MMM-YYYY")}</td>
                      <td>
                        <a href="#" className="btn btn-outline-secondary btn-sm">
                          <i className="fa-solid fa-eye"></i>
                        </a>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center">
                      No bookings available
                    </td>
                  </tr>
                )}
              </tbody>
                </table>
              </div>
            </div> */}
            <div className="col-md-9" style={{marginTop:"30px"}}>
              <div className="row">
                <div className="col-md-6">
                  <div className="d-flex justify-content-between">
                    <p className="fw-semibold" style={{ fontSize: "16px" }}>
                      New Booking Requests
                    </p>
                    <Link to="/entertainer/bookingrequest" className="profile-font fw-semibold">
                      View All<i className="fa-solid fa-chevron-right"></i>
                      <i className="fa-solid fa-chevron-right"></i>
                    </Link>
                  </div>

                  <div className="upcoming-events scrollable-container">
                    {bookings.length === 0 ? (
                      <div className="text-center text-muted py-3">
                        <i className="fa-solid fa-calendar-xmark fa-lg mb-2"></i>
                        <p className="mb-0">No bookings available</p>
                      </div>
                    ) : (
                      bookings.map((booking, index) => (
                        <div
                          key={booking.id}
                          className="row p-2 gx-5 bg-light rounded-3 mb-3 shadow-sm"
                        >
                          <div className="col-md-3">
                            <img
                              src={`${imagePath}profilePic.avif`}
                              style={{
                                height: "62px",
                                width: "73px",
                                borderRadius: "6px",
                                objectFit: "cover",
                              }}
                              alt="Event"
                            />
                          </div>
                          <div className="col-md-9">
                            <p className="dash-font fw-semibold mb-0">
                              {booking.name || "Untitled Venue"}
                            </p>
                            <p className="icon-font mb-1">
                              {booking.specialNotes || "No description available."}
                            </p>
                            <div className="d-flex flex-wrap">
                              <p className="icon-font text-start me-3">
                                <img
                                  src={`${imagePath}Icon akar-calendar.svg`}
                                  className="me-1"
                                  alt="calendar"
                                />
                                {moment(booking.showDate).format("DD-MMM-YYYY")}
                              </p>
                              <p className="icon-font">
                                <img
                                  src={`${imagePath}Icon akar-location.svg`}
                                  className="me-1"
                                  alt="location"
                                />
                                {`${booking.city_name || "City"}, ${booking.state_name || "State"
                                  }, ${booking.country_name || "country"}`}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>


                <div className="col-md-6 scrollable-container" >
                  <div className="d-flex justify-content-between">
                    <p className="fw-semibold" style={{ fontSize: "16px" }}>
                      Upcoming Events
                    </p>
                    <Link to="/entertainer/events" className="profile-font fw-semibold">
                      View All<i className="fa-solid fa-chevron-right"></i>
                      <i className="fa-solid fa-chevron-right"></i>
                    </Link>
                  </div>

                  <div className="upcoming-events mb-2">
                    {events.length === 0 ? (
                      <div className="text-center text-muted py-3">
                        <i className="fa-solid fa-calendar-xmark fa-lg mb-2"></i>
                        <p className="mb-0">No upcoming events</p>
                      </div>
                    ) : (
                      events.slice(0, 4).map((event) => (
                        <div key={event.event_id}>
                          <div className="overflow-hidden bg-light shadow-sm mb-3">
                            <div className="row p-2 gx-3">
                              <div className="col-md-3">
                                <img
                                  src={event.image_url || `${imagePath}profilePic.avif`}
                                  style={{
                                    height: "62px",
                                    width: "73px",
                                    borderRadius: "6px",
                                  }}
                                  alt="Event"
                                />

                              </div>
                              <div className="col-md-9">
                                <p className="dash-font fw-semibold mb-0">
                                  {event.title || "Event Title"}
                                </p>
                                <p className="icon-font mb-1">
                                  {event.description || "No description available."}
                                </p>
                                <div className="d-flex">
                                  <p className="icon-font text-start me-3">
                                    <img
                                      src={`${imagePath}Icon akar-calendar.svg`}
                                      className="me-1"
                                      alt="calendar"
                                    />
                                    {moment(event.startTime).format("DD-MMM-YYYY")}
                                  </p>
                                  <p className="icon-font">
                                    <img
                                      src={`${imagePath}Icon akar-location.svg`}
                                      className="me-1"
                                      alt="location"
                                    />
                                    {event.location || "Location"}
                                  </p>
                                </div>

                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </DashLayoutEnter>
    </>
  );
}
