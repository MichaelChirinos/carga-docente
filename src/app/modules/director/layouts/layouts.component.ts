// director/layouts/layout.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { DirectorNavbarComponent } from '../components/navbar/navbar.component';
import { DirectorSidebarComponent } from '../components/sidebar/sidebar.component';

@Component({
  selector: 'app-director-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, DirectorNavbarComponent, DirectorSidebarComponent],
  template: `
    <div class="min-h-screen bg-gray-50 flex">
      <app-director-sidebar></app-director-sidebar>
      
      <div class="flex-1 ml-64">
        <app-director-navbar></app-director-navbar>
        
        <main class="p-8">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `
})
export class DirectorLayoutComponent {}