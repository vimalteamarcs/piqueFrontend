import React, { useState, useEffect } from "react";
import axios from "axios";
import Input from "../Input";
import { toast, ToastContainer } from "react-toastify";

export default function ContactPersonCard() {
  const [userId, setUserId] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [contactPerson, setContactPerson] = useState({
    name: "",
    phone: "",
    email: "",
  });

  const handleChange = (e) => {
    setContactPerson({
      ...contactPerson,
      [e.target.name]: e.target.value,
    });
  };


  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const token = localStorage.getItem("token");
    const userid = localStorage.getItem("userId")
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}users/${localStorage.getItem("userId")}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(response.data)
      const user = response.data;
      setUserId(user.id);

      setContactPerson({
        name: user.name || localStorage.getItem("userName") || "",
        phone: user.phone || localStorage.getItem("phone") || "",
        email: user.email || "",
      });
    } catch (error) {
      console.error("Error fetching contact person:", error);
    }
  };

  const updateUser = async () => {
    const token = localStorage.getItem("token");
    if (!userId) return;

    setIsUpdating(true);

    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}users/${userId}`,
        contactPerson,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("User updated successfully!", { position: 'top-right' });
      fetchProfile();
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Failed to update user.", { position: 'top-right' });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="d-flex justify-content-between align-items-center mb-0">
        <p className="subheadingPG mb-2 d-flex justify-content-between align-items-center">CONTACT PERSON</p>
        <button type="button" className="btn venue-btn profile-font mb-0" onClick={updateUser}>
          Update
        </button>
      </div>

      <hr />
      <p className="profile-font text-muted">
        This information will not be shared with entertainers who are booked for Pique.
      </p>

      <form>
        <div className="row mb-3 profile-font">
          <div className="col-md-6 col-sm-12">
            <label className="fw-semibold">Contact Person Name</label>
            <Input
              type="text"
              className="form-control profile-font text-muted"
              name="name"
              onChange={handleChange}
              value={contactPerson.name}
              placeholder="Enter your venue Name"
            //   disabled
            />
          </div>

          <div className="col-md-6 col-sm-12">
            <label className="fw-semibold">Contact Number</label>
            <Input
              type="text"
              className="form-control profile-font text-muted"
              name="phone"
              onChange={handleChange}
              value={contactPerson.phone}
              placeholder="Enter your phone Number"
            //   disabled
            />
          </div>
        </div>

        <div className="row profile-font">
          <div className="col-md-6 col-sm-12">
            <label className="fw-semibold">Contact Email</label>
            <Input
              type="email"
              className="form-control profile-font text-muted"
              name="email"
              onChange={handleChange}
              value={contactPerson.email || ""}
              placeholder="Enter your email address"
            //   disabled
            />
          </div>
        </div>
      </form>
    </>
  );
}
