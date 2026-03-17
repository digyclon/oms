import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NoSqlAuthService } from '../../services/auth.service';

export function passwordValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) return null;

    const hasUpperCase = /[A-Z]/.test(value || '');
    const hasLowerCase = /[a-z]/.test(value || '');
    const hasNumeric = /[0-9]/.test(value || '');
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value || '');
    const isValid = hasUpperCase && hasLowerCase && hasNumeric && hasSpecialChar;

    if (isValid) return null;

    return {
      passwordStrength: {
        hasUpperCase,
        hasLowerCase,
        hasNumeric,
        hasSpecialChar,
        isValid
      }
    };
  };
}

@Component({
  selector: 'app-register',
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
              <form class="form" [formGroup]="registerForm" (ngSubmit)="onSubmit()">
                <div class="pb-6 pt-lg-0 pt-4 text-center">
                  <h1 class="font-weight-bolder text-dark font-size-h4">Sign Up</h1>
                  <p class="text-muted font-weight-bold font-size-h6">Enter your details to create your account</p>
                </div>

                <div *ngIf="errorMessage()" class="alert alert-custom alert-light-danger fade show mb-6" role="alert">
                  <div class="alert-icon"><i class="fas fa-exclamation-triangle text-danger"></i></div>
                  <div class="alert-text font-weight-bold">{{ errorMessage() }}</div>
                </div>

                <div class="form-group mb-3">
                  <label class="font-size-h7 font-weight-bolder text-dark">Full Name</label>
                  <input class="form-control form-control-solid h-auto py-3 px-6 rounded-lg font-size-base"
                         type="text" name="fullname" formControlName="fullname" autocomplete="off" />
                  <div *ngIf="f['fullname'].touched && f['fullname'].errors?.['required']" class="text-danger mt-1 font-size-xs">Full name is required</div>
                </div>

                <div class="form-group mb-3">
                  <label class="font-size-h7 font-weight-bolder text-dark">Username</label>
                  <input class="form-control form-control-solid h-auto py-3 px-6 rounded-lg font-size-base"
                         type="text" name="username" formControlName="username" autocomplete="off" />
                  <div *ngIf="f['username'].touched && f['username'].errors?.['required']" class="text-danger mt-1 font-size-xs">Username is required</div>
                </div>

                <div class="form-group mb-3">
                  <label class="font-size-h7 font-weight-bolder text-dark">Email</label>
                  <input class="form-control form-control-solid h-auto py-3 px-6 rounded-lg font-size-base"
                         type="email" name="email" formControlName="email" autocomplete="off" />
                  <div *ngIf="f['email'].touched && f['email'].errors?.['required']" class="text-danger mt-1 font-size-xs">Email is required</div>
                  <div *ngIf="f['email'].touched && f['email'].errors?.['email']" class="text-danger mt-1 font-size-xs">Please enter a valid email</div>
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
                  <div *ngIf="f['password'].value" class="mt-2">
                    <div class="font-size-xs" [ngClass]="passwordStrength.hasUpperCase ? 'text-success' : 'text-danger'">
                      <i class="fas fa-check-circle me-1" *ngIf="passwordStrength.hasUpperCase"></i>
                      <i class="fas fa-times-circle me-1" *ngIf="!passwordStrength.hasUpperCase"></i>
                      At least one uppercase letter
                    </div>
                    <div class="font-size-xs" [ngClass]="passwordStrength.hasLowerCase ? 'text-success' : 'text-danger'">
                      <i class="fas fa-check-circle me-1" *ngIf="passwordStrength.hasLowerCase"></i>
                      <i class="fas fa-times-circle me-1" *ngIf="!passwordStrength.hasLowerCase"></i>
                      At least one lowercase letter
                    </div>
                    <div class="font-size-xs" [ngClass]="passwordStrength.hasNumeric ? 'text-success' : 'text-danger'">
                      <i class="fas fa-check-circle me-1" *ngIf="passwordStrength.hasNumeric"></i>
                      <i class="fas fa-times-circle me-1" *ngIf="!passwordStrength.hasNumeric"></i>
                      At least one number
                    </div>
                    <div class="font-size-xs" [ngClass]="passwordStrength.hasSpecialChar ? 'text-success' : 'text-danger'">
                      <i class="fas fa-check-circle me-1" *ngIf="passwordStrength.hasSpecialChar"></i>
                      <i class="fas fa-times-circle me-1" *ngIf="!passwordStrength.hasSpecialChar"></i>
                      At least one special character
                    </div>
                  </div>
                </div>

                <div class="form-group mb-4">
                   <div class="checkbox-inline">
                      <label class="checkbox checkbox-outline checkbox-success font-weight-bold font-size-sm">
                          <input type="checkbox" name="agree" formControlName="agree" />
                          <span></span> I Agree the <a href="javascript:;" class="ms-1 font-weight-bold">terms</a>.
                      </label>
                   </div>
                   <div *ngIf="f['agree'].touched && f['agree'].errors?.['requiredTrue']" class="text-danger mt-1 font-size-xs">You must agree</div>
                </div>

                <div class="pb-lg-0 pb-3">
                  <button type="submit" [disabled]="registerForm.invalid || isLoading()"
                          class="btn btn-primary font-weight-bolder font-size-base px-8 py-2 my-2 w-100">
                    <span *ngIf="!isLoading()">Submit</span>
                    <span *ngIf="isLoading()" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  </button>
                  <div class="text-center mt-3">
                    <a routerLink="/login" class="btn btn-light-primary font-weight-bolder font-size-base px-8 py-2 my-2 w-100">Cancel</a>
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
    .checkbox {
      display: flex;
      align-items: center;
      position: relative;
      padding-left: 30px;
      margin-bottom: 0;
      cursor: pointer;
      font-size: 1rem;
      transition: all 0.3s ease;
    }
    .checkbox input {
      position: absolute;
      z-index: -1;
      opacity: 0;
    }
    .checkbox > span {
      background-color: #F3F6F9;
      position: absolute;
      top: 50%;
      left: 0;
      transform: translateY(-50%);
      height: 20px;
      width: 20px;
      border-radius: 4px;
      transition: all 0.3s ease;
    }
    .checkbox input:checked ~ span {
      background-color: #3699FF;
    }
    .checkbox input:checked ~ span:after {
      display: block;
    }
    .checkbox > span:after {
      content: '';
      position: absolute;
      display: none;
      top: 50%;
      left: 50%;
      margin-left: -2px;
      margin-top: -6px;
      width: 5px;
      height: 10px;
      border: solid #ffffff;
      border-width: 0 2px 2px 0;
      transform: rotate(45deg);
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
    .text-success { color: #1BC5BD !important; }
    .text-danger { color: #F64E60 !important; }
  `]
})
export class RegisterComponent {
  registerForm: FormGroup;
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);
  showPassword = signal(false);

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: NoSqlAuthService
  ) {
    this.registerForm = this.fb.group({
      fullname: ['', [Validators.required]],
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, passwordValidator()]],
      agree: [false, [Validators.requiredTrue]]
    });
  }

  get f() { return this.registerForm.controls; }

  get isPasswordValid() {
    const value = this.f['password'].value;
    if (!value) return false;

    const hasUpperCase = /[A-Z]/.test(value || '');
    const hasLowerCase = /[a-z]/.test(value || '');
    const hasNumeric = /[0-9]/.test(value || '');
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value || '');

    return hasUpperCase && hasLowerCase && hasNumeric && hasSpecialChar;
  }

  get passwordStrength() {
    const value = this.f['password'].value || '';
    return {
      hasUpperCase: /[A-Z]/.test(value),
      hasLowerCase: /[a-z]/.test(value),
      hasNumeric: /[0-9]/.test(value),
      hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value)
    };
  }

  togglePassword() {
    this.showPassword.update(v => !v);
  }

  onSubmit() {
    if (this.registerForm.invalid || !this.isPasswordValid) return;

    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.authService.register(this.registerForm.value).subscribe({
      next: () => {
        this.isLoading.set(false);
        alert('Account created successfully! Please sign in.');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(err.message || 'Registration failed');
      }
    });
  }
}
