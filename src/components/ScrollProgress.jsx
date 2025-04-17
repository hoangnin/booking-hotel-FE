import { useEffect } from "react";
import { nprogress, NavigationProgress } from "@mantine/nprogress";

export function ScrollProgress() {
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const totalHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrollProgress = (scrollPosition / totalHeight) * 100;

      nprogress.set(scrollProgress);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <NavigationProgress
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        zIndex: 9999, // Đảm bảo nằm trên tất cả các thành phần khác
      }}
    />
  );
}
