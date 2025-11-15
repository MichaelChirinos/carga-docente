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

// En login.component.ts
onLogin() {
  this.accessDenied = false;
  this.errorMessage = null;

  console.log('🔄 Iniciando login con:', this.email);
  
  this.authService.login(this.email, this.password).subscribe({
    next: (response) => {
      console.log('✅ Login exitoso - Respuesta completa:', response);
      
      const user = response.data.usuario;
      
      // ✅ CORRECCIÓN: El idRol está en user.rol.idRol
      if (this.requiredRole && !this.checkRoleAccess(user)) {
        this.errorMessage = 'No tienes acceso a este módulo';
        this.accessDenied = true;
        this.authService.logout();
        return;
      }
      
      // ✅ Usar user.rol.idRol para la redirección
      const defaultRoute = this.authService.getRolePath(user.rol.idRol);
      console.log('🔄 Redirigiendo a:', defaultRoute);
      this.router.navigateByUrl(defaultRoute);
    },
    error: (err) => {
      console.error('❌ Error en login:', err);
      // ... manejo de errores igual
    }
  });
}

private checkRoleAccess(user: any): boolean {
  const roleMap: { [key: string]: number } = {
    'Administrador': 1,
    'Departamento Academico': 2,
    'Docente': 3,
    'Escuela Profesional': 4, 
    'Logistica': 5 
  };
  
  // ✅ CORRECCIÓN: El idRol está en user.rol.idRol
  return user?.rol?.idRol === roleMap[this.requiredRole as string];
}
}