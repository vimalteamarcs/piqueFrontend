import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import DashLayoutEnter from "../../components/Entertainer/DashLayoutEnter";
import EnterAccountSidebar from "../../components/Entertainer/EnterAccountSidebar";
import { toast, ToastContainer } from "react-toastify";

export default function EntertainerGallery() {
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [media, setMedia] = useState([]);
  const [uploading, setUploading] = useState(false);

  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);

  // Fetch existing media
  const fetchMedia = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found in localStorage.");
        return;
      }

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}media/uploads`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200 && response.data?.media) {
        console.log("Fetched Media Successfully:", response.data.media);

        const imageMedia = response.data.media
          .filter((item) => item.type === "image")
          .map((item) => ({
            id: item.id,
            url: item.url,
            type: item.type,
            file: null,
          }));

        const videoMedia = response.data.media
          .filter((item) => item.type === "video")
          .map((item) => ({
            id: item.id,
            url: item.url,
            type: item.type,
            file: null,
          }));

        setImages(imageMedia);
        setVideos(videoMedia);
        setMedia(response.data.media); // ✅ Save the full media list including IDs
      } else {
        console.warn("Unexpected API response structure:", response.data);
      }
    } catch (error) {
      console.error(
        "Error fetching media:",
        error.response?.data || error.message
      );
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const mediaUpload = async () => {
    const token = localStorage.getItem("token");

    try {
      if (images.length === 0 && videos.length === 0) {
        toast.error("Please select media to upload.");
        return;
      }

      const hasImageFiles = images.some((img) => img.file);
      const hasVideoFiles = videos.some((vid) => vid.file);

      if (!hasImageFiles && !hasVideoFiles) {
        toast.error("No new media files to upload.");
        return;
      }
      setUploading(true);

      const uploadFormData = new FormData();
      images.forEach((img) => {
        if (img.file) uploadFormData.append("images", img.file);
      });
      videos.forEach((vid) => {
        if (vid.file) uploadFormData.append("videos", vid.file);
      });

      try {
        const uploadResponse = await axios.post(
          `${import.meta.env.VITE_API_URL}media/uploads`,
          uploadFormData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        console.log(uploadResponse.data);
        if (uploadResponse.status === 201) {
          toast.success("Media uploaded successfully!");
          await fetchMedia();
        }
      } catch (error) {
        console.log(error);
        console.error(
          "Error uploading new media:",
          error.response?.data || error
        );
        toast.error(error.response?.data?.message || "Failed to upload media.");
      }
    } catch (error) {
      console.error("Error in mediaUpload:", error.response?.data || error);
      toast.error(error.response?.data?.message || "Failed to process media.");
    } finally {
      setUploading(false);
    }
  };

  const handleFiles = (files, type) => {
    const previews = Array.from(files).map((file) => ({
      url: URL.createObjectURL(file),
      file,
    }));

    if (type === "image") {
      // const updated = [...images, ...previews];
      // setImages(updated);
      // setTimeout(() => mediaUpload(), 100); // Auto upload
      setImages((prev) => [...prev, ...previews]);
    } else {
      // const updated = [...videos, ...previews];
      // setVideos(updated);
      // setTimeout(() => mediaUpload(), 100); // Auto upload
      setVideos((prev) => [...prev, ...previews]);
    }
  };

  const handleDrop = (e, type) => {
    e.preventDefault();
    e.stopPropagation();
    const files = Array.from(e.dataTransfer.files).filter((file) =>
      type === "image"
        ? file.type.startsWith("image/")
        : file.type.startsWith("video/")
    );
    handleFiles(files, type);
  };

  // const handleDeleteMedia = async (id, type) => {
  //   const token = localStorage.getItem("token");

  //   try {
  //     const response = await axios.delete(
  //       `${import.meta.env.VITE_API_URL}media/${id}`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );

  //     if (response.status === 200) {
  //       toast.success("Media deleted successfully!");
  //       // Update UI by refetching
  //       await fetchMedia();
  //     }
  //   } catch (error) {
  //     console.error("Error deleting media:", error.response?.data || error.message);
  //     toast.error("Failed to delete media.");
  //   }
  // };

  const handleDeleteMedia = async (id, type, index, isLocal = false) => {
    if (isLocal) {
      if (type === "image") {
        setImages((prev) => prev.filter((_, i) => i !== index));
      } else {
        setVideos((prev) => prev.filter((_, i) => i !== index));
      }
      return;
    }

    const token = localStorage.getItem("token");

    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}media/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        // toast.success("Media deleted successfully!");
        await fetchMedia();
      }
    } catch (error) {
      console.error(
        "Error deleting media:",
        error.response?.data || error.message
      );
      toast.error("Failed to delete media.");
    }
  };

  return (
    <DashLayoutEnter
      title=""
      description="View your all bookings in the calendar"
    >
      <div className="container d-flex">
        <EnterAccountSidebar />
        <ToastContainer />
        <div className="entertainer-profile-container entrWrapper">
          <div className="d-flex justify-content-between align-items-center">
            <p className="subheadingPG mb-2 ">GALLERY</p>
            <button
              className="btn enter-btn text-white mb-2"
              onClick={mediaUpload}
              disabled={uploading}
            >
              {uploading ? "Uploading..." : "Upload Media"}
            </button>
          </div>

          <hr className="mt-0 mb-2" />

          {/* Image Upload Section */}
          <div className="mb-4">
            <label className="form-label">Upload Images</label>
            <div
              onDrop={(e) => handleDrop(e, "image")}
              onDragOver={(e) => e.preventDefault()}
              className="border p-3 rounded mb-2 text-center bg-light"
              style={{ cursor: "pointer" }}
            >
              <input
                type="file"
                accept="image/*"
                multiple
                ref={imageInputRef}
                className="form-control mt-2"
                onChange={(e) => handleFiles(e.target.files, "image")}
              />
            </div>
            <div className="d-flex flex-wrap gap-3">
              {images.map((img, idx) => (
                <div key={idx} className="position-relative">
                  <img
                    src={img.url}
                    alt={`preview-${idx}`}
                    className="rounded"
                    style={{
                      width: "120px",
                      height: "120px",
                      objectFit: "cover",
                    }}
                  />
                  <button
                    className="btn btn-sm btn-danger position-absolute top-0 end-0 rounded-4"
                    onClick={() =>
                      handleDeleteMedia(img.id, "image", idx, !img.id)
                    }
                    style={{ transform: "translate(50%, -50%)" }}
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Video Upload Section */}
          <div className="mb-4">
            <label className="form-label">Upload Videos</label>
            <div
              onDrop={(e) => handleDrop(e, "video")}
              onDragOver={(e) => e.preventDefault()}
              className="border p-3 rounded mb-2 text-center bg-light"
              style={{ cursor: "pointer" }}
            >
              <input
                type="file"
                accept="video/*"
                multiple
                ref={videoInputRef}
                className="form-control mt-2"
                onChange={(e) => handleFiles(e.target.files, "video")}
              />
            </div>
            <div className="d-flex flex-wrap gap-3">
              {videos.map((vid, idx) => (
                <div key={idx} className="position-relative">
                  <video
                    src={vid.url}
                    controls
                    className="rounded"
                    style={{
                      width: "200px",
                      height: "120px",
                      objectFit: "cover",
                    }}
                  />
                  <button
                    className="btn btn-sm btn-danger rounded-4 position-absolute top-0 end-0"
                    onClick={() =>
                      handleDeleteMedia(vid.id, "video", idx, !vid.id)
                    }
                    style={{ transform: "translate(50%, -50%)" }}
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashLayoutEnter>
  );
}
