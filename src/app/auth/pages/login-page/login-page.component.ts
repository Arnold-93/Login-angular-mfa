import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})

export class LoginPageComponent {

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private toastr = inject(ToastrService);
  private router = inject(Router);
  codMfa:boolean = false;

  public myForm = this.fb.group({
    userName: [ '',Validators.required ],
    password: [ '',[Validators.required, Validators.minLength(6)]],
    mfa: ['']
  })

  login(){
    const { userName, password } = this.myForm.value;
    this.authService.login(userName!, password! ).subscribe({
      next: ( () => { 
          this.codMfa = true; 
          console.log('Login correcto') 
      }),
      error: ((err) => {
        this.toastr.error(err)
      } )
    })

  }

  confirMfa() {
    const { mfa } = this.myForm.value;
    this.authService.mfaCode(mfa!).subscribe({
      next: ( () => { 
        console.log('codigo Mfa correcto')
        this.router.navigateByUrl('/dashboard')
      }),
      error: ((err) => this.toastr.error(err))
    })

  }

  resetForm(){
    this.codMfa = false; 
    this.myForm.reset();
  }

}
