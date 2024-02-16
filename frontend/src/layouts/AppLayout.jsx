import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import { Divider } from "@mui/material";
export default function AppLayout() {
	return (
		<div className="app-layout">
			{/* Navbar */}
			<Header />
			<Divider />

			<main className="pages">
				<Outlet />
			</main>
		</div>
	);
}
