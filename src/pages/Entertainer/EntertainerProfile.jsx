import React, { useState, useEffect } from "react";
import axios from "axios";
import DashLayoutEnter from "../../components/Entertainer/DashLayoutEnter";
import EnterAccountSidebar from "../../components/Entertainer/EnterAccountSidebar";
import EnterProfileContainer from "../../components/Entertainer/EnterProfileContainer";
import { toast, ToastContainer } from "react-toastify";

export default function Profile() {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [countries, setCountries] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    stageName:"",
    dob:"",
    category: 0,
    specific_category: 0,
    bio: "",
    phoneNumber: "",
    // phone2: "",
    performanceRole: "",
    // availability: "",
    pricePerEvent: 0,
    socialLinks: "",
    vaccinated: "",
    status: "active",
    userId: userId,
    image: [],
    video: [],
    headshot: "",
    country: 0,
    state: 0,
    city: 0,
    zipCode: "",
    services: [],
    addressLine:"",

  });
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});
  const [image, setImage] = useState([]);
  const [video, setVideo] = useState([]);
  const [tempLink, setTempLink] = useState("");
  const [media, setMedia] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [serviceInput, setServiceInput] = useState("");
  const [headshot, setHeadshot] = useState(null);
  const [headshotPreview, setHeadshotPreview] = useState("");


  const performanceRole = [
    { value: "soloist", label: "Soloist" },
    { value: "duo", label: "Duo" },
    { value: "trio", label: "Trio" },
  ];

  const options = [
    { value: "yes", label: "Vaccinated" },
    { value: "no", label: "Non-Vaccinated" },
  ];

  useEffect(() => {
    const hasFilledField = Object.values(formData).some(
      (val) => val !== "" && val !== null && val !== undefined && !(Array.isArray(val) && val.length === 0)
    );
    setIsEditing(hasFilledField);
  }, [formData]);
  
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}entertainers/categories/all`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (
          response.data &&
          response.data.categories &&
          Array.isArray(response.data.categories)
        ) {
          setCategories(
            response.data.categories.map((cat) => ({
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

    const fetchSubcategories = async (categoryId) => {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_API_URL
          }entertainers/categories/subcategories?id=${categoryId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (
          response.data?.categories &&
          Array.isArray(response.data.categories)
        ) {
          setSubcategories(
            response.data.categories.map((sub) => ({
              value: sub.id,
              label: sub.name,
            }))
          );
        } else {
          setSubcategories([]);
          toast.error("No subcategories found.");
        }
      } catch (error) {
        console.error("Error fetching subcategories:", error);
        toast.error("Failed to fetch subcategories.");
      }
    };

    // const fetchEntertainer = async () => {
    //   try {
    //     const response = await axios.get(
    //       `${import.meta.env.VITE_API_URL}entertainers`,
    //       { headers: { Authorization: `Bearer ${token}` } }
    //     );
    
    //     console.log("entertainer profile", response.data);
    //     const entertainer = response.data?.data; // updated: response.data.data, not entertainers[0]
    
    //     if (entertainer) {
    //       localStorage.setItem("entertainerId", entertainer.uid);
    
    //       setFormData({
    //         contactPerson: entertainer.contactPerson || "",
    //         stageName: entertainer.stageName || "",
    //         bio: entertainer.bio || "",
    //         contactNumber: entertainer.contactNumber || "",
    //         category: entertainer.category || "",
    //         specific_category:entertainer.specific_category || "",
    //         vaccinated: entertainer.vaccinated || "",
    //         performanceRole: entertainer.performanceRole || "",
    //         pricePerEvent: entertainer.pricePerEvent || "",
    //         services: entertainer.services || [],
    //         country: entertainer.country || 0,
    //         state: entertainer.state || 0,
    //         city: entertainer.city || 0,
    //         socialLinks: entertainer.socialLinks || "",
    //         address: entertainer.address || "",
    //         dob: entertainer.dob || "",
    //         email : entertainer.email || "",
    //         zipCode: entertainer.zipCode || "",
    //         headshot: entertainer.headshot || ""
    //       });
    
    //       setHeadshotPreview(entertainer.headshot || "");
    //       setIsEditing(true);

    //       if (entertainer.country) fetchStates(entertainer.country);
    //       if (entertainer.state) fetchCities(entertainer.state);
    
    //       if (entertainer.category) {
    //         fetchSubcategories(entertainer.category);
    //       }
          
    //     } else{
    //       setIsEditing(false)
    //     }
    //   } catch (error) {
    //     console.error("Error fetching entertainer:", error);
    //     toast.error("Failed to fetch entertainer data.");
    //     setIsEditing(false)
    //   }
    // };

    const fetchEntertainer = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}entertainers`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
    console.log(response.data)
        const entertainer = response.data?.data;
    
        // Check if entertainer object is not empty and has valid data
        const hasValidData =
          entertainer &&
          (entertainer.uid || entertainer.email || entertainer.stageName);
    
        if (hasValidData) {
          localStorage.setItem("entertainerId", entertainer.uid);
    
          setFormData({
            contactPerson: entertainer.contactPerson || "",
            stageName: entertainer.stageName || "",
            bio: entertainer.bio || "",
            contactNumber: entertainer.contactNumber || "",
            category: entertainer.category || "",
            specific_category: entertainer.specific_category || "",
            vaccinated: entertainer.vaccinated || "",
            performanceRole: entertainer.performanceRole || "",
            pricePerEvent: entertainer.pricePerEvent || "",
            services: Array.isArray(entertainer.services)
  ? entertainer.services
  : JSON.parse(entertainer.services || "[]"),

            country: entertainer.country || 0,
            state: entertainer.state || 0,
            city: entertainer.city || 0,
            socialLinks: entertainer.socialLinks || "",
            address: entertainer.address || "",
            dob: entertainer.dob || "",
            email: entertainer.email || "",
            zipCode: entertainer.zipCode || "",
            headshot: entertainer.headshotUrl || "",
          });
    
          setHeadshotPreview(entertainer.headshotUrl || "");
          setIsEditing(true); // ✅ Only set editing if data is real
    
          if (entertainer.country) fetchStates(entertainer.country);
          if (entertainer.state) fetchCities(entertainer.state);
          if (entertainer.category) fetchSubcategories(entertainer.category);
        } else {
          // New user: no data returned
          setIsEditing(false);
          localStorage.removeItem("entertainerId");
        }
      } catch (error) {
        console.error("Error fetching entertainer:", error);
        setIsEditing(false); // Treat error as no entertainer profile
      }
    };
    

    fetchCategories();
    fetchEntertainer();
  }, []);


  const handleAddService = () => {
    const trimmed = serviceInput.trim();
    if (trimmed && !formData.services.includes(trimmed)) {
      setFormData((prevData) => ({
        ...prevData,
        services: [...prevData.services, trimmed],
      }));
      setServiceInput("");
    }
  };
  
  const handleRemoveService = (indexToRemove) => {
    setFormData((prevData) => ({
      ...prevData,
      services: prevData.services.filter((_, index) => index !== indexToRemove),
    }));
  };
  
  const formatDate = (value) => {
    const date = new Date(value);
    if (isNaN(date)) return ""; // gracefully fallback
    return date.toISOString().split("T")[0];
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
  
    setFormData((prev) => ({ ...prev, [name]: value }));
  
    if (name === "country") {
      setStates([]);
      setCities([]);
      fetchStates(value);
    }
  
    if (name === "state") {
      setCities([]);
      fetchCities(value);
    }
  
    if (name === "stageName") {
      setTempLink(value);
    }
  };
  
  const handleCategoryChange = async (selectedValue) => {

    setFormData((prev) => ({
      ...prev,
      category: selectedValue,
      specific_category: "",
    }));

    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_API_URL
        }entertainers/categories/subcategories?id=${selectedValue}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (
        response.data?.categories &&
        Array.isArray(response.data.categories)
      ) {
        setSubcategories(
          response.data.categories.map((sub) => ({
            value: sub.id,
            label: sub.name,
          }))
        );
      } else {
        setSubcategories([]);
        toast.error("No subcategories found.");
      }
    } catch (error) {
      console.error("Error fetching subcategories:", error);
      toast.error("Failed to fetch subcategories.");
    }
  };

  const handleSubCategoryChange = (selectedValue) => {
    setFormData((prev) => ({
      ...prev,
      specific_category: selectedValue,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setHeadshot(file);
      const previewUrl = URL.createObjectURL(file);
      setHeadshotPreview(previewUrl);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Entertainer Name is required";

    if (!formData.type) newErrors.type = "Entertainer Type is required";

    if (!formData.phone1) newErrors.phone1 = "Phone Number 1 is required";
    else if (!/^\d+$/.test(formData.phone1))
      newErrors.phone1 = "Phone Number 1 must be digits only";

    if (!formData.performanceRole)
      newErrors.performanceRole = "Performance Role is required";

    if (!formData.availability)
      newErrors.availability = "Availability is required";

    if (!formData.vaccinated)
      newErrors.vaccinated = "Vaccination status is required";

    return newErrors;
  };
  

  useEffect(() => {
    fetchCountries();
  }, []);

  const fetchCountries = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}location/countries`
      );

      console.log("API Response:", response.data); // Debugging line

      if (Array.isArray(response.data)) {
        setCountries(response.data.map((c) => ({ label: c.name, value: c.id })));
      } else if (response.data && Array.isArray(response.data.countries)) {
        // If the data is wrapped in an object
        setCountries(response.data.countries.map((c) => ({ label: c.name, value: c.id })));
      } else {
        console.error("Unexpected API response format:", response.data);
      }
    } catch (error) {
      console.error("Error fetching countries:", error);
    }
  };

  const fetchStates = async (countryId) => {
    if (!countryId) return;
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}location/states?countryId=${countryId}`
      );
      console.log("States API Response:", response.data);

      if (Array.isArray(response.data)) {
        setStates(response.data.map((s) => ({ label: s.name, value: s.id })));
      } else if (response.data && Array.isArray(response.data.states)) {
        setStates(response.data.states.map((s) => ({ label: s.name, value: s.id })));
      } else {
        console.error("Unexpected API response format for states:", response.data);
      }
    } catch (error) {
      console.error("Error fetching states:", error);
    }
  };

  const fetchCities = async (stateId) => {
    if (!stateId) return;
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}location/cities?stateId=${stateId}`
      );
      console.log("Cities API Response:", response.data);

      if (Array.isArray(response.data)) {
        setCities(response.data.map((c) => ({ label: c.name, value: c.id })));
      } else if (response.data && Array.isArray(response.data.cities)) {
        setCities(response.data.cities.map((c) => ({ label: c.name, value: c.id })));
      } else {
        console.error("Unexpected API response format for cities:", response.data);
      }
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };
 
  const handleHeadshotChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setHeadshot(file); // actual file
      setHeadshotPreview(URL.createObjectURL(file)); // for display
    }
  };


  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  
  //   const entertainerId = localStorage.getItem("entertainerId");
  //   const form = new FormData();
  
  //   form.append("contactPerson", formData.contactPerson);
  //   form.append("category", Number(formData.category) || "");
  //   form.append("specific_category", Number(formData.specific_category) || "");
  //   form.append("bio", formData.bio);
  //   form.append("contactNumber", formData.contactNumber);
  //   form.append("performanceRole", formData.performanceRole);
  //   form.append("vaccinated", formData.vaccinated);
  //   form.append("pricePerEvent", Number(formData.pricePerEvent) || "");
  //   form.append("socialLinks", formData.socialLinks);
  //   form.append("country", formData.country);
  //   form.append("state", formData.state);
  //   form.append("city", formData.city);
  //   form.append("address", formData.address);
  //   form.append("dob", formData.dob);
  //   form.append("email", formData.email);
  //   form.append("services", JSON.stringify(formData.services));
  //   form.append("stageName", formData.stageName);
  //   form.append("zipCode", formData.zipCode);
  //   form.append("status", localStorage.getItem("status"));
  
  //   // Add image file
  //   if (headshot) {
  //     form.append("headshot", headshot);
  //   }
  
  //   try {
  //     let response;
  
  //     if (isEditing) {
  //       response = await axios.patch(
  //         `${import.meta.env.VITE_API_URL}entertainers`,
  //         form,
  //         {
  //           headers: {
  //             Authorization: `Bearer ${token}`,
  //             "Content-Type": "multipart/form-data",
  //           },
  //         }
  //       );
  //     } else {
  //       response = await axios.post(
  //         `${import.meta.env.VITE_API_URL}entertainers`,
  //         form,
  //         {
  //           headers: {
  //             Authorization: `Bearer ${token}`,
  //             "Content-Type": "multipart/form-data",
  //           },
  //         }
  //       );
  //     }
  //    console.log(response.data)
  //     if (response.status === 200 || response.status === 201) {
  //       toast.success("Entertainer profile saved successfully!");
  
  //       // ✅ This is your required format
  //       if (response.data?.data?.headshotUrl) {
  //         const imageUrl = response.data.data.headshotUrl;
  //         setFormData((prev) => ({
  //           ...prev,
  //           headshot: imageUrl,
  //         }));
  //         setHeadshot(null); // Clear file
  //         console.log("✅ headshot saved:", imageUrl);
  //       }
  //     }
  //   } catch (error) {
  //     console.error("Error submitting form:", error.response || error.message);
  //     toast.error("Failed to submit the form.");
  //   }
  // };
 
  const handleSubmit = async (e) => {
    e.preventDefault();

    const requiredFields = [
      "contactPerson",
      "category",
      "specific_category",
      "bio",
      "contactNumber",
      "performanceRole",
      "vaccinated",
      "pricePerEvent",
      "socialLinks",
      "country",
      "state",
      "city",
      "address",
      "dob",
      "email",
      "services",
      "stageName",
      "zipCode",
    ];
  
    for (let field of requiredFields) {
      if (!formData[field] || (field === "services" && formData.services.length === 0)) {
        toast.error(`Please fill out all fields.`);
        return; 
      }
    }
  
    const entertainerId = localStorage.getItem("entertainerId");
    const form = new FormData();
  
    form.append("contactPerson", formData.contactPerson);
    form.append("category", Number(formData.category) || "");
    form.append("specific_category", Number(formData.specific_category) || "");
    form.append("bio", formData.bio);
    form.append("contactNumber", formData.contactNumber);
    form.append("performanceRole", formData.performanceRole);
    form.append("vaccinated", formData.vaccinated);
    form.append("pricePerEvent", Number(formData.pricePerEvent) || "");
    form.append("socialLinks", formData.socialLinks);
    form.append("country", formData.country);
    form.append("state", formData.state);
    form.append("city", formData.city);
    form.append("address", formData.address);
    form.append("dob", formData.dob);
    form.append("email", formData.email);
    form.append("services", JSON.stringify(formData.services));
    form.append("stageName", formData.stageName);
    form.append("zipCode", formData.zipCode);
    form.append("name","abcd");
    form.append("status", localStorage.getItem("status"));
  
    if (headshot) {
      form.append("headshot", headshot); // should be File object
    }
  
    try {
      let response;
  
      if (isEditing && entertainerId) {
        // ✅ PATCH if editing and ID is available
        response = await axios.patch(
          `${import.meta.env.VITE_API_URL}entertainers`,
          form,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
      } else {
        // ✅ POST for new profile
        response = await axios.post(
          `${import.meta.env.VITE_API_URL}entertainers`,
          form,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
      }
  
      if (response.status === 200 || response.status === 201) {
        toast.success("Entertainer profile saved successfully!");
  
        if (response.data?.data?.headshotUrl) {
          const imageUrl = response.data.data.headshotUrl;
          setFormData((prev) => ({
            ...prev,
            headshot: imageUrl,
          }));
          setHeadshot(null);
          console.log("✅ headshot saved:", imageUrl);
        }
  
        // If profile is created now, store the ID and update edit mode
        if (!isEditing && response.data?.data?.uid) {
          localStorage.setItem("entertainerId", response.data.data.uid);
          setIsEditing(true);
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error.response || error.message);
      toast.error("Failed to submit the form.");
    }
  };
  
  

  return (
    <>
      <DashLayoutEnter
        title="Profile"
        description="View and manage your profile"
      >
        <ToastContainer/>
        <div className="container d-flex">
          <EnterAccountSidebar/>
          <EnterProfileContainer
                formData={formData}
                errors={errors}
                headshot={headshot}
                setHeadshot={setHeadshot} 
                categories={categories}
                countries={countries}
                states={states}
                cities={cities}
                serviceInput={serviceInput}
                setServiceInput={setServiceInput}
                handleAddService={handleAddService}
                subcategories={subcategories}
                performanceRole={performanceRole}
                options={options}
                isEditing={isEditing}
                handleInputChange={handleInputChange}
                handleCategoryChange={handleCategoryChange}
                handleSubCategoryChange={handleSubCategoryChange}
                mediaProp={media}
                // mediaUpload={mediaUpload}
                onMediaUpdate={(updatedMedia) => setMedia(updatedMedia)}
                handleFileChange={handleFileChange}
                handleRemoveService={handleRemoveService}
                formatDate={formatDate}
                setFormData={setFormData}
                headshotUrl={formData.headshot}
                handleSubmit={handleSubmit}/>
        </div>
      
      </DashLayoutEnter>
    </>
  );
}
