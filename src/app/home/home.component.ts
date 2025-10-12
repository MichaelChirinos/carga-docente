import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  selectedModule: string | null = null;
currentYear = new Date().getFullYear();
  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  navigateTo(module: string): void {
    this.selectedModule = module;
    this.router.navigate(['/login'], { 
      state: { requiredRole: module }
    });
  }
}