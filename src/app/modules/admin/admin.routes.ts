import { Routes } from '@angular/router';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { roleGuard } from '../../core/guards/role.guard';
import { AdminLayoutComponent } from './layouts/layouts.component';
import { RegistrarDirectorComponent } from './registrar-director/registrar-director.component';
import { RegistrarEscuelaComponent } from './registrar-escuela/registrar-escuela.component';
import { RegistrarFacultadComponent } from './registrar-facultad/registrar-facultad.component';
import { ListarDirectoresComponent } from './listar-directores/listar-directores.component';
import { ListarFacultadesComponent } from './listar-facultades/listar-facultades.component';
import { ListarEscuelasComponent } from './listar-escuelas/listar-escuelas.component';

export const ADMIN_ROUTES: Routes = [
  { 
    path: '',
    component: AdminLayoutComponent,
    canActivate: [roleGuard], // Protección general
    data: { role: 1 },
    children: [
      { 
        path: '', 
        component: AdminDashboardComponent
      },
      // Rutas de director (manteniendo tu estructura)
      {
        path: 'listar-directores',
        component: ListarDirectoresComponent
      },
      {
  path: 'gestionar-escuelas',
  component: ListarEscuelasComponent
},
{
  path: 'editar-escuela/:id',
  component: RegistrarEscuelaComponent
},
      {
        path: 'registrar-director',
        component: RegistrarDirectorComponent
      },
      {
        path: 'editar-director/:id',
        component: RegistrarDirectorComponent
      },
      // Rutas de facultad
      {
        path: 'registrar-facultad',
        component: RegistrarFacultadComponent
      },
      {
  path: 'gestionar-facultades',
  component: ListarFacultadesComponent
},
{
  path: 'editar-facultad/:id',
  component: RegistrarFacultadComponent
},
      // Rutas de escuela
      {
        path: 'registrar-escuela',
        component: RegistrarEscuelaComponent
      }
    ]
  }
];