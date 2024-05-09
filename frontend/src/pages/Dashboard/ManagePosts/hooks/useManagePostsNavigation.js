import { useNavigate } from "react-router-dom";
export default function useManagePostsNavigation() {
	const navigate = useNavigate();

	const goToManagePostsPage = () => {
		navigate("/dashboard/manage-posts");
		window.scrollTo(0, 0);
	};

	return goToManagePostsPage;
}
