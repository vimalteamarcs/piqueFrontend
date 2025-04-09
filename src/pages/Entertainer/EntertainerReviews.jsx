import React from 'react'
import { ProgressBar } from 'react-bootstrap';
import DashLayoutEnter from '../../components/Entertainer/DashLayoutEnter'
import EnterAccountSidebar from '../../components/Entertainer/EnterAccountSidebar'

const ratingsData = [
    { stars: 5, count: 2000, color: 'success' },
    { stars: 4, count: 1000, color: 'secondary' },
    { stars: 3, count: 500, color: 'warning' },
    { stars: 2, count: 200, color: 'info' },
    { stars: 1, count: 0, color: 'danger' },
];

const totalReviews = 10000;

function ReviewsSummary() {
    return (
        <div className="d-flex gap-5 flex-wrap mt-4">
            {/* Total Reviews */}
            <div>
                <h6>Total Reviews</h6>
                <h3>10.0K <span className="badge bg-success fs-6 ms-2">21% ↑</span></h3>
                <small className="text-muted">Growth in reviews on this year</small>
            </div>

            {/* Average Rating */}
            <div className='border-start ps-4'>
                <h6>Average Rating</h6>
                <h3>
                    4.0{' '}
                    <span className="text-warning fs-5">
                        <i className="fa-solid fa-star"></i>
                        <i className="fa-solid fa-star"></i>
                        <i className="fa-solid fa-star"></i>
                        <i className="fa-solid fa-star"></i>
                        <i class="fa-regular fa-star-half-stroke"></i>
                    </span>
                </h3>
                <small className="text-muted">Average rating on this year</small>
            </div>

            {/* Star Distribution */}
            <div className="flex-grow-1 border-start px-5">
                {ratingsData.map(({ stars, count, color }) => {
                    const percentage = (count / totalReviews) * 100;
                    return (
                        <div key={stars} className="d-flex align-items-center mb-2">
                            <div style={{ width: 20 }}>{stars}</div>
                            <ProgressBar
                                now={percentage}
                                variant={color}
                                style={{ flexGrow: 1, height: '8px', margin: '0 10px' }}
                            />
                            <div style={{ width: 50, textAlign: 'right' }}>{count.toLocaleString()}</div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function ReviewItem() {
    return (
        <div className="d-flex align-items-start mt-0 p-3 rounded">
            <img
                src="/p/assets/pique/image/venue.png"
                alt="reviewer"
                className="me-3"
                width={90}
                height={60}
            />
            <div className='row'>
                <div className='col-md-4 col-12'>
                    <h6 className="mb-0">The Majestic Downtown</h6>
                    <small className="text-muted">John Abraham</small>
                </div>
                <div className='col-md-8 col-12'>
                    <div className="d-flex align-items-center">
                        <span className="text-warning">
                            <i className="fa-solid fa-star"></i>
                            <i className="fa-solid fa-star"></i>
                            <i className="fa-solid fa-star"></i>
                            <i className="fa-solid fa-star"></i>
                            <i class="fa-regular fa-star-half-stroke"></i>
                        </span>
                        <small className="text-muted ms-2">24-11-2024</small>
                    </div>
                    <p className="text-muted mt-2 mb-0" style={{ maxWidth: "600px" }}>
                        Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default function EntertainerReviews() {
    return (
        <DashLayoutEnter
            title=""
            description="View your all bookings in the calendar"
        >
            <div className="container d-flex">
                <EnterAccountSidebar />
                <div className="entertainer-profile-container">
                    <p className="subheadingPG mb-2 d-flex justify-content-between align-items-center">
                        RATINGS & REVIEWS
                    </p>
                    <hr className="mt-0 mb-2" />
                    <div className="mx-4">
                        <ReviewsSummary />
                    </div>
                    <hr className="" />

                    <ReviewItem />
                    <hr className="" />
                </div>
            </div>
        </DashLayoutEnter>
    );
}

