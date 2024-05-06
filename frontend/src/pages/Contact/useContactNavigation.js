import { useNavigate } from "react-router-dom";

export default function useContactNavigation() {
	const navigate = useNavigate();

	const goToContactPage = () => {
		navigate("/contact");
		window.scrollTo(0, 0);
	};

	return goToContactPage;
}
