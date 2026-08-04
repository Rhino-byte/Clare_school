"use client";

import { type Variants } from "framer-motion";

export const easeOut = [0.22, 1, 0.36, 1] as const;

export const riseVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: easeOut },
  },
};

export const fadeVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.45, ease: easeOut },
  },
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.06,
    },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: easeOut },
  },
};

export const reducedRise: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
};
