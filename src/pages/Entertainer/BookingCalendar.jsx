import React, { useRef, useEffect } from "react";
import { Calendar } from "@fullcalendar/core";
import bootstrapPlugin from "@fullcalendar/bootstrap";
import dayGridPlugin from "@fullcalendar/daygrid";
import DashLayoutEnter from "../../components/Entertainer/DashLayoutEnter";
import PiqueFooter from "../../components/PiqueComponents/PiqueFooter";
import EnterAccountSidebar from "../../components/Entertainer/EnterAccountSidebar";
import CalendarComponent from "../../components/Entertainer/CalendarComponent";
import EntertainerCalendarSidebar from "../../components/Entertainer/EntertainerCalendarSidebar";

export default function BookingCalendar() {
  const calendarRef = useRef(null);



  return (
    <>
      <DashLayoutEnter
        title=""
        description="View your all bookings in the calendar"
      >
        <div className="container d-flex">
          <EntertainerCalendarSidebar />
          <div className="entertainer-profile-container">

            <div className="row">

              <div className="col-md-12">

                <CalendarComponent />
              </div>
            </div>
          </div>
        </div>
        {/* <PiqueFooter/> */}
      </DashLayoutEnter>
    </>
  );
}
