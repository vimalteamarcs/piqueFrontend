// import React from 'react';
// import { BsSend } from 'react-icons/bs';

// export default function ChatInput() {
//   return (
//     <div className="p-3 d-flex align-items-center chat-input">
//       <input type="text" className="form-control" placeholder="Type a message..." />
//       <button className="btn btn-outline-secondary ms-2">
//         <BsSend />
//       </button>
//     </div>
//   );
// }

import React, { useRef, useState } from 'react';
import { BsSend, BsPaperclip, BsEmojiSmile } from 'react-icons/bs';
import EmojiPicker from 'emoji-picker-react';

export default function ChatInput() {
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showFileOptions, setShowFileOptions] = useState(false);
  const [fileAcceptType, setFileAcceptType] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleEmojiClick = (emojiData) => {
    if (!selectedFile) {
      setMessage((prev) => prev + emojiData.emoji);
    }
    setShowEmojiPicker(false);
  };

  const handleFileTypeSelect = (type) => {
    const acceptTypes = {
      image: 'image/*',
      video: 'video/*',
      audio: 'audio/*',
      document: '.pdf,.doc,.docx,.txt,.ppt,.xls,.xlsx',
    };

    setFileAcceptType(acceptTypes[type] || '');
    setShowFileOptions(false);
    setTimeout(() => {
      fileInputRef.current?.click();
    }, 100);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setMessage(file.name);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setMessage('');
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  return (
    <div className="p-3 border-top bg-white d-flex flex-column position-relative chat-input">
      {/* Input + Tools */}
      <div className="d-flex align-items-center gap-2">

        {/* Attachment */}
        <div className="position-relative">
          <span
            className="text-muted fs-5"
            style={{ cursor: 'pointer' }}
            onClick={() => setShowFileOptions(!showFileOptions)}
          >
            <BsPaperclip />
          </span>

          {showFileOptions && (
            <div
              className="position-absolute bg-white border rounded shadow-sm p-2"
              style={{ bottom: '100%', left: 0, marginBottom: '10px', zIndex: 10 }}
            >
              <div className="dropdown-item" style={{ cursor: 'pointer' }} onClick={() => handleFileTypeSelect('image')}>Image</div>
              <div className="dropdown-item" style={{ cursor: 'pointer' }} onClick={() => handleFileTypeSelect('video')}>Video</div>
              <div className="dropdown-item" style={{ cursor: 'pointer' }} onClick={() => handleFileTypeSelect('audio')}>Audio</div>
              <div className="dropdown-item" style={{ cursor: 'pointer' }} onClick={() => handleFileTypeSelect('document')}>Document</div>
            </div>
          )}
        </div>

        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          className="d-none"
          accept={fileAcceptType}
          onChange={handleFileChange}
        />

        {/* Emoji Button */}
        <span
          className="fs-5 fw-bold"
          style={{ cursor: 'pointer',color:"#D2B04C" }}
          onClick={() => setShowEmojiPicker((prev) => !prev)}
        >
          <BsEmojiSmile />
        </span>

        {/* Input Field */}
        <div className="position-relative flex-grow-1">
          <input
            type="text"
            className="form-control pe-5"
            placeholder="Type a message or attach file..."
            value={message}
            onChange={(e) => !selectedFile && setMessage(e.target.value)}
            readOnly={!!selectedFile} // prevent typing when file is selected
          />

          {/* Remove file icon */}
          {selectedFile && (
            <span
              className="position-absolute end-0 top-50 translate-middle-y text-danger me-3"
              style={{ cursor: 'pointer', fontSize: '1.2rem' }}
              onClick={handleRemoveFile}
            >
              &times;
            </span>
          )}
        </div>

        {/* Send Button */}
        <button className="btn btn-primary">
          <BsSend />
        </button>
      </div>

      {/* Emoji Picker */}
      {showEmojiPicker && (
        <div className="position-absolute bottom-100 start-0 mb-2 z-index-3">
          <EmojiPicker onEmojiClick={handleEmojiClick} />
        </div>
      )}
    </div>
  );
}

