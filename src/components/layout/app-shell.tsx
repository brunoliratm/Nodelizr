"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { GithubIcon } from "@/components/icons/github";
import { siteConfig } from "@/lib/site";
import { GenerateBar } from "./generate-bar";

const NAV_ITEMS = [
  { href: "/", label: "Create" },
  { href: "/templates", label: "Templates" },
  { href: "/structure", label: "Structure" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);

  useEffect(() => {
    if (!resolvedTheme) return;
    document.querySelector('meta[name="theme-color"]')?.setAttribute(
      "content",
      resolvedTheme === "dark" ? "#11151c" : siteConfig.themeColor,
    );
  }, [resolvedTheme, pathname]);

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <header className="app-header">
        <div className="app-header-inner">
          <Link href="/" className="brand" aria-label="Nodelizr home">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/favicon.svg" alt="" width={33} height={33} />
            <span>Nodelizr<span className="brand-dot">.</span></span>
          </Link>
          <nav className="main-nav" aria-label="Main navigation">
            {NAV_ITEMS.map((item) => (
              <Link key={item.href} href={item.href} aria-current={pathname === item.href ? "page" : undefined} className="nav-link">
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="header-actions">
            <button
              type="button"
              className="theme-toggle"
              aria-label="Toggle color theme"
              title="Toggle color theme"
              onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            >
              <Sun size={16} className="theme-icon-light" aria-hidden="true" />
              <Moon size={16} className="theme-icon-dark" aria-hidden="true" />
            </button>
            <a href={siteConfig.repo} target="_blank" rel="noopener noreferrer" className="github-link">
              <GithubIcon size={16} /><span>View on GitHub</span><ArrowUpRight size={14} />
            </a>
          </div>
        </div>
      </header>
      <div className="announcement">
        <span className="status-dot" /><span>A small start. Endless possibilities.</span>
        <span className="announcement-divider" /><span className="announcement-note">Free & open source</span>
      </div>
      <main ref={mainRef} id="main-content" className="app-main" tabIndex={-1}>
        <div key={pathname} className="page-transition">{children}</div>
      </main>
      <GenerateBar />
    </div>
  );
}
