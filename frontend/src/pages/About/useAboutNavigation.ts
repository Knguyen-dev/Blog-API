import { useNavigate } from "react-router-dom";

/**
 * Custom hook used to route the user to the about page.
 */
export default function useAboutNavigation() {
  const navigate = useNavigate();

  const goToAboutPage = () => {
    navigate("/about");

    // after routing to the about page, scroll up to the top of the page.
    // As a result, we ensure when a user is routed they are always routed to the top of the page, which
    // prevents any strange behavior due to differing page heights and whatnot.
    window.scrollTo(0, 0);
  };

  return goToAboutPage;
}
