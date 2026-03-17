import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NoSqlAuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
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
            <div class="login-form login-signin" style="max-width: 380px; width: 100%;">
              <form class="form" [formGroup]="loginForm" (ngSubmit)="onLogin()">
                <div class="pb-6 pt-lg-0 pt-4 text-center">
                  <h1 class="font-weight-bolder text-dark font-size-h4">OMS</h1>
                  <p class="text-muted font-weight-bold font-size-h6">Optima Monitoring System</p>
                </div>

                <div *ngIf="errorMessage()" class="alert alert-custom alert-light-danger fade show mb-6" role="alert">
                  <div class="alert-icon"><i class="fas fa-exclamation-triangle text-danger"></i></div>
                  <div class="alert-text font-weight-bold">{{ errorMessage() }}</div>
                </div>

                <div class="form-group mb-3">
                  <label class="font-size-h7 font-weight-bolder text-dark">Username</label>
                  <input class="form-control form-control-solid h-auto py-3 px-6 rounded-lg font-size-base"
                         type="text" name="username" formControlName="username" autocomplete="off" />
                  <div *ngIf="f['username'].touched && f['username'].errors?.['required']" class="text-danger mt-1 font-size-xs">Username is required</div>
                  <div class="mt-2 font-size-xs text-muted">
                    Try: <b>omsadmin</b> or <b>omsuser</b> (pw: <b>password123</b>)
                  </div>
                </div>

                <div class="form-group mb-3">
                  <label class="font-size-h7 font-weight-bolder text-dark">Password</label>
                  <div class="position-relative">
                    <input class="form-control form-control-solid h-auto py-3 px-6 rounded-lg font-size-base"
                           [type]="showPassword() ? 'text' : 'password'" name="password" formControlName="password"
                           autocomplete="off" style="padding-right: 45px !important;" />
                    <div class="password-toggle-icon" *ngIf="f['password'].value" (click)="togglePassword()">
                      <i class="fas" [ngClass]="showPassword() ? 'fa-eye-slash' : 'fa-eye'"></i>
                    </div>
                  </div>
                  <div *ngIf="f['password'].touched && f['password'].errors?.['required']" class="text-danger mt-1 font-size-xs">Password is required</div>
                </div>

                <div class="pb-lg-0 pb-3">
                  <button type="submit" [disabled]="loginForm.invalid || isLoading()"
                          class="btn btn-primary font-weight-bolder font-size-base px-8 py-2 my-2 w-100">
                    <span *ngIf="!isLoading()">Sign In</span>
                    <span *ngIf="isLoading()" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  </button>
                  <div class="text-center mt-3">
                    <span class="text-muted font-weight-bold font-size-base">New Here?
                      <a routerLink="/register" class="text-primary font-weight-bolder">Create an Account</a>
                    </span>
                    <div class="mt-1">
                      <a routerLink="/forgot-password" class="text-primary font-size-base font-weight-bolder text-hover-primary">Forgot Password?</a>
                    </div>
                  </div>
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
    .login-container { height: 100%; }
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
    .alert-custom {
        display: flex;
        align-items: stretch;
        padding: 1rem 1.5rem;
        border-radius: 0.42rem;
    }
    .alert-custom .alert-icon {
        display: flex;
        align-items: center;
        padding: 0 1.25rem 0 0;
    }
    .cursor-pointer { cursor: pointer; }
    .input-group-solid {
      background-color: #F3F6F9;
      border: 0;
    }
    .input-group-solid .form-control-solid {
      background-color: transparent;
    }
    .input-group-solid .input-group-text {
      background-color: transparent;
      color: #3F4254;
    }
    .password-toggle-icon {
      position: absolute;
      top: 50%;
      right: 15px;
      transform: translateY(-50%);
      cursor: pointer;
      color: #7E8299;
      z-index: 10;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 30px;
      height: 30px;
    }
    .password-toggle-icon:hover {
      color: #3699FF;
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);
  showPassword = signal(false);

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: NoSqlAuthService
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  get f() { return this.loginForm.controls; }

  togglePassword() {
    this.showPassword.update(v => !v);
  }

  onLogin() {
    if (this.loginForm.invalid) return;

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const { username, password } = this.loginForm.value;

    this.authService.login(username, password).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(err.message || 'Login failed');
      }
    });
  }
}
