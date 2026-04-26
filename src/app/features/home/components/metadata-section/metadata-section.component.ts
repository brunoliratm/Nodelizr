import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  ProjectPresetOption,
  ProjectTemplateOption,
  TemplateTreeNode,
} from '@core/models/generation-options.model';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { ProjectTreeComponent } from '../project-tree/project-tree.component';

@Component({
  standalone: true,
  selector: 'app-metadata-section',
  templateUrl: './metadata-section.component.html',
  styleUrls: ['./metadata-section.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputGroupModule,
    InputGroupAddonModule,
    InputTextModule,
    ProjectTreeComponent,
  ],
})
export class MetadataSectionComponent {
  readonly customPresetId = 'custom';

  @Input() presets: ProjectPresetOption[] = [];
  @Input() templates: ProjectTemplateOption[] = [];
  @Input() projectTree: TemplateTreeNode[] = [];
  @Input() filterForm!: FormGroup;
  @Output() generate = new EventEmitter<void>();
  @Output() presetChange = new EventEmitter<string>();

  onPresetChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.presetChange.emit(value);
  }

  get selectedPresetDescription(): string {
    const selectedPresetId = this.filterForm?.get('presetId')?.value as string;
    if (!selectedPresetId || selectedPresetId === this.customPresetId) {
      return 'Manual mode: pick template and dependencies freely.';
    }

    return (
      this.presets.find((preset) => preset.id === selectedPresetId)?.description ||
      ''
    );
  }

  get selectedTemplateDescription(): string {
    const selectedTemplateId = this.filterForm?.get('templateId')?.value as string;
    return (
      this.templates.find((template) => template.id === selectedTemplateId)
        ?.description || ''
    );
  }
}
