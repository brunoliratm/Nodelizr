"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, ArrowDownToLine, Loader2, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CUSTOM_PRESET, useProjectStore } from "@/store/project-store";

export function GenerateBar() {
  const pathname = usePathname();
  const description = useProjectStore((s) => s.description);
  const presets = useProjectStore((s) => s.presets);
  const presetId = useProjectStore((s) => s.presetId);
  const selectedLibraries = useProjectStore((s) => s.selectedLibraries);
  const generating = useProjectStore((s) => s.generating);
  const generate = useProjectStore((s) => s.generate);

  const presetLabel = presetId === CUSTOM_PRESET
    ? "Custom setup"
    : (presets.find((p) => p.id === presetId)?.name ?? "Custom setup");

  return (
    <footer className="generate-bar">
      <div className="generate-bar-inner">
        <div className="download-summary">
          <span className="download-icon"><Package size={20} strokeWidth={1.5} /></span>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">
              {description.trim() ? `${description.trim().replace(/\s+/g, "-")}.zip` : "Your next project"}
            </p>
            <p className="mt-1 truncate text-xs text-muted-foreground">
              {presetLabel}<span className="mx-2">·</span>
              {selectedLibraries.length} dependenc{selectedLibraries.length === 1 ? "y" : "ies"}
            </p>
          </div>
        </div>
        <div className="generate-actions">
          {pathname !== "/structure" && (
            <Link href="/structure" className="preview-link">Preview files <ArrowRight size={15} /></Link>
          )}
          <Button onClick={generate} disabled={generating} className="generate-button" aria-busy={generating}>
            {generating ? "Preparing your project" : "Generate project"}
            {generating ? <Loader2 className="animate-spin" /> : <ArrowDownToLine />}
          </Button>
        </div>
      </div>
    </footer>
  );
}
