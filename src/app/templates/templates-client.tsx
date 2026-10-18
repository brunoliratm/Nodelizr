"use client";

import { ArrowRight, Check, CodeXml, FolderTree, Globe, RadioTower, ScanSearch, Server, Terminal, Workflow, type LucideIcon } from "lucide-react";
import { CUSTOM_PRESET, CUSTOM_TEMPLATE_ID, useProjectStore } from "@/store/project-store";

const PRESET_ICONS: Record<string, LucideIcon> = {
  "saas-api": Server,
  "public-api": Globe,
  "microservice-events": RadioTower,
  "cli-automation": Terminal,
  "scheduler-worker": Workflow,
  "web-scraping": ScanSearch,
};

export default function TemplatesPage() {
  const templates = useProjectStore((s) => s.templates);
  const presets = useProjectStore((s) => s.presets);
  const presetId = useProjectStore((s) => s.presetId);
  const setPreset = useProjectStore((s) => s.setPreset);
  const templateName = (id: string) => templates.find((t) => t.id === id)?.name ?? id;

  return (
    <div className="page-shell">
      <header className="collection-header">
        <p className="eyebrow"><span className="status-dot" /> THE TEMPLATE COLLECTION</p>
        <h1 className="page-title">A head start.<br /><span>Entirely your own.</span></h1>
        <p className="page-description">Every great project starts somewhere. Find a foundation that fits your idea, then make it yours.</p>
      </header>
      <div className="collection-label"><h2>Choose your starting point</h2><span>{presets.length + 1} possibilities</span></div>
      <div className="template-grid">
        <SelectableCard active={presetId === CUSTOM_PRESET} title="A clean slate" description="Your idea, your rules. Start with a minimal Node.js project and build your stack from the ground up." structure={templateName(CUSTOM_TEMPLATE_ID)} icon={CodeXml} libraries={[]} onClick={() => setPreset(CUSTOM_PRESET)} />
        {presets.map((preset) => (
          <SelectableCard key={preset.id} active={presetId === preset.id} title={preset.name} description={preset.description} structure={templateName(preset.templateId)} icon={PRESET_ICONS[preset.id] ?? CodeXml} libraries={preset.recommendedLibraries} onClick={() => setPreset(preset.id)} />
        ))}
      </div>
      <div className="page-note"><span>Nothing is set in stone. Customize your dependencies anytime.</span><span>Yours to build.</span></div>
    </div>
  );
}

function SelectableCard({ active, title, description, structure, icon: Icon, libraries, onClick }: {
  active: boolean;
  title: string;
  description: string;
  structure: string;
  icon: LucideIcon;
  libraries: string[];
  onClick: () => void;
}) {
  return (
    <button type="button" onClick={onClick} className="template-card" aria-pressed={active}>
      <div className="template-card-top">
        <span className="template-icon"><Icon size={20} strokeWidth={1.5} /></span>
        {active && <span className="template-selected"><Check size={17} />Selected</span>}
      </div>
      <h3>{title}</h3>
      <p className="template-card-description">{description}</p>
      <div className="template-structure"><FolderTree size={12} className="shrink-0" /><span className="truncate">{structure}</span></div>
      <div className="template-packages">
        {libraries.length > 0 ? libraries.map((lib) => <span key={lib} className="template-package">{lib}</span>) : <span className="template-package">Just the essentials</span>}
      </div>
      <div className="template-card-footer"><span>{libraries.length > 0 ? `${libraries.length} curated packages` : "A world of possibilities"}</span><ArrowRight size={15} /></div>
    </button>
  );
}
