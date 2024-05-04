import { useNavigate } from "react-router-dom";
export default function useAboutNavigation() {
	const navigate = useNavigate();

	const goToAboutPage = () => {
		navigate("/about");
		window.scrollTo(0, 0);
	};

	return goToAboutPage;
}
