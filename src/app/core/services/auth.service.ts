import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private isBrowser: boolean;

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    
    if (this.isBrowser) {
      this.loadUserFromStorage();
    }
  }

  private loadUserFromStorage(): void {
    if (!this.isBrowser) return;
    
    try {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user_data');
      
      if (token && userData) {
        const user = JSON.parse(userData);
        this.currentUserSubject.next(user);
      }
    } catch (error) {
      this.clearStorage();
    }
  }

  private loadUserFromStorageSync(): void {
    try {
      const userData = localStorage.getItem('user_data');
      if (userData) {
        const user = JSON.parse(userData);
        if (!this.getCurrentUser()) {
          this.currentUserSubject.next(user);
        }
      }
    } catch (error) {
      this.clearStorage();
    }
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap((response) => {
        if (!response || !response.data) {
          throw new Error('Respuesta inválida del servidor');
        }
        
        const user = response.data.usuario;
        const token = response.data.token;
        
        if (!user || !user.rol?.idRol) {
          throw new Error('Estructura de usuario inválida - rol no encontrado');
        }
        
        if (!token) {
          throw new Error('Token no recibido');
        }
        
        if (this.isBrowser) {
          localStorage.setItem('token', token);
          localStorage.setItem('user_data', JSON.stringify(user));
        }
        
        this.currentUserSubject.next(user);
      }),
      map(response => response)
    );
  }

  public ensureUserLoaded(): void {
    if (!this.isBrowser) return;
    
    if (this.getToken() && !this.getCurrentUser()) {
      this.loadUserFromStorageSync();
    }
  }

  private getLocalStorageItem(key: string): string | null {
    if (!this.isBrowser) return null;
    
    try {
      return localStorage.getItem(key);
    } catch (error) {
      return null;
    }
  }

  private setLocalStorageItem(key: string, value: string): void {
    if (!this.isBrowser) return;
    
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      // Silenciar error en producción
    }
  }

  private removeLocalStorageItem(key: string): void {
    if (!this.isBrowser) return;
    
    try {
      localStorage.removeItem(key);
    } catch (error) {
      // Silenciar error en producción
    }
  }

  private clearStorage(): void {
    if (!this.isBrowser) return;
    
    localStorage.removeItem('token');
    localStorage.removeItem('user_data');
  }

  getToken(): string | null {
    return this.getLocalStorageItem('token');
  }

  logout(): void {
    this.removeLocalStorageItem('token');
    this.removeLocalStorageItem('user_data');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
  
  getCurrentUser() {
    return this.currentUserSubject.value;
  }

  public setCurrentUser(user: any): void {
    this.currentUserSubject.next(user);
  }

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
}