"use client";

import { motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

type PageTransitionProps = {
  children: ReactNode;
};

const transitionConfig = {
  duration: 0.32,
  ease: [0.22, 1, 0.36, 1] as const,
};

const PageTransition = ({ children }: PageTransitionProps) => {
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (prefersReducedMotion) {
    return <>{children}</>;
  }

  return (
    <motion.div
      key={pathname}
      className="page-enter-surface"
      initial={isHydrated ? { opacity: 0, y: 12, scale: 0.995 } : false}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={transitionConfig}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;