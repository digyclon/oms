import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { NoSqlAuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(NoSqlAuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    // Check for required permissions in route data
    const requiredPermission = route.data['permission'] as string;

    if (requiredPermission) {
      const user = authService.currentUser();
      if (user && user.permissions.includes(requiredPermission)) {
        return true;
      } else {
        // Redirect to dashboard if permission is missing
        return router.createUrlTree(['/dashboard']);
      }
    }

    return true;
  }

  // Redirect to login page with return url
  return router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
};
