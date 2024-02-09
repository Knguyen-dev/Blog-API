import { Outlet } from "react-router-dom";

export default function AppLayout() {
	return (
		<div className="app-layout">
			{/* Navbar */}

			<main className="pages">
				<Outlet />
			</main>
		</div>
	);
}
