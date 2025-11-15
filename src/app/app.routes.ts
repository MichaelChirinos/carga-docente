import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './modules/auth/login/login.component';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { 
    path: 'Administrador', 
    loadChildren: () => import('./modules/admin/admin.routes').then(m => m.ADMIN_ROUTES),
    canActivate: [roleGuard],
    data: { role: 1 } 
  },
  { 
    path: 'Departamento Academico',
    loadChildren: () => import('./modules/director/director.routes').then(m => m.DIRECTOR_ROUTES),
    canActivate: [roleGuard],
    data: { role: 2 } 
  },
  { 
    path: 'Docente',
    loadChildren: () => import('./modules/docente/docente.routes').then(m => m.DOCENTE_ROUTES),
    canActivate: [roleGuard],
    data: { role: 3 } 
  },
  { 
    path: 'Escuela Profesional',
    loadChildren: () => import('./modules/jefe-departamento/jefe-departamento.routes').then(m => m.JEFE_DEPARTAMENTO_ROUTES),
    canActivate: [roleGuard],
    data: { role: 4 } 
  },
  { 
    path: 'Logistica',
    loadChildren: () => import('./modules/logistica/logistica.routes').then(m => m.LOGISTICA_ROUTES),
    canActivate: [roleGuard],
    data: { role: 5 } 
  },
  { path: '**', redirectTo: '' }
];