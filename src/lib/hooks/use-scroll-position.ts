import type { Dispatch, SetStateAction } from "react";
import { useEffect, useState } from "react";

const handleScroll = (setScrollPosition: Dispatch<SetStateAction<number>>) => {
  const { scrollHeight, clientHeight, scrollTop: elementScrollTop } = document.documentElement;
  const { scrollTop: bodyScrollTop } = document.body;

  const height = scrollHeight - clientHeight;
  const windowScroll = bodyScrollTop || elementScrollTop;
  const scrolled = (windowScroll / height) * 100;

  setScrollPosition(scrolled);
};

export const useScrollPosition = () => {
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    window.addEventListener("scroll", () => handleScroll(setScrollPosition), { passive: true });

    return () => {
      window.removeEventListener("scroll", () => handleScroll(setScrollPosition));
    };
  }, []);

  return scrollPosition;
};
