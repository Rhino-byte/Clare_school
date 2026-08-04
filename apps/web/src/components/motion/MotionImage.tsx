"use client";

import Image, { type ImageProps } from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

type Props = Omit<ImageProps, "alt"> & {
  alt: string;
  parallax?: boolean;
  className?: string;
  wrapperClassName?: string;
};

export function MotionImage({
  parallax = true,
  className,
  wrapperClassName,
  alt,
  ...imageProps
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const enabled = Boolean(parallax && !reduce);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], enabled ? ["-4%", "4%"] : ["0%", "0%"]);
  const scale = useTransform(scrollYProgress, [0, 1], enabled ? [1.06, 1] : [1, 1]);

  return (
    <div ref={ref} className={wrapperClassName} style={{ overflow: "hidden", position: "relative", height: "100%", width: "100%" }}>
      <motion.div style={{ y, scale, height: "100%", width: "100%" }}>
        <Image alt={alt} className={className} style={{ objectFit: "cover", width: "100%", height: "100%" }} {...imageProps} />
      </motion.div>
    </div>
  );
}
