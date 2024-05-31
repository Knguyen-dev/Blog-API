import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

import { StyledEngineProvider } from "@mui/material";
import { AuthProvider } from "./contexts/AuthProvider.js";
import ColorModeProvider from "./contexts/SettingsProvider.js";
import { ToastProvider } from "./contexts/ToastProvider.js";

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<StyledEngineProvider injectFirst>
			<ColorModeProvider>
				<AuthProvider>
					<ToastProvider>
						<App />
					</ToastProvider>
				</AuthProvider>
			</ColorModeProvider>
		</StyledEngineProvider>
	</React.StrictMode>
);
