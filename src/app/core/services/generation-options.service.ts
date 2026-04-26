import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { defaultGenerationOptions } from '@core/data/default-generation-options';
import { environment } from '@core/environments/environment';
import {
    GenerationOptionsResponse,
    ProjectPresetOption,
    ProjectTemplateOption,
} from '@core/models/generation-options.model';
import { catchError, map, Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class GenerationOptionsService {
  private readonly remoteOptionsUrl = `${environment.remoteApiUrl}/options`;
  private readonly localOptionsUrl = `${environment.localApiUrl}/options`;

  constructor(private http: HttpClient) {}

  getOptions(): Observable<GenerationOptionsResponse> {
    const primaryUrl = environment.isLocalhost
      ? this.localOptionsUrl
      : this.remoteOptionsUrl;
    const secondaryUrl = environment.isLocalhost
      ? this.remoteOptionsUrl
      : this.localOptionsUrl;

    return this.http.get<GenerationOptionsResponse>(primaryUrl).pipe(
      catchError(() =>
        this.http
          .get<GenerationOptionsResponse>(secondaryUrl)
          .pipe(catchError(() => of(defaultGenerationOptions)))
      )
    );
  }

  getTemplates(): Observable<ProjectTemplateOption[]> {
    return this.getOptions().pipe(map((options) => options.templates));
  }

  getPresets(): Observable<ProjectPresetOption[]> {
    return this.getOptions().pipe(map((options) => options.presets));
  }
}
