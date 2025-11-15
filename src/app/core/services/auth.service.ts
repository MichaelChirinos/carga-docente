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

// En auth.service.ts
login(email: string, password: string): Observable<any> {
  return this.http.post<any>(`${this.apiUrl}/login`, { email, password }).pipe(
    tap((response) => {
      console.log('🔍 Respuesta completa del backend:', response);
      
      if (!response || !response.data) {
        throw new Error('Respuesta inválida del servidor');
      }
      
      const user = response.data.usuario;
      const token = response.data.token;
      
      console.log('🔍 Usuario:', user);
      console.log('🔍 Rol:', user?.rol);
      
      // ✅ CORRECCIÓN: El idRol está en user.rol.idRol
      if (!user || !user.rol?.idRol) {
        console.error('❌ Usuario sin rol válido:', user);
        throw new Error('Estructura de usuario inválida - rol no encontrado');
      }
      
      if (!token) {
        throw new Error('Token no recibido');
      }
      
      this.setToken(token);
      this.currentUserSubject.next(user);
    }),
    map(response => response)
  );
}
// En auth.service.ts
// En auth.service.ts
public getRolePath(idRol: number): string {
  const routes = {
    1: '/Administrador',
    2: '/Departamento Academico', 
    3: '/Docente',
    4: '/Escuela Profesional',
    5: '/Logistica'
  };
  return routes[idRol as keyof typeof routes] || '/login';
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