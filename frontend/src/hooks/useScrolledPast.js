import { useEffect, useState } from "react";

// Returns true once the page has scrolled past `offset` pixels.
// The scroll listener is passive and throttled to one check per animation frame.
const useScrolledPast = (offset) => {
    const [past, setPast] = useState(false);

    useEffect(() => {
        let frame = 0;
        const check = () => {
            frame = 0;
            setPast(window.scrollY > offset);
        };
        const onScroll = () => {
            if (!frame) frame = requestAnimationFrame(check);
        };

        check();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => {
            window.removeEventListener("scroll", onScroll);
            if (frame) cancelAnimationFrame(frame);
        };
    }, [offset]);

    return past;
};

export default useScrolledPast;
