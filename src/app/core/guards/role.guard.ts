import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, take, filter, catchError, of } from 'rxjs';

export const roleGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const expectedRole = Number(route.data['role']);
  
  const token = localStorage.getItem('token');
  
  if (!token) {
    return router.createUrlTree(['/login']);
  }
  
  const userData = localStorage.getItem('user_data');
  if (userData) {
    try {
      const user = JSON.parse(userData);
      
      if (!authService.getCurrentUser()) {
        authService.setCurrentUser(user);
      }
      
      if (user?.rol?.idRol === expectedRole) {
        return true;
      } else {
        return router.createUrlTree(['/access-denied']);
      }
      
    } catch (error) {
      localStorage.removeItem('user_data');
      return router.createUrlTree(['/login']);
    }
  }
  
  
  const currentUser = authService.getCurrentUser();
  if (currentUser) {
    return checkRole(currentUser, expectedRole, router);
  }
  
  
  return authService.currentUser$.pipe(
    filter(user => user !== null), 
    take(1), 
    map(user => {
      return checkRole(user!, expectedRole, router);
    }),
    catchError((error) => {
      return of(router.createUrlTree(['/login']));
    })
  );
};

function checkRole(user: any, expectedRole: number, router: Router): boolean | import('@angular/router').UrlTree {
  const hasRole = user?.rol?.idRol === expectedRole;
  
  if (hasRole) {
    return true;
  } else {
    return router.createUrlTree(['/access-denied']);
  }
}