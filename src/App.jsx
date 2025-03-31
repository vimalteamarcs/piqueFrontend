import "./App.css";

import { RouterProvider } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import router from "./router/router";

function App() {
  return (
    <>
      <HelmetProvider>
        
        <RouterProvider router={router} />
      </HelmetProvider>
    </>
  );
}

export default App;
