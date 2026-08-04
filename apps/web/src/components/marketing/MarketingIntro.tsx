"use client";

import type { ReactNode } from "react";
import { ImageBand, RiseIn, StaggerChildren, StaggerItem } from "@/components/motion";

type Props = {
  title: string;
  lead: string;
  imageSrc?: string;
  imageAlt?: string;
  children?: ReactNode;
};

/** Atmospheric page intro for secondary marketing pages */
export function MarketingIntro({
  title,
  lead,
  imageSrc = "/images/band-languages.jpg",
  imageAlt = "St. Clare Language Institute atmosphere",
  children,
}: Props) {
  return (
    <>
      <ImageBand src={imageSrc} alt={imageAlt}>
        <RiseIn>
          <h2>{title}</h2>
          <p style={{ margin: 0, maxWidth: "36rem", opacity: 0.92 }}>{lead}</p>
        </RiseIn>
      </ImageBand>
      {children && (
        <section className="section">
          <div className="container-page">{children}</div>
        </section>
      )}
    </>
  );
}

export function RevealList({ children, className, style }: { children: ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <StaggerChildren className={className} style={style}>
      {children}
    </StaggerChildren>
  );
}

export function RevealItem({ children }: { children: ReactNode }) {
  return <StaggerItem>{children}</StaggerItem>;
}
