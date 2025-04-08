// import React, { useEffect, useState } from "react";
// import FullCalendar from "@fullcalendar/react";
// import dayGridPlugin from "@fullcalendar/daygrid";
// import timeGridPlugin from "@fullcalendar/timegrid";
// import listPlugin from "@fullcalendar/list";
// import interactionPlugin from "@fullcalendar/interaction";
// import { Modal, Button, Badge, Form } from "react-bootstrap";
// import axios from "axios";

// const CalendarComponent = () => {
//   const cssclasses = {
//     completed: "fc-completed",
//     cancelled: "fc-cancelled",
//     unpublished: "fc-unpublished",
//     confirmed: "fc-confirmed",
//     scheduled: "fc-scheduled",
//   };

//   const [allEvents, setAllEvents] = useState([]);
//   const [events, setEvents] = useState([]);

//   const [selectedEvent, setSelectedEvent] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const [filter, setFilter] = useState("All");
//   const [currentMonth, setCurrentMonth] = useState(() => {
//     const now = new Date();
//     return now.toISOString().slice(0, 7); // "YYYY-MM"
//   });

//   const fetchEvents = async (monthStr) => {
//     console.log(monthStr);

//     try {
//       const token = localStorage.getItem("token");
//       const response = await axios.get(
//         `${
//           import.meta.env.VITE_API_URL
//         }entertainers/calendar/events?date=${monthStr}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       console.log("kjnbasdkjhb", response.data);

//       const formattedEvents = response.data.map((event, index) => {
//         const statusKey = event.status?.toLowerCase();
//         return {
//           id: (event.id || event.event_id || `event-${index}`).toString(),

//           title: event.title || event.name || "Untitled Event",
//           start: event.start || event.startTime || new Date().toISOString(),
//           end: event.end || event.endTime || new Date().toISOString(),

//           className:
//             statusKey && cssclasses[statusKey] ? cssclasses[statusKey] : "",

//           location: event.location || "TBD",
//           description: event.description || "",
//           organizer: event.organizer || "Admin",
//           status: event.status,
//           tags: event.tags || [],
//           type: event.type || "Entertainment",
//         };
//       });

//       setAllEvents(formattedEvents);
//       setEvents(formattedEvents);
//     } catch (error) {
//       console.error("Error fetching upcoming events:", error);
//     }
//   };

//   useEffect(() => {
//     fetchEvents(currentMonth);
//   }, [currentMonth]);

//   const handleEventClick = (info) => {
//     const event = allEvents.find((e) => e.id === info.event.id);
//     setSelectedEvent(event);
//     setShowModal(true);
//   };

//   const handleFilterChange = (e) => {
//     const value = e.target.value;
//     setFilter(value);

//     if (value === "All") {
//       setEvents(allEvents);
//     } else {
//       setEvents(
//         allEvents.filter(
//           (event) => event.status.toLowerCase() === value.toLowerCase()
//         )
//       );
//     }
//   };
//   const handleDatesSet = (arg) => {
//     const year = arg.start.getFullYear();
//     const month = String(arg.start.getMonth() + 1).padStart(2, "0");
//     const newMonth = `${year}-${month}`;
//     if (newMonth !== currentMonth) setCurrentMonth(newMonth);
//   };
//   return (
//     <div className="taskCalendar my-1">
//       <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap1">
//         <h4 className="mb-2 text-center">Event Calendar</h4>
//         <Form.Select
//           value={filter}
//           onChange={handleFilterChange}
//           className="w-auto calendar-filter-dropdown"
//           style={{ minWidth: "140px" }}
//         >
//           <option value="All">All</option>
//           <option value="Confirmed">Confirmed</option>
//           <option value="unpublished">Unpublished</option>
//           <option value="scheduled">Scheduled</option>
//           <option value="cancelled">Cancelled</option>
//           <option value="completed">Completed</option>
//         </Form.Select>
//       </div>

//       <FullCalendar
//         plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
//         initialView="dayGridMonth"
//         headerToolbar={{
//           start: "today prev,next",
//           center: "title",
//           end: "dayGridMonth,timeGridWeek,timeGridDay,listMonth",
//         }}
//         events={events}
//         selectable={true}

//         editable={true}
//         height="auto"
//         eventClick={handleEventClick}
//         datesSet={handleDatesSet}
//       />

//       {/* <FullCalendar
//         plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
//         initialView="dayGridMonth"
//         events={events}
//         eventClick={handleEventClick}
//         height="auto"
//         dayMaxEvents={2}
//       /> */}

//       {/* Modal */}
//       <Modal
//         show={showModal}
//         onHide={() => setShowModal(false)}
//         centered
//         size="lg"
//       >
//         <Modal.Header closeButton>
//           <div className="w-100">
//             <h5 className="mb-1">{selectedEvent?.title}</h5>
//             <small className="text-muted">Event</small>
//           </div>
//         </Modal.Header>
//         <Modal.Body>
//           <div className="row">
//             <div className="col-md-8">
//               <div className="mb-3">
//                 <i className="fa-solid fa-calendar-days mr-2 text-primary" />
//                 <strong>Date:</strong>{" "}
//                 {selectedEvent?.startTime
//                   ? new Date(selectedEvent.startTime).toLocaleString()
//                   : ""}{" "}
//                 -{" "}
//                 {selectedEvent?.endTime
//                   ? new Date(selectedEvent.endTime).toLocaleTimeString()
//                   : ""}
//               </div>
//               <div className="mb-3">
//                 <i className="fa-solid fa-location-dot mr-2 text-danger" />
//                 <strong>Location:</strong> {selectedEvent?.location}
//               </div>
//               <div className="mb-3">
//                 <i className="fa-solid fa-align-left mr-2 text-warning" />
//                 <strong>Description:</strong> {selectedEvent?.description}
//               </div>
//             </div>

//             <div className="col-md-4">
//               <div className="mb-3">
//                 <strong>Status:</strong>{" "}
//                 <Badge
//                   pill
//                   bg={
//                     selectedEvent?.status?.toLowerCase() === "confirmed"
//                       ? "success"
//                       : selectedEvent?.status?.toLowerCase() === "pending"
//                       ? "warning"
//                       : "secondary"
//                   }
//                   text={
//                     selectedEvent?.status?.toLowerCase() === "pending"
//                       ? "dark"
//                       : "white"
//                   }
//                 >
//                   {selectedEvent?.status}
//                 </Badge>
//               </div>
//               <div className="mb-3">
//                 <strong>Recurring:</strong>{" "}
//                 <span className="text-capitalize">
//                   {selectedEvent?.recurring}
//                 </span>
//               </div>
//               <div className="mb-3">
//                 <strong>Event ID:</strong> {selectedEvent?.event_id}
//               </div>
//               <div className="mb-3">
//                 <strong>Created By:</strong>{" "}
//                 {selectedEvent?.isAdmin ? "Admin" : "User"}
//               </div>
//             </div>
//           </div>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowModal(false)}>
//             Close
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </div>
//   );
// };

// export default CalendarComponent;

// import React, { useEffect, useState, useCallback, useRef } from "react";
// import FullCalendar from "@fullcalendar/react";
// import dayGridPlugin from "@fullcalendar/daygrid";
// import timeGridPlugin from "@fullcalendar/timegrid";
// import listPlugin from "@fullcalendar/list";
// import interactionPlugin from "@fullcalendar/interaction";
// import { Modal, Button, Badge, Form } from "react-bootstrap";
// import axios from "axios";

// const cssclasses = {
//   completed: "fc-completed",
//   cancelled: "fc-cancelled",
//   unpublished: "fc-unpublished",
//   confirmed: "fc-confirmed",
//   scheduled: "fc-scheduled",
// };

// const CalendarComponent = () => {
//   const [allEvents, setAllEvents] = useState([]);
//   const [events, setEvents] = useState([]);
//   const [selectedEvent, setSelectedEvent] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const [filter, setFilter] = useState("All");
//   const [currentMonth, setCurrentMonth] = useState(null);

//   const lastFetchedMonth = useRef(null); // ✅ Ref to track last fetched month

//   const fetchEvents = useCallback(async (monthStr) => {
//     if (lastFetchedMonth.current === monthStr) return; // ✅ Skip if already fetched
//     lastFetchedMonth.current = monthStr;

//     try {
//       const token = localStorage.getItem("token");
//       console.log(
//         "url",
//         `${
//           import.meta.env.VITE_API_URL
//         }entertainers/calendar/events?date=${monthStr}`
//       );

//       const { data } = await axios.get(
//         `${
//           import.meta.env.VITE_API_URL
//         }entertainers/calendar/events?date=${monthStr}`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       console.log("data", data);

//       if (Array.isArray(data.data) && data.data.length > 0) {
//         const formatted = data.data.map((event, i) => {
//           const statusKey = event.status?.toLowerCase();
//           const start = new Date(
//             event.start || event.startTime || event.date || new Date()
//           );
//           const end = new Date(
//             event.end || event.endTime || event.date || new Date()
//           );

//           return {
//             id: (event.id || event.event_id || `event-${i}`).toString(),
//             title: event.title || event.name || "Untitled Event",
//             start,
//             end,
//             className: cssclasses[statusKey] || "",
//             location: event.location || "TBD",
//             description: event.description || "",
//             organizer: event.organizer || "Admin",
//             status: event.status || "Unknown",
//             tags: event.tags || [],
//             type: event.type || "Entertainment",
//             recurring: event.recurring || "no",
//             isAdmin: !!event.isAdmin,
//             event_id: event.event_id || event.id || "",
//           };
//         });

//         setAllEvents(formatted);
//         setEvents(formatted);
//       } else {
//         setAllEvents([]);
//         setEvents([]);
//       }
//     } catch (err) {
//       console.error("Error fetching events:", err);
//     }
//   }, []);

//   // useEffect(() => {
//   //   const now = new Date().toISOString().slice(0, 7);
//   //   setCurrentMonth(now);
//   //   fetchEvents(now); // ✅ fetch on mount
//   // }, [fetchEvents]);
//   useEffect(() => {
//     if (currentMonth) {
//       fetchEvents(currentMonth);
//     } else {
//       fetchEvents(new Date().toISOString().slice(0, 7));
//     }
//   }, []);

//   const handleEventClick = ({ event }) => {
//     const found = allEvents.find((e) => e.id === event.id);
//     if (found) {
//       setSelectedEvent(found);
//       setShowModal(true);
//     }
//   };

//   const handleFilterChange = (e) => {
//     const value = e.target.value;
//     setFilter(value);

//     setEvents(
//       value === "All"
//         ? allEvents
//         : allEvents.filter(
//             (event) => event.status?.toLowerCase() === value.toLowerCase()
//           )
//     );
//   };

//  const handleDatesSet = ({ view }) => {
//    const year = view.currentStart.getFullYear();
//    const month = String(view.currentStart.getMonth() + 1).padStart(2, "0");
//    const newMonth = `${year}-${month}`;

//    if (newMonth !== currentMonth) {
//      setCurrentMonth(newMonth);
//      fetchEvents(newMonth);
//    }
//  };

//   return (
//     <div className="taskCalendar my-1">
//       <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap1">
//         <h4 className="mb-2 text-center">Event Calendar</h4>
//         <Form.Select
//           value={filter}
//           onChange={handleFilterChange}
//           className="w-auto calendar-filter-dropdown"
//           style={{ minWidth: "140px" }}
//         >
//           {[
//             "All",
//             "Confirmed",
//             "unpublished",
//             "scheduled",
//             "cancelled",
//             "completed",
//           ].map((status) => (
//             <option key={status} value={status}>
//               {status.charAt(0).toUpperCase() + status.slice(1)}
//             </option>
//           ))}
//         </Form.Select>
//       </div>

//       <FullCalendar
//         plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
//         initialView="dayGridMonth"
//         headerToolbar={{
//           start: "today prev,next",
//           center: "title",
//           end: "dayGridMonth,timeGridWeek,timeGridDay,listMonth",
//         }}
//         events={events}
//         selectable
//         editable
//         height="auto"
//         eventClick={handleEventClick}
//         datesSet={handleDatesSet}
//       />

//       {selectedEvent && (
//         <Modal
//           show={showModal}
//           onHide={() => setShowModal(false)}
//           centered
//           size="lg"
//         >
//           <Modal.Header closeButton>
//             <div className="w-100">
//               <h5 className="mb-1">{selectedEvent.title}</h5>
//               <small className="text-muted">Event</small>
//             </div>
//           </Modal.Header>
//           <Modal.Body>
//             <div className="row">
//               <div className="col-md-8">
//                 <div className="mb-3">
//                   <i className="fa-solid fa-calendar-days mr-2 text-primary" />
//                   <strong>
//                     Date:
//                   </strong> {selectedEvent.start.toLocaleString()} -{" "}
//                   {selectedEvent.end.toLocaleTimeString()}
//                 </div>
//                 <div className="mb-3">
//                   <i className="fa-solid fa-location-dot mr-2 text-danger" />
//                   <strong>Location:</strong> {selectedEvent.location}
//                 </div>
//                 <div className="mb-3">
//                   <i className="fa-solid fa-align-left mr-2 text-warning" />
//                   <strong>Description:</strong> {selectedEvent.description}
//                 </div>
//               </div>

//               <div className="col-md-4">
//                 <div className="mb-3">
//                   <strong>Status:</strong>{" "}
//                   <Badge
//                     pill
//                     bg={
//                       selectedEvent.status?.toLowerCase() === "confirmed"
//                         ? "success"
//                         : selectedEvent.status?.toLowerCase() === "pending"
//                         ? "warning"
//                         : "secondary"
//                     }
//                     text={
//                       selectedEvent.status?.toLowerCase() === "pending"
//                         ? "dark"
//                         : "white"
//                     }
//                   >
//                     {selectedEvent.status}
//                   </Badge>
//                 </div>
//                 <div className="mb-3">
//                   <strong>Recurring:</strong>{" "}
//                   <span className="text-capitalize">
//                     {selectedEvent.recurring}
//                   </span>
//                 </div>
//                 <div className="mb-3">
//                   <strong>Created By:</strong>{" "}
//                   {selectedEvent.isAdmin ? "Admin" : "User"}
//                 </div>
//               </div>
//             </div>
//           </Modal.Body>
//           <Modal.Footer>
//             <Button variant="secondary" onClick={() => setShowModal(false)}>
//               Close
//             </Button>
//           </Modal.Footer>
//         </Modal>
//       )}
//     </div>
//   );
// };

// export default CalendarComponent;

import React, { useEffect, useState, useCallback, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import { Modal, Button, Badge, Form } from "react-bootstrap";
import axios from "axios";

const cssclasses = {
  completed: "fc-completed",
  cancelled: "fc-cancelled",
  unpublished: "fc-unpublished",
  confirmed: "fc-confirmed",
  scheduled: "fc-scheduled",
};

const CalendarComponent = () => {
  const [allEvents, setAllEvents] = useState([]);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState("All");
  const [currentMonth, setCurrentMonth] = useState(null);
  const [dailyEvents, setDailyEvents] = useState([]);
  const [showDailyModal, setShowDailyModal] = useState(false);


  const lastFetchedMonth = useRef(null);

  const fetchEvents = useCallback(async (monthStr) => {
    if (lastFetchedMonth.current === monthStr) return;
    lastFetchedMonth.current = monthStr;

    try {
      const token = localStorage.getItem("token");

      const { data } = await axios.get(
        `${
          import.meta.env.VITE_API_URL
        }entertainers/calendar/events?date=${monthStr}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (Array.isArray(data.data) && data.data.length > 0) {
        const formatted = data.data.map((event, i) => {
          const statusKey = event.status?.toLowerCase();
          const start = new Date(
            event.start || event.startTime || event.date || new Date()
          );
          const end = new Date(
            event.end || event.endTime || event.date || new Date()
          );

          return {
            id: (event.id || event.event_id || `event-${i}`).toString(),
            title: event.title || event.name || "Untitled Event",
            start,
            end,
            className: cssclasses[statusKey] || "",
            location: event.location || "TBD",
            description: event.description || "",
            organizer: event.organizer || "Admin",
            status: event.status || "Unknown",
            tags: event.tags || [],
            type: event.type || "Entertainment",
            recurring: event.recurring || "no",
            isAdmin: !!event.isAdmin,
            event_id: event.event_id || event.id || "",
          };
        });

        setAllEvents(formatted);
        setEvents(formatted);
      } else {
        setAllEvents([]);
        setEvents([]);
      }
    } catch (err) {
      console.error("Error fetching events:", err);
    }
  }, []);

  useEffect(() => {
    if (currentMonth) {
      fetchEvents(currentMonth);
    } else {
      fetchEvents(new Date().toISOString().slice(0, 7));
    }
  }, []);

  const handleEventClick = ({ event }) => {
    const found = allEvents.find((e) => e.id === event.id);
    if (found) {
      setSelectedEvent(found);
      setShowModal(true);
    }
  };

  const handleFilterChange = (e) => {
    const value = e.target.value;
    setFilter(value);

    setEvents(
      value === "All"
        ? allEvents
        : allEvents.filter(
            (event) => event.status?.toLowerCase() === value.toLowerCase()
          )
    );
  };

  const handleDatesSet = ({ view }) => {
    const year = view.currentStart.getFullYear();
    const month = String(view.currentStart.getMonth() + 1).padStart(2, "0");
    const newMonth = `${year}-${month}`;

    if (newMonth !== currentMonth) {
      setCurrentMonth(newMonth);
      fetchEvents(newMonth);
    }
  };

  const [selectedDate, setselectedDate] = useState(null);
  const [popupPosition, setPopupPosition] = useState({
    top: "50%",
    left: "50%",
  });
  const handleMoreLinkClick = (info) => {
    const clickedDate = info.date;
    setselectedDate(clickedDate);

    // Get position from event target
    const rect = info.jsEvent?.target?.getBoundingClientRect?.();
    if (rect) {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      const scrollLeft =
        window.pageXOffset || document.documentElement.scrollLeft;

      setPopupPosition({
        top: `${rect.top + scrollTop + 5}px`,
        left: `${rect.left + scrollLeft}px`,
      });
    }

    const eventsForDay = allEvents.filter((e) => {
      const eventDate = new Date(e.start).toDateString();
      return eventDate === clickedDate.toDateString();
    });

    setDailyEvents(eventsForDay);
    setShowDailyModal(true);
  };

  return (
    <div className="taskCalendar my-1">
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap1">
        <h4 className="mb-2 text-center">Event Calendar</h4>
        <Form.Select
          value={filter}
          onChange={handleFilterChange}
          className="w-auto calendar-filter-dropdown"
          style={{ minWidth: "140px" }}
        >
          {[
            "All",
            "Confirmed",
            "unpublished",
            "scheduled",
            "cancelled",
            "completed",
          ].map((status) => (
            <option key={status} value={status}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </option>
          ))}
        </Form.Select>
      </div>

      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          start: "today prev,next",
          center: "title",
          end: "dayGridMonth,timeGridWeek,timeGridDay,listMonth",
        }}
        events={events}
        selectable
        editable
        height="auto"
        eventClick={handleEventClick}
        datesSet={handleDatesSet}
        dayMaxEvents={1}
        moreLinkClick={(info) => {
          handleMoreLinkClick(info);
          return true;
        }}
        moreLinkContent={(args) => {
          return (
            <div
              style={{
                backgroundColor: "#008AB4",
                color: "white",
                padding: "2px 6px",
                borderRadius: "4px",
                fontSize: "12px",
                display: "inline-block",
              }}
            >
              View {args.num} more
            </div>
          );
        }}
      />

      {/* Daily Modal */}
      
      <Modal
        show={showDailyModal}
        onHide={() => setShowDailyModal(false)}
        size="sm"
        className="custom-popup-modal"
        backdrop={false}
        style={{
          top: popupPosition.top,
          left: popupPosition.left,
          position: "absolute",
        }}
      >
        <Modal.Header closeButton>
          <div className="d-flex align-items-center gap-3 w-100">
            <div className="popup-date-circle">
              {selectedDate?.getDate()?.toString().padStart(2, "0") || "?"}
            </div>
            
          </div>
        </Modal.Header>

        <Modal.Body className="p-3 custom-popup-body">
          {dailyEvents.length > 0 ? (
            <div className="d-flex flex-column gap-3">
              {dailyEvents.map((event) => (
                <div
                  key={event.id}
                  className="event-card p-3 rounded shadow-sm"
                >
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <div className="status-dot bg-success rounded-circle d-flex align-items-center justify-content-center">
                      <i
                        className="fas fa-check text-white"
                        style={{ fontSize: "10px" }}
                      ></i>
                    </div>
                    <div className="event-time fw-semibold">
                      {new Date(event.start).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>

                  <div className="event-title mb-2">"{event.title}"</div>

                  <Button
                    variant="success"
                    size="sm"
                    className="px-3 py-1 view-btn"
                    onClick={() => {
                      setSelectedEvent(event);
                      setShowModal(true);
                      setShowDailyModal(false);
                    }}
                  >
                    View Event
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center">No events available.</p>
          )}
        </Modal.Body>
      </Modal>

      {/* Main Event Modal */}
      {selectedEvent && (
        <Modal
          show={showModal}
          onHide={() => setShowModal(false)}
          centered
          size="lg"
        >
          <Modal.Header closeButton>
            <div className="w-100">
              <h5 className="mb-1">{selectedEvent.title}</h5>
              <small className="text-muted">Event</small>
            </div>
          </Modal.Header>
          <Modal.Body>
            <div className="row">
              <div className="col-md-8">
                <div className="mb-3">
                  <i className="fa-solid fa-calendar-days mr-2 text-primary" />
                  <strong>
                    Date:
                  </strong> {selectedEvent.start.toLocaleString()} -{" "}
                  {selectedEvent.end.toLocaleTimeString()}
                </div>
                <div className="mb-3">
                  <i className="fa-solid fa-location-dot mr-2 text-danger" />
                  <strong>Location:</strong> {selectedEvent.location}
                </div>
                <div className="mb-3">
                  <i className="fa-solid fa-align-left mr-2 text-warning" />
                  <strong>Description:</strong> {selectedEvent.description}
                </div>
              </div>

              <div className="col-md-4">
                <div className="mb-3">
                  <strong>Status:</strong>{" "}
                  <Badge
                    pill
                    bg={
                      selectedEvent.status?.toLowerCase() === "confirmed"
                        ? "success"
                        : selectedEvent.status?.toLowerCase() === "pending"
                        ? "warning"
                        : "secondary"
                    }
                    text={
                      selectedEvent.status?.toLowerCase() === "pending"
                        ? "dark"
                        : "white"
                    }
                  >
                    {selectedEvent.status}
                  </Badge>
                </div>
                <div className="mb-3">
                  <strong>Recurring:</strong>{" "}
                  <span className="text-capitalize">
                    {selectedEvent.recurring}
                  </span>
                </div>
                <div className="mb-3">
                  <strong>Created By:</strong>{" "}
                  {selectedEvent.isAdmin ? "Admin" : "User"}
                </div>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default CalendarComponent;
