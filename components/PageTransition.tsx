"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

const PageTransition = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  const [key, setKey] = useState(pathname);

  useEffect(() => {
    setKey(pathname);
  }, [pathname]);

  return (
    <motion.div
      key={key} // Ensure animation runs on route change
      initial={{ opacity: 0 }} // Start with opacity 0 (invisible)
      animate={{ opacity: 1 }} // Animate to opacity 1 (fully visible)
      exit={{ opacity: 0 }} // Exit by fading out
      transition={{ duration: 0.5, ease: "easeInOut" }} // Smooth transition with ease-in-out
      className="w-full h-full"
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
