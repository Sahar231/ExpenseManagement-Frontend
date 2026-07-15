import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FraisService {
  private apiUrl = 'https://localhost:7212/api/expenses';
  private missionsUrl = 'https://localhost:7212/api/missions';

  constructor(private http: HttpClient) { }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('Erreur API:', error);
    return throwError(() => error);
  }

  getMissions(): Observable<any[]> {
    return this.http.get<any[]>(this.missionsUrl).pipe(catchError(this.handleError));
  }

  getMesFrais(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(catchError(this.handleError));
  }

  creerFrais(frais: any): Observable<any> {
    return this.http.post(this.apiUrl, frais).pipe(catchError(this.handleError));
  }

  // Méthode unique et centralisée
  soumettre(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/soumettre`, {}).pipe(catchError(this.handleError));
  }
  // --- NOUVELLES MÉTHODES AJOUTÉES ---

  // Modifier une note de frais
  modifier(id: number, frais: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, frais).pipe(catchError(this.handleError));
  }

  // Supprimer une note de frais
  supprimer(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(catchError(this.handleError));
}
getFraisAValider(): Observable<any[]> {
  return this.http.get<any[]>(
    `${this.apiUrl}/validation`
  ).pipe(
    catchError(this.handleError)
  );
}

approuverFrais(id: number): Observable<any> {
  return this.http.post(
    `${this.apiUrl}/${id}/approve`,
    {}
  ).pipe(
    catchError(this.handleError)
  );
}

rejeterFrais(id: number, comment: string): Observable<any> {
  return this.http.post(
    `${this.apiUrl}/${id}/reject`,
    {
      comment: comment
    }
  ).pipe(
    catchError(this.handleError)
  );
}
getDetailsFrais(id: number): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/${id}/details`)
    .pipe(catchError(this.handleError));
}
}