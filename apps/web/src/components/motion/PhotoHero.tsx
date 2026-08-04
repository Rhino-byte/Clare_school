"use client";

import Image from "next/image";
import { useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { RiseIn } from "./FadeIn";
import { MotionImage } from "./MotionImage";

type Props = {
  imageSrc: string;
  imageAlt: string;
  brand?: string;
  headline: string;
  /** Wider headline for long marketing titles (About, etc.) */
  headlineWide?: boolean;
  support?: ReactNode;
  actions?: ReactNode;
  priority?: boolean;
  minHeight?: string;
  children?: ReactNode;
};

export function PhotoHero({
  imageSrc,
  imageAlt,
  brand = "St. Clare",
  headline,
  headlineWide = false,
  support,
  actions,
  priority = false,
  minHeight = "calc(100vh - 76px)",
  children,
}: Props) {
  const reduce = useReducedMotion();

  return (
    <section
      className="photo-hero"
      style={{
        position: "relative",
        minHeight,
        display: "grid",
        alignItems: "end",
        color: "white",
      }}
    >
      {/* Clip parallax on the media layer only — not the copy, so text never gets cut off */}
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", zIndex: 0 }} aria-hidden={!imageAlt}>
        <MotionImage
          src={imageSrc}
          alt={imageAlt}
          fill
          priority={priority}
          sizes="100vw"
          parallax={!reduce}
          wrapperClassName="photo-hero-media"
        />
        <div className="photo-hero-scrim" aria-hidden />
      </div>

      <div className="container-page" style={{ position: "relative", padding: "5rem 0 4rem", zIndex: 1 }}>
        <RiseIn immediate>
          <p className="photo-hero-brand">{brand}</p>
        </RiseIn>
        <RiseIn delay={0.08} immediate>
          <h1 className={headlineWide ? "photo-hero-headline photo-hero-headline-wide" : "photo-hero-headline"}>
            {headline}
          </h1>
        </RiseIn>
        {support ? (
          <RiseIn delay={0.16} immediate>
            {typeof support === "string" ? <p className="photo-hero-support">{support}</p> : support}
          </RiseIn>
        ) : null}
        {actions && (
          <RiseIn delay={0.24} immediate>
            <div className="photo-hero-actions">{actions}</div>
          </RiseIn>
        )}
        {children ? (
          <RiseIn delay={0.28} immediate>
            {children}
          </RiseIn>
        ) : null}
      </div>
    </section>
  );
}

/** Static fallback image for SSR-friendly band sections */
export function ImageBand({
  src,
  alt,
  children,
}: {
  src: string;
  alt: string;
  children: ReactNode;
}) {
  return (
    <section className="image-band">
      <div className="image-band-media">
        <Image src={src} alt={alt} fill sizes="100vw" style={{ objectFit: "cover" }} />
        <div className="image-band-scrim" aria-hidden />
      </div>
      <div className="container-page image-band-content">{children}</div>
    </section>
  );
}
