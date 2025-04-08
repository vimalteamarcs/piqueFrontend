import React, { useEffect, useState } from 'react'
import DashLayoutEnter from '../../components/Entertainer/DashLayoutEnter'
import { ToastContainer } from 'react-toastify'
import EnterAccountSidebar from '../../components/Entertainer/EnterAccountSidebar'
import EntertainerUpcomingEvents from '../../components/Entertainer/EntertainerUpcomingEvents'
import axios from 'axios'

export default function EntertainerEvents() {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const fetchEvents = async () => {
          const token = localStorage.getItem("token");
    
          try {
            const res = await axios.get(
              `${import.meta.env.VITE_API_URL}entertainers/events/upcoming`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            console.log(res.data)
            setEvents(res.data?.data || []); 
          } catch (err) {
            console.error("Error fetching events:", err);
          }
        };
    
        fetchEvents();
      }, []);
    
  return (
    <>
          <DashLayoutEnter
        title="Profile"
        description="View and manage your profile"
      >
        <ToastContainer/>
        <div className="container d-flex">
          <EnterAccountSidebar/>
          <EntertainerUpcomingEvents events={events}/>
          </div>
          </DashLayoutEnter>
    </>
  )
}
