import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-jefe-departamento-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html'
})
export class JefeDepartamentoSidebarComponent {
  menuItems = [
    {
      path: '/Escuela Profesional',
      icon: `M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6`,
      label: 'Inicio'
    },
    {
  path: '/Escuela Profesional/gestionar-categorias',
  icon: `M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4`,
  label: 'Categorías Docentes'
},
     {
      path: '/Escuela Profesional/gestionar-docentes', // Cambiado a ruta unificada
      icon: `M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z`,
      label: 'Gestionar Docentes' // Nuevo nombre
    },
     {
  path: '/Escuela Profesional/gestionar-dedicaciones',
  icon: `M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2`,
  label: 'Dedicaciones'
},
 {
    path: '/Escuela Profesional/gestionar-especializaciones',
    icon: `M12 14l9-5-9-5-9 5 9 5z M12 14l9-5-9-5-9 5 9 5z`,

    label: 'Especializaciones'
  },
  {
  path: '/Escuela Profesional/gestionar-preferencias',
  icon: `M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z`,
  label: 'Preferencias Docentes'
},
{
  path: '/Escuela Profesional/gestionar-disponibilidades',
  icon: `M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z`,
  label: 'Disponibilidades'
}
  ];
}