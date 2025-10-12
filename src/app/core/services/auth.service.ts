import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, map, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:8080/auth';
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

// Reemplaza el método login por este:
login(email: string, password: string): Observable<any> {
  return this.http.post<any>(`${this.apiUrl}/login`, { email, password }).pipe(
    tap((response) => {
      // Validación y almacenamiento
      if (!response?.data?.usuario?.idRol) throw new Error('Respuesta inválida');
      this.setToken(response.data.token);
      this.currentUserSubject.next(response.data.usuario);

      // Redirección optimizada
      const rolePath = this.getRolePath(response.data.usuario.idRol);
      setTimeout(() => {
        this.router.navigateByUrl(rolePath, { replaceUrl: true })
          .catch(err => console.error('Error en navegación:', err));
      }, 0);
    }),
    catchError((error) => {
      if (error.status === 401 || error.status === 403) {
        // Forzar un error 403 cuando las credenciales son válidas pero el rol no coincide
        throw { status: 403, error: { message: 'Acceso denegado' } };
      }
      throw error;
    }),
    map(response => response.data.usuario) // 👈 Devuelve el usuario
  );
}
public getRolePath(idRol: number): string {
  return idRol === 1 ? 'admin' :
         idRol === 2 ? 'director' :
         idRol === 3 ? 'docente' :
         idRol === 4 ? 'jefe-departamento' :
         idRol === 5 ? 'logistica' : 'login';
}

  private setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  logout(): void {
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
  
  // En auth.service.ts
getCurrentUser() {
  return this.currentUserSubject.value;
}

}