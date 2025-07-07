import { Routes } from '@angular/router';
import { DirectorDashboardComponent } from './director-dashboard/director-dashboard.component';
import { AsignacionComponent } from './asignacion/asignacion.component';
import { RegistrarDocenteComponent } from './registrar-docente/registrar-docente.component';
import { RegistrarCategoriaComponent } from './registrar-categoria/registrar-categoria.component';
import { RegistrarDedicacionComponent } from './registrar-dedicacion/registrar-dedicacion.component';
import { ListarDocentesComponent } from './listar-docentes/listar-docentes.component';
import { RegistrarPlanEstudioComponent } from './registrar-plan-estudio/registrar-plan-estudio.component';
import { roleGuard } from '../../core/guards/role.guard';
import { RegistrarCicloAcademicoComponent } from './registrar-ciclo-academico/registrar-ciclo-academico.component';
import { RegistrarAsignaturaComponent } from './registrar-asignatura/registrar-asignatura.component';
import { RegistrarCursoComponent } from './registrar-curso/registrar-curso.component';
import { DirectorLayoutComponent } from './layouts/layouts.component';
import { ListarCategoriasComponent } from './listar-categorias/listar-categorias.component';
import { ListarDedicacionesComponent } from './listar-dedicaciones/listar-dedicaciones.component';
import { ListarPlanesEstudioComponent } from './listar-planes-estudio/listar-planes-estudio.component';
import { ListarCiclosAcademicosComponent } from './listar-ciclos-academicos/listar-ciclos-academicos.component';
import { ListarAsignaturasComponent } from './listar-asignaturas/listar-asignaturas.component';
import { ListarCursosComponent } from './listar-cursos/listar-cursos.component';
import { ListarAsignacionesDocenteComponent } from './listar-asignaciones-docente/listar-asignaciones-docente.component';

export const DIRECTOR_ROUTES: Routes = [
  { 
      path: '',
      component: DirectorLayoutComponent,
      children: [
  { 
    path: '', 
    component: DirectorDashboardComponent,
    canActivate: [roleGuard],
    data: { role: 2 }
  },
  {
    path: 'asignacion',
    component: AsignacionComponent,
    canActivate: [roleGuard],
    data: { role: 2 }
  },
  {
  path: 'gestionar-ciclos-academicos',
  component: ListarCiclosAcademicosComponent,
  canActivate: [roleGuard],
  data: { role: 2 }
},
{
  path: 'editar-ciclo-academico/:id',
  component: RegistrarCicloAcademicoComponent,
  canActivate: [roleGuard],
  data: { role: 2 }
},
  {
    path: 'registrar-docente',
    component: RegistrarDocenteComponent,
    canActivate: [roleGuard],
    data: { role: 2 }
  },
{
  path: 'registrar-dedicacion',
  component: RegistrarDedicacionComponent,
  canActivate: [roleGuard],
  data: { role: 2 }
},
  {
  path: 'gestionar-dedicaciones',
  component: ListarDedicacionesComponent,
  canActivate: [roleGuard],
  data: { role: 2 }
},
{
  path: 'gestionar-planes-estudio',
  component: ListarPlanesEstudioComponent,
  canActivate: [roleGuard],
  data: { role: 2 }
},
{
  path: 'editar-dedicacion/:id',
  component: RegistrarDedicacionComponent,
  canActivate: [roleGuard],
  data: { role: 2 }
},
 // Modificar las rutas existentes
{
  path: 'gestionar-categorias',
  component: ListarCategoriasComponent,
  canActivate: [roleGuard],
  data: { role: 2 }
},
{
  path: 'registrar-categoria',
  component: RegistrarCategoriaComponent,
  canActivate: [roleGuard],
  data: { role: 2 }
},
{
  path: 'editar-categoria/:id',
  component: RegistrarCategoriaComponent,
  canActivate: [roleGuard],
  data: { role: 2 }
},
  {
  path: 'listar-docentes',
  component: ListarDocentesComponent,
  canActivate: [roleGuard],
  data: { role: 2 }
},
{
    path: 'registrar-plan-estudio',
    component: RegistrarPlanEstudioComponent,
    canActivate: [roleGuard],
    data: { role: 2 }
  },
  {
  path: 'gestionar-docentes',
  component: ListarDocentesComponent, // Usamos el componente de listado como principal
  canActivate: [roleGuard],
  data: { role: 2 }
},
   {
    path: 'registrar-ciclo-academico',
    component: RegistrarCicloAcademicoComponent,
    canActivate: [roleGuard],
    data: { role: 2 }
  },
    {
    path: 'registrar-asignatura',
    component: RegistrarAsignaturaComponent,
    canActivate: [roleGuard],
    data: { role: 2 }
  },
  {
  path: 'gestionar-asignaturas',
  component: ListarAsignaturasComponent,
  canActivate: [roleGuard],
  data: { role: 2 }
},
{
  path: 'editar-asignatura/:id',
  component: RegistrarAsignaturaComponent,
  canActivate: [roleGuard],
  data: { role: 2 }
},
{
  path: 'gestionar-cursos',
  component: ListarCursosComponent,
  canActivate: [roleGuard],
  data: { role: 2 }
},
{
  path: 'editar-curso/:id',
  component: RegistrarCursoComponent,
  canActivate: [roleGuard],
  data: { role: 2 }
},
  {
    path: 'registrar-curso',
    component: RegistrarCursoComponent,
    canActivate: [roleGuard],
    data: { role: 2 }
  },
  {
  path: 'editar-docente/:id',
  component: RegistrarDocenteComponent,
  canActivate: [roleGuard],
  data: { role: 2 }
},
 {
        path: 'listar-asignaciones',
        component: ListarAsignacionesDocenteComponent,
        canActivate: [roleGuard],
        data: { role: 2 }
      }
    ]
  }
];