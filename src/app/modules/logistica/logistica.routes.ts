import { Routes } from '@angular/router';
import { roleGuard } from '../../core/guards/role.guard';
import { LogisticaLayoutComponent } from './layouts/layouts.component';
import { LogisticaDashboardComponent } from './logistica-dashboard/logistica-dashboard.component';
import { GestionarAulasComponent } from './gestionar-aulas/gestionar-aulas.component';

export const LOGISTICA_ROUTES: Routes = [
  { 
    path: '',
    component: LogisticaLayoutComponent,
    children: [
      { 
        path: '', 
        component: LogisticaDashboardComponent,
        canActivate: [roleGuard],
        data: { role: 5 }
      },
      { 
        path: 'dashboard', 
        component: LogisticaDashboardComponent,
        canActivate: [roleGuard],
        data: { role: 5 }
      },
      {
        path: 'gestionar-aulas',
        component: GestionarAulasComponent,
        canActivate: [roleGuard],
        data: { role: 5 }
      }
    ]
  }
];