import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormArray, FormControl, FormGroup, FormsModule } from '@angular/forms';
import { Library } from '@core/services/libraries.service';

@Component({
  selector: 'app-dependencies-section',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dependencies-section.component.html',
})
export class DependenciesSectionComponent implements OnChanges {
  @Input() filterForm!: FormGroup;
  @Input() libraries: Library[] = [];

  grouped: Record<string, Library[]> = {};
  search = '';
  filteredGrouped: Record<string, Library[]> = {};

  get librariesForm(): FormArray {
    return this.filterForm.get('libraries') as FormArray;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['libraries']) {
      this.groupLibraries();
      this.onSearch();
    }
  }

  onSearch() {
    const term = this.search.trim().toLowerCase();
    if (!term) {
      this.filteredGrouped = { ...this.grouped };
      return;
    }
    this.filteredGrouped = {};
    for (const category of Object.keys(this.grouped)) {
      const filtered = this.grouped[category].filter(
        (lib) =>
          lib.name.toLowerCase().includes(term) ||
          (lib.description && lib.description.toLowerCase().includes(term))
      );
      if (filtered.length) {
        this.filteredGrouped[category] = filtered;
      }
    }
  }

  get categories(): string[] {
    return Object.keys(this.filteredGrouped);
  }

  isSelected(lib: Library): boolean {
    return this.librariesForm.value.some(
      (selected: { name: string }) => selected.name === lib.name
    );
  }

  toggle(lib: Library) {
    const index = this.librariesForm.value.findIndex(
      (selected: { name: string }) => selected.name === lib.name
    );
    if (index > -1) {
      this.librariesForm.removeAt(index);
    } else {
      this.librariesForm.push(
        new FormControl({ name: lib.name, version: lib.version })
      );
    }
  }

  private groupLibraries() {
    this.grouped = this.libraries.reduce((acc, lib) => {
      acc[lib.category] = acc[lib.category] || [];
      acc[lib.category].push(lib);
      return acc;
    }, {} as Record<string, Library[]>);
    this.filteredGrouped = { ...this.grouped };
  }
}
