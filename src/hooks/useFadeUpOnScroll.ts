import { useEffect, useCallback } from "react";

export const useFadeUpOnScroll = () => {
  const observeElements = useCallback(() => {
    if (typeof window === "undefined") return () => {};

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    const elements = document.querySelectorAll(".fade-up:not(.visible)");
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  useEffect(() => {
    const cleanup = observeElements();
    
    // Use MutationObserver to watch for new elements being added
    const mutationObserver = new MutationObserver(() => {
      observeElements();
    });
    
    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      cleanup();
      mutationObserver.disconnect();
    };
  }, [observeElements]);
};
