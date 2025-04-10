import "./App.css";

import { RouterProvider } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import router from "./router/router";
import { useEffect } from "react";
import { onMessageListener } from "./notifications/onMessageListener";

function App() {
  useEffect(() => {
    onMessageListener()
      .then((payload) => {
        // Show custom toast/snackbar here
        alert(`📬 ${payload.notification?.title}: ${payload.notification?.body}`);
      })
      .catch((err) => console.log("Failed to get message: ", err));
  }, []);
  return (
    <>
      <HelmetProvider>
        
        <RouterProvider router={router} />
      </HelmetProvider>
    </>
  );
}

export default App;
