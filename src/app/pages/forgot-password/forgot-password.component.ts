import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="d-flex flex-column flex-root h-100">
      <div class="login login-1 login-signin-on d-flex flex-column flex-lg-row flex-column-fluid bg-white h-100">
        <!-- Aside -->
        <div class="login-aside d-flex flex-column flex-row-auto d-none d-lg-flex" style="background-color: #3699FF; width: 400px;">
          <div class="d-flex flex-column-auto flex-column pt-lg-20 pt-10">
            <a href="#" class="text-center mb-6">
              <img src="assets/media/logos/logo-letter-1.png" class="max-h-50px" alt="" />
            </a>
            <h3 class="font-weight-bolder text-center font-size-h5 font-size-h3-lg" style="color: #ffffff;">
              Optima <br />
              Monitoring System
            </h3>
          </div>
          <div class="aside-img d-flex flex-row-fluid bgi-no-repeat bgi-position-y-bottom bgi-position-x-center"
               style="background-image: url(assets/media/svg/illustrations/login-visual-1.svg)"></div>
        </div>

        <!-- Content -->
        <div class="login-content flex-row-fluid d-flex flex-column justify-content-center position-relative p-4 mx-auto h-100">
          <div class="d-flex flex-column-fluid flex-center">
            <!-- Form -->
            <div class="login-form" style="max-width: 380px; width: 100%;">
              <form class="form" [formGroup]="forgotPasswordForm" (ngSubmit)="onSubmit()">
                <div class="pb-6 pt-lg-0 pt-4 text-center">
                  <h1 class="font-weight-bolder text-dark font-size-h4">Forgotten Password?</h1>
                  <p class="text-muted font-weight-bold font-size-h6">Enter your email to reset your password</p>
                </div>

                <div class="form-group mb-3">
                  <label class="font-size-h7 font-weight-bolder text-dark">Email</label>
                  <input class="form-control form-control-solid h-auto py-3 px-6 rounded-lg font-size-base"
                         type="email" name="email" formControlName="email" autocomplete="off" />
                  <div *ngIf="f['email'].touched && f['email'].errors?.['required']" class="text-danger mt-1 font-size-xs">Email is required</div>
                  <div *ngIf="f['email'].touched && f['email'].errors?.['email']" class="text-danger mt-1 font-size-xs">Please enter a valid email</div>
                </div>

                <div class="pb-lg-0 pb-3 d-flex flex-wrap flex-center">
                  <button type="submit" [disabled]="forgotPasswordForm.invalid || isLoading()"
                          class="btn btn-primary font-weight-bolder font-size-base px-8 py-2 my-2 w-100">
                    <span *ngIf="!isLoading()">Request</span>
                    <span *ngIf="isLoading()" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  </button>
                  <a routerLink="/login" class="btn btn-light-primary font-weight-bolder font-size-base px-8 py-2 my-2 w-100">Cancel</a>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .font-size-h7 { font-size: 0.9rem !important; }
    .font-size-h5 { font-size: 1.15rem !important; }
    .font-size-h3 { font-size: 1.75rem !important; }
    .login-aside { border-right: 1px solid #ebedf3; }
    .form-control-solid {
        background-color: #F3F6F9;
        border-color: #F3F6F9;
        color: #3F4254;
        transition: color 0.15s ease, background-color 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease;
    }
    .form-control-solid:focus {
        background-color: #EBEDF3;
        border-color: #EBEDF3;
        color: #3F4254;
    }
    .flex-root { height: 100vh; display: flex; flex-direction: column; overflow: auto; min-width: 0; }
    .flex-column-fluid { flex: 1 0 auto; min-width: 0; }
    .login-content { max-width: 500px; width: 100%; min-width: 0; }
    @media (max-width: 991.98px) {
      .login-aside {
        display: none !important;
      }
      .login-content {
        padding: 2rem !important;
        margin: auto !important;
      }
    }
    .btn-light-primary {
      color: #3699FF;
      background-color: #E1F0FF;
      border-color: transparent;
    }
    .btn-light-primary:hover {
      color: #FFFFFF;
      background-color: #3699FF;
    }
  `]
})
export class ForgotPasswordComponent {
  forgotPasswordForm: FormGroup;
  isLoading = signal(false);

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  get f() { return this.forgotPasswordForm.controls; }

  onSubmit() {
    if (this.forgotPasswordForm.invalid) return;

    this.isLoading.set(true);
    setTimeout(() => {
      this.isLoading.set(false);
      alert('Password reset link sent to your email!');
      this.router.navigate(['/login']);
    }, 1500);
  }
}
