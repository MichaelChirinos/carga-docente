import { Routes } from '@angular/router';
import { DocenteLayoutComponent } from './layouts/layouts.component';
import { roleGuard } from '../../core/guards/role.guard';
import { DocenteDashboardComponent } from './docente-dashboard/docente-dashboard.component';
import { RegistrarDisponibilidadComponent } from './registrar-disponibilidad/registrar-disponibilidad.component';
import { RegistrarPreferenciaComponent } from './registrar-preferencia/registrar-preferencia.component';
import { ListarDisponibilidadComponent } from './listar-disponibilidad/listar-disponibilidad.component';
import { ListarPreferenciaComponent } from './listar-preferencia/listar-preferencia.component';

export const DOCENTE_ROUTES: Routes = [
  { 
    path: '',
    component: DocenteLayoutComponent,
    children: [
      { 
        path: '', 
        component: DocenteDashboardComponent,
        canActivate: [roleGuard],
        data: { role: 3 }
      },
      {
        path: 'registrar-disponibilidad',
        component: RegistrarDisponibilidadComponent,
        canActivate: [roleGuard],
        data: { role: 3 }
      },
      {
        path: 'registrar-preferencia',
        component: RegistrarPreferenciaComponent,
        canActivate: [roleGuard],
        data: { role: 3 }
      },
{
  path: 'gestionar-disponibilidad',
  component: ListarDisponibilidadComponent,
          canActivate: [roleGuard],

  data: { role: 3 }
},
{
  path: 'editar-disponibilidad/:id',
  component: RegistrarDisponibilidadComponent,
  canActivate: [roleGuard],
  data: { role: 3 }
},
{
  path: 'gestionar-preferencia',
  component: ListarPreferenciaComponent,
  data: { role: 3}
},
{
  path: 'editar-preferencia/:id',
  component: RegistrarPreferenciaComponent,
  data: { role: 3 }
}
    ]
  }
];