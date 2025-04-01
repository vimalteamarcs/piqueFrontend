import React, { useState, useEffect } from "react";
import Input from "../../components/Input";
import Select from "../../components/Select";
import RadioButton from "../../components/RadioButton";
import Button from "../../components/Button";
import axios from "axios";

import DashLayout from "../DashLayout";
import { useLocation, useNavigate } from "react-router-dom";
import {
  CREATE_ENTERTAINER,
  DELETE_MEDIA,
  GET_CITIES,
  GET_COUNTRIES,
  GET_MAIN_CATEGORY,
  GET_MEDIA_BYID,
  GET_STATES,
  GET_SUB_CATEGORY,
  UPDATE_ENTERTAINERS_BYID,
  UPDATE_MEDIA,
  UPLOAD_MEDIA,
  UPLOAD_URL_BY_USERID,
} from "../../../constants";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Spinner from "../../components/Spinner";
import AdminSideBar from "../../components/Venue/AdminSideBar";

export default function EditEntertainer() {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  let headshot = null;
  let images = null;
  let videos = null;

  const [media, setMedia] = useState({
    headshot: null,
    image: [],
    video: [],
  });
  const [flag, setFlag] = useState(true);
  const token = localStorage.getItem("token");
  const location = useLocation();
  const navigate = useNavigate();
  let data = location.state;
  console.log(data)

  const [formData, setFormData] = useState({
    id: 0,
    name: "",
    category: 0,
    specific_category: 0,
    bio: "",
    phone1: "",
    phone2: "",
    performanceRole: "",
    availability: "",
    pricePerEvent: 0,
    socialLinks: "",
    vaccinated: "",
    status: "",
    user: data.user.id || "",
    country: 0,
    state: 0,
    city: 0
  });
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}${GET_COUNTRIES}`
        );
        console.log(response.data); // Debugging

        setCountries(response.data?.countries || []);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };

    fetchCountries();
  }, []);


  const fetchStates = async (countryId) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}${GET_STATES}${countryId}`
      );
      console.log("States fetched:", response.data); // Debugging
      setStates(response.data?.states || []);
    } catch (error) {
      console.error("Error fetching states:", error);
    }
  };


  const fetchCities = async (stateId) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}${GET_CITIES}${stateId}`
      );
      console.log("Cities fetched:", response.data); // Debugging
      setCities(response.data?.cities || []);
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };


  useEffect(() => {
    if (data?.id) {
      setFormData((prevState) => ({
        ...prevState,
        id: data.user.id,
        name: data.name || "",
        category: data.category || "",
        specific_category: data.specific_category || "",
        bio: data.bio || "",
        phone1: data.phone1 || "",
        phone2: data.phone2 || "",
        performanceRole: data.performanceRole || "",
        availability: data.availability || "",
        pricePerEvent: data.pricePerEvent || 0,
        socialLinks: data.socialLinks || "",
        vaccinated: data.vaccinated || "",
        status: data.status || "active", // Default to "active" if not available
        user: data.user.id || "",
        // No need to set images, videos, or headshot here unless you want to
      }));
    }
  }, [data]);

  const status = [
    { value: "active", label: "Active" },
    { value: "pending", label: "Pending" }
  ]

  useEffect(() => {
    const fetchData = async () => {
      if (data?.id) {
        let id = data.user.id;
        if (id) {
          try {
            const mediaRes = await axios.get(
              `${import.meta.env.VITE_API_URL}${GET_MEDIA_BYID}${id}`,
              { headers: { Authorization: `Bearer ${token}` } }
            );

            const fetchedMedia = mediaRes.data.media;

            if (fetchedMedia.length > 0) {
              // Process media in a single state update
              let newHeadshot = null;
              let newImages = [];
              let newVideos = [];
              let newMedia = { headshot: null, image: [], video: [] };

              fetchedMedia.forEach((mediaItem) => {
                if (mediaItem.type === "headshot") {
                  newHeadshot = mediaItem; // Store the full headshot data
                } else if (mediaItem.type === "image") {
                  newImages.push(mediaItem); // Add full image data
                } else if (mediaItem.type === "video") {
                  newVideos.push(mediaItem); // Add full video data
                }

                // Update the newMedia object with the full mediaItem data for each type
                newMedia[mediaItem.type] = [
                  ...(newMedia[mediaItem.type] || []),
                  mediaItem, // Add the full mediaItem data (not just URL)
                ];
              });

              // Set the full media data in the state
              setMedia(newMedia);
            }
          } catch (mediaError) {
            console.error("Failed to fetch media:", mediaError);
          }
        }
      }
    };
    setLoading(true);
    fetchData();
    setLoading(false);
  }, [data, token, flag]);

  const performanceRole = [
    { value: "soloist", label: "Soloist" },
    { value: "duo", label: "Duo" },
    { value: "trio", label: "Trio" },
  ];

  const options = [
    { value: "yes", label: "Yes" },
    { value: "no", label: "No" },
  ];

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}${GET_MAIN_CATEGORY}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data && Array.isArray(response.data)) {
          setCategories(
            response.data.map((cat) => ({
              value: cat.id,
              label: cat.name,
            }))
          );
        } else {
          console.error(
            "Unexpected API response format for categories:",
            response.data
          );
          toast.error("Failed to load categories. Please try again.");
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    setLoading(true);
    fetchCategories();
    setLoading(false);
  }, []);

  useEffect(() => {
    if (data) {
      setFormData((prev) => ({
        ...prev,
        country: data.country || "",
        state: data.state || "",
        city: data.city || "",
      }));

      if (data.country) {
        fetchStates(data.country); // Fetch states for selected country
      }

      if (data.state) {
        fetchCities(data.state); // Fetch cities for selected state
      }
    }
  }, [data]);


  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "", // Clear the error for this field
    }));

    if (name === "country") {
      setStates([]); // Clear states list
      setCities([]); // Clear cities list
      fetchStates(value); // Fetch new states based on country
    }

    if (name === "state") {
      setCities([]); // Clear cities list
      fetchCities(value); // Fetch new cities based on state
    }
  };



  // Fetch subcategories when the selected category changes
  useEffect(() => {
    const fetchSubcategories = async () => {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}${GET_SUB_CATEGORY}`,
          { parentId: formData.category },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data && Array.isArray(response.data)) {
          setSubcategories(
            response.data.map((sub) => ({
              value: sub.id,
              label: sub.name,
            }))
          );
        } else {
          console.error("No subcategory found:", response.data);
          setSubcategories([]);
          toast.error("No subcategories found for the selected category");
        }
      } catch (error) {
        console.error("Error fetching subcategories:", error);
        setSubcategories([]);
        toast.error("Failed to fetch subcategories.");
      }
    };

    // Only fetch subcategories if category is selected
    if (formData.category) {
      fetchSubcategories();
    }
  }, [formData.category]); // This effect runs when `formData.category` changes

  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value; // Get the selected category value

    // Update the form data with the selected category
    setFormData((prev) => ({
      ...prev,
      category: selectedCategory, // Set category from selected value
      specific_category: "", // Reset subcategory when category changes
    }));
  };

  const handleSubCategoryChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      specific_category: e.target.value, // Update specific_category
    }));
  };

  // const deletemedia = async (index) => {
  //   setLoading(true);
  //   try {
  //     const response = await axios.delete(
  //       `${import.meta.env.VITE_API_URL}${DELETE_MEDIA}${index}`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );
  //     console.log(response.data)
  //     setFlag(!flag);
  //     toast.success("Media deleted successfully!", { autoClose: 1000 });
  //   } catch (error) {
  //     console.error("Error deleting Media:", error);
  //     toast.error("Failed to delete Media. Please try again.");
  //   }
  //   setLoading(false);
  // };

  const deletemedia = async (id, type) => {
    setLoading(true);
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}${DELETE_MEDIA}${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Media deleted successfully!", { autoClose: 1000 });

        // Update media state to remove the deleted item
        setMedia((prevMedia) => {
          console.log("Previous Media State:", prevMedia); // Log previous state for debugging
          const updatedMedia = {
            ...prevMedia,
            [type]: prevMedia[type].filter((item) => item.id !== id),
          };
          console.log("Updated Media State:", updatedMedia); // Log updated state for debugging
          return updatedMedia;
        });
      }
    } catch (error) {
      console.error("Error deleting Media:", error);
      toast.error("Failed to delete Media. Please try again.");
    }
    setLoading(false);
  };



  const handleFileChange = (e, fileType) => {
    const files = e.target.files;
    setLoading(true);
    if (fileType === "headshot") {
      headshot = files[0];
      if (!media.headshot) {
        mediaUpload(e, files);
      } else {
        mediaUpdate(e); // Trigger update for headshot upload
      }
    }
    if (fileType === "images") {
      images = Array.from(files);
      if (!media.image) {
        mediaUpload(e, files);
      } else {
        mediaUpload(e, files); // Trigger update for images upload
      }
    }
    if (fileType === "videos") {
      videos = Array.from(files);
      if (media.video) {
        mediaUpload(e, files);
      } else {
        mediaUpload(e, files); // Trigger update for images upload
      }
    }
    setLoading(false);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Entertainer Name is required";

    // if (!formData.type) newErrors.type = "Entertainer Type is required";

    if (!formData.phone1) newErrors.phone1 = "Phone Number 1 is required";
    else if (!/^\d+$/.test(formData.phone1))
      newErrors.phone1 = "Phone Number 1 must be digits only";

    if (!formData.performanceRole)
      newErrors.performanceRole = "Performance Role is required";

    // Validate pricePerEvent
    if (!formData.pricePerEvent) {
      newErrors.pricePerEvent = "Price is required";
    } else if (
      isNaN(formData.pricePerEvent) ||
      Number(formData.pricePerEvent) <= 0
    ) {
      newErrors.pricePerEvent = "Price must be a positive number";
    }

    if (!formData.availability)
      newErrors.availability = "Availability is required";

    if (!formData.vaccinated)
      newErrors.vaccinated = "Vaccination status is required";

    return newErrors;
  };

  const mediaUpdate = async (e) => {
    setLoading(true);
    e.preventDefault();
    const files = e.target.files;

    let mediaId = 0;
    // Create FormData object
    const mediaFormData = new FormData();

    // Ensure that only one media type (image, video, or headshot) is selected
    if (headshot) {
      mediaFormData.append("headshot", headshot);
      mediaId = media.headshot[0].id;
    }

    mediaFormData.append("userId", formData.id);

    try {
      // Send the PUT request
      const mediaUploadResponse = await axios.put(
        `${import.meta.env.VITE_API_URL}${UPDATE_MEDIA}${mediaId}`,
        mediaFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Axios will automatically set this header for FormData
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (
        mediaUploadResponse.status === 201 ||
        mediaUploadResponse.status === 200
      ) {
        // Handle successful upload
        const { headshotUrl, imagesUrls, videosUrls } =
          mediaUploadResponse.data;
        setFormData((prev) => ({
          ...prev,
          headshot: headshotUrl || prev.headshot,
          images: imagesUrls || prev.images,
          videos: videosUrls || prev.videos,
        }));

        toast.success("Media updated successfully!", { autoClose: 1000 });
        setFlag(!flag);
      }
    } catch (error) {
      console.error("Error updated media:", error);
      toast.error("Failed to updated media. Please try again.");
    }
    setLoading(false);
  };

  const mediaUpload = async (e, file) => {
    setLoading(true);
    e.preventDefault();

    if (!file || !file.length) {
      return; // Exit if no file is provided
    }

    try {
      // Handle each file individually
      const filesToUpload = file.length === 1 ? [file[0]] : Array.from(file);

      // Iterate through each file and send a request for each one
      for (let item of filesToUpload) {
        const mediaFormData = new FormData();
        const fileType = item.type.split("/")[0]; // Extract the type (image, video)

        // Append the correct file based on its type
        if (fileType === "image" && !media.headshot) {
          mediaFormData.append("headshot", item); // Handle headshot
        } else if (fileType === "image") {
          mediaFormData.append("images", item); // Handle images
        } else if (fileType === "video") {
          mediaFormData.append("videos", item); // Handle videos
        }

        // Add userId to the form data
        mediaFormData.append("userId", data.user.id);

        // Send the form data to the server for this individual file
        const mediaUploadResponse = await axios.post(
          `${import.meta.env.VITE_API_URL}${UPLOAD_MEDIA}`,
          mediaFormData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Handle successful response
        if (mediaUploadResponse.status === 201) {
          const { headshotUrl, imagesUrls, videosUrls } =
            mediaUploadResponse.data;

          setFormData((prev) => ({
            ...prev,
            headshot: headshotUrl || prev.headshot,
            images: imagesUrls || prev.images,
            videos: videosUrls || prev.videos,
          }));

          toast.success("Media uploaded successfully!", {
            autoClose: 1000,
          });
          setTimeout(() => {
            setFlag(!flag);
          }, 3000);
        }
      }
    } catch (error) {
      console.error("Error uploading media:", error);
      toast.error("Failed to upload media. Please try again.");
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setLoading(true);

    const { id, ...rest } = formData;

    const payload = {
      id: Number(id),
      fieldsToUpdate: {
        ...rest,
        category: Number(formData.category),
        specific_category: Number(formData.specific_category),
        pricePerEvent: Number(formData.pricePerEvent),
        city: Number(formData.city),
        country: Number(formData.country),
        state: Number(formData.state),
      },
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}${UPDATE_ENTERTAINERS_BYID}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201 || response.status === "success") {
        toast.success("Entertainer Updated successfully!", { autoClose: 1000 });
      }
    } catch (error) {
      console.error("Error submitting form:", error.response || error.message);
      toast.error("Failed to submit the form.");
    }
    setLoading(false);
  };

  const [url, setUrl] = useState("");
  const [mediaType, setMediaType] = useState("video");

  const uploadUrl = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Extract the file extension from the URL
    const type = url.split(".").pop();

    // Determine the type based on the extension

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}${UPLOAD_URL_BY_USERID}`,
        {
          url,
          userId: data.user.id || undefined,
          refId: undefined,
          type: mediaType, // Use the media type determined earlier
        }
      );

      toast.success("URL uploaded successfully!", {
        autoClose: 1000,
      });
      setUrl("");
      setFlag(!flag);
      console.log(response.data);
    } catch (error) {
      toast.error("Failed to upload URL. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <DashLayout title="Profile" description="View and manage your profile" />
      <div className="container-fluid w-100 p-0">
        <div className="pageLayout">
          <div className="dash-sidebar-container">
            <AdminSideBar />
          </div>
          <div className="dash-profile-container">
            <div className="card">
              <div className="card-body">
                {/* <Spinner show={loading} /> */}
                <ToastContainer />
                <div className="row">
                  <div className="col-md-12">
                    <button
                      onClick={() => navigate(-1)}
                      className="btn btn-outline-dark btn-sm d-flex align-items-center mb-1 m-2"
                    >
                      <i
                        className="fa fa-arrow-left"
                        style={{ marginRight: "8px" }}
                      ></i>
                    </button>
                    <p className="profile-font fw-semibold mt-3">PROFILE</p><hr />
                  </div>
                  <div className="row justify-content-center mb-4 scrollable-container event-form pt-2 m-1">
                    <form onSubmit={handleSubmit}>
                      <div className="d-flex justify-content-center">
                        <div className="col-12 border-0">
                          <div className="card-body">
                            <p className="text-start label-font fw-semibold text-muted">
                              Entertainer Details
                            </p>
                            <hr />
                            <div className="row mb-3 label-font">
                              <div className="col-md-4">
                                <label className="fw-semibold mb-2">Entertainer Name</label>
                                <Input
                                  type="text"
                                  name="name"
                                  value={formData.name}
                                  placeholder="Enter your Entertainer Name"
                                  onChange={handleInputChange}
                                />
                                {errors.name && (
                                  <div className="text-danger">{errors.name}</div>
                                )}
                              </div>
                              <div className="col-md-4">
                                <label className="fw-semibold mb-2">
                                  Entertainer Main Category
                                </label>
                                <Select
                                  options={categories}
                                  value={formData.category || ""}
                                  onChange={handleCategoryChange}
                                  placeholder="Select Category"
                                />
                              </div>
                              <div className="col-md-4">
                                <label className="fw-semibold mb-2">
                                  Entertainer Sub Category
                                </label>
                                <Select
                                  options={subcategories}
                                  value={formData.specific_category || ""}
                                  onChange={handleSubCategoryChange}
                                  placeholder="Select Subcategory"
                                  isDisabled={!formData.category}
                                />
                              </div>
                            </div>

                            <div className="row mb-3 label-font">
                              <div className="col-md-4">
                                <label className="fw-semibold mb-2">Bio</label>
                                <textarea
                                  className="form-control"
                                  name="bio"
                                  value={formData.bio}
                                  onChange={handleInputChange}
                                  placeholder="Describe your business"
                                />
                              </div>
                              <div className="col-md-4">
                                <label className="fw-semibold mb-2">Contact Number 1</label>
                                <Input
                                  type="text"
                                  name="phone1"
                                  value={formData.phone1}
                                  placeholder="Enter your contact number."
                                  onChange={handleInputChange}
                                />
                                {errors.phone1 && (
                                  <div className="text-danger">{errors.phone1}</div>
                                )}
                              </div>
                              <div className="col-md-4">
                                <label className="fw-semibold mb-2">Contact Number 2</label>
                                <Input
                                  type="text"
                                  name="phone2"
                                  value={formData.phone2}
                                  placeholder="Enter your another contact number."
                                  onChange={handleInputChange}
                                />
                              </div>
                            </div>

                            <div className="row mb-3 label-font">
                              <div className="col-md-4">
                                <label className="fw-semibold mb-2">Performance Role</label>
                                <Select
                                  name="performanceRole"
                                  options={performanceRole}
                                  defaultOption="--Select Role--"
                                  value={formData.performanceRole}
                                  onChange={handleInputChange}
                                />
                                {errors.performanceRole && (
                                  <div className="text-danger">
                                    {errors.performanceRole}
                                  </div>
                                )}
                              </div>
                              <div className="col-md-4">
                                <label className="fw-semibold mb-2">Availability?</label>
                                <RadioButton
                                  name="availability"
                                  options={options}
                                  value={formData.availability}
                                  onChange={handleInputChange}
                                />
                                {errors.availability && (
                                  <div className="text-danger">
                                    {errors.availability}
                                  </div>
                                )}
                              </div>
                              {/* <div className="col-md-4">
                                <label className="fw-semibold mb-2">Price Per Event</label>
                                <Input
                                  type="number"
                                  name="pricePerEvent"
                                  value={formData.pricePerEvent}
                                  placeholder="$"
                                  onChange={handleInputChange}
                                />
                              </div> */}
                              <div className="col-md-4">
                                <label className="fw-semibold mb-2">Price Per Event</label>
                                <div className="input-group">
                                  <span className="input-group-text">$</span>
                                  <input
                                    type="number"
                                    className="form-control"
                                    name="pricePerEvent"
                                    value={formData.pricePerEvent}
                                    placeholder="Enter price"
                                    onChange={handleInputChange}
                                    min="0"
                                  />
                                </div>
                              </div>

                            </div>
                            <div className="row mb-3 label-font">
                              <div className="col-md-4">
                                <label className="fw-semibold mb-2">Vaccinated?</label>
                                <RadioButton
                                  name="vaccinated"
                                  options={options}
                                  value={formData.vaccinated}
                                  onChange={handleInputChange}
                                />
                                {errors.vaccinated && (
                                  <div className="text-danger">
                                    {errors.vaccinated}
                                  </div>
                                )}
                              </div>
                              <div className="col-md-4">
                                <label className="fw-semibold label-font">Status</label>
                                <Select
                                  name="status"
                                  options={status}
                                  defaultOption="--Select Status--"
                                  value={formData.status}
                                  onChange={handleInputChange}
                                />
                              </div>
                            </div>

                            <div className="row mb-3">
                              <div className="col-md-4">
                                <label className="form-label label-font mt-3  fw-medium">
                                  Country
                                </label>
                                <select
                                  className="form-control "
                                  name="country"
                                  value={formData.country}
                                  onChange={handleInputChange}
                                  required
                                >
                                  <option value="">Select Country</option>
                                  {countries.map((c) => (
                                    <option key={c.id} value={c.id}>
                                      {c.name}
                                    </option>
                                  ))}
                                </select>
                              </div>

                              <div className="col-md-4">
                                <label className="form-label label-font mt-3 fw-medium">
                                  State
                                </label>
                                <select
                                  className="form-control"
                                  name="state"
                                  onChange={handleInputChange}
                                  value={formData.state}
                                  required
                                >
                                  <option value="">Select State</option>
                                  {states.map((s) => (
                                    <option key={s.id} value={s.id}>
                                      {s.name}
                                    </option>
                                  ))}
                                </select>
                              </div>

                              <div className="col-md-4">
                                <label className="form-label label-font mt-3 fw-medium">
                                  City
                                </label>
                                <select
                                  className="form-control"
                                  name="city"
                                  value={formData.city}
                                  onChange={handleInputChange}
                                  required
                                >
                                  <option value="">Select City</option>
                                  {cities.map((c) => (
                                    <option key={c.id} value={c.id}>
                                      {c.name}
                                    </option>
                                  ))}
                                </select>
                              </div>

                            </div>
                            <p className="text-start text-muted fw-semibold label-font mt-2">Links</p>
                            <hr />
                            <div className="row mb-3 label-font">
                              <label className="fw-semibold mb-2">Social Media Link</label>
                              <div className="col-md-6 col-sm-12">
                                <Input
                                  type="text"
                                  name="socialLinks"
                                  value={formData.socialLinks}
                                  placeholder="Enter your Social Media Link"
                                  onChange={handleInputChange}
                                />
                              </div>
                            </div>
                            <div className="row ">
                              <div className="col ">
                                <Button
                                  type="submit"
                                  className="btn btn-dark btn-sm mb-3"
                                  label={"Update"}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </form>
                    <div>
                      <div className="d-flex justify-content-center">
                        <div className="col-12 border-0 ">
                          <div className="card-body">
                            <p className="text-start text-muted label-font fw-semibold mt-2">
                              Media Uploads
                            </p>
                            <hr />

                            <div className="row mb-3 label-font">
                              <div className="col-md-12 col-sm-12">
                                <label className="fw-semibold mb-2">
                                  Headshot Profile Pic
                                </label>
                                <Input
                                  type="file"
                                  name="headshot"
                                  accept="image/*"
                                  onChange={(e) => handleFileChange(e, "headshot")}
                                />

                                {media.headshot && (
                                  <div className="position-relative">
                                    <img
                                      src={
                                        media.headshot instanceof File
                                          ? URL.createObjectURL(media.headshot[0]) // If the headshot is a File object, create an object URL
                                          : media.headshot[0].url // Otherwise, use the URL stored in the media.headshot object
                                      }
                                      alt="Headshot preview"
                                      className="media-image rounded"
                                      style={{ height: "90px", width: "90px" }}
                                    />

                                    {/* <button
                                      type="button"
                                      className="btn btn-link position-absolute"
                                      onClick={() => {
                                        const confirmDelete = window.confirm(
                                          "Are you sure you want to delete this headshot?"
                                        );
                                        if (confirmDelete) {
                                          deletemedia(media.headshot[0].id);
                                        }
                                      }}
                                    >
                                      <i className="fa-solid fa-trash-can text-danger"></i>
                                    </button> */}
                                    <button
                                      type="button"
                                      className="btn btn-link position-absolute"
                                      onClick={() => {
                                        const confirmDelete = window.confirm("Are you sure you want to delete this headshot?");
                                        if (confirmDelete) {
                                          deletemedia(media.headshot[0].id, "headshot");
                                        }
                                      }}
                                    >
                                      <i className="fa-solid fa-trash-can text-danger"></i>
                                    </button>

                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="row mt-4">
                              <div className="col-md-12 col-sm-12">
                                <label className="fw-semibold label-font mb-2">Image Upload</label>
                                <Input
                                  type="file"
                                  name="images"
                                  accept="image/*"
                                  multiple
                                  onChange={(e) => handleFileChange(e, "images")}
                                />

                                {media.image.length > 0 && (
                                  <div className="d-flex flex-wrap gap-3">
                                    {media.image.map((file, index) => (
                                      <div
                                        key={index}
                                        className="position-relative p-2"
                                      >
                                        <img
                                          src={
                                            file instanceof File
                                              ? URL.createObjectURL(file.url)
                                              : file.url
                                          }
                                          alt={`Uploaded image ${index}`}
                                          className="media-image rounded"
                                          style={{ height: "90px", width: "90px" }}
                                        />
                                        {/* <button
                                          type="button"
                                          className="btn btn-link position-absolute"
                                          onClick={() => {
                                            const confirmDelete = window.confirm(
                                              "Are you sure you want to delete this image?"
                                            );
                                            if (confirmDelete) {
                                              deletemedia(file.id);
                                            }
                                          }}
                                        >
                                          <i className="fa-solid fa-trash-can text-danger"></i>
                                        </button> */}

                                        <button
                                          type="button"
                                          className="btn btn-link position-absolute"
                                          onClick={() => {
                                            const confirmDelete = window.confirm("Are you sure you want to delete this image?");
                                            if (confirmDelete) {
                                              deletemedia(file.id, "image");
                                            }
                                          }}
                                        >
                                          <i className="fa-solid fa-trash-can text-danger"></i>
                                        </button>

                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Video Upload */}
                            <div className="row mt-4">
                              <div className="col-md-12 col-sm-12">
                                <label className="fw-semibold label-font mb-2">Video Upload</label>
                                <Input
                                  type="file"
                                  name="videos"
                                  accept="video/*"
                                  multiple
                                  onChange={(e) => handleFileChange(e, "videos")}
                                />

                                {media.video.length > 0 && (
                                  <div className="d-flex flex-wrap gap-3">
                                    {media.video.map((file, index) => (
                                      <div
                                        key={index}
                                        className="position-relative p-2"
                                      >
                                        {file.url.includes("youtu.be") ? (
                                          <iframe
                                            width="190"
                                            height="90"
                                            src={`https://www.youtube.com/embed/${file.url.split("youtu.be/")[1]
                                              }?feature=shared`}
                                            title="YouTube video player"
                                            frameBorder="0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                          />
                                        ) : (
                                          <video
                                            src={file.url}
                                            autoPlay={true}
                                            controls
                                            className="media-video rounded"
                                            style={{ height: "90px", width: "190px" }}
                                          />
                                        )}

                                        {/* <button
                                          type="button"
                                          className="btn btn-link btn-sm position-absolute"
                                          onClick={() => {
                                            const confirmDelete = window.confirm(
                                              "Are you sure you want to delete this video?"
                                            );
                                            if (confirmDelete) {
                                              deletemedia(file.id);
                                            }
                                          }}
                                        >
                                          <i className="fa-solid fa-trash-can text-danger"></i>
                                        </button> */}

                                        <button
                                          type="button"
                                          className="btn btn-link btn-sm position-absolute"
                                          onClick={() => {
                                            const confirmDelete = window.confirm("Are you sure you want to delete this video?");
                                            if (confirmDelete) {
                                              deletemedia(file.id, "video");
                                            }
                                          }}
                                        >
                                          <i className="fa-solid fa-trash-can text-danger"></i>
                                        </button>

                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="row ">
                              <form onSubmit={uploadUrl}>
                                <div className="col-md-12 col-sm-12">
                                  <div className=" d-flex m-3">
                                    <div className="col-md-2 p-1">URL:</div>
                                    <div className="col-md-6">
                                      <input
                                        type="text"
                                        className="form-control"
                                        id="url"
                                        placeholder="Enter media URL"
                                        value={url}
                                        onChange={(e) => setUrl(e.target.value)}
                                        required
                                        pattern="https?://.*" // Ensures the URL starts with http or https
                                        title="Please enter a valid URL starting with http:// or https://"
                                      />
                                    </div>
                                    {/* Media Type Dropdown */}

                                    {/* <div className="col-md-3">
                    <select
                      className="form-control"
                      id="mediaType"
                      value={mediaType}
                      onChange={(e) => setMediaType(e.target.value)}
                      required
                    >
                      <option value="">Select Media Type</option>
                      <option value="video">Video</option>
                      <option value="image">Image</option>
                      <option value="audio">Audio</option>
                    </select>
                  </div> */}

                                    <div className="col-md-4">
                                      <button
                                        type="submit"
                                        className="btn btn-dark btn-sm ms-3 "
                                        disabled={loading}
                                      >
                                        {"Save"}
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </form>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
