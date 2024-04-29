import {
	createBrowserRouter,
	Route,
	createRoutesFromElements,
	RouterProvider,
	Navigate,
} from "react-router-dom";

// Layouts
import RootLayout from "./layouts/RootLayout";
import AppLayout from "./layouts/AppLayout";

// Misc Pages
import NotFoundPage from "./pages/NotFoundPage";
import NotAuthorizedPage from "./pages/NotAuthorizedPage";

// Blog/Browse Section
import BrowsePage from "./pages/Browse/BrowsePage";
import PostPage from "./pages/Browse/PostPage";
import TagPage from "./pages/Browse/TagPage";
import CategoryPage from "./pages/Browse/CategoryPage";

// Dashboard
import DashboardLayout from "./pages/Dashboard/DashboardLayout";
import ProfilePage from "./pages/Dashboard/Profile/ProfilePage";
import ManagePostsPage from "./pages/Dashboard/ManagePosts/ManagePostsPage";
import TeamPage from "./pages/Dashboard/Team/TeamPage";
import ManageCategoriesPage from "./pages/Dashboard/ManageCategories/ManageCategoriesPage";
import ManageTagsPage from "./pages/Dashboard/ManageTags/ManageTagsPage";

// Editor Suite
import EditorLayout from "./pages/EditorSuite/EditorLayout";
import CreatePostPage from "./pages/EditorSuite/CreatePostPage";
import EditPostPage from "./pages/EditorSuite/EditPostPage";

// Login and Signup
import AuthLayout from "./pages/Auth/AuthLayout";
import LoginForm from "./pages/Auth/LoginForm";
import SignupForm from "./pages/Auth/SignupForm";

import PersistLogin from "./components/PersistLogin";
import ProtectedRoute from "./components/ProtectedRoute";

// Contexts
import useAuthContext from "./hooks/useAuthContext";

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
						<Route index element={<Navigate to="login" />} />
						<Route path="signup" element={<SignupForm />} />
						<Route path="login" element={<LoginForm />} />
					</Route>

					<Route path="/" element={<AppLayout />}>
						<Route path="browse">
							<Route index element={<BrowsePage />} />
							<Route path="tags/:id" element={<TagPage />} />
							<Route path="categories/:id" element={<CategoryPage />} />
							<Route path=":slug" element={<PostPage />} />
						</Route>

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

							<Route
								path="manage-categories"
								element={
									<ProtectedRoute
										allowedRoles={[
											import.meta.env.VITE_ROLE_EDITOR,
											import.meta.env.VITE_ROLE_ADMIN,
										]}>
										<ManageCategoriesPage />
									</ProtectedRoute>
								}
							/>

							<Route
								path="manage-tags"
								element={
									<ProtectedRoute
										allowedRoles={[
											import.meta.env.VITE_ROLE_EDITOR,
											import.meta.env.VITE_ROLE_ADMIN,
										]}>
										<ManageTagsPage />
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

						<Route
							path="editor-suite"
							element={
								<ProtectedRoute
									allowedRoles={[
										import.meta.env.VITE_ROLE_EDITOR,
										import.meta.env.VITE_ROLE_ADMIN,
									]}>
									<EditorLayout />
								</ProtectedRoute>
							}>
							<Route index element={<CreatePostPage />} />

							<Route path=":id" element={<EditPostPage />} />
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
