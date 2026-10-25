import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { authService } from '../../services/auth.service';
import { FormUtils } from '../../../utils/form-utils';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-auth-login',
  styleUrl: './auth-login.css',
  templateUrl: './auth-login.html',
})
export class AuthLogin {
    authService = inject(authService);
  fb = inject(FormBuilder);
  formUtils = FormUtils;
  loginForm = this.fb.group({
    email: [
      '',
      [Validators.required, Validators.pattern(FormUtils.emailPattern)],
      [FormUtils.checkingServerResponse],
    ],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }

    const { email = '', password = '' } = this.loginForm.value;

     this.authService
         .authentication({Email:email!,Password:password!})
           .subscribe();
  }
}
