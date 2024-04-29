import { useNavigate } from "react-router-dom";
export default function useCategoryRedirect() {
	const navigate = useNavigate();
	const handleCategoryRedirect = (categoryID) => {
		navigate(`/browse/categories/${categoryID}`);
	};
	return handleCategoryRedirect;
}
