import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // L'URL exacte de ton contrôleur d'authentification .NET
  private apiUrl = 'http://localhost:5111/api/auth';

  // Injection de HttpClient obligatoire pour communiquer avec le backend
  constructor(private http: HttpClient) { }

  // Envoie la demande de connexion au serveur
  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password });
  }

  // AJOUT : Envoie les données d'inscription au contrôleur .NET (Route: api/auth/signup)
  signUp(userModel: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/signup`, userModel);
  }

  // Sauvegarder le token et les infos utilisateur après un login réussi
  saveSession(token: string, user: any): void {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user)); // Transformation de l'objet en chaîne de caractères
  }

  // Gère aussi un retour backend qui fournit accessToken au lieu de token
  saveSessionFromResponse(response: any): void {
    const token = response?.token || response?.accessToken || response?.jwt || null;
    const user = response?.user || response?.payload || null;

    if (token) {
      this.saveSession(token, user);
    }
  }

  // Récupérer le précieux token pour ton jwtInterceptor
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Vérifier si l'utilisateur est connecté (utilisé par ton authGuard)
  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }

  // Récupérer les données de l'utilisateur connecté
  getUserData(): any {
    const userJson = localStorage.getItem('user');
    return userJson ? JSON.parse(userJson) : null;
  }

  // Nettoyer le localStorage lors de la déconnexion (Respect du cahier des charges)
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
}