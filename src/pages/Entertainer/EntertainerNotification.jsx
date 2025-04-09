import React from 'react'
import DashLayoutEnter from '../../components/Entertainer/DashLayoutEnter'
import EnterAccountSidebar from '../../components/Entertainer/EnterAccountSidebar'

const notifications = [
    {
        type: 'message',
        time: '9:40 AM',
        date: '24 December,2024',
        avatar: '/p/assets/pique/image/venue.png',
        message: 'New message from Magic Wonders. Tap to View!',
    },
    {
        type: 'events',
        time: '9:40 AM',
        date: '24 December,2024',
        message: 'You have events lined up!',
        images: [
            '/p/assets/pique/image/venue.png',
            '/p/assets/pique/image/venue.png',
            '/p/assets/pique/image/venue.png',
        ],
    },
    {
        type: 'message',
        time: '9:40 AM',
        date: '24 December,2024',
        avatar: '/p/assets/pique/image/venue.png',
        message: 'New message from Magic Wonders. Tap to View!',
    },
    {
        type: 'invoice',
        time: '9:40 AM',
        date: '24 December,2024',
        avatar: '/p/assets/pique/image/venue.png',
        message: "You've received an Invoice of $66 from Magic Wonders.",
    },
];

const NotificationItem = ({ note }) => (
    <div className="card p-3 mb-2 d-flex flex-row align-items-start gap-3">
        {/* Dot Indicator */}
        <div className="mt-2 text-primary">•</div>

        {note.type === 'events' ? (
            <div className="mb-2 d-flex justify-content-between align-items-center" style={{ width: '-webkit-fill-available' }}>
                <div className="">
                    <div className="fw-semibold mb-1">{note.message}</div>
                    {note.images.map((img, i) => (
                        <img className='me-3' key={i} src={img} alt="event" width={70} height={50} style={{ objectFit: 'cover', borderRadius: 6 }} />
                    ))}
                </div>
                <div className="text-end small text-muted mt-2">
                    {note.time}<br />
                    {note.date}
                </div>
            </div>
        ) : (
            <>
                <img
                    src={note.avatar}
                    alt="avatar"
                    className="rounded-circle"
                    width={40}
                    height={40}
                />
                <div className="mb-2 d-flex justify-content-between align-items-center" style={{ width: '-webkit-fill-available' }}>
                    <div className="fw-semibold">{note.message}</div>
                    <div className="text-end small text-muted mt-2">
                        {note.time}<br />
                        {note.date}
                    </div>
                </div>
            </>
        )}
    </div>
);
export default function EntertainerNotification() {
    return (
        <>
            <DashLayoutEnter
                title=""
                description="View your all bookings in the calendar"
            >
                <div className="container d-flex">
                    <EnterAccountSidebar />
                    <div className="entertainer-profile-container">

                        <p className="subheadingPG mb-2 d-flex justify-content-between align-items-center"> NOTIFICATIONS </p>
                        <hr className="mt-0 mb-2" />
                        <div className='col-md-2 col-12'>
                            <select className='form-select'>
                                <option value="">All Notifications</option>
                                <option value="messages">Messages</option>
                                <option value="events">Events</option>
                                <option value="invoices">Invoices</option>
                            </select>
                        </div>

                        <div className="mt-4">
                            {notifications.map((note, idx) => (
                                <NotificationItem key={idx} note={note} />
                            ))}
                        </div>
                    </div>
                </div>
            </DashLayoutEnter>
        </>
    )
}
