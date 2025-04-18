

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
//   const [filter, setFilter] = useState("");
//   const [currentMonth, setCurrentMonth] = useState(null);
//   const [dailyEvents, setDailyEvents] = useState([]);
//   const [showDailyModal, setShowDailyModal] = useState(false);

//   const lastFetchedMonth = useRef(null);
//   console.log("Component Rendered", Date.now(), filter);
//   async function fetchEvents(monthStr, filter) {
//     if (lastFetchedMonth.current === monthStr) return;
//     lastFetchedMonth.current = monthStr;

//     try {
//       const token = localStorage.getItem("token");
//       console.log("filter", filter);

//       const { data } = await axios.get(
//         `${import.meta.env.VITE_API_URL}entertainers/calendar/events?date=${monthStr}&status=${filter}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

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
//   }


//   useEffect(() => {
//     if (currentMonth) {
//       fetchEvents(currentMonth, filter);
//     } else {
//       fetchEvents(new Date().toISOString().slice(0, 7), filter);
//     }
//   }, [filter]);

//   const handleEventClick = ({ event }) => {
//     const found = allEvents.find((e) => e.id === event.id);
//     if (found) {
//       setSelectedEvent(found);
//       setShowModal(true);
//     }
//   };

//   const handleFilterChange = (e) => {
//     const value = e.target.value;
//     setFilter(value); // triggers useEffect
//   };
//   useEffect(() => {
//     const monthToUse = currentMonth || new Date().toISOString().slice(0, 7);
//     fetchEvents(monthToUse, filter);
//   }, [filter, currentMonth]);



//   const handleDatesSet = ({ view }) => {
//     const year = view.currentStart.getFullYear();
//     const month = String(view.currentStart.getMonth() + 1).padStart(2, "0");
//     const newMonth = `${year}-${month}`;

//     if (newMonth !== currentMonth) {
//       setCurrentMonth(newMonth);
//       fetchEvents(newMonth,filter);
//     }
//   };

//   const [selectedDate, setselectedDate] = useState(null);
//   const [popupPosition, setPopupPosition] = useState({
//     top: "50%",
//     left: "50%",
//   });
//   const handleMoreLinkClick = (info) => {
//     const clickedDate = info.date;
//     setselectedDate(clickedDate);

//     // Get position from event target
//     const rect = info.jsEvent?.target?.getBoundingClientRect?.();
//     if (rect) {
//       const scrollTop =
//         window.pageYOffset || document.documentElement.scrollTop;
//       const scrollLeft =
//         window.pageXOffset || document.documentElement.scrollLeft;

//       setPopupPosition({
//         top: `${rect.top + scrollTop + 5}px`,
//         left: `${rect.left + scrollLeft}px`,
//       });
//     }

//     const eventsForDay = allEvents.filter((e) => {
//       const eventDate = new Date(e.start).toDateString();
//       return eventDate === clickedDate.toDateString();
//     });

//     setDailyEvents(eventsForDay);
//     setShowDailyModal(true);
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
//           {[
//             "",
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
//         dayMaxEvents={1}
//         moreLinkClick={(info) => {
//           handleMoreLinkClick(info);
//           return true;
//         }}
//         moreLinkContent={(args) => {
//           return (
//             <div
//               style={{
//                 backgroundColor: "#008AB4",
//                 color: "white",
//                 padding: "2px 6px",
//                 borderRadius: "4px",
//                 fontSize: "12px",
//                 display: "inline-block",
//               }}
//             >
//               View {args.num} more
//             </div>
//           );
//         }}
//       />

//       {/* Daily Modal */}

//       <Modal
//         show={showDailyModal}
//         onHide={() => setShowDailyModal(false)}
//         size="sm"
//         className="custom-popup-modal"
//         backdrop={false}
//         style={{
//           top: popupPosition.top,
//           left: popupPosition.left,
//           position: "absolute",
//         }}
//       >
//         <Modal.Header closeButton>
//           <div className="d-flex align-items-center gap-3 w-100">
//             <div className="popup-date-circle">
//               {selectedDate?.getDate()?.toString().padStart(2, "0") || "?"}
//             </div>
//           </div>
//         </Modal.Header>

//         <Modal.Body className="p-1 custom-popup-body">
//           {dailyEvents.length > 0 ? (
//             <div className="d-flex flex-column gap-2">
//               {dailyEvents.map((event) => (
//                 <div
//                   key={event.id}
//                   className="event-card p-2 rounded shadow-sm"
//                 >
//                   <div className="d-flex align-items-center gap-2">
//                     <div className="status-dot bg-success rounded-circle d-flex align-items-center justify-content-center">
//                       <i
//                         className="fas fa-check text-white"
//                         style={{ fontSize: "10px" }}
//                       ></i>
//                     </div>
//                     <div className="event-time fw-semibold">
//                       {new Date(event.start).toLocaleTimeString([], {
//                         hour: "2-digit",
//                         minute: "2-digit",
//                       })}
//                     </div>
//                   </div>

//                   <div className="event-title">"{event.title}"</div>

//                   <Button
//                     variant="success"
//                     size="sm"
//                     className="btn view-btn"
//                     onClick={() => {
//                       setSelectedEvent(event);
//                       setShowModal(true);
//                       setShowDailyModal(false);
//                     }}
//                   >
//                     View Event
//                   </Button>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <p className="text-center">No events available.</p>
//           )}
//         </Modal.Body>
//       </Modal>

//       {/* Main Event Modal */}
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
//                   <i className="fa-solid fa-calendar-days me-2 text-primary" />
//                   <strong>
//                     Date:
//                   </strong> {selectedEvent.start.toLocaleString()} -{" "}
//                   {selectedEvent.end.toLocaleTimeString()}
//                 </div>
//                 <div className="mb-3">
//                   <i className="fa-solid fa-location-dot me-2 text-danger" />
//                   <strong>Location:</strong> {selectedEvent.location}
//                 </div>
//                 <div className="mb-3">
//                   <i className="fa-solid fa-align-left me-2 text-warning" />
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
  const [filter, setFilter] = useState("");
  const [currentMonth, setCurrentMonth] = useState(null);
  const [dailyEvents, setDailyEvents] = useState([]);
  const [showDailyModal, setShowDailyModal] = useState(false);

  const lastFetchedMonth = useRef(null);

  // 
  const fetchEvents = useCallback(async (monthStr, filterValue) => {
    const token = localStorage.getItem("token");
  
    let url = `${import.meta.env.VITE_API_URL}entertainers/calendar/events?date=${monthStr}`;
    if (filterValue && filterValue !== "All") {
      url += `&status=${filterValue}`;
    }
  
    if (lastFetchedMonth.current === `${monthStr}-${filterValue}`) return;
    lastFetchedMonth.current = `${monthStr}-${filterValue}`;
  
    try {
      const { data } = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

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
    const month = currentMonth || new Date().toISOString().slice(0, 7);
    fetchEvents(month, filter);
  }, [filter, currentMonth, fetchEvents]);

  const handleEventClick = ({ event }) => {
    const found = allEvents.find((e) => e.id === event.id);
    if (found) {
      setSelectedEvent(found);
      setShowModal(true);
      setShowDailyModal(false);
    }
  };

  const handleFilterChange = (e) => {
    const value = e.target.value;
    setFilter(value);
  };

  const handleDatesSet = ({ view }) => {
    const year = view.currentStart.getFullYear();
    const month = String(view.currentStart.getMonth() + 1).padStart(2, "0");
    const newMonth = `${year}-${month}`;

    if (newMonth !== currentMonth) {
      setCurrentMonth(newMonth);
    }
  };

  const [selectedDate, setselectedDate] = useState(null);
  const [popupPosition, setPopupPosition] = useState({
    top: "50%",
    left: "50%",
  });

  // const handleMoreLinkClick = (info) => {
  //   const clickedDate = info.date;
  //   setselectedDate(clickedDate);

  //   const rect = info.jsEvent?.target?.getBoundingClientRect?.();
  //   if (rect) {
  //     const scrollTop =
  //       window.pageYOffset || document.documentElement.scrollTop;
  //     const scrollLeft =
  //       window.pageXOffset || document.documentElement.scrollLeft;

  //     setPopupPosition({
  //       top: `${rect.top + scrollTop + 5}px`,
  //       left: `${rect.left + scrollLeft}px`,
  //     });
  //   }

  //   const eventsForDay = allEvents.filter((e) => {
  //     const eventDate = new Date(e.start).toDateString();
  //     return eventDate === clickedDate.toDateString();
  //   });

  //   setDailyEvents(eventsForDay);
  //   setShowDailyModal(true);
  // };

  const handleMoreLinkClick = (info) => {
    const clickedDate = info.date;
    setselectedDate(clickedDate);
  
    let targetElement = info.jsEvent?.target;
  
    // Traverse up to find the element with class `.fc-more` or `.fc-daygrid-day`
    while (targetElement && !targetElement.classList.contains("fc-more") && !targetElement.classList.contains("fc-daygrid-day")) {
      targetElement = targetElement.parentElement;
    }
  
    if (targetElement) {
      const rect = targetElement.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
  
      setPopupPosition({
        top: `${rect.top + scrollTop + targetElement.offsetHeight + 8}px`,
        left: `${rect.left + scrollLeft}px`,
      });
    } else {
      // fallback to center of screen
      setPopupPosition({
        top: "50%",
        left: "50%",
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
          {["All", "Confirmed", "unpublished", "scheduled", "cancelled", "completed"].map((status) => (
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
        dayMaxEvents={2}
        moreLinkClick={(info) => {
          handleMoreLinkClick(info);
          return true;
        }}
        moreLinkContent={(args) => (
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
        )}
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
           zIndex: 1050,
        }}
        container={document.querySelector(".taskCalendar")}
      >
        <Modal.Header closeButton>
          <div className="d-flex align-items-center gap-3 w-100">
            <div className="popup-date-circle">
              {selectedDate?.getDate()?.toString().padStart(2, "0") || "?"}
            </div>
          </div>
        </Modal.Header>

        <Modal.Body className="p-1 custom-popup-body">
          {dailyEvents.length > 0 ? (
            <div className="d-flex flex-column gap-2">
              {dailyEvents.map((event) => (
                <div key={event.id} className="event-card p-2 rounded shadow-sm">
                  <div className="d-flex align-items-center gap-2">
                    <div className="status-dot bg-success rounded-circle d-flex align-items-center justify-content-center">
                      <i className="fas fa-check text-white" style={{ fontSize: "10px" }}></i>
                    </div>
                    <div className="event-time fw-semibold">
                      {new Date(event.start).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                  <div className="event-title">"{event.title}"</div>
                  <Button
                    variant="success"
                    size="sm"
                    className="btn view-btn"
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
        <Modal show={showModal} onHide={() => setShowModal(false)} centered size="md">
          <Modal.Header closeButton>
            <div className="w-100">
              <h5 className="mb-1">
                {selectedEvent.title.charAt(0).toUpperCase() + selectedEvent.title.slice(1)}
              </h5>

              <small className="text-muted">Event</small>
            </div>
          </Modal.Header>
          <Modal.Body>
            <div className="row">
              <div className="col-md-8">
                <div className="mb-3">
                  <i className="fa-solid fa-calendar-days me-2 text-primary" />
                  <strong>Date:</strong>{" "}
                  {moment(selectedEvent.start).format("DD MMM YYYY, hh:mm A")} - {moment(selectedEvent.end).format("hh:mm A")}
                </div>
                <div className="mb-3">
                  <i className="fa-solid fa-location-dot me-2 text-danger" />
                  <strong>Location:</strong> {selectedEvent.location}
                </div>
                <div className="mb-3">
                  <i className="fa-solid fa-align-left me-2 text-warning" />
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
                  <span className="text-capitalize">{selectedEvent.recurring}</span>
                </div>
                <div className="mb-3">
                  <strong>Created By:</strong>{" "}
                  {selectedEvent.isAdmin ? "Admin" : "User"}
                </div>
              </div>
            </div>
          </Modal.Body>
          {/* <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Close
            </Button>
          </Modal.Footer> */}
        </Modal>
      )}
    </div>
  );
};

export default CalendarComponent;
