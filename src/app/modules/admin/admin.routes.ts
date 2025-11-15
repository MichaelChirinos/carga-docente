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
import { GestionarEscuelasProfesionalesComponent } from './gestionar-escuelas-profesionales/gestionar-escuelas-profesionales.component';
import { RegistrarEscuelaProfesionalComponent } from './registrar-escuela-profesional/registrar-escuela-profesional.component';
import { GestionarDepartamentosAcademicosComponent } from './gestionar-departamentos-academicos/gestionar-departamentos-academicos.component';
import { RegistrarDepartamentoAcademicoComponent } from './registrar-departamento-academico/registrar-departamento-academico.component';

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
      {
        path: 'gestionar-escuelas-profesionales', // Cambiado de 'gestionar-jefes-departamento'
        component: GestionarEscuelasProfesionalesComponent
      },
      {
        path: 'registrar-escuela-profesional', // Cambiado de 'registrar-jefe-departamento'
        component: RegistrarEscuelaProfesionalComponent
      },
      {
        path: 'editar-escuela-profesional/:id', // Nueva ruta para editar
        component: RegistrarEscuelaProfesionalComponent
      },
      // Rutas de director (manteniendo tu estructura)
      {
        path: 'listar-directores', // Cambiar nombre para ser más específico
        component: GestionarDepartamentosAcademicosComponent
      },
      {
        path: 'registrar-director',
        component: RegistrarDepartamentoAcademicoComponent
      },
      {
        path: 'editar-director/:id',
        component: RegistrarDepartamentoAcademicoComponent
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