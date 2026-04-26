export interface TemplateTreeNode {
  label?: string;
  icon?: string;
  children?: TemplateTreeNode[];
}

export interface ProjectTemplateOption {
  id: string;
  name: string;
  description: string;
  category: string;
  tree: TemplateTreeNode[];
}

export interface ProjectPresetOption {
  id: string;
  name: string;
  description: string;
  templateId: string;
  recommendedLibraries: string[];
}

export interface GenerationOptionsResponse {
  templates: ProjectTemplateOption[];
  presets: ProjectPresetOption[];
}
