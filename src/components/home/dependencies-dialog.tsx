"use client";

import { useMemo } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useProjectStore } from "@/store/project-store";
import type { Library } from "@/lib/types";

interface DependenciesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DependenciesDialog({
  open,
  onOpenChange,
}: DependenciesDialogProps) {
  const libraries = useProjectStore((s) => s.libraries);
  const selectedLibraries = useProjectStore((s) => s.selectedLibraries);
  const toggleLibrary = useProjectStore((s) => s.toggleLibrary);

  const selectedNames = useMemo(
    () => new Set(selectedLibraries.map((l) => l.name)),
    [selectedLibraries],
  );

  const grouped = useMemo(() => {
    const result: Record<string, Library[]> = {};
    for (const lib of libraries) {
      (result[lib.category] ||= []).push(lib);
    }
    return result;
  }, [libraries]);

  return (
    <CommandDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Add dependencies"
      description="Search and add dependencies to your project."
      className="dependency-dialog top-1/2 w-[calc(100%-2rem)] max-w-2xl -translate-y-1/2 border border-border sm:max-w-2xl"
      showCloseButton
    >
      <Command>
        <CommandInput placeholder="Find your next dependency..." aria-label="Search dependencies" />
        <CommandList className="max-h-[60vh]">
        <CommandEmpty>No dependencies found.</CommandEmpty>
        {Object.keys(grouped).map((category) => (
          <CommandGroup key={category} heading={category}>
            {grouped[category].map((lib) => {
              const selected = selectedNames.has(lib.name);
              return (
                <CommandItem
                  key={lib.name}
                  value={`${lib.name} ${lib.description}`}
                  onSelect={() => toggleLibrary(lib)}
                  className="flex items-center gap-3"
                >
                  <span
                    className={cn(
                      "flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border transition-colors",
                      selected
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-muted-foreground/40 bg-transparent",
                    )}
                  >
                    {selected && <Check size={12} strokeWidth={3} />}
                  </span>
                  <span className="w-28 shrink-0 truncate font-mono text-xs text-foreground max-sm:w-24">
                    {lib.name}
                  </span>
                  <span className="flex-1 truncate text-xs text-muted-foreground max-sm:hidden">
                    {lib.description}
                  </span>
                  <span className="ml-auto shrink-0 rounded-md bg-muted px-2 py-1 font-mono text-[10px] text-muted-foreground">
                    {lib.version}
                  </span>
                </CommandItem>
              );
            })}
          </CommandGroup>
        ))}
        </CommandList>
        <div className="mt-1 border-t border-border px-3 py-3 text-[11px] text-muted-foreground">
          Selecting keeps the dialog open. Add multiple, then press{" "}
          <kbd className="rounded border border-border bg-muted px-1">Esc</kbd>{" "}
          to close.
        </div>
      </Command>
    </CommandDialog>
  );
}
