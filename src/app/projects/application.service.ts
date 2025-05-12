import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class ApplicationService {
  private baseUrl = environment.apiUrl + '/api/applications';

  constructor(private http: HttpClient) {}

  getApplications(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}`);
  }

  assignUsers(id: number, userIds: number[]): Observable<any> {
    return this.http.post(`${this.baseUrl}/${id}/assign-users`, userIds);
  }

  assignAllUsers(id: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/${id}/assign-all-users`, {});
  }

  toggleLock(id: number, userId: any, lock: boolean): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}/toggle-lock`, null, {
      params: { userId, lock }
    });
  }

  getActiveUser(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}/active-user`);
  }

  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/user?offset=0&limit=100`);
  }
}