import React, { useEffect, useRef, useState } from "react";
import Input from "../Input";
import Button from "../Button";
import axios from "axios";
import Select from "../Select";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function SearchBar({ updateFilters }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || ""
  );
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [entertainers, setEntertainers] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || ""
  );

  const navigate = useNavigate();
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

  useEffect(() => {
    // Close dropdown when clicking outside the input or suggestions
    const handleClickOutside = (event) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target) &&
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}location/countries`
        );
        const formattedCountries = response.data.countries.map((country) => ({
          value: country.id,
          label: country.name,
        }));
        setCountries(formattedCountries);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };

    fetchCountries();
  }, []);

  useEffect(() => {
    if (searchQuery.length > 0) {
      fetchSuggestions(searchQuery);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchQuery]);

  const fetchSuggestions = async (query) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}venues/search/suggestion/cat`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { q: query },
      });

      if (Array.isArray(response.data.data) && response.data.data.length > 0) {
        setSuggestions(response.data.data);
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // const handleSearchChange = (e) => {
  //   const query = e.target.value;
  //   setSearchQuery(query);
  //   fetchSuggestions(query);

  //   if (query.trim() === "") {
  //     const updatedParams = new URLSearchParams(searchParams);
  //     updatedParams.delete("search");
  //     setSearchParams(updatedParams);

  //     setSuggestions([]);
  //     setShowSuggestions(false);
  //   }
  // };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim() === "") { // Ensure all spaces are removed before checking length
      setSuggestions([]);
      setShowSuggestions(false);

      const updatedParams = new URLSearchParams(searchParams);
      updatedParams.delete("search");
      setSearchParams(updatedParams);

      return; // Stop further execution
    }

    // Introduce a small delay to ensure state updates properly
    setTimeout(() => fetchSuggestions(query), 100);
  };





  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion.name);
    setSelectedCategory(suggestion.id);
    setTimeout(() => setShowSuggestions(false), 0); // Delay closing
  };


  // const handleSuggestionClick = (suggestion) => {
  //   setSearchQuery(suggestion.name);
  //   setShowSuggestions(false);
  //   setSelectedCategory(suggestion.id);
  // };

  const handleSearchClick = async () => {
    if (!selectedCategory) {
      alert("Please select a category.");
      return;
    }

    setSearchParams({ category: selectedCategory, search: searchQuery });
    navigate('/venue/entertainers')
    fetchEntertainers(selectedCategory);
  };

  useEffect(() => {
    console.log("Current URL Params:", searchParams.toString());
  }, [searchParams]);

  useEffect(() => {
    setSelectedCategory(searchParams.get("category") || "");
  }, [searchParams]);

  const fetchEntertainers = async (category, searchQueryParam) => {
    const apiUrl = `${import.meta.env.VITE_API_URL}venues/search/entertainers`;
    const token = localStorage.getItem("token");
    const params = {};
    if (category) {
      params.category = category;
    }
    if (searchQueryParam) {
      params.search = searchQueryParam;
    }
    try {
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        params,
      });

      console.log("Fetched entertainers:", response.data);
      setEntertainers(response.data.data || []);

      updateFilters({
        category,
        search: searchQueryParam || "",
      });
    } catch (error) {
      console.error("Error fetching entertainers:", error);
      setEntertainers([]);
    }
  };



  return (
    <>
      <div className="container-fluid bg-searchbar mt-0 p-0 w-100">
        <div className="container">
          <div className="row search-bar gx-1 pt-2">
            <div className="col-md-2 col-sm-12 col-12">
              <Input
                type="date"
                className="rounded-3 custom-search-font p-3"
                style={{ "border": "none" }}
              />
            </div>
            <div className="col-md-2 col-sm-12 col-12">
              <Input
                type="time"
                className="rounded-3 custom-search-font p-3"
                style={{ "border": "none" }}
              />
            </div>
            <div className="col-md-3 col-sm-12 col-12">
              <select
                className="form-select custom-search-font rounded-3 p-1"
                aria-label="Default select example"
                style={{ "border": "none" }}
              ><i class="fa-solid fa-location-dot"></i>

                <option value="default">Neighbourhoods</option>
                <option value="us">US</option>
                <option value="india">India</option>
              </select>
            </div>

            <div className="col-md-3 col-sm-12 col-12">
              {/* <input
                type="text"
                placeholder="Search Entertainers"
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => setShowSuggestions(true)}
                className="form-control custom-search-font rounded-3 p-2"
                style={{ "border": "none" }}
              />
              {showSuggestions && suggestions.length > 0 && (
                <ul
                  className="dropdown-menu show position-absolute shadow suggestion-dropdown"
                  style={{ width: "48%" }}
                >
                  {suggestions.map((suggestion, index) => (
                    <li
                      key={suggestion.id || index}
                      className="dropdown-item custom-search-font"
                      onClick={() => handleSuggestionClick(suggestion)}
                      style={{ cursor: "pointer" }}
                    >
                      {suggestion.name}
                    </li>
                  ))}
                </ul>
              )} */}

              <input
                ref={inputRef}
                type="text"
                placeholder="Search Entertainers"
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => setShowSuggestions(true)}
                className="form-control custom-search-font rounded-3 p-2"
                style={{ "border": "none" }}
              />

              {showSuggestions && suggestions.length > 0 && (
                <ul ref={suggestionsRef} className="dropdown-menu show position-absolute shadow" style={{ width: "32%" }}>
                  {suggestions.map((suggestion, index) => (
                    <li
                      key={index}
                      className="dropdown-item"
                      onClick={() => setSearchQuery(suggestion.name)}
                    >
                      {suggestion.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="col-md-2 col-sm-12 col-12">
              <Button
                className="btn mybtn"
                onClick={handleSearchClick}
              >
                <i className="fa fa-search me-3 fs-6"></i>
                Search
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
