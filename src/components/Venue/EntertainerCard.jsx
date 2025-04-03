import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const EntertainerCard = ({ entertainer, isWishlisted, isProcessing, onRemoveFromWishlist }) => {
  const imagePath = import.meta.env.VITE_LOGGEDIN_IMAGE_PATH;
  const navigate = useNavigate();
  const [isFavorited, setIsFavorited] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // const toggleFavorite = async (e) => {
  //   e.stopPropagation();
  //   if (isLoading) return; 
  //   setIsLoading(true);
  //   console.log("entertainer details", entertainer);
  //   const body = {
  //     name: entertainer.name,
  //     username:entertainer.user_name,
  //     ratings: 4,
  //     url: entertainer.mediaUrl,
  //     category: entertainer.category,
  //     specific_category: entertainer.specific_category,
  //     entId: Number(entertainer.ent_id || entertainer.eid),

  //   };
  //   console.log("toggle fav",body);
  //   try {
  //     const response = await axios.post(
  //       `${import.meta.env.VITE_API_URL}venues/toogle/wishlist`,
  //       body,
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${localStorage.getItem("token")}`,
  //         },
  //       }
  //     );
  //     console.log("toogle", response);
  //     if (response.status === 200 || response.status === 201) {
  //       setIsFavorited((prev) => !prev);

  //       if (isFavorited && onRemoveFromWishlist) {
  //         onRemoveFromWishlist(entertainer.eid);
  //       }
  //     }
  //   } catch (error) {
  //     console.error("Error toggling wishlist:", error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  useEffect(() => {
    setIsFavorited(!!isWishlisted); // Convert truthy/falsy values to boolean
  }, [isWishlisted]);

  const toggleFavorite = async (e) => {
    e.stopPropagation();
    if (isLoading) return;
    setIsLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}venues/toogle/wishlist`,
        {
          name: entertainer.name,
          username: entertainer.user_name,
          ratings: entertainer.ratings,
          url: entertainer.mediaUrl,
          category: entertainer.category,
          specific_category: entertainer.specific_category,
          entId: Number(entertainer.ent_id || entertainer.eid),
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // if (response.status === 200 || response.status === 201) {
      //   setIsFavorited((prev) => !prev);

      //   if (isFavorited && onRemoveFromWishlist) {
      //     onRemoveFromWishlist(entertainer.eid);
      //   }
      // }
      if (response.data.isWishlisted !== undefined) {
        setIsFavorited(response.data.isWishlisted);
      } else {
        setIsFavorited((prev) => !prev);
      }
  
      if (!response.data.isWishlisted && onRemoveFromWishlist) {
        onRemoveFromWishlist(entertainer.eid);
      }
    } catch (error) {
      console.error("Error toggling wishlist:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCardClick = (e) => {
    if (e.target.closest(".favorite-btn")) return;
    e.preventDefault();
    console.log("Navigating with entertainerId:", entertainer.eid);
    navigate("/venue/entertainerDetails", { state: { entertainerId: entertainer.eid } });
  };


  const headshot =
    entertainer.media?.find((media) => media.type === "headshot")?.url ||
    "../assets/pique/image/magician.jpg";

  return (
    <>
      <div className="col-lg-3 col-md-4 col-sm-6 col-12 mb-4">
        <div
          className="card card-rounded mb-3 rounded-4 overflow-hidden"
          onClick={handleCardClick}
          style={{ cursor: "pointer", border: "none" }}
        >
          <button
            className="favorite-btn position-absolute top-1 me-3 end-0 m-2 border-0 bg-transparent"
            onClick={toggleFavorite}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="spinner-border spinner-border-sm text-danger" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            ) : (
              <i
                className={`fa-solid fa-heart ${isFavorited ? "text-danger" : "text-light"}`}
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
                  className={`fa-star ${index < entertainer.ratings ? "fa-solid text-warning" : "fa-regular text-muted"}`}
                  style={{ fontSize: "0.6rem" }}
                ></i>
              ))}
            </div>
          </div>
          <p className="text-muted custom-card-text mt-0">
            {entertainer.category_name} - {entertainer.state} , {entertainer.country}
          </p>
        </div>
      </div>
    </>
  );
};

export default EntertainerCard;
