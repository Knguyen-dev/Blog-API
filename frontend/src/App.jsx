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

// Pages
import NotFoundPage from "./pages/NotFoundPage";
import BrowsePage from "./pages/BrowsePage";

/*
- Header/footer
1. Home Page
2. About Page
3. Create post page (For editors/admins)
4. Search results page


*/

// Components
import SignUpForm from "./components/forms/SignUpForm";
import LoginForm from "./components/forms/LoginForm";
import PersistLogin from "./components/PersistLogin";

//
import useAuthContext from "./hooks/useAuthContext";

function App() {
	const { auth } = useAuthContext();

	const appRouter = createBrowserRouter(
		createRoutesFromElements(
			<Route path="/" element={<RootLayout />}>
				{/* If the user is logged in, navigate to '/' route instead */}

				<Route element={<PersistLogin />}>
					<Route
						path="/auth"
						element={!auth ? <AuthLayout /> : <Navigate to="/" />}>
						{/* 
          - NOTE: Going to '/auth/' itself is valid, however we don't want users to do that
            so in that case, we'll redirect them to the 'login' route if that happens.*/}
						<Route index element={<Navigate to="login" />} />
						<Route path="signup" element={<SignUpForm />} />
						<Route path="login" element={<LoginForm />} />
					</Route>
					<Route path="/" element={<AppLayout />}>
						<Route index element={<BrowsePage />} />
					</Route>
				</Route>

				<Route path="*" element={<NotFoundPage />} />
			</Route>
		)
	);

	return <RouterProvider router={appRouter} />;
}

export default App;
