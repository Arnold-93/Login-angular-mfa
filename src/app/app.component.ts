import { Component, computed, effect, inject } from '@angular/core';
import { AuthService } from './auth/services/auth.service';
import { AuthStatus } from './auth/interfaces';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  private authService = inject(AuthService);
  private router = inject(Router);
  loading: boolean = false;

  public valueLoading = computed(() => this.authService.loading());

  public isLoading = effect(()=> {
     this.loading = this.authService.loading();
  })
 
  

  //si la aplicacion se refresca validamos que el usuario este autenticado
  // por el momneto mostramos un mesaje de loading ya que se encuenta en el estado de cheking
  public finishedAuthCheck = computed<boolean>( () => {
    if(this.authService.authState() === AuthStatus.checking) return false;

    return true;
  })

  //en nuestro componente principal cuando el estado cambia va detectar el effect y va disparar la redirecciones
  // recordar que toda la aplicacion pasa siempre por este componente PRINCIPAL
  public authStatusChangeEffect = effect(() => {
    switch (this.authService.authState()) {
      case AuthStatus.checking:
        return;
      case AuthStatus.authenticated:
        this.router.navigateByUrl('/dashboard')
        return;
      case AuthStatus.notAuthenticated:
        this.router.navigateByUrl('/auth/login')
        return;
  
    }

  })
 
}
