"use client";

import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";
import { fadeVariants, reducedRise, riseVariants } from "./variants";

type Props = HTMLMotionProps<"div"> & {
  delay?: number;
  mode?: "rise" | "fade";
  once?: boolean;
  amount?: number;
  /** Animate on mount instead of waiting for scroll into view (use for heroes) */
  immediate?: boolean;
};

export function FadeIn({
  children,
  delay = 0,
  mode = "rise",
  once = true,
  amount = 0.12,
  immediate = false,
  ...rest
}: Props) {
  const reduce = useReducedMotion();
  const base = reduce ? reducedRise : mode === "fade" ? fadeVariants : riseVariants;

  return (
    <motion.div
      initial="hidden"
      animate={immediate ? "visible" : undefined}
      whileInView={immediate ? undefined : "visible"}
      viewport={immediate ? undefined : { once, amount, margin: "0px 0px -8% 0px" }}
      variants={base}
      transition={reduce ? { duration: 0.2 } : { delay, duration: 0.55 }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

export function RiseIn(props: Omit<Props, "mode">) {
  return <FadeIn mode="rise" {...props} />;
}
