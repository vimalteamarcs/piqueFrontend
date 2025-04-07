


import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Modal, Button, Badge, Form } from 'react-bootstrap';
import axios from 'axios';


const CalendarComponent = () => {
 const initialEventList = [
  {
    id: 1,
    title: 'Birthday Bash',
    start: '2025-04-10',
    end: '2025-04-10',
    status: 'upcoming',
  },
  {
    id: 2,
    title: 'Wedding Gala',
    start: '2025-04-12',
    end: '2025-04-12',
    status: 'confirmed',
  },
  {
    id: 3,
    title: 'Corporate Show',
    start: '2025-04-15',
    end: '2025-04-15',
    status: 'pending',
  },
  {
    id: 4,
    title: 'Charity Concert',
    start: '2025-04-18',
    end: '2025-04-18',
    status: 'confirmed',
  },
  {
    id: 5,
    title: 'Community Fair',
    start: '2025-04-20',
    end: '2025-04-20',
    status: 'upcoming',
  },
];

const [allEvents, setAllEvents] = useState(initialEventList);
const [events, setEvents] = useState(initialEventList);

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState('All');

  const fetchEvents = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}entertainers/events/upcoming`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const formattedEvents = response.data.map((event) => ({
        id: event.id.toString(),
        title: event.title || event.name || 'Untitled Event',
        start: event.start,
        end: event.end,
        className: event.status?.toLowerCase(),
        location: event.location || 'TBD',
        description: event.description || '',
        organizer: event.organizer || 'Admin',
        status: event.status || 'Pending',
        tags: event.tags || [],
        type: event.type || 'Entertainment',
      }));

      setAllEvents(formattedEvents);
      setEvents(formattedEvents);
    } catch (error) {
      console.error('Error fetching upcoming events:', error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleEventClick = (info) => {
    const event = allEvents.find((e) => e.id === info.event.id);
    setSelectedEvent(event);
    setShowModal(true);
  };

  const handleFilterChange = (e) => {
    const value = e.target.value;
    setFilter(value);

    if (value === 'All') {
      setEvents(allEvents);
    } else {
      setEvents(allEvents.filter((event) => event.status.toLowerCase() === value.toLowerCase()));
    }
  };

  return (
    <div className="container my-4">
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
        <h3 className="mb-2 text-center">Event Calendar</h3>
        <Form.Select
          value={filter}
          onChange={handleFilterChange}
          className="w-auto calendar-filter-dropdown"
        >
          <option value="All">All</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Pending">Pending</option>
          <option value="Upcoming">Upcoming</option>
        </Form.Select>
      </div>

      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        eventClick={handleEventClick}
        height="auto"
        dayMaxEvents={2}
      />

      {/* Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
        <Modal.Header closeButton>
          <div className="w-100">
            <h5 className="mb-1">{selectedEvent?.title}</h5>
            <small className="text-muted">{selectedEvent?.type}</small>
          </div>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-md-8">
              <div className="mb-3">
                <i className="fa-solid fa-calendar-days mr-2 text-primary" />
                <strong>Date:</strong>{' '}
                {new Date(selectedEvent?.start).toLocaleString()} -{' '}
                {new Date(selectedEvent?.end).toLocaleTimeString()}
              </div>
              <div className="mb-3">
                <i className="fa-solid fa-location-dot mr-2 text-danger" />
                <strong>Location:</strong> {selectedEvent?.location}
              </div>
              <div className="mb-3">
                <i className="fa-solid fa-user mr-2 text-success" />
                <strong>Organizer:</strong> {selectedEvent?.organizer}
              </div>
              <div className="mb-3">
                <i className="fa-solid fa-align-left mr-2 text-warning" />
                <strong>Description:</strong> {selectedEvent?.description}
              </div>
            </div>

            <div className="col-md-4">
              <div className="mb-3">
                <strong>Status:</strong>{' '}
                <Badge
                  pill
                  bg={
                    selectedEvent?.status === 'Confirmed'
                      ? 'success'
                      : selectedEvent?.status === 'Pending'
                      ? 'warning'
                      : 'secondary'
                  }
                  text={selectedEvent?.status === 'Pending' ? 'dark' : 'white'}
                >
                  {selectedEvent?.status}
                </Badge>
              </div>
              <div>
                <strong>Tags:</strong>
                <div className="mt-1">
                  {selectedEvent?.tags?.map((tag, idx) => (
                    <Badge key={idx} bg="info" className="mr-1">
                      {tag}
                    </Badge>
                  ))}
                </div>
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
    </div>
  );
};

export default CalendarComponent;
