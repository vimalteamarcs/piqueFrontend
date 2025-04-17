import React, { useEffect, useState } from 'react'
import DashLayoutVenue from '../../components/Venue/DashLayoutVenue'
import SearchBar from '../../components/Venue/SearchBar'
import MessageSidebar from '../../components/Venue/Messages/MessageSidebar'
import ChatHeader from '../../components/Venue/Messages/ChatHeader'
import ChatBody from '../../components/Venue/Messages/ChatBody'
import ChatInput from '../../components/Venue/Messages/ChatInput'
import { Offcanvas, Button } from 'react-bootstrap'


export default function VenueMessage() {
  const [sidebarOpen, setSidebarOpen] = useState(false); // State to control offcanvas toggle


  return (
    <>
      <DashLayoutVenue
        title="Profile"
        description="View and manage your profile"
      >
        <div className="container-fluid d-flex flex-column min-vh-100 p-0">
          <SearchBar />
          <div className="d-flex">
            {/* Sidebar toggle button for small screens */}
            <button
              className="btn btn-secondary d-sm-none btn-sm h-25"
              onClick={() => setSidebarOpen(true)}  // Open offcanvas when button is clicked
              aria-controls="offcanvasSidebar"
              aria-expanded={sidebarOpen}
            >
              view more
            </button>

            {/* Offcanvas Sidebar for small screens */}
            <Offcanvas 
              show={sidebarOpen} 
              onHide={() => setSidebarOpen(false)}  // Close offcanvas when hide
              placement="start"  // Sidebar will slide from the left
            >
              <Offcanvas.Header closeButton>
                <Offcanvas.Title>Sidebar</Offcanvas.Title>
              </Offcanvas.Header>
              <Offcanvas.Body>
                <MessageSidebar />
              </Offcanvas.Body>
            </Offcanvas>

            {/* Sidebar for large screens */}
            <div className="sidebar-container d-none d-sm-block border-end">
              <MessageSidebar />
            </div>

            {/* Main content */}
            <div className="message-wrapper d-flex flex-column w-100">
              <ChatHeader />
              <ChatBody />
              <div className="fixed-bottom" style={{ marginLeft: "335px" }}>
                <ChatInput className="mb-0" />
              </div>
            </div>
          </div>
        </div>
      </DashLayoutVenue>
    </>
  )
}


