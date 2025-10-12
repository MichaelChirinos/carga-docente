import { Routes } from '@angular/router';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { roleGuard } from '../../core/guards/role.guard';
import { AdminLayoutComponent } from './layouts/layouts.component';
import { RegistrarDirectorComponent } from './registrar-director/registrar-director.component';
import { RegistrarEscuelaComponent } from './registrar-escuela/registrar-escuela.component';
import { ListarDirectoresComponent } from './listar-directores/listar-directores.component';
import { ListarEscuelasComponent } from './listar-escuelas/listar-escuelas.component';
import { AlgoritmoFormComponent } from './algoritmo-form/algoritmo-form.component';
import { ListarAlgoritmosComponent } from './listar-algoritmos/listar-algoritmos.component';
import { RegistrarLogisticaComponent } from './registrar-logistica/registrar-logistica.component';
import {GestionarLogisticaComponent} from './gestionar-logistica/gestionar-logistica.component';
import { GestionarJefesDepartamentoComponent } from './gestionar-jefes-departamento/gestionar-jefes-departamento.component';
import { RegistrarJefeDepartamentoComponent } from './registrar-jefe-departamento/registrar-jefe-departamento.component';
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
     {
  path: 'gestionar-jefes-departamento',
  component: GestionarJefesDepartamentoComponent
},
{
  path: 'registrar-jefe-departamento',
  component: RegistrarJefeDepartamentoComponent
},
{
  path: 'personal-logistica',
  component: GestionarLogisticaComponent
},
     {
  path: 'gestionar-personal-logistica',
  component: RegistrarLogisticaComponent
},
 
{
  path: 'configuracion-algoritmo',
  component: AlgoritmoFormComponent,
},
{
  path: 'listar-algoritmos',
  component: ListarAlgoritmosComponent
},
      // Rutas de escuela
      {
        path: 'registrar-escuela',
        component: RegistrarEscuelaComponent
      }
    ]
  }
];