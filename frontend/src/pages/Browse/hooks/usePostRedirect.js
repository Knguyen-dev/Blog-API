import { useNavigate } from "react-router-dom";

export default function usePostRedirect() {
	const navigate = useNavigate();
	const handlePostRedirect = (slug) => {
		navigate(`/browse/${slug}`);
	};

	const handleEditPostRedirect = (id) => {
		navigate(`/editor-suite/${id}`);
	};

	const handleCreatePostRedirect = () => navigate("/editor-suite");

	return {
		handlePostRedirect,
		handleEditPostRedirect,
		handleCreatePostRedirect,
	};
}
