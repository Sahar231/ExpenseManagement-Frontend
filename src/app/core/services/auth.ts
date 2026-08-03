import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5111/api/auth';

  constructor(private http: HttpClient) { }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password });
  }

  signUp(userModel: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/signup`, userModel);
  }

  saveSession(token: string, user: any): void {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  }

  saveSessionFromResponse(response: any): void {
    const token = response?.token || response?.accessToken || response?.jwt || null;
    const user = response?.user || response?.payload || response || null;

    if (token) {
      this.saveSession(token, user);
    }
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }

  getUserData(): any {
    const userJson = localStorage.getItem('user');
    return userJson ? JSON.parse(userJson) : null;
  }

  // --- MHOUM M3A L-ROLE GUARD ---

  // 1. Récupérer le rôle direct mel user object fi localStorage
  getUserRole(): string | null {
    const user = this.getUserData();
    // Thabbet fi backend mte3ek (role, Role, userRole...)
    return user?.role || user?.Role || user?.userRole || null; 
  }

  // 2. Méthode pour vérifier si l'utilisateur a un rôle spécifique
  hasRole(requiredRole: string): boolean {
    const role = this.getUserRole();
    if (!role) return false;
    
    // Comparaison case-insensitive (Manager == manager)
    return role.toLowerCase() === requiredRole.toLowerCase();
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
}