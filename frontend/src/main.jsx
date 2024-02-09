import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

import { StyledEngineProvider, ThemeProvider } from "@mui/material";
import { appTheme } from "./appTheme.js";

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<StyledEngineProvider injectFirst>
			<ThemeProvider theme={appTheme}>
				<App />
			</ThemeProvider>
		</StyledEngineProvider>
	</React.StrictMode>
);
