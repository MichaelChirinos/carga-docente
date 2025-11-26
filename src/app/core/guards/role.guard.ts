import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map } from 'rxjs/operators';

// En role.guard.ts
export const roleGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const expectedRole = Number(route.data['role']);

  return authService.currentUser$.pipe(
    map(user => {
      const hasRole = user?.rol?.idRol === expectedRole;
      return hasRole || router.createUrlTree(['/login']);
    })
  );
};