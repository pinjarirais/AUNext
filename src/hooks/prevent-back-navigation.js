import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function PreventBackNavigation() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    // If user is logged in and on login page, redirect immediately
    if (token && (location.pathname === "/" || location.pathname === "/login")) {
      navigate("/dashboard", { replace: true });
    }

    const preventBack = () => {
      if (token && (location.pathname === "/" || location.pathname === "/login")) {
        window.history.pushState(null, "", window.location.href);
      }
    };

    if (token && (location.pathname === "/" || location.pathname === "/login")) {
      // Remove previous history entry (prevents flickering)
      window.history.replaceState(null, "", window.location.href);

      // Push a new history state to block back navigation
      window.history.pushState(null, "", window.location.href);

      window.addEventListener("popstate", preventBack);
    }

    return () => {
      window.removeEventListener("popstate", preventBack);
    };
  }, [location, navigate]);

  return null;
}

export default PreventBackNavigation;
