import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@core/environments/environment';
import { Observable } from 'rxjs';

export interface SelectedLibraryPayload {
  name: string;
  version?: string;
}

export interface GenerateProjectPayload {
  description: string;
  author: string;
  version: string;
  license: string;
  templateId: string;
  presetId?: string;
  libraries: SelectedLibraryPayload[];
}

@Injectable({ providedIn: 'root' })
export class GenerateService {
  private readonly apiUrl = `${environment.apiUrl}/generate`;

  constructor(private http: HttpClient) {}

  generateProject(data: GenerateProjectPayload): Observable<Blob> {
    return this.http.post(this.apiUrl, data, {
      responseType: 'blob',
    });
  }
}
