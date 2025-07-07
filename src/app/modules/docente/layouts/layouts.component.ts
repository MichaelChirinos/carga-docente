import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { DocenteNavbarComponent } from '../components/navbar/navbar.component';
import { DocenteSidebarComponent } from '../components/sidebar/sidebar.component';

@Component({
  selector: 'app-docente-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, DocenteNavbarComponent, DocenteSidebarComponent],
  template: `
    <div class="min-h-screen bg-gray-50 flex">
      <app-docente-sidebar></app-docente-sidebar>
      
      <div class="flex-1 ml-64">
        <app-docente-navbar></app-docente-navbar>
        
        <main class="p-8">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `
})
export class DocenteLayoutComponent {}
