import { Routes } from '@angular/router';
import { roleGuard } from '../../core/guards/role.guard';
import { JefeDepartamentoLayoutComponent } from './layouts/layouts.component';
import { JefeDepartamentoDashboardComponent } from './jefe-departamento-dashboard/jefe-departamento-dashboard.component';
import { RegistrarDedicacionComponent } from './registrar-dedicacion/registrar-dedicacion.component';
import { ListarDedicacionesComponent } from './listar-dedicaciones/listar-dedicaciones.component';
import { RegistrarDocenteComponent } from './registrar-docente/registrar-docente.component';
import { RegistrarCategoriaComponent } from './registrar-categoria/registrar-categoria.component';
import { ListarDocentesComponent } from './listar-docentes/listar-docentes.component';
import { ListarCategoriasComponent } from './listar-categorias/listar-categorias.component';
import { GestionarEspecializacionesComponent } from './gestionar-especializaciones/gestionar-especializaciones.component';
import { GestionarPreferenciasComponent } from './gestionar-preferencias/gestionar-preferencias.component';
import { GestionarDisponibilidadesComponent } from './gestionar-disponibilidades/gestionar-disponibilidades.component';

export const JEFE_DEPARTAMENTO_ROUTES: Routes = [
  { 
    path: '',
    component: JefeDepartamentoLayoutComponent,
    children: [
      { 
        path: '', 
        component: JefeDepartamentoDashboardComponent,
        canActivate: [roleGuard],
        data: { role: 4 }
      },
      { 
        path: 'dashboard', 
        component: JefeDepartamentoDashboardComponent,
        canActivate: [roleGuard],
        data: { role: 4 }
      },
      {
        path: 'registrar-dedicacion',
        component: RegistrarDedicacionComponent,
        canActivate: [roleGuard],
        data: { role: 4 }
      },
        {
        path: 'gestionar-dedicaciones',
        component: ListarDedicacionesComponent,
        canActivate: [roleGuard],
        data: { role: 4 }
      },
      {
    path: 'registrar-docente',
    component: RegistrarDocenteComponent,
    canActivate: [roleGuard],
    data: { role: 4 }
  },
  {
    path: 'editar-dedicacion/:id',
    component: RegistrarDedicacionComponent,
    canActivate: [roleGuard],
    data: { role: 4 }
  },
  {
    path: 'registrar-categoria',
    component: RegistrarCategoriaComponent,
    canActivate: [roleGuard],
    data: { role: 4 }
  },
  {
    path: 'editar-categoria/:id',
    component: RegistrarCategoriaComponent,
    canActivate: [roleGuard],
    data: { role: 4 }
  },
    {
    path: 'gestionar-docentes',
    component: ListarDocentesComponent,
    canActivate: [roleGuard],
    data: { role: 4 }
  },
    {
    path: 'editar-docente/:id',
    component: RegistrarDocenteComponent,
    canActivate: [roleGuard],
    data: { role: 4 }
  },
  {
  path: 'gestionar-preferencias',
  component: GestionarPreferenciasComponent,
  canActivate: [roleGuard],
  data: { role: 4 }
},
    {
    path: 'listar-docentes',
    component: ListarDocentesComponent,
    canActivate: [roleGuard],
    data: { role: 4 }
  },
  {
  path: 'gestionar-disponibilidades',
  component: GestionarDisponibilidadesComponent,
  canActivate: [roleGuard],
  data: { role: 4 }
},
  {
  path: 'gestionar-categorias',
  component: ListarCategoriasComponent,
  canActivate: [roleGuard],
  data: { role: 4 }
},
    {
        path: 'gestionar-especializaciones',
        component: GestionarEspecializacionesComponent,
        canActivate: [roleGuard],
        data: { role: 4 }
      },
    ]
  }
];