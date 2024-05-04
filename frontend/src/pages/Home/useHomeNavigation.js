import { useNavigate } from "react-router-dom";

export default function useHomeNavigation() {
	const navigate = useNavigate();
	const goToHomePage = () => {
		navigate("/");

		// When going to the home page, scroll to the top of it
		window.scrollTo(0, 0);
	};

	return goToHomePage;
}
