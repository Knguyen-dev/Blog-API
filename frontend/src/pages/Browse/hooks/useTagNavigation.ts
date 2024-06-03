import { useNavigate } from "react-router-dom";

export default function useTagNavigation() {
	const navigate = useNavigate();

	const goToTagPage = (tagID: string) => {
		navigate(`/browse/tags/${tagID}`);
		window.scrollTo(0, 0);
	};

	return goToTagPage;
}
