import { useEffect } from "react";
import { wsSend } from "./store";

export function Active() {
  useEffect(() => {
    let active = false;

    const interval = setInterval(() => {
      if (active) wsSend({ type: "active", scroll: scrollY });
      active = false;
    }, 15 * 1000);

    document.addEventListener("scroll", () => {
      active = true;
    });

    document.addEventListener("mousemove", () => {
      active = true;
    });

    return () => clearInterval(interval);
  }, []);

  return null;
}
