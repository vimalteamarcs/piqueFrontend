import React from 'react';

export default function ChatBody() {
  return (
    <div className="flex-grow-1 overflow-auto p-3 chat-body" style={{backgroundColor:"#F8F8F8"}}>
      <div className="text-start mb-2">
        <div className="chat-bubble left shadow">Hi Olivia! Hope you are good.<span className="timestamp">10:43</span></div>
        {/* <div className="chat-bubble left">I am good too. Thanks for asking!<span className="timestamp">10:43</span></div> */}
        {/* <div className="chat-bubble left">Kindly share your requirements.<span className="timestamp">10:43</span></div> */}
      </div>
      <div className="text-end">
        <div className="chat-bubble text-black right shadow">Hi James! I am good. How r you?<span className="timestamp">10:43</span></div>
        {/* <div className="chat-bubble right">Thanks for asking! I will share them soon.<span className="timestamp">10:43</span></div> */}
      </div>
    </div>
  );
}
