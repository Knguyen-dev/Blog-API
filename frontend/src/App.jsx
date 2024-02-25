import {
	createBrowserRouter,
	Route,
	createRoutesFromElements,
	RouterProvider,
	Navigate,
} from "react-router-dom";

// Layouts
import RootLayout from "./layouts/RootLayout";
import AuthLayout from "./layouts/AuthLayout";
import AppLayout from "./layouts/AppLayout";
import DashboardLayout from "./layouts/DashboardLayout";

// Pages
import NotFoundPage from "./pages/NotFoundPage";
import NotAuthorizedPage from "./pages/NotAuthorizedPage";

import BrowsePage from "./pages/BrowsePage";
import ProfilePage from "./pages/dashboard/ProfilePage";
import ManagePostsPage from "./pages/dashboard/ManagePostsPage";
import TeamPage from "./pages/dashboard/TeamPage";

// Components
import SignUpForm from "./components/forms/SignUpForm";
import LoginForm from "./components/forms/LoginForm";
import PersistLogin from "./components/PersistLogin";
import ProtectedRoute from "./components/ProtectedRoute";

// Contexts
import useAuthContext from "./hooks/user/useAuthContext";

function App() {
	const { auth } = useAuthContext();

	const appRouter = createBrowserRouter(
		createRoutesFromElements(
			<Route path="/" element={<RootLayout />}>
				{/* Wrap routes around PersistLogin component */}
				<Route element={<PersistLogin />}>
					<Route
						path="auth"
						element={
							!auth.user ? <AuthLayout /> : <Navigate to="/dashboard" />
						}>
						{/* 
          - NOTE: 
            1. Going to '/auth/' itself is valid, however we don't want users to do that
            so in that case, we'll redirect them to the 'login' route if that happens.
            2. If the user isn't authenticated, allow them to go to the pages where they sign 
              up or log in. However if they are authenticated and they try to go to this route,
              navigate them to their user dashboard!
            */}
						<Route index element={<Navigate to="login" />} />
						<Route path="signup" element={<SignUpForm />} />
						<Route path="login" element={<LoginForm />} />
					</Route>
					<Route path="/" element={<AppLayout />}>
						<Route index element={<BrowsePage />} />

						{/* Dashboard: Put protected route on the layout element since the layout requires us to 
              access the 'auth' property.   */}
						<Route
							path="dashboard"
							element={
								<ProtectedRoute>
									<DashboardLayout />
								</ProtectedRoute>
							}>
							{/* Protected for users, which is covered by putting ProtectedRoute around DashboardLayout */}
							<Route index element={<ProfilePage />} />

							{/* Protected for editors and admins */}
							<Route
								path="manage-posts"
								element={
									<ProtectedRoute
										allowedRoles={[
											import.meta.env.VITE_ROLE_EDITOR,
											import.meta.env.VITE_ROLE_ADMIN,
										]}>
										<ManagePostsPage />
									</ProtectedRoute>
								}
							/>

							{/* Protected for admins only */}
							<Route
								path="team"
								element={
									<ProtectedRoute
										allowedRoles={[import.meta.env.VITE_ROLE_ADMIN]}>
										<TeamPage />
									</ProtectedRoute>
								}
							/>
						</Route>
					</Route>
				</Route>

				<Route path="unauthorized" element={<NotAuthorizedPage />} />
				<Route path="*" element={<NotFoundPage />} />
			</Route>
		)
	);

	return <RouterProvider router={appRouter} />;
}

export default App;
