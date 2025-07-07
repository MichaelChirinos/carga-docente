import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { AdminNavbarComponent } from '../components/navbar/navbar.component';
import { AdminSidebarComponent } from '../components/sidebar/sidebar.component';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, AdminNavbarComponent, AdminSidebarComponent],
  template: `
    <div class="min-h-screen bg-gray-50 flex">
      <app-admin-sidebar></app-admin-sidebar>
      
      <div class="flex-1 ml-64">
        <app-admin-navbar></app-admin-navbar>
        
        <main class="p-8">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `
})
export class AdminLayoutComponent {}