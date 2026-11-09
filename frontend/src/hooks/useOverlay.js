import { useEffect } from "react";

// Shared behaviour for drawers and full-screen overlays while they are open:
// close on Escape and stop the page behind them from scrolling.
const useOverlay = (open, onClose) => {
    useEffect(() => {
        if (!open) return undefined;

        const onKeyDown = (e) => {
            if (e.key === "Escape") onClose();
        };
        const previousOverflow = document.body.style.overflow;

        document.body.style.overflow = "hidden";
        window.addEventListener("keydown", onKeyDown);
        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener("keydown", onKeyDown);
        };
    }, [open, onClose]);
};

export default useOverlay;
