import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

import { StyledEngineProvider } from "@mui/material";
import { AuthProvider } from "./contexts/AuthProvider.js";
import ColorModeProvider from "./contexts/SettingsProvider.js";
import { ToastProvider } from "./contexts/ToastProvider.js";

const rootElement = document.getElementById("root");

if (rootElement) {
	ReactDOM.createRoot(rootElement).render(
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
} else {
	console.error("Failed to find root element!");
}
