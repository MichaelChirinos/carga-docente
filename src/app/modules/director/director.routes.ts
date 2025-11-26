import { Routes } from '@angular/router';
import { DirectorDashboardComponent } from './director-dashboard/director-dashboard.component';
import { AsignacionComponent } from './asignacion/asignacion.component';
import { RegistrarPlanEstudioComponent } from './registrar-plan-estudio/registrar-plan-estudio.component';
import { roleGuard } from '../../core/guards/role.guard';
import { RegistrarCicloAcademicoComponent } from './registrar-ciclo-academico/registrar-ciclo-academico.component';
import { RegistrarAsignaturaComponent } from './registrar-asignatura/registrar-asignatura.component';
import { RegistrarCursoComponent } from './registrar-curso/registrar-curso.component';
import { DirectorLayoutComponent } from './layouts/layouts.component';
import { ListarPlanesEstudioComponent } from './listar-planes-estudio/listar-planes-estudio.component';
import { ListarCiclosAcademicosComponent } from './listar-ciclos-academicos/listar-ciclos-academicos.component';
import { ListarAsignaturasComponent } from './listar-asignaturas/listar-asignaturas.component';
import { ListarCursosComponent } from './listar-cursos/listar-cursos.component';
import { ListarAsignacionesComponent } from './listar-asignaciones-docente/listar-asignaciones-docente.component';
import { GestionarHorariosComponent } from './gestionar-horarios/gestionar-horarios.component';
import { RegistrarAsignacionComponent } from './registrar-asignacion/registrar-asignacion.component';
import { ListarAsignacionesCargaComponent } from './listar-asignaciones-carga/listar-asignaciones-carga.component';
import { ListarAsignacionesEscuelaComponent } from './listar-asignaciones-escuelas/listar-asignaciones-escuelas.component';
import { GestionarCargasComponent } from './gestionar-cargas/gestionar-cargas.component';
import { GestionarReportesComponent } from './gestionar-reportes/gestionar-reportes.component';

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
  path: 'asignaciones/carga',
  component: ListarAsignacionesCargaComponent,
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
  path: 'gestionar-planes-estudio',
  component: ListarPlanesEstudioComponent,
  canActivate: [roleGuard],
  data: { role: 2 }
},

 // Modificar las rutas existentes



{
    path: 'registrar-plan-estudio',
    component: RegistrarPlanEstudioComponent,
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
  path: 'gestionar-horarios/:idCurso',
  component: GestionarHorariosComponent,
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
  path: 'registrar-asignacion',
  component: RegistrarAsignacionComponent,
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
  path: 'asignaciones/escuela',
  component: ListarAsignacionesEscuelaComponent,
  canActivate: [roleGuard],
  data: { role: 2 }
},
 {
        path: 'listar-asignaciones',
        component: ListarAsignacionesComponent,
        canActivate: [roleGuard],
        data: { role: 2 }
      },
      { path: 'gestionar-cargas', 
        component: GestionarCargasComponent,
      canActivate: [roleGuard],
        data: { role: 2 } 
      },
      {
        path: 'generar-reportes',
        component: GestionarReportesComponent,
        canActivate: [roleGuard],
        data: { role: 2 }
      }

    ]
  }
];