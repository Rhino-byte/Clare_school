"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { easeOut } from "./variants";

export function PageTransition({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={reduce ? { duration: 0 } : { duration: 0.4, ease: easeOut }}
    >
      {children}
    </motion.div>
  );
}
