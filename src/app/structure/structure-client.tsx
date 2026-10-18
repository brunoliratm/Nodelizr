"use client";

import { useEffect, useMemo, useState } from "react";
import { Copy, File, FileCode2, Folder, FolderTree } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { getTemplatePreview } from "@/lib/api";
import {
  buildFallbackFilesFromTree,
  buildTreeItems,
  type PreviewTreeItem,
} from "@/lib/build-tree";
import { useProjectStore } from "@/store/project-store";
import type { TemplatePreviewFile } from "@/lib/types";

export default function StructurePage() {
  const templateId = useProjectStore((s) => s.templateId);

  return <StructurePreview key={templateId} templateId={templateId} />;
}

function StructurePreview({ templateId }: { templateId: string }) {
  const templates = useProjectStore((s) => s.templates);

  const [files, setFiles] = useState<TemplatePreviewFile[]>([]);
  const [treeItems, setTreeItems] = useState<PreviewTreeItem[]>([]);
  const [selectedPath, setSelectedPath] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const selectedTemplate = templates.find((t) => t.id === templateId);

  useEffect(() => {
    let active = true;

    const applyFiles = (incoming: TemplatePreviewFile[]) => {
      const sorted = [...incoming].sort((a, b) =>
        a.path.localeCompare(b.path),
      );
      setFiles(sorted);
      setTreeItems(buildTreeItems(sorted));
      setSelectedPath(sorted[0]?.path ?? "");
    };

    getTemplatePreview(templateId || "node-basic-js")
      .then((preview) => {
        if (active) {
          applyFiles(preview.files);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!active) return;
        setError(
          "Could not load file preview from API. Showing structure-only fallback.",
        );
        const fallbackTree = selectedTemplate?.tree ?? [];
        applyFiles(buildFallbackFilesFromTree(fallbackTree));
        setLoading(false);
      });

    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [templateId]);

  const selectedContent = useMemo(
    () => files.find((f) => f.path === selectedPath)?.content ?? "",
    [files, selectedPath],
  );
  const selectedName = selectedPath.split("/").pop() || selectedPath;

  const copyCurrentFile = () => {
    if (!selectedContent || !navigator?.clipboard) return;
    navigator.clipboard.writeText(selectedContent);
    toast.success("Copied", {
      description: "File content copied to clipboard.",
    });
  };

  return (
    <div className="page-shell structure-page">
      <header className="structure-header">
        <p className="eyebrow"><span className="status-dot" /> A LITTLE LOOK INSIDE</p>
        <h1 className="page-title">Good structure.<br /><span>Great possibilities.</span></h1>
        <p className="page-description">
          Explore your files before they become your next project.{" "}
          <span className="text-foreground">
            {selectedTemplate?.name ?? "the selected template"}
          </span>.
        </p>
      </header>

      <div className="file-workspace">
        {/* Tree */}
        <aside className="file-sidebar" aria-label="Project files">
          <div className="file-sidebar-heading">
            <span className="flex items-center gap-2"><FolderTree size={13} /> EXPLORER</span>
            <span className="count-badge">{files.length}</span>
          </div>
          <div className="file-tree">
            {loading && (
              <p className="p-3 text-sm text-muted-foreground">
                Loading file preview...
              </p>
            )}
            {error && (
              <p className="p-3 text-sm text-destructive">{error}</p>
            )}
            {!loading &&
              treeItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() =>
                    item.type === "file" && setSelectedPath(item.path)
                  }
                  style={{ paddingLeft: 12 + item.depth * 16 }}
                  disabled={item.type === "folder"}
                  aria-pressed={item.type === "file" ? item.path === selectedPath : undefined}
                  className={cn("file-tree-item", item.type === "folder" && "file-folder")}
                >
                  {item.type === "folder" ? (
                    <Folder size={14} className="shrink-0" strokeWidth={1.5} />
                  ) : (
                    <File size={14} className="shrink-0" strokeWidth={1.5} />
                  )}
                  <span className="truncate">{item.name}</span>
                </button>
              ))}
          </div>
        </aside>

        {/* Content */}
        <section className="code-panel" aria-label="File content">
          <div className="code-header">
            <span className="code-header-path">
              <FileCode2 size={14} /><span className="truncate">{selectedPath || "No file selected"}</span>
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="copy-button"
              onClick={copyCurrentFile}
              disabled={!selectedContent}
            >
              <Copy size={14} />
              Copy
            </Button>
          </div>
          <pre className="code-content" aria-busy={loading}>
            <code>{loading ? "Preparing your preview..." : selectedContent}</code>
          </pre>
          <div className="code-footer"><span>{selectedName || "Preview"}</span><span>UTF-8 · {selectedContent.split("\n").length} lines</span></div>
        </section>
      </div>
      <div className="page-note"><span>Your foundation. Ready to build on.</span><span>Preview before you download.</span></div>
    </div>
  );
}
