"use client";

import Link from "next/link";
import { ArrowRight, LayoutTemplate } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CUSTOM_PRESET, useProjectStore } from "@/store/project-store";

export function MetadataForm() {
  const description = useProjectStore((s) => s.description);
  const version = useProjectStore((s) => s.version);
  const author = useProjectStore((s) => s.author);
  const license = useProjectStore((s) => s.license);
  const presetId = useProjectStore((s) => s.presetId);
  const presets = useProjectStore((s) => s.presets);
  const setField = useProjectStore((s) => s.setField);
  const presetName = presetId === CUSTOM_PRESET ? "A clean slate" : presets.find((p) => p.id === presetId)?.name ?? "A clean slate";

  return (
    <section className="metadata-form" aria-labelledby="details-heading">
      <h3 id="details-heading" className="section-label"><span className="section-number">01</span> PROJECT DETAILS</h3>
      <div className="form-fields">
        <div className="form-field form-field-wide">
          <Label htmlFor="description">Project name</Label>
          <Input id="description" className="project-input" placeholder="my-next-big-thing" value={description} onChange={(e) => setField("description", e.target.value)} spellCheck={false} autoComplete="off" />
        </div>
        <div className="form-field">
          <Label htmlFor="version">Version</Label>
          <Input id="version" className="project-input" placeholder="1.0.0" value={version} onChange={(e) => setField("version", e.target.value)} spellCheck={false} autoComplete="off" />
        </div>
        <div className="form-field">
          <Label htmlFor="license">License</Label>
          <Select value={license} onValueChange={(v) => v && setField("license", v)}>
            <SelectTrigger id="license" className="project-select"><SelectValue placeholder="Choose a license" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="MIT">MIT</SelectItem>
              <SelectItem value="Apache-2.0">Apache-2.0</SelectItem>
              <SelectItem value="GPL-3.0">GPL-3.0</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="form-field form-field-wide">
          <Label htmlFor="author">Author <span className="optional-label">(optional)</span></Label>
          <Input id="author" className="project-input" placeholder="Your name or organization" value={author} onChange={(e) => setField("author", e.target.value)} autoComplete="name" />
        </div>
      </div>
      <Link href="/templates" className="template-link">
        <LayoutTemplate size={19} strokeWidth={1.5} />
        <div className="min-w-0"><p>{presetName}</p><span>Choose a template for a head start</span></div>
        <ArrowRight size={15} />
      </Link>
    </section>
  );
}
