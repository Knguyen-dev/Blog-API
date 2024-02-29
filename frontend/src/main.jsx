import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

import { StyledEngineProvider } from "@mui/material";
import { AuthProvider } from "./contexts/AuthProvider.jsx";
import ColorModeProvider from "./contexts/ColorModeProvider.jsx";
import { SnackbarProvider } from "./contexts/SnackbarProvider.jsx";

import { disableReactDevTools } from "@fvilers/disable-react-devtools";
/*
+ Disabling react-dev-tools in production:
- Disabling React DevTools in production is a security measure to 
  prevent potential attackers from inspecting and manipulating the React application 
  in ways that could compromise its security or integrity. 
*/

// If we're in production, disable the react dev tools
if (import.meta.env.VITE_NODE_ENV === "production") {
	disableReactDevTools();
}

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<StyledEngineProvider injectFirst>
			<ColorModeProvider>
				<AuthProvider>
					<SnackbarProvider>
						<App />
					</SnackbarProvider>
				</AuthProvider>
			</ColorModeProvider>
		</StyledEngineProvider>
	</React.StrictMode>
);
