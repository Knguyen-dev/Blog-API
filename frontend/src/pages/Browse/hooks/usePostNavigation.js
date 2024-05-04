import { useNavigate } from "react-router-dom";

export default function usePostNavigation() {
	const navigate = useNavigate();

	const goToPostPage = (slug) => {
		navigate(`/browse/${slug}`);
	};

	const goToEditPostPage = (id) => {
		navigate(`/editor-suite/${id}`);
	};

	const goToCreatePostPage = () => navigate("/editor-suite");

	return {
		goToPostPage,
		goToEditPostPage,
		goToCreatePostPage,
	};
}
