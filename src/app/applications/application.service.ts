import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Application } from './models/application';

@Injectable({ providedIn: 'root' })
export class ApplicationService {
  private baseUrl = environment.apiUrl + '/api/applications';

  constructor(private http: HttpClient) { }

  getApplications(): Observable<Application[]> {
    return this.http.get<Application[]>(`${this.baseUrl}`);
  }

  getApplicationById(id: number | undefined): Observable<Application> {
    return this.http.get<Application>(`${this.baseUrl}/${id}`);
  }

  addGithubUrl(id: number, githubUrl: string): Observable<Application> {
    return this.http.put<Application>(`${this.baseUrl}/${id}/github-url`, null, {
      params: { githubUrl }
    });
  }

  getGithubUrl(id: number): Observable<string> {
    return this.http.get(`${this.baseUrl}/${id}/github-url`, { responseType: 'text' });
  }

  createApplication(name: string): Observable<Application> {
    return this.http.post<Application>(`${this.baseUrl}/create`, null, {
      params: { name }
    });
  }

  updateApplication(id: any, updatedApplication: Application): Observable<Application> {
    return this.http.put<Application>(`${this.baseUrl}/update/${id}`, updatedApplication);
  }
  
  deleteAppByid(metadataId: any) {
    return this.http.delete<Application>(`${this.baseUrl}/${metadataId}`);
  }
}