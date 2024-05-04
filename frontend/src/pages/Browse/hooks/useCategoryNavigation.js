import { useNavigate } from "react-router-dom";
export default function useCategoryNavigation() {
	const navigate = useNavigate();
	const goToCategoryPage = (categoryID) => {
		navigate(`/browse/categories/${categoryID}`);
		window.scrollTo(0, 0);
	};
	return goToCategoryPage;
}
