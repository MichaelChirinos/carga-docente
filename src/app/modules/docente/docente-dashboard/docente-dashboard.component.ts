import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-docente-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-4xl mx-auto bg-white rounded-xl shadow-sm p-6">
      <h1 class="text-2xl font-bold text-gray-800 mb-4">Bienvenido al Panel Docente</h1>
      <p class="text-gray-600 mb-6">Selecciona una opción del menú lateral para comenzar.</p>
      
      <div class="bg-blue-50/50 p-5 rounded-lg border border-blue-200">
        <p class="text-blue-800 font-medium">
          <span class="font-bold">📌 Recordatorio:</span> Registra tu disponibilidad y preferencias.
        </p>
      </div>
    </div>
  `
})
export class DocenteDashboardComponent {}