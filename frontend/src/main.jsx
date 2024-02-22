import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

import { StyledEngineProvider } from "@mui/material";
import { AuthProvider } from "./contexts/AuthProvider.jsx";
import ColorModeProvider from "./contexts/ColorModeProvider.jsx";
/*

- CssBaseline: Component that helps normalize styles across different
  browsers. Essentially applies minimal set of CSS styles to establish
  a consistent baseline/foudnation for all browsers. It resets styles, applies 
  base styles, and avoids browser specific styles.



*/

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<StyledEngineProvider injectFirst>
			<ColorModeProvider>
				<AuthProvider>
					<App />
				</AuthProvider>
			</ColorModeProvider>
		</StyledEngineProvider>
	</React.StrictMode>
);
