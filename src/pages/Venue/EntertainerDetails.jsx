import React, { useEffect, useState } from "react";
import PiqueFooter from "../../components/PiqueComponents/PiqueFooter";
import DashLayoutVenue from "../../components/Venue/DashLayoutVenue";
import Button from "../../components/Button";
import { useLocation, useNavigate } from "react-router-dom";
import SearchBar from "../../components/Venue/SearchBar";
import axios from "axios";
import Input from "../../components/Input";
import Select from "../../components/Select";
import { toast, ToastContainer } from "react-toastify";

export default function EntertainerDetails() {
  const imagePath = import.meta.env.VITE_LOGGEDIN_IMAGE_PATH;
  const location = useLocation();
  const navigate = useNavigate();
  const entertainerId = location.state?.entertainerId;
  const [entertainer, setEntertainer] = useState({});
  const [loading, setLoading] = useState(true);
  const [showTime, setShowTime] = useState("");
  const [showDate, setShowDate] = useState("");
  const [specialNotes, setSpecialNotes] = useState("");
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchEntertainerDetails = async () => {
      if (!entertainerId) {
        setLoading(false);
        return;
      }

      const token = localStorage.getItem("token");
      const apiUrl = `${
        import.meta.env.VITE_API_URL
      }venues/entertainer-profile/${entertainerId}`;

      try {
        const response = await axios.get(apiUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        console.log("entertainer details", response.data);
        setEntertainer(response.data?.data || {});
      } catch (error) {
        console.error("Error fetching entertainer details:", error);
        setEntertainer({});
      } finally {
        setLoading(false);
      }
    };

    fetchEntertainerDetails();
  }, [entertainerId]);

  useEffect(() => {
    const now = new Date();

    // Set time in hh:mm format
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    setShowTime(`${hours}:${minutes}`);

    // Set date in yyyy-mm-dd format
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const day = String(now.getDate()).padStart(2, "0");
    setShowDate(`${year}-${month}-${day}`);
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}event`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        setEvents(response.data.data || []);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  const validateForm = () => {
    const newErrors = {};

    if (!showTime) newErrors.showTime = "Time is required";
    if (!showDate) newErrors.showDate = "Date is required";
    if (!specialNotes) newErrors.specialNotes = "Special note is required";
    if (!selectedEvent) newErrors.selectedEvent = "Event selection is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const token = localStorage.getItem("token");
    const venueId = localStorage.getItem("venueId");
    // const entertainerId = localStorage.getItem("entertainerId");
    const entertainerId = location.state?.entertainerId || entertainer.id;

    const formData = new FormData(e.target);
    const showTime = formData.get("showTime");
    const showDate = formData.get("showDate");
    const specialNotes = formData.get("specialNotes");

    if (!showTime || !showDate) {
      alert("Please select show time and date.");
      return;
    }

    const bookingData = {
      entertainerId: Number(entertainerId),
      venueId: Number(venueId),
      performanceRole: entertainer.performanceRole,
      showTime: showTime,
      showDate: showDate,
      specialNotes: specialNotes,
      eventId: Number(selectedEvent),
    };
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}venues/createbooking`,
        bookingData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 201) {
        toast.success("Booking request sent successfully!", {
          autoClose: 1000,
        });
        setTimeout(() => {
          navigate(-1);
        }, 1000);
      } else {
        toast.error("Failed to send booking request.");
      }
    } catch (error) {
      toast.error("An error occurred while booking.");
    }
  };

  // const image = entertainer.media?.find((media) => media.type === "image")?.url;
  const headshot = entertainer?.media?.find(
    (media) => media.type === "headshot"
  )?.url;
  const validHeadshotUrl = headshot?.includes("https")
    ? headshot
    : "/assets/pique/image/comedian.avif";

  return (
    <DashLayoutVenue
      title="Entertainer Profile"
      description="View and book entertainer according to your preferences."
    >
      <div className="d-flex flex-column min-vh-100">
        <ToastContainer position="top-right" reverseOrder={false} />
        <SearchBar updateFilters={(filters) => setSearchParams(filters)} />
        <div className="container ">
          <p
            className="profile-font mt-3 fw-semibold text-decoration-none"
            onClick={() => navigate(-1)}
            style={{ cursor: "pointer" }}
          >
            <i className="fa-solid fa-angle-left me-2"></i>Back
          </p>

          <div className="d-flex justify-content-between align-items-center mb-0">
            <h4 className="fw-semibold mt-3">
              {entertainer.specific_category_name || entertainer.category_name}
            </h4>

            {/* <div className="div">
              <i className="fa-solid fa-arrow-up-from-bracket me-1 profile-font"></i>
              <span className="profile-font">Share</span>
              <i className="fa-solid fa-heart ms-3 me-1 profile-font"></i>
              <span className="profile-font">Wishlist</span>
            </div> */}
          </div>

          <div className="row d-flex justify-content-between column-gap-5">
            {/* {!loading && entertainer?.imageUrl ? ( */}
            <div className="row">
              {entertainer?.media?.some((media) => media.type === "image") ? (
                <>
                  <div className="col-md-7">
                    <img
                      src={
                        entertainer.media.find(
                          (media) => media.type === "image"
                        )?.url || "/assets/pique/image/magician.jpg"
                      }
                      alt="Main Entertainer Image"
                      className="img-fluid rounded-4 main-image"
                      style={{
                        width: "100%",
                        height: "400px",
                        objectFit: "cover",
                      }}
                    />
                  </div>

                  <div className="col-md-5 d-flex flex-wrap gap-3">
                    {entertainer?.media?.filter(
                      (media) => media.type === "image"
                    ).length > 1 ? (
                      entertainer.media
                        .filter((media) => media.type === "image")
                        .slice(1, 5)
                        .map((media, index) => (
                          <img
                            key={index}
                            src={
                              media.url || "/assets/pique/image/magician.jpg"
                            }
                            alt={`Entertainer Image ${index + 2}`}
                            className="img-fluid rounded-4 small-image"
                            style={{
                              width: "48%",
                              height: "190px",
                              objectFit: "cover",
                            }}
                          />
                        ))
                    ) : (
                      <p className="profile-font text-muted">
                        No additional media available
                      </p>
                    )}
                  </div>
                </>
              ) : (
                <p className="profile-font text-muted">
                  No media available for this entertainer.
                </p>
              )}
            </div>

            <div className="row booking-row mt-5">
              <div className="col-md-8">
                <div className="row booking-heading">
                  <div className="col-md-3">
                    <h5 className="fw-semibold">Booking Info</h5>
                  </div>
                  <div className="col-md-9 entertainer-details">
                    {[
                      ["Entertainer Name:", entertainer.username],
                      [
                        "Category:",
                        entertainer.specific_category_name ||
                          entertainer.category_name,
                      ],
                      ["Pricing (per hour):", `$ ${entertainer.pricePerEvent}`],
                    ].map(([label, value], index) => (
                      <div
                        className="d-flex justify-content-between align-items-start flex-wrap mb-2"
                        key={index}
                      >
                        <p className="profile-font fw-semibold mb-0 me-2">
                          {label}
                        </p>
                        <p className="profile-font mb-0 flex-grow-1">{value}</p>
                      </div>
                    ))}
                    <hr />
                    <div className="about-section">
                      <p className="fw-semibold mb-4">About</p>
                      <p className="profile-font">{entertainer.bio}</p>
                    </div>

                    {Array.isArray(entertainer?.services) &&
                      entertainer.services.length > 0 && (
                        <>
                          <hr />
                          <div className="what-you-get">
                            <p className="fw-semibold mb-4">
                              What will you get
                            </p>
                            <ul className="">
                              {entertainer.services.map((service, index) => (
                                <li key={index} className="timeline-item2">
                                  <span className="paraTxt profile-font">
                                    {service}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </>
                      )}
                    {entertainer?.availability &&
                      Array.isArray(entertainer.availability) &&
                      entertainer.availability.length > 0 && (
                        <>
                          <hr />
                          <div className="availability">
                            <p className="fw-semibold mb-4">Availability</p>
                            <ul
                              style={{ listStyleType: "none", paddingLeft: 0 }}
                            >
                              {entertainer.availability.map(
                                (availability, index) => {
                                  const formatTime = (time) => {
                                    const [hours] = time.split(":");
                                    const date = new Date();
                                    date.setHours(hours, 0);
                                    const formattedTime = date.toLocaleString(
                                      "en-US",
                                      { hour: "numeric", hour12: true }
                                    );
                                    return formattedTime.toLowerCase();
                                  };

                                  const formattedStartTime = formatTime(
                                    availability.startTime
                                  );
                                  const formattedEndTime = formatTime(
                                    availability.endTime
                                  );

                                  return (
                                    <li key={index} className="profile-font">
                                      {`${availability.dayOfWeek} - ${formattedStartTime} to ${formattedEndTime}`}
                                    </li>
                                  );
                                }
                              )}
                            </ul>
                          </div>
                        </>
                      )}

                    {entertainer?.unavailability &&
                      Array.isArray(entertainer.unavailability) &&
                      entertainer.unavailability.length > 0 && (
                        <>
                          <hr />
                          <div className="unavailability">
                            <p className="fw-semibold mb-4">
                              Unavailable Dates
                            </p>
                            <ul
                              style={{ listStyleType: "none", paddingLeft: 0 }}
                            >
                              {entertainer.unavailability.map((date, index) => {
                                const formatDate = (dateString) => {
                                  const dateObj = new Date(dateString);
                                  const options = {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                  };
                                  return dateObj.toLocaleDateString(
                                    "en-GB",
                                    options
                                  );
                                };

                                return (
                                  <li key={index} className="profile-font">
                                    {formatDate(date)}
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                        </>
                      )}

                    {entertainer?.bookedFor?.length === 0 && (
                      <div className="availability">
                        <p className="fw-semibold mb-4">Availability</p>
                        <p className="profile-font">
                          {entertainer.availability || "Not Available"}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="col-md-4 ">
                <div className="d-flex flex-column align-items-center">
                  {entertainer?.vaccinated && (
                    <span
                      className={`vaccination-badge ${
                        entertainer.vaccinated === "yes"
                          ? "vaccinated-orangered"
                          : "vaccinated-red"
                      }`}
                      style={{
                        padding: "6px 14px ",
                        border: "2px solid orangered ",
                        borderRadius: "16px ",
                        backgroundColor: "orangered ",
                        fontSize: "12px ",
                        // fontWeight: "bold ",
                        color: "white ",
                      }}
                    >
                      Vaccinated
                    </span>
                  )}
                  {entertainer?.media?.some(
                    (media) => media.type === "headshot"
                  ) ? (
                    <img
                      src={
                        entertainer.media.find(
                          (media) => media.type === "headshot"
                        )?.url || "/assets/pique/image/magician.jpg"
                      }
                      alt={entertainer?.entertainer_name || "No name available"}
                      className="img-fluid rounded-circle"
                      style={{
                        width: "200px",
                        height: "200px",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <p className="profile-font text-muted">
                      No headshot available
                    </p>
                  )}
                </div>

                <h5 className="text-center mt-3 mb-1">
                  {entertainer.specific_category_name}
                </h5>
                <p className="profile-font text-center mb-1">
                  By {entertainer.username}
                </p>
                <p className="star-font text-center">
                  4.5 <i className="fa-solid fa-star star-icon"></i>
                  <i className="fa-solid fa-star star-icon"></i>
                  <i className="fa-solid fa-star star-icon"></i>
                  <i className="fa-solid fa-star star-icon"></i>
                  <i className="fa-solid fa-star-half-stroke star-icon"></i>
                </p>

                <div className="booking-form">
                  <form onSubmit={handleBookingSubmit}>
                    <div className="row">
                      <div className="col-md-6">
                        <label className="icon-font fw-semibold">
                          Duration
                          <span style={{ color: "red", display: "inline" }}>
                            *
                          </span>
                        </label>
                        <Input
                          type="time"
                          className="form-control profile-font"
                          name="showTime"
                          value={showTime}
                          onChange={(e) => setShowTime(e.target.value)}
                        />
                        {errors.showTime && (
                          <small className="text-danger">
                            {errors.showTime}
                          </small>
                        )}
                      </div>
                      <div className="col-md-6">
                        <label className="icon-font fw-semibold">
                          Date of Event
                          <span style={{ color: "red", display: "inline" }}>
                            *
                          </span>
                        </label>
                        <Input
                          type="date"
                          className="form-control profile-font"
                          name="showDate"
                          value={showDate}
                          onChange={(e) => setShowDate(e.target.value)}
                        />
                        {errors.showDate && (
                          <small className="text-danger">
                            {errors.showDate}
                          </small>
                        )}
                      </div>
                    </div>
                    <hr />
                    <div className="div">
                      <label className="icon-font fw-semibold">
                        Entertainers
                      </label>
                      <select
                        className="form-select profile-font rounded-3"
                        aria-label="Default select example"
                        // value={performanceRole}
                      >
                        <option value="default">Soloist</option>
                        <option value="1">Duo</option>
                        <option value="2">Trio</option>
                      </select>
                    </div>
                    <hr />
                    <p className="mt-2 icon-font mb-1 fw-semibold">
                      Special Notes
                      <span style={{ color: "red", display: "inline" }}>*</span>
                    </p>
                    <textarea
                      className="form-control profile-font"
                      placeholder="Enter your message here..."
                      rows="2"
                      value={specialNotes}
                      name="specialNotes"
                      onChange={(e) => setSpecialNotes(e.target.value)}
                    />
                    {errors.specialNotes && (
                      <small className="text-danger">
                        {errors.specialNotes}
                      </small>
                    )}

                    <hr />
                    <p className="mt-2 icon-font mb-1 fw-semibold">
                      Choose Event
                      <span style={{ color: "red", display: "inline" }}>*</span>
                    </p>
                    <select
                      name="eventId"
                      value={selectedEvent}
                      onChange={(e) => setSelectedEvent(e.target.value)}
                      className="form-control profile-font"
                    >
                      <option value="">--Select Event--</option>
                      {events.map((event) => (
                        <option key={event.id} value={event.id}>
                          {event.title}
                        </option>
                      ))}
                    </select>
                    {errors.selectedEvent && (
                      <small className="text-danger">
                        {errors.selectedEvent}
                      </small>
                    )}

                    <Button
                      className="btn venue-btn w-100 mt-2 profile-font rounded-3 w-100 mt-3 text-white"
                      type="submit"
                      label="Send Booking Request"
                    />
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashLayoutVenue>
  );
}
