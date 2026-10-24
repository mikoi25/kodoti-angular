import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FormUtils } from '../../../utils/form-utils';
import { authService } from '../../services/auth.service';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-auth-login',
  styleUrl: './auth-login.css',
  templateUrl: './auth-login.html',
})
export class AuthLogin {

   fb = inject(FormBuilder);
  hasError = signal(false);
  isPosting =signal(false);
  router = inject(Router);
  formUtils = FormUtils;
  authService = inject(authService);

  loginForm = this.fb.group({
    email: [
      '',
      [Validators.required, Validators.pattern(FormUtils.emailPattern)],
      [FormUtils.checkingServerResponse],
    ],
    password:['',[Validators.required,Validators.minLength(6)]]
  });


  onSubmit(){
    if(this.loginForm.invalid){
      this.hasError.set(true);
      setTimeout(() => {
       this.hasError.set(false);
      }, 2000);
      return ;
     }

    const { email = '', password= ''} = this.loginForm.value;
     console.log('email ',email);
     console.log('password', password);
     this.authService
         .authentication({Email:email!,Password:password!})
           .subscribe();

   }
 }