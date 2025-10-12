// director/components/sidebar/sidebar.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-director-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html'
})
export class DirectorSidebarComponent {
  menuItems = [
    {
      path: '/director',
      icon: `M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6`,
      label: 'Inicio'
    },
  

   // Cambiar el ítem de categorías en el sidebar

    {
      path: '/director/asignacion',
      icon: `M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2`,
      label: 'Asignaciones'
    },
   // En sidebar.component.ts
{
  path: '/director/gestionar-planes-estudio',
  icon: `M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253`,
  label: 'Planes de Estudio'
},
  {
  path: '/director/gestionar-ciclos-academicos',
  icon: `M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z`,
  label: 'Ciclos Académicos'
},
    {
  path: '/director/gestionar-asignaturas',
  icon: `M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z`,
  label: 'Asignaturas'
},
    {
  path: '/director/gestionar-cursos',
  icon: `M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2`,
  label: 'Gestión de Cursos'
},

  {
      path: '/director/listar-asignaciones',
      icon: `M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4`,
      label: 'Listar Asignaciones'
    },
    {
  path: '/director/registrar-asignacion',
  icon: `M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z`,
  label: 'Asignar Curso'
}
  ];
}