import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map } from 'rxjs/operators';

export const roleGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const expectedRole = Number(route.data['role']); // 👈 Convertir a número

  return authService.currentUser$.pipe(
    map(user => {
      const hasRole = user?.idRol === expectedRole; // ✅ Ahora compara número vs número
      return hasRole || router.createUrlTree(['/login']);
    })
  );
};