import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

import { StyledEngineProvider } from "@mui/material";
import AuthProvider from "./contexts/AuthProvider";
import SettingsProvider from "./contexts/SettingsProvider";
import ToastProvider from "./contexts/ToastProvider";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <StyledEngineProvider injectFirst>
      <SettingsProvider>
        <AuthProvider>
          <ToastProvider>
            <App />
          </ToastProvider>
        </AuthProvider>
      </SettingsProvider>
    </StyledEngineProvider>
  </React.StrictMode>
);

// ReactDOM.createRoot(document.getElementById("root")!).render(
//   <React.StrictMode>
//     <StyledEngineProvider injectFirst>
//       <SettingsProvider>
//         <AuthProvider>
//           <ToastProvider>
//             <App />
//           </ToastProvider>
//         </AuthProvider>
//       </SettingsProvider>
//     </StyledEngineProvider>
//   </React.StrictMode>
// );
