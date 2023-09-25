import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AuthStatus } from '../interfaces';

export const isAuthenticatedGuard: CanActivateFn = (route, state) => {

  const authService = inject(AuthService);
  const router = inject(Router);
  
  //Verificamos que el usuario este autenticado
  if(authService.authState() === AuthStatus.authenticated ) return true;

  //Si el usaurio no esta autenticado pero esta en espera de  validacion ( tal ves este autenticado )
  //le negamos el acceso pero no lo regresamos al login
  //if(authService.authState() === AuthStatus.checking) return false;

  //le negamos el acceso y lo regresamos al login
  router.navigateByUrl('/auth/login');
  return false;
};
