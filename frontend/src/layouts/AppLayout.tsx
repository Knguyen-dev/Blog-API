import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import { Divider, CircularProgress } from "@mui/material";
import { Suspense } from "react";

export default function AppLayout() {
	return (
		<div className="tw-min-h-screen tw-flex tw-flex-col">
			{/* Navbar */}
			<Header />
			<main className="tw-flex-1 tw-flex tw-justify-center tw-items-center">
				<Suspense fallback={<CircularProgress />}>
					<Outlet />
				</Suspense>
			</main>

			<Divider className="tw-mt-16" />
			<Footer className="tw-py-4 tw-px-8" />
		</div>
	);
}
