import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import {
    TemplatePreviewFile,
    TemplateTreeNode,
} from '@core/models/generation-options.model';
import { GenerationOptionsService } from '@core/services/generation-options.service';
import { defaultTreeData } from '@shared/data/tree-structure';

interface PreviewTreeItem {
  id: string;
  path: string;
  name: string;
  depth: number;
  type: 'folder' | 'file';
}

interface FolderNode {
  name: string;
  path: string;
  folders: Map<string, FolderNode>;
  files: TemplatePreviewFile[];
}

@Component({
  standalone: true,
  selector: 'app-project-tree',
  templateUrl: './project-tree.component.html',
  imports: [CommonModule],
})
export class ProjectTreeComponent {
  @Input() files: TemplateTreeNode[] = defaultTreeData;
  @Input() templateId = 'node-basic-js';

  isModalOpen = false;
  isLoading = false;
  loadError = '';
  selectedFilePath = '';
  previewFiles: TemplatePreviewFile[] = [];
  treeItems: PreviewTreeItem[] = [];

  constructor(private generationOptionsService: GenerationOptionsService) {}

  openPreviewModal() {
    this.isModalOpen = true;
    this.loadPreview();
  }

  closePreviewModal() {
    this.isModalOpen = false;
  }

  selectFile(path: string) {
    this.selectedFilePath = path;
  }

  copyCurrentFile() {
    const content = this.selectedFileContent;
    if (!content || !navigator?.clipboard) {
      return;
    }

    navigator.clipboard.writeText(content);
  }

  get selectedFileContent(): string {
    return (
      this.previewFiles.find((file) => file.path === this.selectedFilePath)?.content ||
      ''
    );
  }

  get selectedFileName(): string {
    return this.selectedFilePath.split('/').pop() || this.selectedFilePath;
  }

  private loadPreview() {
    this.isLoading = true;
    this.loadError = '';
    const templateId = this.templateId || 'node-basic-js';

    this.generationOptionsService.getTemplatePreview(templateId).subscribe({
      next: (preview) => {
        this.applyPreviewFiles(preview.files);
        this.isLoading = false;
      },
      error: () => {
        this.loadError =
          'Could not load file preview from API. Showing structure-only fallback.';
        this.applyPreviewFiles(this.buildFallbackFilesFromTree(this.files));
        this.isLoading = false;
      },
    });
  }

  private applyPreviewFiles(files: TemplatePreviewFile[]) {
    const sortedFiles = [...files].sort((a, b) => a.path.localeCompare(b.path));
    this.previewFiles = sortedFiles;
    this.treeItems = this.buildTreeItems(sortedFiles);

    const hasSelectedFile = sortedFiles.some(
      (file) => file.path === this.selectedFilePath
    );
    if (!hasSelectedFile) {
      this.selectedFilePath = sortedFiles[0]?.path || '';
    }
  }

  private buildTreeItems(files: TemplatePreviewFile[]): PreviewTreeItem[] {
    const root: FolderNode = {
      name: '',
      path: '',
      folders: new Map<string, FolderNode>(),
      files: [],
    };

    for (const file of files) {
      const segments = file.path.split('/').filter(Boolean);
      if (!segments.length) {
        continue;
      }

      let current = root;
      let currentPath = '';
      for (let index = 0; index < segments.length - 1; index++) {
        const segment = segments[index];
        currentPath = currentPath ? `${currentPath}/${segment}` : segment;

        if (!current.folders.has(segment)) {
          current.folders.set(segment, {
            name: segment,
            path: currentPath,
            folders: new Map<string, FolderNode>(),
            files: [],
          });
        }

        current = current.folders.get(segment)!;
      }

      current.files.push(file);
    }

    const items: PreviewTreeItem[] = [];

    const walk = (folder: FolderNode, depth: number) => {
      const childFolders = Array.from(folder.folders.values()).sort((a, b) =>
        a.name.localeCompare(b.name)
      );

      for (const childFolder of childFolders) {
        items.push({
          id: `folder:${childFolder.path}`,
          path: childFolder.path,
          name: childFolder.name,
          depth,
          type: 'folder',
        });
        walk(childFolder, depth + 1);
      }

      const childFiles = [...folder.files].sort((a, b) =>
        a.path.localeCompare(b.path)
      );
      for (const file of childFiles) {
        items.push({
          id: `file:${file.path}`,
          path: file.path,
          name: file.path.split('/').pop() || file.path,
          depth,
          type: 'file',
        });
      }
    };

    walk(root, 0);
    return items;
  }

  private buildFallbackFilesFromTree(nodes: TemplateTreeNode[]): TemplatePreviewFile[] {
    const filePaths: string[] = [];

    const walk = (currentNodes: TemplateTreeNode[], parentPath = '') => {
      for (const node of currentNodes) {
        const label = node.label?.trim();
        if (!label) {
          continue;
        }

        const currentPath = parentPath ? `${parentPath}/${label}` : label;
        const children = node.children ?? [];
        if (children.length) {
          walk(children, currentPath);
        } else {
          filePaths.push(currentPath);
        }
      }
    };

    walk(nodes);

    return filePaths.map((path) => ({
      path,
      content: `// Preview unavailable for ${path}\n// The file content will be generated when you click Generate.`,
    }));
  }
}
