import React, { useState } from "react";
import DashLayoutEnter from "../../components/Entertainer/DashLayoutEnter";
import EntertainerCalendarSidebar from "../../components/Entertainer/EntertainerCalendarSidebar";

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

const Calendar = () => {
    const [currentMonth, setCurrentMonth] = useState(2);
    const [currentYear, setCurrentYear] = useState(2025);

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
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

    const dates = getMonthDetails(currentYear, currentMonth);
    const eventDays = eventDaysMap[`${currentYear}-${currentMonth}`] || [];

    return (
        <div className="calendar-container">
            <div className="calendar-header d-flex justify-content-between align-items-center mb-3">
                <strong>{monthNames[currentMonth].toUpperCase()} {currentYear}</strong>
                <div>
                    <button className="nav-btn" onClick={handlePrevMonth}>&lt;</button>
                    <button className="nav-btn" onClick={handleNextMonth}>&gt;</button>
                </div>
            </div>

            <div className="calendar-grid">
                {days.map((day, idx) => (
                    <div key={idx} className="day-header">{day}</div>
                ))}
                {dates.map((date, idx) => (
                    <div key={idx} className={`date-cell ${eventDays.includes(date) ? 'has-dot' : ''}`}>
                        {date && <span>{date}</span>}
                    </div>
                ))}
            </div>
        </div>
    );
};
export default function EntertainerAvailability() {
    return (
        <DashLayoutEnter
            title=""
            description="View your all bookings in the calendar"
        >
            <div className="container d-flex">
                <EntertainerCalendarSidebar />
                <div className="entertainer-profile-container">

                    <p className="subheadingPG mb-2 d-flex justify-content-between align-items-center"> AVAILABILITY </p>
                    <hr className="mt-0 mb-2" />
                    <p className='mb-1'> Leads will be restricted to your availability. To block a specific date and time, simply add it to your calendar. </p>

                    <div className='row mt-4'>
                        <div className='col-12 col-md-6 e-time-slot'>
                            <p className='mb-0'>What days are you available for events?</p>
                            <div className="d-flex align-items-center gap-2 mt-3">
                                <input className="form-check-input" type="checkbox" id="mondayCheck" />
                                <label className="form-check-label me-3" htmlFor="mondayCheck">
                                    Monday
                                </label>

                                <select className="form-select w-auto" style={{ minWidth: '110px' }}>
                                    <option>12:00 am</option>
                                    <option>1:00 am</option>
                                    <option>2:00 am</option>
                                </select>

                                <span className='mx-3'>to</span>

                                <select className="form-select w-auto" style={{ minWidth: '110px' }}>
                                    <option>12:00 am</option>
                                    <option>1:00 am</option>
                                    <option>2:00 am</option>
                                </select>
                            </div>
                            <div className="d-flex align-items-center gap-2 mt-3">
                                <input className="form-check-input" type="checkbox" id="tueCheck" />
                                <label className="form-check-label me-3" htmlFor="tueCheck">
                                    Tuesday
                                </label>

                                <select className="form-select w-auto" style={{ minWidth: '110px' }}>
                                    <option>12:00 am</option>
                                    <option>1:00 am</option>
                                    <option>2:00 am</option>
                                </select>

                                <span className='mx-3'>to</span>

                                <select className="form-select w-auto" style={{ minWidth: '110px' }}>
                                    <option>12:00 am</option>
                                    <option>1:00 am</option>
                                    <option>2:00 am</option>
                                </select>
                            </div>
                            <div className="d-flex align-items-center gap-2 mt-3">
                                <input className="form-check-input" type="checkbox" id="wedCheck" />
                                <label className="form-check-label me-3" htmlFor="wedCheck">
                                    Wednesday
                                </label>

                                <select className="form-select w-auto" style={{ minWidth: '110px' }}>
                                    <option>12:00 am</option>
                                    <option>1:00 am</option>
                                    <option>2:00 am</option>
                                </select>

                                <span className='mx-3'>to</span>

                                <select className="form-select w-auto" style={{ minWidth: '110px' }}>
                                    <option>12:00 am</option>
                                    <option>1:00 am</option>
                                    <option>2:00 am</option>
                                </select>
                            </div>
                            <div className="d-flex align-items-center gap-2 mt-3">
                                <input className="form-check-input" type="checkbox" id="thuCheck" />
                                <label className="form-check-label me-3" htmlFor="thuCheck">
                                    Thursday
                                </label>

                                <select className="form-select w-auto" style={{ minWidth: '110px' }}>
                                    <option>12:00 am</option>
                                    <option>1:00 am</option>
                                    <option>2:00 am</option>
                                </select>

                                <span className='mx-3'>to</span>

                                <select className="form-select w-auto" style={{ minWidth: '110px' }}>
                                    <option>12:00 am</option>
                                    <option>1:00 am</option>
                                    <option>2:00 am</option>
                                </select>
                            </div>
                            <div className="d-flex align-items-center gap-2 mt-3">
                                <input className="form-check-input" type="checkbox" id="friCheck" />
                                <label className="form-check-label me-3" htmlFor="friCheck">
                                    Friday
                                </label>

                                <select className="form-select w-auto" style={{ minWidth: '110px' }}>
                                    <option>12:00 am</option>
                                    <option>1:00 am</option>
                                    <option>2:00 am</option>
                                </select>

                                <span className='mx-3'>to</span>

                                <select className="form-select w-auto" style={{ minWidth: '110px' }}>
                                    <option>12:00 am</option>
                                    <option>1:00 am</option>
                                    <option>2:00 am</option>
                                </select>
                            </div>
                            <div className="d-flex align-items-center gap-2 mt-3">
                                <input className="form-check-input" type="checkbox" id="satCheck" />
                                <label className="form-check-label me-3" htmlFor="satCheck">
                                    Saturday
                                </label>

                                <select className="form-select w-auto" style={{ minWidth: '110px' }}>
                                    <option>12:00 am</option>
                                    <option>1:00 am</option>
                                    <option>2:00 am</option>
                                </select>

                                <span className='mx-3'>to</span>

                                <select className="form-select w-auto" style={{ minWidth: '110px' }}>
                                    <option>12:00 am</option>
                                    <option>1:00 am</option>
                                    <option>2:00 am</option>
                                </select>
                            </div>
                            <div className="d-flex align-items-center gap-2 mt-3">
                                <input className="form-check-input" type="checkbox" id="sunCheck" />
                                <label className="form-check-label me-3" htmlFor="sunCheck">
                                    Sunday
                                </label>

                                <select className="form-select w-auto" style={{ minWidth: '110px' }}>
                                    <option>12:00 am</option>
                                    <option>1:00 am</option>
                                    <option>2:00 am</option>
                                </select>

                                <span className='mx-3'>to</span>

                                <select className="form-select w-auto" style={{ minWidth: '110px' }}>
                                    <option>12:00 am</option>
                                    <option>1:00 am</option>
                                    <option>2:00 am</option>
                                </select>
                            </div>
                        </div>
                        <div className='col-12 col-md-6 e-date-slot'>
                            <p className='mb-0'>Oops! I am not available for these days:</p>
                            <div className="">
                                <Calendar />
                            </div>
                        </div>
                    </div>



                </div>
            </div>
        </DashLayoutEnter>
    );
}

