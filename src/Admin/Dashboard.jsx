import React, { useEffect, useState } from "react";
import DashLayout from "./DashLayout";
import AdminSideBar from "../components/Venue/AdminSideBar";
import axios from "axios";
import { SEARCH_STATS } from "../../constants";
import { useNavigate } from "react-router-dom";
import Highcharts from "highcharts";

export default function Dashboard() {
  const imagePath = import.meta.env.VITE_LOGGEDIN_IMAGE_PATH;
  const [stats, setStats] = useState({
    totalUsers: 0,
    entertainerCount: 0,
    venueCount: 0,
    totalBookings: 0,
    confirmedBookings: 0,
    rejectedBookings: 0,
    canceledBookings: 0,
  });

  const [upcomingEvents, setUpcomingEvents] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}${SEARCH_STATS}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const data = response.data.data || {};

        setStats({
          totalUsers: data.totalUsers || 0,
          entertainerCount: data.entertainerCount || 0,
          venueCount: data.venueCount || 0,
          totalBookings: data.bookingStats?.total || 0,
          confirmedBookings: data.bookingStats?.confirmed || 0,
          rejectedBookings: data.bookingStats?.rejected || 0,
          canceledBookings: data.bookingStats?.canceled || 0,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    const fetchUpcomingEvents = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/admin/events/upcoming`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setUpcomingEvents(response.data.data || []);
      } catch (error) {
        console.error("Error fetching upcoming events:", error);
      }
    };

    fetchStats();
    fetchUpcomingEvents();
  }, []);

  useEffect(() => {


    Highcharts.chart("bookingChart", {
      chart: {
        type: "column",
        height: 200,
      },
      title: {
        text: null,
      },
      xAxis: {
        type: "category",
        lineColor: '#ccd6eb',
        tickColor: '#ccd6eb',
        labels: {
          style: {
            color: '#666',
            fontSize: '11px'
          }
        }
      },
      yAxis: {
        title: {
          text: null,
        },
      },
      legend: {
        enabled: false,
      },
      plotOptions: {
        series: {
          borderWidth: 0,
          borderRadius: 6,
          pointWidth: 35,
          dataLabels: {
            enabled: false,
            format: "{point.y:.1f}",
          },
        },
      },
      tooltip: {
        headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
        pointFormat:
          '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}</b> of total<br/>',
      },
      credits: {
        enabled: false,
      },
      series: [
        {
          name: "Bookings",
          colorByPoint: true,
          data: [
            { name: "Jan", y: 18, color: "#00e0d7" },
            { name: "Feb", y: 16, color: "#00e0d7" },
            { name: "Mar", y: 14, color: "#00e0d7" },
            { name: "Apr", y: 15, color: "#00e0d7" },
            { name: "May", y: 11, color: "#00e0d7" },
            { name: "Jun", y: 12, color: "#00e0d7" },
          ],
        },
      ],
    });


    Highcharts.chart('revenueChart', {
      chart: {
        type: 'spline',
        height: 200
      },
      title: {
        text: ''
      },
      xAxis: {
        visible: true,
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        lineColor: '#ccd6eb',
        tickColor: '#ccd6eb',
        labels: {
          style: {
            color: '#666',
            fontSize: '11px'
          }
        }
      },
      yAxis: {
        visible: true,
        gridLineDashStyle: 'Dash',
        gridLineColor: '#e6f0ff',
        title: {
          text: null
        }
      },
      legend: {
        enabled: false
      },
      credits: {
        enabled: false
      },
      tooltip: {
        shared: true,
        crosshairs: true
      },
      plotOptions: {
        spline: {
          marker: {
            enabled: true,
            radius: 4,
            symbol: 'circle',
            fillColor: '#00e0d7',
            lineWidth: 2,
            lineColor: '#00e0d7'
          },
          lineWidth: 2,
          color: '#00e0d7'
        }
      },
      series: [{
        name: 'Data',
        data: [100, 290, 170, 390, 320, 150,]
      }]
    });


  }, []);

  const navigate = useNavigate();

  return (
    <>
      <DashLayout />
      <div className="container-fluid w-100 p-0">
        <div className="pageLayout">
          <div className="dash-sidebar-container">
            <AdminSideBar />
          </div>
          <div className="dash-profile-container">
            {/* Dashboard Header */}
            <div className="row d-flex justify-content-between">
              <div className="col">
                <p className="headingPG">DASHBOARD</p>
              </div>
            </div>

            {/* Analytics Cards */}
            <div className="card">
              <div className="card-body">
                <p className="profile-font fw-semibold ms-2 pt-0 mb-1">Analytics</p>
                <div className="row d-flex gap-3 p-3 pb-1">
                  {/* Revenue & Earnings */}
                  <div className="col totalRevenue p-2 ps-3">
                    <div className="d-flex justify-content-between mb-0">
                      <p className="profile-font fw-semibold">Revenue & Earnings</p>
                      <img src={`${imagePath}totaluserdash.svg`} height="35px" width="40px" />
                    </div>
                    <p className="fw-bold mt-0 mb-2">{stats.entertainerCount}</p>
                    <p className="icon-font mt-0">Total Earnings </p>
                  </div>

                  {/* Total Bookings */}
                  <div className="col total-bookings p-2 ps-3">
                    <div className="d-flex justify-content-between mb-0">
                      <p className="profile-font fw-semibold">Total Bookings</p>
                      <img src={`${imagePath}totalbookingsdash.svg`} height="35px" width="40px" />
                    </div>
                    <p className="fw-bold mt-0 mb-2">{stats.totalBookings}</p>
                    <p className="icon-font mt-0">Total Bookings Confirmed</p>
                  </div>

                  {/* Venue Signups */}
                  <div className="col total-venues p-2 ps-3">
                    <div className="d-flex justify-content-between mb-0">
                      <p className="profile-font fw-semibold">Venue Signups</p>
                      <img src={`${imagePath}totalvenuedash.svg`} height="35px" width="40px" />
                    </div>
                    <p className="fw-bold mt-0 mb-2">{stats.venueCount}</p>
                    <p className="icon-font mt-0">Total Venues</p>
                  </div>

                  {/* Entertainer Signups */}
                  <div className="col total-entertainers p-2 ps-3">
                    <div className="d-flex justify-content-between mb-0">
                      <p className="profile-font fw-semibold">Entertainer Signups</p>
                      <img src={`${imagePath}totalenterdash.svg`} height="35px" width="40px" />
                    </div>
                    <p className="fw-bold mt-0 mb-2">{stats.entertainerCount}</p>
                    <p className="icon-font mt-0">Total Entertainers</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Revenue Chart and Upcoming Events */}
            <div className="row p-3 gap-3">
              {/* Chart */}
              <div className="col">
                <div className="row revenue-earning event-form">
                  <p className="profile-font fw-semibold ms-2 mt-2">Bookings</p>
                  <figure className="highcharts-figure">
                    <div id="bookingChart" style={{ width: "100%", height: "200px" }}></div>
                  </figure>

                </div>
                <div className="row revenue-earning event-form mt-3">

                  <p className="profile-font fw-semibold ms-2 mt-2"> Revenue </p>
                  <figure className="highcharts-figure">
                    <div id="revenueChart" style={{ width: "100%", height: "200px" }}></div>
                  </figure>
                </div>
              </div>

              {/* Events */}
              <div className="col dash-upcoming-events event-form">
                <p className="profile-font fw-semibold ms-2 mt-2 mb-0">Upcoming Events</p>
                <hr className="mt-0" />
                <div className="scrollable-container">
                  {upcomingEvents.length > 0 ? (
                    upcomingEvents.map((event) => (
                      <div key={event.event_id} className="row d-flex event-details p-2 mb-2">
                        <div className="">
                          <p className="icon-font fw-semibold mb-2 cursor-pointer" onClick={() =>
                            navigate("viewevent", {
                              state: { id: event.event_id },
                            })
                          }>{event.title}</p>
                        </div>
                        <div className="col-md-2">
                          <img src={event.image_url} alt={event.title} height="54px" width="54px" />
                        </div>
                        <div className="col-md-5">
                          <div className="d-flex mb-0">
                            <img src={`${imagePath}Icon akar-calendar.svg`} className="ms-2" height="13px" width="13px" />
                            <p className="text-muted ms-2" style={{ fontSize: "10px" }}>
                              {new Date(event.startTime).toLocaleDateString("en-GB", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })}{" "}
                              -{" "}
                              {new Date(event.endTime).toLocaleDateString("en-GB", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })}
                            </p>
                          </div>
                          <div className="d-flex mt-0">
                            <img src={`${imagePath}Icon material-outline-watch-later.png`} className="ms-2" height="13px" width="13px" />
                            <p className="text-muted mb-1 ms-2" style={{ fontSize: "10px" }}>
                              {new Date(event.startTime).toLocaleTimeString()} -{" "}
                              {new Date(event.endTime).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                        <div className="col-md-5">
                          {/* <button
                            type="button"
                            className="btn inline d-flex align-items-center justify-content-center"
                            style={{
                              background: "#E9EBBF",
                              color: "black",
                              height: "21px",
                              width: "51px",
                              fontSize: "10px",
                            }}
                            onClick={() =>
                              navigate("viewevent", {
                                state: { id: event.event_id },
                              })
                            }
                          >
                            View
                          </button> */}

                          <div className="d-flex mb-0 mt-0">
                            <img src={`${imagePath}Icon akar-location.svg`} className="ms-2" height="13px" width="13px" />
                            <p className="text-muted ms-2" style={{ fontSize: "10px" }}>
                              {event.location}
                            </p>
                          </div>
                          <div className="d-flex mb-0">
                            <img src={`${imagePath}Icon feather-user.png`} className="ms-2" height="13px" width="13px" />
                            <p className="text-muted mb-1 ms-2" style={{ fontSize: "10px" }}>
                              {event.venue_name}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>No upcoming events available.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
