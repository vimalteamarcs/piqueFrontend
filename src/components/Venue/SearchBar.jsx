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
    setSelectedCategory(suggestion.id); // ✅ ensures category number is stored
    setShowSuggestions(false);
  };




  // const handleSuggestionClick = (suggestion) => {
  //   setSearchQuery(suggestion.name);
  //   setSelectedCategory(suggestion.id);
  //   setTimeout(() => setShowSuggestions(false), 0); // Delay closing
  // };


  // const handleSuggestionClick = (suggestion) => {
  //   setSearchQuery(suggestion.name);
  //   setShowSuggestions(false);
  //   setSelectedCategory(suggestion.id);
  // };

  const handleSearchClick = async () => {
    // if (!selectedCategory) {
    //   alert("Please select a category.");
    //   return;
    // }

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

  const [formattedDate, setFormattedDate] = useState("");
  
const [selectedDate, setSelectedDate] = useState(""); 

   

  const fetchEntertainersByDate = async (selectedDate) => {
  try {
    const apiUrl = `${import.meta.env.VITE_API_URL}venues/search/entertainers`;
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No token found. User might be logged out.");
      return;
    }

    // Format date to YYYY-MM-DD
    const formattedDate = selectedDate ? new Date(selectedDate).toISOString().split("T")[0] : null;

    const params = {};
    if (formattedDate) {
      params.date = formattedDate;
    }

      updateFilters({
        
        date: formattedDate || "",
      });
      
console.log("params",params);

    const response = await axios.get(apiUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      params,
    });

    console.log("after date",response.data.entertainers);
    
    setEntertainers(response.data.entertainers || []);

    

  } catch (error) {
    console.error("Error fetching entertainers:", error.response?.data || error.message);
    setEntertainers([]);
  }
};


const handleDateChange = (event) => {
  const rawDate = event.target.value; // e.g., "2025-04-05"
  setSelectedDate(rawDate); // Keep original value for input

  if (rawDate) {
    const dateObj = new Date(rawDate);
    
    // Format date as "YYYY-MM-DD" for API call
    const formattedDateForApi = dateObj.toISOString().split("T")[0];

    // Extracting the day and ensuring it's two digits
    const day = dateObj.getDate().toString().padStart(2, "0");

    // Extracting the short month name manually
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = monthNames[dateObj.getMonth()];

    // Extracting the year
    const year = dateObj.getFullYear();

    // Setting the formatted date as "05 Apr 2025"
    setFormattedDate(`${day} ${month} ${year}`);
console.log("after date",selectedCategory, formattedDateForApi);


    // Call fetchEntertainers with selected category and formatted date
    fetchEntertainersByDate( formattedDateForApi);
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
        style={{ border: "1px solid #EAEAEA" }}
        value={selectedDate}
        onChange={handleDateChange}
      />
            </div>
            {/* <div className="col-md-2 col-sm-12 col-12">
              <Input
                type="time"
                className="rounded-3 custom-search-font p-3"
                style={{ "border": "1px solid #EAEAEA" }}
                        

              />
            </div> */}
            <div className="col-md-3 col-sm-12 col-12 position-relative">
              <i className="fa-solid fa-location-dot locationBH"></i>
              {/* <select
                className="form-select custom-search-font rounded-3 locnBG"
                aria-label="Default select example"
                style={{ border: "1px solid #EAEAEA" }}
              >

                <option value="default">Neighbourhoods</option>
                <option value="us">US</option>
                <option value="india">India</option>
              </select> */}
              <select
                className="form-select custom-search-font rounded-3 locnBG"
                aria-label="Select neighbourhood"
                defaultValue=""
                style={{ border: "1px solid #EAEAEA" }}
              >
                <option value="" disabled hidden>
                  Neighbourhoods
                </option>
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
                style={{ "border": "1px solid #EAEAEA" }}
              />

              {showSuggestions && suggestions.length > 0 && (
                <ul ref={suggestionsRef} className="dropdown-menu show position-absolute shadow" style={{ width: "32%" }}>
                  {suggestions.map((suggestion, index) => (
                    <li
                      key={index}
                      className="dropdown-item"
                      // onClick={() => setSearchQuery(suggestion.name)}
                      onClick={() => handleSuggestionClick(suggestion)}
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


