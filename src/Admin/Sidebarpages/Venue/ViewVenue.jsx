import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import DashLayout from "../../DashLayout";
import {
  GET_CITIES,
  GET_COUNTRIES,
  GET_STATES,
  GET_VENUE_BY_USER,
} from "../../../../constants";
import { LinkOutlined, EyeOutlined, GlobalOutlined } from "@ant-design/icons";
import { Button } from "antd";
import AdminSideBar from "../../../components/Venue/AdminSideBar";

export default function ViewVenue() {
  const location = useLocation();
  const navigate = useNavigate();
  let user = location.state;
  console.log(user)
  localStorage.setItem('venueUserId', user.id)
  const [venues, setVenues] = useState([]);
  const [hasVenues, setHasVenues] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // State for search term

  useEffect(() => {
    const fetchCountries = async () => {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}${GET_COUNTRIES}`
      );

      return data || [];
    };

    const fetchStates = async (countryId) => {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}${GET_STATES}${countryId}`
      );
      return data || [];
    };

    const fetchCities = async (stateId) => {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}${GET_CITIES}${stateId}`
      );
      return data || [];
    };
    const fetchVenues = async () => {
      try {
        const token = localStorage.getItem("token"); // Assuming you store the token in localStorage

        if (user.role) {
          const response = await axios.get(
            `${import.meta.env.VITE_API_URL}${GET_VENUE_BY_USER}${user.id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          console.log("venues", response.data);

          if (response.data?.total !== 0) {
            const records = response.data.records[0];
            setHasVenues(true);
            let countries = [];
            let states = [];
            let cities = [];

            // Only fetch country, state, city if country field is valid
            if (records.country) {
              countries = await fetchCountries();
              states = await fetchStates(Number(records.country));
              cities = await fetchCities(Number(records.state));
            }

            // Attach names to the venue records
            setVenues(
              response.data.records.map((record) => {
                let countryName = "";
                let stateName = "";
                let cityName = "";

                // Fetch country, state, city names only if country is valid
                if (records.country) {
                  const country =
                    countries.countries.find(
                      (c) => Number(c.id) === Number(record.country)
                    ) || undefined;
                  const state =
                    states.states.find(
                      (s) => Number(s.id) === Number(record.state)
                    ) || undefined;
                  const city =
                    cities.cities.find(
                      (c) => Number(c.id) === Number(record.city)
                    ) || undefined;

                  countryName = country?.name || "";
                  stateName = state?.name || "";
                  cityName = city?.name || "";
                }

                console.log(record, countryName, stateName, cityName);

                return {
                  ...record,
                  country: countryName,
                  state: stateName,
                  city: cityName,
                };

              })
            );
          } else {
            setVenues([]);
            user = null;
            setHasVenues(false); // If no venues, nullify the user to show venue details
          }
        } else {
          setVenues([user]); // No role means this is a venue
          user = null;
          setHasVenues(false); // nullify user to show venue details
        }

        setLoading(false); // Set loading to false after data is fetched
      } catch (error) {
        setError("Failed to fetch venues");
        console.log(error);

        setLoading(false);
      }
    };

    if (user?.id) {
      fetchVenues();
    }
  }, [user?.id]);



  // Filter venues based on search term
  const filteredVenues = venues.filter((venue) => {
    return (
      venue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      venue.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      venue.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      venue.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
      venue.country.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <>
      <DashLayout />
      <div className="container-fluid w-100 p-0">
        <div className="pageLayout">
          <div className="dash-sidebar-container">
            <AdminSideBar />
          </div>
          <div className="dash-profile-container">
            <button
              onClick={() => navigate(-1)}
              className="btn btn-outline-dark btn-sm d-flex align-items-center mb-4"
            >
              <i
                className="fa fa-arrow-left"
                style={{ marginRight: "8px" }}
              ></i>
            </button>

            {user?.role ? (
              // User details section
              <div className="card">
                <div className="card-body">
                  <p className="label-font fw-semibold pt-2">USER DETAILS</p>
                  <hr />
                  <div className="container">
                    {hasVenues ? (
                      <button
                        className="btn btn-dark myBtn"
                        onClick={() => {
                          navigate("/admin/addvenuelocation", { state: user }); // ✅ Navigate to Add Location page
                        }}
                      >
                        Add Location
                      </button>
                    ) : (
                      <button
                        className="btn btn-dark myBtn"
                        onClick={() => {
                          navigate("/admin/addvenue", { state: user }); // ✅ Navigate to Add Venue page
                        }}
                      >
                        Add Venue
                      </button>
                    )}
                  </div>
                  <div className="container profile-font">
                    <div className="mb-3 col-md-6 col-sm-12">
                      <p className="label-font">
                        <span className="fw-semibold"> Name: </span>
                        {user?.name || ""}
                      </p>
                    </div>

                    <div className="mb-3 col-md-6 col-sm-12">
                      <p className="label-font">
                        <span className="fw-semibold">Email:</span>{" "}
                        {user?.email || ""}
                      </p>
                    </div>

                    <div className="mb-3 col-md-6 col-sm-12">
                      <p className="label-font">
                        <span className="fw-semibold">Phone Number:</span>{" "}
                        {user?.phoneNumber || ""}
                      </p>
                    </div>

                    <div className="mb-3 col-md-6 col-sm-12">
                      <p className="label-font">
                        <span className="fw-semibold">Role:</span>{" "}
                        <span className="text-capitalize">
                          {user?.role || ""}
                        </span>
                      </p>
                    </div>

                    <div className="mb-3 col-md-6 col-sm-12">
                      <p className="label-font">
                        <span className="fw-semibold">Status:</span>{" "}
                        <span className="text-capitalize">
                          {user?.status || ""}
                        </span>
                      </p>
                    </div>
                  </div>
                  <hr />
                  <>
                    {loading && <p>Loading venues...</p>}
                    {error && <p className="text-danger">{error}</p>}
                    {!loading && !error && (
                      <div className="container-fluid">
                        <div className="row">
                          <p className="label-font fw-semibold">
                            VENUES LOCATIONS
                          </p>
                        </div>

                        {/* Search Input - Always Visible */}
                        <div className="row">
                          <div className="mb-3">
                            <input
                              type="text"
                              className="dashSearchBar w-25 rounded-3 label-font ps-3"
                              placeholder="Search Venues ...."
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                            />
                          </div>
                        </div>

                        {/* No Venues Message After Search Bar */}
                        {filteredVenues && filteredVenues.length === 0 && (
                          <p className="label-font text-danger fw-medium">
                            No venues found for this user.
                          </p>
                        )}

                        {/* Table Only When Venues Exist */}
                        {filteredVenues && filteredVenues.length > 0 && (
                          <div className="row">
                            <div className="col-12">
                              <div className="table-responsive label-font">
                                <table className="table table-responsive">
                                  <thead>
                                    <tr className="text-nowrap">
                                      <th>Venue Name</th>
                                      <th>Phone</th>
                                      <th>Email</th>
                                      <th>Address</th>
                                      <th>Zip Code</th>
                                      {/* <th>City,State,Country</th> */}
                                      {/* <th>Website</th> */}
                                      <th>Action</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {filteredVenues.map((venue) => (
                                      <tr key={venue.id}>
                                        <td className="text-nowrap">
                                          {venue.name}
                                        </td>
                                        <td>{venue.phone || ""}</td>
                                        <td>{venue.email || ""}</td>
                                        <td>{`${venue.addressLine1}, ${venue.addressLine2 || ""
                                          }`}</td>
                                        <td>{venue.zipCode || ""}</td>
                                        {/* <td>
                                        {venue?.city &&
                                        venue?.state &&
                                        venue?.country
                                          ? `${venue.city}, ${venue.state}, ${venue.country}`
                                          : ""}
                                      </td> */}
                                        {/* <td>
                                        {venue.websiteUrl && (
                                          <Button
                                            type="link"
                                            href={
                                              venue.websiteUrl.startsWith(
                                                "http"
                                              )
                                                ? venue.websiteUrl
                                                : `https://${venue.websiteUrl}`
                                            }
                                            target="_blank"
                                            rel="noopener noreferrer"
                                          >
                                            <GlobalOutlined
                                              style={{ fontSize: "16px" }}
                                            />
                                          </Button>
                                        )}
                                      </td> */}
                                        <td>
                                          <Button
                                            type="link"
                                            shape="circle"
                                            icon={
                                              <EyeOutlined
                                                style={{ fontSize: "16px" }}
                                              />
                                            }
                                            onClick={() =>
                                              navigate("/admin/viewdetails", {
                                                state: venue,
                                              })
                                            }
                                          />
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </>
                </div>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </>
  );
}
//</div> (
// Venue details section
// <>
//   <h3 className="text-center my-3">Venues details</h3>

//   {/* Search Input */}
//   <div className="mb-3">
//     <input
//       type="text"
//       className="form-control w-25"
//       placeholder="Search Venues"
//       value={searchTerm}
//       onChange={(e) => setSearchTerm(e.target.value)}
//     />
//   </div>

//   {loading && <p>Loading venues...</p>}
//   {error && <p className="text-danger">{error}</p>}
//   {!loading && !error && filteredVenues.length === 0 && (
//     <p>No venues found for this user.</p>
//   )}
//   {!loading && !error && filteredVenues.length > 0 && (
//     <div className="container-fluid">
//       <div className="row">
//         <div className="col-12">
//           {/* Remove overflow hidden, allow horizontal scroll */}
//           <div className="table-responsive">
//             <table className="table table-bordered">
//               <thead>
//                 <tr className="text-nowrap">
//                   <th>Venue Name</th>
//                   <th>Phone</th>
//                   <th>Email</th>
//                   <th>Address</th>
//                   <th>City,State,Country</th>
//                   <th>Website</th>
//                   <th>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredVenues.map((venue) => (
//                   <tr key={venue.id}>
//                     <td className="text-nowrap">{venue.name}</td>

//                     <td>{venue.phone || ""}</td>
//                     <td>{venue.email || ""}</td>
//                     <td>{`${venue.addressLine1}, ${
//                       venue.addressLine2 || ""
//                     }`}</td>
//                     <td>
//                       {venue?.city && venue?.state && venue?.country
//                         ? `${venue.city}, ${venue.state}, ${venue.country}`
//                         : ""}
//                     </td>

//                     <td>
//                       {venue.websiteUrl && (
//                         <Button
//                           type="link"
//                           href={venue.websiteUrl}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                         >
//                           <LinkOutlined
//                             style={{ fontSize: "16px" }}
//                           />
//                         </Button>
//                       )}
//                     </td>
//                     <td>
//                       <Button
//                         type="primary"
//                         shape="circle"
//                         icon={<EyeOutlined />}
//                         onClick={() =>
//                           navigate("/viewdetails", { state: venue })
//                         }
//                       />
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </div>
//   )}
// </>
//</DashLayout>)}
