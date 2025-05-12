import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from './models/project';

@Injectable({ providedIn: 'root' })
export class ProjectService {
  private baseUrl = environment.apiUrl + '/api/projects';

  constructor(private http: HttpClient) {}

  getProjects(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}`);
  }

  assignUsers(projectId: number, userIds: number[]): Observable<any> {
    return this.http.post(`${this.baseUrl}/${projectId}/assign-users`, userIds);
  }

  assignAllUsers(projectId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/${projectId}/assign-all-users`, {});
  }

  toggleLock(projectId: number, userId: any, lock: boolean): Observable<any> {
    return this.http.put(`${this.baseUrl}/${projectId}/toggle-lock`, null, {
      params: { userId, lock }
    });
  }

  getActiveUser(projectId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${projectId}/active-user`);
  }

  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/user?offset=0&limit=100`);
  }
}