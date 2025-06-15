import { Component } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true, // ✅ obligatorio
  imports: [CommonModule, FormsModule], // ✅ necesario para ngModel
  templateUrl: './login.component.html'
})
export class LoginComponent {
  username = '';
  password = '';

  constructor(private authService: AuthService) {}

  onLogin() {
    this.authService.login(this.username, this.password).subscribe({
      next: (res) => {
        // ✅ Mostrar en consola igual que Postman
        console.log('✅ Mensaje:', res.message);
        console.log('🔐 Token:', res.data.token);
        console.log('👤 Usuario:', res.data.usuario);
      },
      error: (err) => {
        console.error('❌ Error en login:', err);
      }
    });
  }
}
