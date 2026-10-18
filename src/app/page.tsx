import { ArrowRight, Braces, Terminal } from "lucide-react";
import Link from "next/link";
import { DependenciesPanel } from "@/components/home/dependencies-panel";
import { MetadataForm } from "@/components/home/metadata-form";

export default function HomePage() {
  return (
    <div className="page-shell">
      <header className="project-hero">
        <div className="hero-copy">
          <p className="eyebrow"><span className="status-dot" /> A FRESH START FOR NODE.JS</p>
          <h1>Your next project.<br /><span>A better beginning.</span></h1>
          <p className="hero-description">Bring your idea. Pick your stack.{" "}<br />We&apos;ll take care of the boilerplate.</p>
          <Link href="/templates" className="text-link">Find your starting point <ArrowRight size={15} /></Link>
        </div>
        <div className="hero-art" aria-hidden="true">
          <div className="hero-glow" />
          <div className="hero-art-grid" />
          <div className="hero-art-top"><Braces size={17} /><span>LESS SETUP. MORE POSSIBILITY.</span></div>
          <svg className="hero-symbol" viewBox="0 0 360 300" fill="none">
            <defs>
              <linearGradient id="node-light" x1="70" y1="260" x2="290" y2="30" gradientUnits="userSpaceOnUse">
                <stop stopColor="#89ebb0" /><stop offset=".42" stopColor="#64c6fb" /><stop offset="1" stopColor="#5984ff" />
              </linearGradient>
              <filter id="node-bloom" x="-80%" y="-80%" width="260%" height="260%">
                <feGaussianBlur stdDeviation="15" />
              </filter>
            </defs>
            <g className="hero-symbol-shape">
              <path d="M180 40 280 98v112l-100 58-100-58V98Z" stroke="url(#node-light)" strokeWidth="22" strokeLinejoin="round" filter="url(#node-bloom)" opacity=".7" />
              <path d="M180 40 280 98v112l-100 58-100-58V98Z" stroke="url(#node-light)" strokeWidth="2" strokeLinejoin="round" opacity=".75" />
              <path d="m147 192 72-72m-58 0h58v58" stroke="url(#node-light)" strokeWidth="17" strokeLinecap="round" strokeLinejoin="round" />
            </g>
          </svg>
          <div className="hero-art-bottom"><Terminal size={15} /><span>your-next-big-thing</span><span className="terminal-cursor" /></div>
          <span className="hero-art-caption">Built on Node.js.<br />Made for what&apos;s next.</span>
        </div>
      </header>
      <div className="workspace-heading">
        <h2>Make it yours<span>.</span></h2><p>A few details, then you&apos;re off.</p>
      </div>
      <div className="workspace-card"><MetadataForm /><DependenciesPanel /></div>
      <div className="page-note">
        <span>From idea to your first commit.</span>
        <span>Crafted by <a href="https://github.com/Aethelon" target="_blank" rel="noopener noreferrer">Aethelon <ArrowRight size={12} /></a></span>
      </div>
    </div>
  );
}
