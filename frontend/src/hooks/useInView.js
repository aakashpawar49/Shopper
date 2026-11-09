import { useEffect, useRef, useState } from "react";

// One IntersectionObserver is shared by every element on the page instead of
// creating one per element. Each element is observed only until it first
// becomes visible.
const callbacks = new WeakMap();
let sharedObserver = null;

const getObserver = () => {
    if (!sharedObserver) {
        sharedObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;
                    callbacks.get(entry.target)?.();
                    callbacks.delete(entry.target);
                    sharedObserver.unobserve(entry.target);
                });
            },
            { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
        );
    }
    return sharedObserver;
};

// Returns [ref, inView]. `inView` turns true the first time the element
// scrolls into view and then stays true.
const useInView = () => {
    const ref = useRef(null);
    const [inView, setInView] = useState(false);

    useEffect(() => {
        const node = ref.current;
        if (!node) return undefined;

        if (typeof IntersectionObserver === "undefined") {
            setInView(true);
            return undefined;
        }

        const observer = getObserver();
        callbacks.set(node, () => setInView(true));
        observer.observe(node);

        return () => {
            callbacks.delete(node);
            observer.unobserve(node);
        };
    }, []);

    return [ref, inView];
};

export default useInView;
