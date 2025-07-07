import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './modules/auth/login/login.component';
import { roleGuard } from './core/guards/role.guard';


export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { 
    path: 'admin', 
    loadChildren: () => import('./modules/admin/admin.routes').then(m => m.ADMIN_ROUTES),
    canActivate: [roleGuard],
    data: { role: 1 } 
  },
 {
  path: 'director',
  loadChildren: () => import('./modules/director/director.routes').then(m => m.DIRECTOR_ROUTES),
      canActivate: [roleGuard],
    data: { role:2 } 

},
  { 
    path: 'docente',
    loadChildren: () => import('./modules/docente/docente.routes').then(m => m.DOCENTE_ROUTES),
    canActivate: [roleGuard],
    data: { role: 3 } // Ejemplo: 3 = docente
  },
  { path: '**', redirectTo: '' }
];