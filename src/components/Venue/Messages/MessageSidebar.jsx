import React from 'react';
import Input from '../../Input';

export default function MessageSidebar() {
  const users = ['James Andrew', 'William Smith', 'Chandler Nova'];

  return (
    <div className=" message-sidebar ">
      <button className="btn fw-medium mb-2" onClick={() => { navigate('/venue') }} style={{ fontSize: "20px" }}><i className="fa-solid fa-angle-left fs-6 me-1"></i>Messages</button>
      <div className="col dataTableSearch text-end">
            <Input
              placeholder="Search..."
              style={{ width: 200 }}
              className="rounded-5"
            />
          </div>
      {/* <input type="text" placeholder="Search" className="form-control mb-3 dataTableSearch" /> */}
      <div className="chat-list overflow-auto mt-4">
        {users.map((name, i) => (
          <div className="chat-user d-flex align-items-center mb-3" key={i}>
            <img src={`https://i.pravatar.cc/40?img=${i + 1}`} alt={name} className="rounded-circle me-2" />
            <div>
              <strong>{name}</strong>
              <p className="mb-0 text-muted" style={{ fontSize: '0.8rem' }}>
                Thanks for asking! I will share...
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
