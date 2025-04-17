import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import DashLayoutVenue from "../../components/Venue/DashLayoutVenue";
import SearchBar from "../../components/Venue/SearchBar";
import EntertainerCard from "../../components/Venue/EntertainerCard";
import FilterNavbar from "../../components/Venue/FilterNavbar";
import EntertainerListFooter from "../../components/Venue/EntertainerListFooter";

export default function AllEntertainer() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [entertainers, setEntertainers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const searchQuery = searchParams.get("search") || "";
  const availability = searchParams.get("availability") || "";
  const category = searchParams.get("category") || "";
  const date = searchParams.get("date") || "";
  const pageIndex = Number(searchParams.get("page")) || 1;
  const pageSize = Number(searchParams.get("pageSize")) || 10;

  useEffect(() => {
    const fetchEntertainers = async () => {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No token found. Please log in again.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}venues/search/entertainers`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            params: {
              search: searchQuery || null,
              availability: availability || null,
              category: category || null,
              page: pageIndex,
              pageSize: pageSize,
              date:date
            },
          }
        );
        console.log("entertainer data",response.data)
        setEntertainers(response.data.entertainers || []);
        setTotalCount(response.data.totalCount || 0);
      } catch (err) {
        setError(err.message || "Failed to fetch entertainers.");
      } finally {
        setLoading(false);
      }
    };

    fetchEntertainers();
  }, [searchQuery, availability, category, pageIndex, pageSize,date]);

  useEffect(() => {
    fetchVenues();
  }, []);
  

  const updateFilters = (newFilters) => {
    const updatedParams = new URLSearchParams(searchParams);
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value) {
        updatedParams.set(key, value);
      } else {
        updatedParams.delete(key);
      }
    });

    updatedParams.set("page", "1");
    setSearchParams(updatedParams);
  };

  const fetchVenues = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}venues`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      console.log("Venue Response:", response.data);
  
      const parentVenue = response.data.venues.find(venue => venue.isParent);
  
      if (parentVenue) {
        localStorage.setItem("venueId", parentVenue.id);
      } else {
        console.warn("No parent venue found.");
      }
    } catch (error) {
      console.error("Error fetching venues:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleWishlistToggle = (eid, isWishlisted) => {
    setEntertainers(prev =>
      prev.map(ent =>
        ent.eid === eid ? { ...ent, isWishlisted } : ent
      )
    );
  };
  

  return (
    <DashLayoutVenue
      title="All Entertainers"
      description="View and book your preferred entertainer"
    >
      <div className="d-flex flex-column min-vh-100">
        <SearchBar updateFilters={updateFilters} />
        <div className="mt-3">
          <FilterNavbar updateFilters={updateFilters} />
        </div>
        <div className="container mt-3">
          <div className="scrollable-container">
            <div className="row">
              {loading ? (
                <div className="d-flex justify-content-center my-5">
                  <div className="spinner-grow text-dark" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : entertainers.length > 0 ? (
                entertainers.map((entertainer) => (
                  <EntertainerCard
                    key={entertainer.eid}
                    isWishlisted={entertainer.isWishlisted}
                    isProcessing={false}
                    entertainer={entertainer}
                    onRemoveFromWishlist={(eid) => handleWishlistToggle(eid, false)}
                    onToggleWishlist={handleWishlistToggle}
                  />
                ))
              ) : <div>
                <p className="text-danger text-center">No Entertainers found</p>
                </div>}
            </div>
          </div>
        </div>
      </div>
      <EntertainerListFooter />
    </DashLayoutVenue>
  );
}
