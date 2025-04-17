import "./App.css";

import { RouterProvider } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import router from "./router/router";
import { useEffect, useState } from "react";
import { onMessageListener } from "./notifications/onMessageListener";
import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_SOCKET_URL, {
  autoConnect: false,
});

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      setUser({ id: userId });
    }
  }, []);

  useEffect(() => {
    onMessageListener()
      .then((payload) => {
        alert(`📬 ${payload.notification?.title}: ${payload.notification?.body}`);
      })
      .catch((err) => console.log("Failed to get message: ", err));
  }, []);

  useEffect(() => {
    if (user) {
      socket.connect();

      socket.emit("register", user.id); 

      socket.on("connect", () => {
        // console.log("Socket connected ✅");
      });

      socket.on("disconnect", () => {
        // console.log("Socket disconnected ❌");
      });

      return () => {
        socket.disconnect();
      };
    }
  }, [user]);


  return (
    <>
      <HelmetProvider>

        <RouterProvider router={router} />
      </HelmetProvider>
    </>
  );
}

export default App;
