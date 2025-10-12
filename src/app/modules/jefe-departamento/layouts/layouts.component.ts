import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { JefeDepartamentoNavbarComponent } from '../components/navbar/navbar.component';
import { JefeDepartamentoSidebarComponent } from '../components/sidebar/sidebar.component';

@Component({
  selector: 'app-jefe-departamento-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, JefeDepartamentoNavbarComponent, JefeDepartamentoSidebarComponent],
  template: `
    <div class="min-h-screen bg-gray-50 flex">
      <app-jefe-departamento-sidebar></app-jefe-departamento-sidebar>
      
      <div class="flex-1 ml-64">
        <app-jefe-departamento-navbar></app-jefe-departamento-navbar>
        
        <main class="p-8">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `
})
export class JefeDepartamentoLayoutComponent {}