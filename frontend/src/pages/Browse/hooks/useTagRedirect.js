import { useNavigate } from "react-router-dom";

export default function useTagRedirect() {
	const navigate = useNavigate();

	const handleTagRedirect = (tagID) => {
		navigate(`/browse/tags/${tagID}`);
	};

	return handleTagRedirect;
}
