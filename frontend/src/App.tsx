import {
  createBrowserRouter,
  Route,
  createRoutesFromElements,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { lazy } from "react";

// Layouts
import RootLayout from "./layouts/RootLayout";
import AppLayout from "./layouts/AppLayout";

// Misc Pages
import NotFoundPage from "./pages/NotFoundPage";
import NotAuthorizedPage from "./pages/NotAuthorizedPage";
import VerifyEmailPage from "./pages/VerifyEmailPage";

// Other pages
import HomePage from "./pages/Home/HomePage";
import AboutPage from "./pages/About/AboutPage";
import ContactPage from "./pages/Contact/ContactPage";

// Blog/Browse Section
import BlogPage from "./pages/Browse/BlogPage";
import PostPage from "./pages/Browse/PostPage";
import TagPage from "./pages/Browse/TagPage";
import CategoryPage from "./pages/Browse/CategoryPage";
// Dashboard
const DashboardLayout = lazy(() => import("./pages/Dashboard/DashboardLayout"));
const ProfilePage = lazy(() => import("./pages/Dashboard/Profile/ProfilePage"));
const ManageTagsPage = lazy(
  () => import("./pages/Dashboard/ManageTags/ManageTagsPage")
);
const ManagePostsPage = lazy(
  () => import("./pages/Dashboard/ManagePosts/ManagePostsPage")
);
const TeamPage = lazy(() => import("./pages/Dashboard/Team/TeamPage"));
const ManageCategoriesPage = lazy(
  () => import("./pages/Dashboard/ManageCategories/ManageCategoriesPage")
);
// Editor Suite
const EditorLayout = lazy(() => import("./pages/EditorSuite/EditorLayout"));
const CreatePostPage = lazy(() => import("./pages/EditorSuite/CreatePostPage"));
const EditPostPage = lazy(() => import("./pages/EditorSuite/EditPostPage"));

// Auth section
import AuthLayout from "./pages/Auth/AuthLayout";
import LoginForm from "./pages/Auth/LoginForm";
import SignupForm from "./pages/Auth/SignupForm";
import ForgotPasswordForm from "./pages/Auth/ForgotPasswordForm";
import ResetPasswordForm from "./pages/Auth/ResetPasswordForm";

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
            <Route path="forgotPassword" element={<ForgotPasswordForm />} />
            <Route
              path="resetPassword/:passwordResetToken"
              element={<ResetPasswordForm />}
            />
          </Route>

          <Route path="/" element={<AppLayout />}>
            <Route index element={<HomePage />} />

            <Route path="contact" element={<ContactPage />} />
            <Route path="about" element={<AboutPage />} />

            <Route path="browse">
              <Route index element={<BlogPage />} />
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

        <Route
          path="verifyEmail/:verifyEmailToken"
          element={<VerifyEmailPage />}
        />
        <Route path="unauthorized" element={<NotAuthorizedPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    )
  );

  return <RouterProvider router={appRouter} />;
}

export default App;
