import React, { useEffect, useState } from "react";
import Button from "../Button";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import EditEventModal from "./EditEventModal";
import CustomTable from "../CustomTable";

export default function EventList() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchText, setSearchText] = useState("");

  const fetchEvents = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}event`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      console.log("Events Response:", response.data);

      if (Array.isArray(response.data.data)) {
        setEvents(response.data.data);
      } else {
        console.error("Unexpected API response format:", response.data);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleClick = () => {
    navigate("/venue/addevents");
  };

  const handleEdit = (event) => {
    setSelectedEvent(event);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedEvent(null);
  };

  const handleSearchChange = (value) => {
    setSearchText(value);
  };
  

  const filteredEvents = events.filter((event) =>
    Object.values(event)
      .join(" ")
      .toLowerCase()
      .includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Start Date",
      dataIndex: "startTime",
      key: "startTime",
      render: (startTime) => (
        <>
          {new Date(startTime).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}{" "}
          |{" "}
          {new Date(startTime).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </>
      ),
    },
    {
      title: "End Date",
      dataIndex: "endTime",
      key: "endTime",
      render: (startTime) => (
        <>
          {new Date(startTime).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}{" "}
          |{" "}
          {new Date(startTime).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 60,
      render: (status) => {
        let badgeClass = "";
    
        switch (status) {
          case "confirmed":
            badgeClass = "badge-confirmed";
            break;
          case "pending":
            badgeClass = "badge-pending";
            break;
          case "rejected":
            badgeClass = "badge-declined";
            break;
          case "accepted":
            badgeClass = "bg-success badgeSucessBH";
            break;
            case "unpublished":
              badgeClass = "bg-secondary";
              break;
          default:
            badgeClass = "bg-secondary";
        }
    
        return (
          <span className={`badge ${badgeClass}`}>
            {status}
          </span>
        );
      },
    },
    {
      title: "Duration",
      dataIndex: "duration",
      key: "duration",
      render: (_, record) => {
        const startTime = new Date(record.startTime);
        const endTime = new Date(record.endTime);
        const durationInMs = endTime - startTime;
    
        // Calculate hours and minutes
        const hours = Math.floor(durationInMs / (1000 * 60 * 60)); // Convert to hours
        const minutes = Math.floor((durationInMs % (1000 * 60 * 60)) / (1000 * 60)); // Convert to minutes
    
        // If the duration is greater than or equal to 24 hours, show days
        if (hours >= 24) {
          const days = Math.floor(hours / 24);
          const remainingHours = hours % 24;
          return `${days}d ${remainingHours > 0 ? `${remainingHours}h` : ''}`;
        }
    
        // If no minutes, show just hours
        if (minutes === 0) {
          return `${hours}h`;
        }
    
        // Otherwise, show hours and minutes
        return `${hours}h ${minutes}m`;
      },
    },
    
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
    },
    {
      title: "Recurring",
      dataIndex: "recurring",
      key: "recurring",
    },
  ];

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-0">
        <div className="div">
          <p className="subheadingPG mb-2 d-flex justify-content-between align-items-center">EVENTS</p>
        </div>
        <div className="div">
          <Button
            className="btn venue-btn btn-sm profile-font"
            label="Add Events"
            onClick={handleClick}
          />
        </div>
      </div>
      <hr />
      {loading ? (
        <div className="d-flex justify-content-center my-5">
          <div className="spinner-grow text-dark" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : events.length > 0 ? (
        <CustomTable
          data={filteredEvents}
          columns={columns}
          onEdit={handleEdit}
          loading={loading}
          pagination={{
            current: 1,
            pageSize: 10,
            total: filteredEvents.length,
            showSizeChanger: false,
          }}
          search={searchText}
          onSearchChange={handleSearchChange}
        />
      ) : (
        <p>No events found.</p>
      )}


      {showModal && selectedEvent && (
        <EditEventModal event={selectedEvent} onClose={closeModal} fetchEvents={fetchEvents} />
      )}
    </>
  );
}
