import {useLayoutEffect} from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
    const location = useLocation();

    // Scroll to top if path changes
    useLayoutEffect(() => {
        window.scroll({top: 0, left: 0, behavior: 'smooth' });
    }, [location.pathname]);

    return null;
}

