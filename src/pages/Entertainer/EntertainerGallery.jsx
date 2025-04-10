import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import DashLayoutEnter from '../../components/Entertainer/DashLayoutEnter'
import EnterAccountSidebar from '../../components/Entertainer/EnterAccountSidebar'
import { toast, ToastContainer } from 'react-toastify'

export default function EntertainerGallery() {
  const [images, setImages] = useState([])
  const [videos, setVideos] = useState([])
  const [media, setMedia] = useState([]);
  const [uploading, setUploading] = useState(false);


  const imageInputRef = useRef(null)
  const videoInputRef = useRef(null)

  // Fetch existing media
  const fetchMedia = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        console.error('No token found in localStorage.')
        return
      }

      const response = await axios.get(`${import.meta.env.VITE_API_URL}media/uploads`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.status === 200 && response.data?.media) {
        console.log('Fetched Media Successfully:', response.data.media)
      
        const imageMedia = response.data.media
          .filter(item => item.type === 'image')
          .map(item => ({
            id: item.id,
            url: item.url,
            type: item.type,
            file: null,
          }));
      
        const videoMedia = response.data.media
          .filter(item => item.type === 'video')
          .map(item => ({
            id: item.id,
            url: item.url,
            type: item.type,
            file: null,
          }));
      
        setImages(imageMedia);
        setVideos(videoMedia);
        setMedia(response.data.media); // ✅ Save the full media list including IDs
      }
       else {
        console.warn('Unexpected API response structure:', response.data)
      }
    } catch (error) {
      console.error('Error fetching media:', error.response?.data || error.message)
    }
  }

  useEffect(() => {
    fetchMedia()
  }, [])

  // const mediaUpload = async () => {
  //   const token = localStorage.getItem("token");
  
  //   try {
  //     if (images.length === 0 && videos.length === 0) {
  //       toast.error("Please select media to upload.");
  //       return;
  //     }
  
  //     setUploading(true);
  
  //     let newImages = [];
  //     let newVideos = [];
  
  //     if (media.length > 0) {
  //       // ✅ Update existing media
  //       const updatePromises = media.map(async (item) => {
  //         if ((item.type === "image" && images.length === 0) ||
  //             (item.type === "video" && videos.length === 0)) {
  //           return null;
  //         }
  
  //         const updateFormData = new FormData();
  //         if (item.type === "image" && images.length > 0) {
  //           images.forEach((img) => {
  //             if (img.file) updateFormData.append("images", img.file);
  //           });
  //         } else if (item.type === "video" && videos.length > 0) {
  //           videos.forEach((vid) => {
  //             if (vid.file) updateFormData.append("videos", vid.file);
  //           });
  //         }
  
  //         try {
  //           await axios.put(
  //             `${import.meta.env.VITE_API_URL}media/${item.id}`,
  //             updateFormData,
  //             {
  //               headers: {
  //                 Authorization: `Bearer ${token}`,
  //                 "Content-Type": "multipart/form-data",
  //               },
  //             }
  //           );
  //         } catch (err) {
  //           console.error(`Failed to update ${item.type}:`, err.response?.data || err);
  //           toast.error(`Failed to update ${item.type}.`);
  //         }
  //       });
  
  //       await Promise.all(updatePromises);
  //       toast.success("Media updated successfully!");
  //     } else {
  //       // ✅ Upload new media (if no existing media)
  //       const uploadFormData = new FormData();
  //       images.forEach((img) => {
  //         if (img.file) uploadFormData.append("images", img.file);
  //       });
  //       videos.forEach((vid) => {
  //         if (vid.file) uploadFormData.append("videos", vid.file);
  //       });
  
  //       try {
  //         const uploadResponse = await axios.post(
  //           `${import.meta.env.VITE_API_URL}media/uploads`,
  //           uploadFormData,
  //           {
  //             headers: {
  //               Authorization: `Bearer ${token}`,
  //               "Content-Type": "multipart/form-data",
  //             },
  //           }
  //         );
  
  //         if (uploadResponse.status === 201) {
  //           const { imagesUrls, videosUrls } = uploadResponse.data;
  //           newImages = imagesUrls;
  //           newVideos = videosUrls;
  //           toast.success("Media uploaded successfully!");
  //         }
  //       } catch (error) {
  //         console.error("Error uploading new media:", error.response?.data || error);
  //         toast.error(error.response?.data?.message || "Failed to upload media.");
  //       }
  //     }
  
  //     // ✅ Refresh media list from server
  //     await fetchMedia();
  //   } catch (error) {
  //     console.error("Error in mediaUpload:", error.response?.data || error);
  //     toast.error(error.response?.data?.message || "Failed to process media.");
  //   } finally {
  //     setUploading(false);
  //   }
  // };

  const mediaUpload = async () => {
    const token = localStorage.getItem("token");
  
    try {
      if (images.length === 0 && videos.length === 0) {
        toast.error("Please select media to upload.");
        return;
      }
  
      setUploading(true);
  
      let hasNewImages = images.some(img => img.file);
      let hasNewVideos = videos.some(vid => vid.file);
  
      if (media.length > 0 && (hasNewImages || hasNewVideos)) {
        // ✅ Update existing media by type using item.id
        const updatePromises = media.map(async (item) => {
          const updateFormData = new FormData();
          let isUpdate = false;
  
          if (item.type === "image") {
            images.forEach((img) => {
              if (img.file) {
                updateFormData.append("images", img.file);
                isUpdate = true;
              }
            });
          } else if (item.type === "video") {
            videos.forEach((vid) => {
              if (vid.file) {
                updateFormData.append("videos", vid.file);
                isUpdate = true;
              }
            });
          }
  
          if (!isUpdate) return null; // nothing to update
  
          try {
            await axios.put(
              `${import.meta.env.VITE_API_URL}media/${item.id}`,
              updateFormData,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "multipart/form-data",
                },
              }
            );
          } catch (err) {
            console.error(`Failed to update ${item.type}:`, err.response?.data || err);
            toast.error(`Failed to update ${item.type}.`);
          }
        });
  
        await Promise.all(updatePromises);
        toast.success("Media updated successfully!");
      } else {
        // ✅ Upload new media (if no matching server media exists)
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
  
          if (uploadResponse.status === 201) {
            toast.success("Media uploaded successfully!");
          }
        } catch (error) {
          console.error("Error uploading new media:", error.response?.data || error);
          toast.error(error.response?.data?.message || "Failed to upload media.");
        }
      }
  
      // ✅ Refresh media list from server
      await fetchMedia();
    } catch (error) {
      console.error("Error in mediaUpload:", error.response?.data || error);
      toast.error(error.response?.data?.message || "Failed to process media.");
    } finally {
      setUploading(false);
    }
  };
  

  const handleFiles = (files, type) => {
    const previews = Array.from(files).map(file => ({
      url: URL.createObjectURL(file),
      file
    }));
  
    if (type === 'image') {
      const updated = [...images, ...previews];
      setImages(updated);
      setTimeout(() => mediaUpload(), 100); // Auto upload
    } else {
      const updated = [...videos, ...previews];
      setVideos(updated);
      setTimeout(() => mediaUpload(), 100); // Auto upload
    }
  };
  

  const handleDrop = (e, type) => {
    e.preventDefault()
    e.stopPropagation()
    const files = Array.from(e.dataTransfer.files).filter(file =>
      type === 'image' ? file.type.startsWith('image/') : file.type.startsWith('video/')
    )
    handleFiles(files, type)
  }

  const handleRemove = (index, type) => {
    if (type === 'image') {
      const updated = images.filter((_, i) => i !== index);
      setImages(updated);
      setTimeout(() => mediaUpload(), 100);
    } else {
      const updated = videos.filter((_, i) => i !== index);
      setVideos(updated);
      setTimeout(() => mediaUpload(), 100);
    }
  };
  



  
  return (
    <DashLayoutEnter title="" description="View your all bookings in the calendar">
      <div className="container d-flex">
        <EnterAccountSidebar />
        <ToastContainer/>
        <div className="entertainer-profile-container w-100">
          <p className="subheadingPG mb-2 d-flex justify-content-between align-items-center">
            GALLERY
          </p>
          <hr className="mt-0 mb-2" />

          {/* Image Upload Section */}
          <div className="mb-4">
            <label className="form-label">Upload Images</label>
            <div
              onDrop={e => handleDrop(e, 'image')}
              onDragOver={e => e.preventDefault()}
              className="border p-3 rounded mb-2 text-center bg-light"
              style={{ cursor: 'pointer' }}
            >
              <input
                type="file"
                accept="image/*"
                multiple
                ref={imageInputRef}
                className="form-control mt-2"
                onChange={e => handleFiles(e.target.files, 'image')}
              />
            </div>
            <div className="d-flex flex-wrap gap-3">
              {images.map((img, idx) => (
                <div key={idx} className="position-relative">
                  <img
                    src={img.url}
                    alt={`preview-${idx}`}
                    className="rounded"
                    style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                  />
                  <button
                    className="btn btn-sm btn-danger position-absolute top-0 end-0 rounded-4"
                    onClick={() => handleRemove(idx, 'image')}
                    style={{ transform: 'translate(50%, -50%)' }}
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
              onDrop={e => handleDrop(e, 'video')}
              onDragOver={e => e.preventDefault()}
              className="border p-3 rounded mb-2 text-center bg-light"
              style={{ cursor: 'pointer' }}
            >
              <input
                type="file"
                accept="video/*"
                multiple
                ref={videoInputRef}
                className="form-control mt-2"
                onChange={e => handleFiles(e.target.files, 'video')}
              />
            </div>
            <div className="d-flex flex-wrap gap-3">
              {videos.map((vid, idx) => (
                <div key={idx} className="position-relative">
                  <video
                    src={vid.url}
                    controls
                    className="rounded"
                    style={{ width: '200px', height: '120px', objectFit: 'cover' }}
                  />
                  <button
                    className="btn btn-sm btn-danger rounded-4 position-absolute top-0 end-0"
                    onClick={() => handleRemove(idx, 'video')}
                    style={{ transform: 'translate(50%, -50%)' }}
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
  )
}
