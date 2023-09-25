import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.css']
})
export class RegisterPageComponent {

  private fb = inject(FormBuilder);

  public myForm = this.fb.group({
    usernames: ['', [Validators.required, Validators.minLength(6)]],
    password:['', [Validators.required, Validators.minLength(6)]],
    rol:['', [Validators.required]]
  })

  insert(){
    console.log(this.myForm.value);
    
  }

}
