import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import "./i18n.js";
import {CountryCityProvider} from "./Context/CountryCityContext.jsx"

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <CountryCityProvider>
      <App />
    </CountryCityProvider>
  </StrictMode>
);
