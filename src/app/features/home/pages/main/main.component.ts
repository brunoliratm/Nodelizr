import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  ProjectPresetOption,
  ProjectTemplateOption,
  TemplateTreeNode,
} from '@core/models/generation-options.model';
import {
  GenerateProjectPayload,
  GenerateService,
} from '@core/services/generate.service';
import { GenerationOptionsService } from '@core/services/generation-options.service';
import { LibrariesService, Library } from '@core/services/libraries.service';
import { DependenciesSectionComponent } from '@features/home/components/dependencies-section/dependencies-section.component';
import { MetadataSectionComponent } from '@features/home/components/metadata-section/metadata-section.component';
import { defaultTreeData } from '@shared/data/tree-structure';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { forkJoin, startWith } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  imports: [
    MetadataSectionComponent,
    DependenciesSectionComponent,
    ReactiveFormsModule,
    ToastModule,
  ],
})
export class MainComponent {
  private fb = inject(FormBuilder);
  private destroyRef = inject(DestroyRef);
  private generateService = inject(GenerateService);
  private generationOptionsService = inject(GenerationOptionsService);
  private librariesService = inject(LibrariesService);
  private messageService: MessageService = inject(MessageService);

  readonly customPresetId = 'custom';

  templates: ProjectTemplateOption[] = [];
  presets: ProjectPresetOption[] = [];
  libraries: Library[] = [];
  projectTree: TemplateTreeNode[] = defaultTreeData;
  filterForm: FormGroup;

  constructor() {
    this.filterForm = this.fb.group({
      presetId: [this.customPresetId],
      templateId: ['node-basic-js', Validators.required],
      description: ['', [Validators.required, Validators.minLength(2)]],
      author: [''],
      version: [
        '1.0.0',
        [Validators.required, Validators.pattern(/^\d+\.\d+\.\d+([-+].*)?$/)],
      ],
      license: ['MIT', Validators.required],
      libraries: this.fb.array([]),
    });

    this.setupTemplatePreviewSync();
    this.loadGenerationOptions();
  }

  onPresetChange(presetId: string) {
    if (!presetId || presetId === this.customPresetId) {
      return;
    }

    const preset = this.presets.find((item) => item.id === presetId);
    if (!preset) {
      return;
    }

    this.filterForm.patchValue({ templateId: preset.templateId });
    this.applyPresetLibraries(preset.recommendedLibraries);
  }

  onGenerate() {
    if (this.filterForm.invalid) {
      this.filterForm.markAllAsTouched();
      this.messageService.add({
        severity: 'warn',
        summary: 'Invalid Form',
        detail: 'Please provide a valid project name and version.',
      });
      return;
    }

    const payload = this.filterForm.getRawValue() as GenerateProjectPayload;

    this.generateService.generateProject(payload).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = payload.description
          ? `${payload.description.replace(/\s+/g, '-')}.zip`
          : 'project.zip';
        a.click();
        window.URL.revokeObjectURL(url);
        this.messageService.add({
          severity: 'success',
          summary: 'Project Generated',
          detail: 'ZIP file downloaded successfully!',
        });
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Generation Error',
          detail: 'There was a problem generating the project.',
        });
      },
    });
  }

  private loadGenerationOptions() {
    forkJoin({
      libraries: this.librariesService.getAll(),
      options: this.generationOptionsService.getOptions(),
    }).subscribe({
      next: ({ libraries, options }) => {
        this.libraries = libraries;
        this.templates = options.templates;
        this.presets = options.presets;

        const currentTemplate = this.filterForm.get('templateId')?.value as string;
        const fallbackTemplate = this.templates[0]?.id;

        if (
          fallbackTemplate &&
          !this.templates.some((template) => template.id === currentTemplate)
        ) {
          this.filterForm.patchValue({ templateId: fallbackTemplate });
          return;
        }

        this.projectTree =
          this.templates.find((template) => template.id === currentTemplate)?.tree ||
          defaultTreeData;
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Load Error',
          detail: 'Unable to load templates and presets at the moment.',
        });
      },
    });
  }

  private setupTemplatePreviewSync() {
    const templateControl = this.filterForm.get('templateId');
    if (!templateControl) {
      return;
    }

    templateControl.valueChanges
      .pipe(startWith(templateControl.value), takeUntilDestroyed(this.destroyRef))
      .subscribe((templateId: string) => {
        this.projectTree =
          this.templates.find((template) => template.id === templateId)?.tree ||
          defaultTreeData;
      });
  }

  private applyPresetLibraries(recommendedLibraries: string[]) {
    const librariesArray = this.filterForm.get('libraries') as FormArray;
    librariesArray.clear();

    for (const libraryName of recommendedLibraries) {
      const libraryData = this.libraries.find((item) => item.name === libraryName);
      if (!libraryData) {
        continue;
      }

      const version =
        libraryData.version && libraryData.version !== 'unknown'
          ? libraryData.version
          : '*';

      librariesArray.push(new FormControl({ name: libraryData.name, version }));
    }
  }
}
