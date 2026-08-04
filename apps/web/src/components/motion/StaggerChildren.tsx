"use client";

import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";
import { reducedRise, staggerContainer, staggerItem } from "./variants";

type ContainerProps = HTMLMotionProps<"div"> & {
  once?: boolean;
  amount?: number;
};

export function StaggerChildren({ children, once = true, amount = 0.1, ...rest }: ContainerProps) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount, margin: "0px 0px -8% 0px" }}
      variants={reduce ? reducedRise : staggerContainer}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, ...rest }: HTMLMotionProps<"div">) {
  const reduce = useReducedMotion();
  return (
    <motion.div variants={reduce ? reducedRise : staggerItem} {...rest}>
      {children}
    </motion.div>
  );
}
