import { Component } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [FormsModule, CommonModule]
})
export class LoginComponent {
  email = '';
  password = '';
  errorMessage: string | null = null;
  requiredRole: string | null = null;
  accessDenied = false;
  currentYear = new Date().getFullYear();

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    // Recuperamos el rol requerido del estado de navegación
    const navigation = this.router.getCurrentNavigation();
    this.requiredRole = navigation?.extras.state?.['requiredRole'];
  }

  goBack() {
    this.router.navigate(['/']);
  }

  onLogin() {
    this.accessDenied = false;
    this.errorMessage = null;

    this.authService.login(this.email, this.password).subscribe({
      next: (user) => {
        if (this.requiredRole && !this.checkRoleAccess(user)) {
          this.errorMessage = 'No tienes acceso a este módulo';
          this.accessDenied = true;
          this.authService.logout();
          return;
        }
        // Redirigir después de login exitoso
        const defaultRoute = this.authService.getRolePath(user.idRol);
        this.router.navigateByUrl(defaultRoute);
      },
      error: (err) => {
        if (err.status === 403) {
          this.accessDenied = true;
          this.errorMessage = 'Acceso denegado';
        } else {
          this.errorMessage = 'Credenciales incorrectas';
          this.accessDenied = true;
        }
      }
    });
  }

  private checkRoleAccess(user: any): boolean {
    const roleMap: { [key: string]: number } = {
      'admin': 1,
      'director': 2,
      'docente': 3,
      'jefe-departamento': 4, // Nuevo: rol jefe de departamento
      'logistica': 5          // Nuevo: rol logística
    };
    return user?.idRol === roleMap[this.requiredRole as string];
  }
}