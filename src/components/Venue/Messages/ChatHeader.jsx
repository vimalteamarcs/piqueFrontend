import React from 'react';

export default function ChatHeader() {
  return (
    <div className="p-3 border-bottom d-flex align-items-center chat-header shadow-sm">
      <img src="https://i.pravatar.cc/40?img=1" alt="User" className="rounded-circle me-2" />
      <div>
        <strong>Wedding Bells</strong>
        <p className="mb-0 text-muted" style={{ fontSize: '0.8rem' }}>
          See more info
        </p>
      </div>
    </div>
  );
}
