/*
- useProfileNavigation: Definitely on the account menu, sometimes you're so low on another page, when you get redirected via react router
you're redirected to liked the middle of the profile page. We'll create this so that when redirected, they'll be at the top of the window

*/

import { useNavigate } from "react-router-dom";
export default function useProfileNavigation() {
	const navigate = useNavigate();

	const goToProfilePage = () => {
		navigate("/dashboard");
		window.scrollTo(0, 0);
	};

	return goToProfilePage;
}
