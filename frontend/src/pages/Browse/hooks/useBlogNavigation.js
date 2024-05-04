import { useNavigate } from "react-router-dom";
export default function useBlogNavigation() {
  const navigate = useNavigate();

  const goToBlogPage = () => {
    navigate("/browse");
    window.scrollTo(0,0);
  }

  return goToBlogPage;
}