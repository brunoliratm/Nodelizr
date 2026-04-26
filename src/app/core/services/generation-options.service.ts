import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { defaultGenerationOptions } from '@core/data/default-generation-options';
import { environment } from '@core/environments/environment';
import {
  GenerationOptionsResponse,
  ProjectPresetOption,
  ProjectTemplateOption,
  TemplatePreviewResponse,
} from '@core/models/generation-options.model';
import { catchError, map, Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class GenerationOptionsService {
  private readonly remoteApiUrl = environment.remoteApiUrl;
  private readonly localApiUrl = environment.localApiUrl;

  constructor(private http: HttpClient) {}

  getOptions(): Observable<GenerationOptionsResponse> {
    const primaryUrl = this.getApiUrl('primary');
    const secondaryUrl = this.getApiUrl('secondary');

    return this.http.get<GenerationOptionsResponse>(`${primaryUrl}/options`).pipe(
      catchError(() =>
        this.http
          .get<GenerationOptionsResponse>(`${secondaryUrl}/options`)
          .pipe(catchError(() => of(defaultGenerationOptions)))
      )
    );
  }

  getTemplatePreview(templateId: string): Observable<TemplatePreviewResponse> {
    const encodedTemplateId = encodeURIComponent(templateId);
    const primaryUrl = this.getApiUrl('primary');
    const secondaryUrl = this.getApiUrl('secondary');

    return this.http
      .get<TemplatePreviewResponse>(
        `${primaryUrl}/templates/${encodedTemplateId}/preview`
      )
      .pipe(
        catchError(() =>
          this.http.get<TemplatePreviewResponse>(
            `${secondaryUrl}/templates/${encodedTemplateId}/preview`
          )
        )
      );
  }

  getTemplates(): Observable<ProjectTemplateOption[]> {
    return this.getOptions().pipe(map((options) => options.templates));
  }

  getPresets(): Observable<ProjectPresetOption[]> {
    return this.getOptions().pipe(map((options) => options.presets));
  }

  private getApiUrl(priority: 'primary' | 'secondary'): string {
    if (environment.isLocalhost) {
      return priority === 'primary' ? this.localApiUrl : this.remoteApiUrl;
    }

    return priority === 'primary' ? this.remoteApiUrl : this.localApiUrl;
  }
}
