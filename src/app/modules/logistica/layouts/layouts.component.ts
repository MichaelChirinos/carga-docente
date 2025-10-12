import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { LogisticaNavbarComponent } from '../components/navbar/navbar.component';
import { LogisticaSidebarComponent } from '../components/sidebar/sidebar.component';

@Component({
  selector: 'app-logistica-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, LogisticaNavbarComponent, LogisticaSidebarComponent],
  template: `
    <div class="min-h-screen bg-gray-50 flex">
      <app-logistica-sidebar></app-logistica-sidebar>
      
      <div class="flex-1 ml-64">
        <app-logistica-navbar></app-logistica-navbar>
        
        <main class="p-8">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `
})
export class LogisticaLayoutComponent {}