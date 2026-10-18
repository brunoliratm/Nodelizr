"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Box, Braces, Check, Package, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProjectStore } from "@/store/project-store";
import { DependenciesDialog } from "./dependencies-dialog";

export function DependenciesPanel() {
  const libraries = useProjectStore((s) => s.libraries);
  const selectedLibraries = useProjectStore((s) => s.selectedLibraries);
  const removeLibrary = useProjectStore((s) => s.removeLibrary);
  const toggleLibrary = useProjectStore((s) => s.toggleLibrary);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "b" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  const descriptions = useMemo(() => new Map(libraries.map((lib) => [lib.name, lib.description])), [libraries]);
  const popularLibraries = ["express", "cors", "dotenv"].flatMap((name) => {
    const library = libraries.find((lib) => lib.name === name);
    return library ? [library] : [];
  });

  return (
    <section className="dependencies-panel" aria-labelledby="dependencies-heading">
      <div className="dependencies-header">
        <h3 id="dependencies-heading" className="section-label">
          <span className="section-number">02</span> DEPENDENCIES
          <span className="count-badge" aria-live="polite" aria-label={`${selectedLibraries.length} selected`}>{selectedLibraries.length}</span>
        </h3>
        <Button variant="outline" className="add-packages" onClick={() => setOpen(true)} aria-keyshortcuts="Control+b Meta+b">
          <Plus size={14} /> Add packages
        </Button>
      </div>
      <div className="dependency-content">
        {selectedLibraries.length === 0 ? (
          <div className="empty-dependencies">
            <div className="package-constellation" aria-hidden="true">
              <span className="package-tile"><Braces size={18} strokeWidth={1.5} /></span>
              <span className="package-tile"><Package size={25} strokeWidth={1.35} /></span>
              <span className="package-tile"><Box size={18} strokeWidth={1.5} /></span>
            </div>
            <h3>A little something for your stack.</h3>
            <p>Add the packages you love.<br />Leave the rest behind.</p>
            <button type="button" className="text-link" onClick={() => setOpen(true)}>Browse dependencies <ArrowRight size={13} /></button>
          </div>
        ) : (
          <ul className="dependency-list">
            {selectedLibraries.map((lib) => (
              <li key={lib.name} className="dependency-row">
                <span className="dependency-row-icon"><Package size={16} strokeWidth={1.5} /></span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-2"><span className="dependency-row-name truncate">{lib.name}</span><span className="dependency-version shrink-0">{lib.version}</span></div>
                  {descriptions.get(lib.name) && <p className="mt-1 truncate text-[10px] text-muted-foreground">{descriptions.get(lib.name)}</p>}
                </div>
                <button type="button" onClick={() => removeLibrary(lib.name)} aria-label={`Remove ${lib.name}`} className="dependency-remove"><X size={14} /></button>
              </li>
            ))}
          </ul>
        )}
      </div>
      {popularLibraries.length > 0 && (
        <div className="popular-packages">
          <span>A good place to start</span>
          {popularLibraries.map((lib) => {
            const selected = selectedLibraries.some((item) => item.name === lib.name);
            return <button key={lib.name} type="button" className="package-chip" aria-pressed={selected} onClick={() => toggleLibrary(lib)}>{selected ? <Check size={10} /> : <Plus size={10} />}{lib.name}</button>;
          })}
        </div>
      )}
      <DependenciesDialog open={open} onOpenChange={setOpen} />
    </section>
  );
}
