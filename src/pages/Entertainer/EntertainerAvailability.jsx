import React, { useEffect, useState } from "react";
import DashLayoutEnter from "../../components/Entertainer/DashLayoutEnter";
import EntertainerCalendarSidebar from "../../components/Entertainer/EntertainerCalendarSidebar";
import axios from "axios";

const days = ["S", "M", "T", "W", "T", "F", "S"];

const getMonthDetails = (year, month) => {
  const date = new Date(year, month, 1);
  const firstDay = date.getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();

  const dates = Array(firstDay).fill("");
  for (let i = 1; i <= lastDate; i++) {
    dates.push(i);
  }
  return dates;
};

const eventDaysMap = {
  "2025-2": [19, 20, 21],
};

const Calendar = ({ unavailableDates, setUnavailableDates }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const toggleUnavailable = (date) => {
    const dateKey = `${currentYear}-${currentMonth}-${date}`;
    setUnavailableDates((prev) =>
      prev.includes(dateKey)
        ? prev.filter((d) => d !== dateKey)
        : [...prev, dateKey]
    );
  };

  const isUnavailable = (date) => {
    const dateKey = `${currentYear}-${currentMonth}-${date}`;
    return unavailableDates.includes(dateKey);
  };

  const dates = getMonthDetails(currentYear, currentMonth);
  const eventDays = eventDaysMap[`${currentYear}-${currentMonth}`] || [];

  return (
    <div className="calendar-container">
      <div className="calendar-header d-flex justify-content-between align-items-center mb-3">
        <strong>
          {monthNames[currentMonth].toUpperCase()} {currentYear}
        </strong>
        <div>
          <button className="nav-btn" onClick={handlePrevMonth}>
            &lt;
          </button>
          <button className="nav-btn" onClick={handleNextMonth}>
            &gt;
          </button>
        </div>
      </div>

      <div className="calendar-grid">
        {days.map((day, idx) => (
          <div key={idx} className="day-header">
            {day}
          </div>
        ))}

        {dates.map((date, idx) => (
          <div
            key={idx}
            className={`date-cell ${
              date && isUnavailable(date) ? "unavailable" : ""
            }`}
            onClick={() => date && toggleUnavailable(date)}
            style={{
              position: "relative",
              cursor: date ? "pointer" : "default",
            }}
          >
            {date && (
              <>
                <span>{date}</span>
                {isUnavailable(date) && (
                  <i
                    className="fa-solid fa-xmark text-danger"
                    style={{
                      position: "absolute",
                      top: "6px",
                      right: "7px",
                      fontSize: "1.2rem",
                    }}
                  ></i>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
export default function EntertainerAvailability() {
  const [unavailableDates, setUnavailableDates] = useState([]);
  const [availability, setAvailability] = useState([
    { day: "Monday", available: false, from: "", to: "" },
    { day: "Tuesday", available: false, from: "", to: "" },
    { day: "Wednesday", available: false, from: "", to: "" },
    { day: "Thursday", available: false, from: "", to: "" },
    { day: "Friday", available: false, from: "", to: "" },
    { day: "Saturday", available: false, from: "", to: "" },
    { day: "Sunday", available: false, from: "", to: "" },
  ]);

  useEffect(() => {
    const fetchAvailabilityData = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}availability`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response.data)
        const data = response.data;
  
        // Set availability slots
        const updatedAvailability = availability.map((slot) => {
          const match = data?.availability?.slots?.find(
            (s) => s.dayOfWeek === slot.day
          );
          return match
            ? {
                ...slot,
                available: true,
                from: match.startTime,
                to: match.endTime,
              }
            : slot;
        });
  
        // Set unavailable dates
        const updatedUnavailableDates =
          data?.unavailability?.dates?.map((d) => {
            const parts = d.split("-");
            return `${parts[0]}-${parseInt(parts[1]) - 1}-${parts[2]}`;
          }) || [];
  
        setAvailability(updatedAvailability);
        setUnavailableDates(updatedUnavailableDates);
      } catch (error) {
        console.error("Error fetching availability:", error);
      }
    };
  
    fetchAvailabilityData();
  }, []);
  

  const generateTimeOptions = () => {
    const times = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let min = 0; min < 60; min += 30) {
        const valueHour = hour.toString().padStart(2, "0");
        const valueMinute = min.toString().padStart(2, "0");
        const value = `${valueHour}:${valueMinute}`;

        const suffix = hour >= 12 ? "PM" : "AM";
        const displayHour = hour % 12 === 0 ? 12 : hour % 12;
        const displayMinute =
          min === 0 ? "00" : min.toString().padStart(2, "0");
        const label = `${displayHour}:${displayMinute} ${suffix}`;

        times.push({ value, label });
      }
    }
    return times;
  };

  const timeOptions = generateTimeOptions();

  const handleAvailabilityChange = (index, field, value) => {
    const updated = [...availability];
    updated[index][field] = value;
    setAvailability(updated);
  };

  const handleSaveAvailability = async () => {
    const slots = availability
      .filter((slot) => slot.available && slot.from && slot.to)
      .map((slot) => ({
        dayOfWeek: slot.day,
        startTime: slot.from,
        endTime: slot.to,
      }));

    const formattedUnavailableDates = unavailableDates.map((dateKey) => {
      // Convert "2025-3-12" to "2025-04-12"
      const [year, month, day] = dateKey.split("-");
      const formattedMonth = (parseInt(month) + 1).toString().padStart(2, "0");
      const formattedDay = day.toString().padStart(2, "0");
      return `${year}-${formattedMonth}-${formattedDay}`;
    });

    const payload = {
      availability: {
        slots: slots,
      },
      unavailability: {
        dates:
          formattedUnavailableDates.length > 0 ? formattedUnavailableDates : [],
      },
    };
    console.log("Payload:", payload);
    const token = localStorage.getItem("token");
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}availability`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Saved successfully:", res.data);
      alert("Availability saved!");
    } catch (error) {
      console.error("Error saving availability:", error);
      alert("Something went wrong!");
    }
  };

  return (
    <DashLayoutEnter
      title=""
      description="View your all bookings in the calendar"
    >
      <div className="container d-flex">
        <EntertainerCalendarSidebar />
        <div className="entertainer-profile-container">
          <p className="subheadingPG mb-2 d-flex justify-content-between align-items-center">
            {" "}
            AVAILABILITY{" "}
          </p>
          <hr className="mt-0 mb-2" />
          <p className="mb-1">
            {" "}
            Leads will be restricted to your availability. To block a specific
            date and time, simply add it to your calendar.{" "}
          </p>

          <div className="row mt-4">
            <div className="col-12 col-md-6 e-time-slot">
              <p className="mb-0">What days are you available for events?</p>
              {/* <div className="d-flex align-items-center gap-2 mt-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="mondayCheck"
                />
                <label className="form-check-label me-3" htmlFor="mondayCheck">
                  Monday
                </label>

                <select
                  className="form-select w-auto"
                  style={{ minWidth: "110px" }}
                >
                  <option>12:00 am</option>
                  <option>1:00 am</option>
                  <option>2:00 am</option>
                </select>

                <span className="mx-3">to</span>

                <select
                  className="form-select w-auto"
                  style={{ minWidth: "110px" }}
                >
                  <option>12:00 am</option>
                  <option>1:00 am</option>
                  <option>2:00 am</option>
                </select>
              </div> */}
              {availability.map((dayData, index) => (
                <div
                  className="d-flex align-items-center gap-2 mt-3"
                  key={index}
                >
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id={`${dayData.day}Check`}
                    checked={dayData.available}
                    onChange={(e) =>
                      handleAvailabilityChange(
                        index,
                        "available",
                        e.target.checked
                      )
                    }
                  />
                  <label
                    className="form-check-label me-3"
                    htmlFor={`${dayData.day}Check`}
                  >
                    {dayData.day}
                  </label>

                  <select
                    className="form-select w-auto"
                    style={{ minWidth: "110px" }}
                    value={dayData.from}
                    onChange={(e) =>
                      handleAvailabilityChange(index, "from", e.target.value)
                    }
                    disabled={!dayData.available}
                  >
                    <option value="">From</option>
                    {timeOptions.map((time, idx) => (
                      <option key={idx} value={time.value}>
                        {time.label}
                      </option>
                    ))}
                  </select>

                  <span className="mx-3">to</span>
                  <select
                    className="form-select w-auto"
                    style={{ minWidth: "110px" }}
                    value={dayData.to}
                    onChange={(e) =>
                      handleAvailabilityChange(index, "to", e.target.value)
                    }
                    disabled={!dayData.available}
                  >
                    <option value="">To</option>
                    {timeOptions.map((time, idx) => (
                      <option key={idx} value={time.value}>
                        {time.label}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
            <div className="col-12 col-md-6 e-date-slot">
              <p className="mb-0">Oops! I am not available for these days:</p>
              <div className="">
                <Calendar
                  unavailableDates={unavailableDates}
                  setUnavailableDates={setUnavailableDates}
                />
              </div>
            </div>
            <div className="col-12 col-md-12 mt-3 text-end">
              <button
                type="button"
                className="btn enter-btn icon-font text-white rounded-3"
                onClick={handleSaveAvailability}
              >
                Save Availability
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashLayoutEnter>
  );
}
