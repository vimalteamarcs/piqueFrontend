import axios from "axios";
import React, { useEffect, useState } from "react";
import EntertainerCard from "./EntertainerCard";
import { useNavigate } from "react-router-dom";

export default function WishlistItems() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingId, setProcessingId] = useState(null);
  const navigate = useNavigate();

  const fetchWishlist = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}venues/entertainers/wishlist`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setWishlist(response.data.data || []);
    } catch (err) {
      setError("Failed to fetch wishlist.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const removeFromWishlist = async (eid) => {
    console.log("inside remove wishlist function");
    
    setProcessingId(eid);

    const entertainer = wishlist.find((item) => item.eid === eid);
    if (!entertainer) {
      setProcessingId(null);
      return;
    }
console.log("url",`${import.meta.env.VITE_API_URL}venues/entertainer/wishlist/${Number(entertainer.eid)}`);

    

    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}venues/entertainer/wishlist/${Number(entertainer.eid)}`,
        
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        console.log("resksjhdbcfjahb",response);
        
        setWishlist((prev) => prev.filter((item) => item.eid !== eid));
      } else {
        console.error("Unexpected response:", response);
      }
    } catch (error) {
      console.error("Error removing from wishlist:", error.response?.data || error);
    } finally {
      setProcessingId(null);
    }
  };

  const handleCardClick = (eid) => {
    navigate(`/venue/entertainerDetails`,{ state: { entertainerId:eid } }); 
  };

  return (
    <>
      <p className="fw-bold">WISHLIST</p>
      <hr />

      {loading ? (
        <div className="d-flex justify-content-center my-5">
          <div className="spinner-grow text-dark" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : error ? (
        <p className="text-danger">{error}</p>
      ) : wishlist.length > 0 ? (
        <div className="row">
          {/* {wishlist.map((entertainer) => (
            <EntertainerCard
              key={entertainer.eid}
              entertainer={entertainer}
              isWishlisted={true}
              isProcessing={processingId === entertainer.eid}
              onRemoveFromWishlist={removeFromWishlist}
            />
          ))} */}
          {wishlist.map((entertainer) => (
  <div className="col-lg-3 col-md-4 col-sm-6 col-12 mb-4" key={entertainer.eid}>
    <div
      className="card card-rounded mb-3 rounded-4 overflow-hidden"
      style={{ cursor: "pointer", border: "none" }} onClick={() => handleCardClick(entertainer.eid)}
    >
      <button
        className="favorite-btn position-absolute top-1 me-3 end-0 m-2 border-0 bg-transparent"
        onClick={(e) => {
          e.stopPropagation(); 
          removeFromWishlist(entertainer.eid);
        }}
        disabled={processingId === entertainer.eid}
      >
        {processingId === entertainer.eid ? (
          <div className="spinner-border spinner-border-sm text-danger" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        ) : (
          <i
            className={`fa-solid fa-heart text-danger`}
            style={{ fontSize: "1.5rem" }}
          ></i>
        )}
      </button>

      <img
        src={entertainer.mediaUrl || entertainer.url}
        className="card-img"
        style={{
          aspectRatio: "4 / 3",
          objectFit: "cover",
          borderRadius: "12px",
        }}
        alt={entertainer.name}
      />
      <div className="d-flex justify-content-between mt-2">
        <p className="icon-font fw-semibold mb-0">
          {entertainer.specific_category_name}
        </p>
        <p className="icon-font mb-0">{entertainer.ratings}</p>
      </div>
      <div className="d-flex justify-content-between">
        <p className="mb-2 mt-0">By {entertainer.user_name}</p>
        <div className="ratings">
          {[...Array(5)].map((_, index) => (
            <i
              key={index}
              className={`fa-star ${
                index < entertainer.ratings ? "fa-solid text-warning" : "fa-regular text-muted"
              }`}
              style={{ fontSize: "0.6rem" }}
            ></i>
          ))}
        </div>
      </div>
      <p className="text-muted custom-card-text mt-0">
        {entertainer.category_name} - {entertainer.state}, {entertainer.country}
      </p>
    </div>
  </div>
))}

        </div>
      ) : (
        <p>No items in wishlist.</p>
      )}
    </>
  );
}
