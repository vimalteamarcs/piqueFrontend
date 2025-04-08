import React from 'react'
import DashLayoutEnter from '../../components/Entertainer/DashLayoutEnter'
import EntertainerCalendarSidebar from '../../components/Entertainer/EntertainerCalendarSidebar'

export default function EntertainerAvailability() {
    return (
        <>
            <DashLayoutEnter
                title=""
                description="View your all bookings in the calendar"
            >
                <div className="container d-flex">
                    <EntertainerCalendarSidebar />
                    <div className="entertainer-profile-container">

                    </div>
                </div>
            </DashLayoutEnter>
        </>
    )
}
