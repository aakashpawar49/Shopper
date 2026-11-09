import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Jump to the top of the page when the route path changes
// (query-string changes such as filters keep the scroll position).
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  return null;
};

export default ScrollToTop;
