"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { FadeIn, PageTransition, StaggerChildren, StaggerItem } from "@/components/motion";

export function AppPageHeader({
  eyebrow,
  title,
  lead,
  backHref,
  backLabel = "← Dashboard",
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
  backHref?: string;
  backLabel?: string;
}) {
  return (
    <FadeIn className="app-page-header">
      {backHref ? (
        <Link href={backHref} style={{ color: "var(--navy)", fontWeight: 600, fontSize: "0.95rem" }}>
          {backLabel}
        </Link>
      ) : null}
      {eyebrow ? <p className="about-kicker" style={{ marginTop: backHref ? "0.75rem" : 0 }}>{eyebrow}</p> : null}
      <h2>{title}</h2>
      {lead ? <p className="lead">{lead}</p> : null}
    </FadeIn>
  );
}

export function AppPanel({ children, className, style }: { children: ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <FadeIn>
      <div className={className ? `panel ${className}` : "panel"} style={style}>
        {children}
      </div>
    </FadeIn>
  );
}

export function AppList({ children }: { children: ReactNode }) {
  return (
    <StaggerChildren style={{ display: "grid", gap: "0.75rem" }}>
      {children}
    </StaggerChildren>
  );
}

export function AppListItem({ children }: { children: ReactNode }) {
  return <StaggerItem>{children}</StaggerItem>;
}

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <PageTransition>
      <section className="section">
        <div className="container-page">{children}</div>
      </section>
    </PageTransition>
  );
}

export function StatusChip({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "ok" | "warn" | "bad";
}) {
  const cls = tone === "neutral" ? "status-chip" : `status-chip ${tone}`;
  return <span className={cls}>{children}</span>;
}

export function EmptyState({ children }: { children: ReactNode }) {
  return <div className="empty-state">{children}</div>;
}
