import axios from "axios";
import React, { useEffect, useState } from "react";
import EntertainerCard from "./EntertainerCard";

export default function WishlistItems() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
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
        console.log("wishlist items", response.data);
        setWishlist(response.data.data);
      } catch (err) {
        console.error("Error fetching wishlist:", err);
        setError("Failed to fetch wishlist.");
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  // const removeFromWishlist = async (entertainerEid) => {
  //   setProcessingId(entertainerEid);
  //   const entertainer = wishlist.find((item) => item.ent_id === entertainerEid);
  // if (!entertainer) return;
  //   const body = {
  //     name: entertainer.name,
  //     url: entertainer.url,
  //     category: entertainer.category,
  //     specific_category: entertainer.specific_category,
  //     entId: Number(entertainer.ent_id),

  //   };
  // console.log("wish body",body)
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
  
  //     console.log("Wishlist toggle response:", response.data);
  
  //     if (response.status === 200 || response.status === 201) {
  //       const message = response.data.message;
  
  //       if (message.includes("Removed")) {
  //         setWishlist((prevWishlist) =>
  //           prevWishlist.filter((item) => item.ent_id !== entertainerEid)
  //         );
  //       } else if (message.includes("Added")) {
          
  //         console.log("Unexpected: Entertainer added back in wishlist page");
  //       }
  //     }
  //   } catch (error) {
  //     console.error("Error removing from wishlist:", error);
  //   } finally {
  //     setProcessingId(null);
  //   }
  // };
  
  // const removeFromWishlist = async (entertainerEid) => {
  //   setProcessingId(entertainerEid);
  //   console.log("Entertainer id: " , entertainerEid)
  //   const entertainer = wishlist.find((item) => item.ent_id === entertainerEid);
  //   if (!entertainer) {
  //     console.error("Entertainer not found in wishlist:", entertainerEid);
  //     return;
  //   }
  
  //   console.log("Entertainer Object:", entertainer);
  
  //   const body = {
  //     name: entertainer.name,
  //     url: entertainer.url,
  //     category: entertainer.category,
  //     specific_category: entertainer.specific_category,
  //     entId: Number(entertainer.ent_id) || 0,  // Ensure it's a number
  //     username: entertainer.username,
  //   };
  
  //   console.log("Wishlist body:", body);
  
  //   if (!body.entId || isNaN(body.entId)) {
  //     console.error("Invalid entId:", body.entId);
  //     setProcessingId(null);
  //     return;
  //   }
  
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
  
  //     console.log("Wishlist toggle response:", response.data);
  
  //     if (response.status === 200 || response.status === 201) {
  //       setWishlist((prevWishlist) =>
  //         prevWishlist.filter((item) => item.ent_id !== entertainerEid)
  //       );
  //     }
  //   } catch (error) {
  //     console.error("Error removing from wishlist:", error);
  //   } finally {
  //     setProcessingId(null);
  //   }
  // };
  
  const removeFromWishlist = async (entertainerEid) => {
    setProcessingId(entertainerEid);
    console.log("Entertainer ID:", entertainerEid);
  
    const entertainer = wishlist.find((item) => item.ent_id === entertainerEid);
    if (!entertainer) {
      console.error("Entertainer not found in wishlist:", entertainerEid);
      setProcessingId(null);
      return;
    }
  
    const entId = Number(entertainer.ent_id);
    if (!entId || isNaN(entId)) {
      console.error("Invalid entId:", entId);
      setProcessingId(null);
      return;
    }
  
    const body = {
      // name: entertainer.name,
      // url: entertainer.url,
      // category: entertainer.category,
      // specific_category: entertainer.specific_category,
      // entId,
      // username: entertainer.username,

      name: entertainer.name,
      username:entertainer.user_name,
      ratings: 4,
      url: entertainer.mediaUrl,
      category: entertainer.category,
      specific_category: entertainer.specific_category,
      entId: Number(entertainer.ent_id || entertainer.eid),
    };
  
    console.log("Wishlist request body:", JSON.stringify(body, null, 2));
  
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}venues/toogle/wishlist`,
        body,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
  
      console.log("Wishlist toggle response:", response.data);
  
      if (response.status === 200 || response.status === 201) {
        setWishlist((prevWishlist) =>
          prevWishlist.filter((item) => item.ent_id !== entertainerEid)
        );
      }
    } catch (error) {
      console.error("Error removing from wishlist:", error);
    } finally {
      setProcessingId(null);
    }
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
          {wishlist.map((entertainer) => (
            <EntertainerCard
              key={entertainer.id}
              entertainer={entertainer}
              // isWishlisted={true}
              isWishlisted={entertainer.isWishlisted}
              isProcessing={processingId === entertainer.id}
              onRemoveFromWishlist={removeFromWishlist}
            />
          ))}
      </div>
        ) : (
          <p>No items in wishlist.</p>
        )}
    </>
  );
}
