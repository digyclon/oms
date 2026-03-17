import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NoSqlAuthService } from '../../services/auth.service';
import { passwordValidator } from '../register/register.component';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="d-flex flex-column-fluid">
      <div class="container-fluid p-0">
        <div class="card card-custom card-stretch">
          <!-- Header -->
          <div class="card-header py-3">
            <div class="card-title align-items-start flex-column">
              <h3 class="card-label font-weight-bolder text-dark">Change Password</h3>
              <span class="text-muted font-weight-bold font-size-sm mt-1">Change your account password</span>
            </div>
          </div>

          <!-- Body -->
          <div class="card-body p-6">
            <div class="row justify-content-center">
              <div class="col-xl-6 col-lg-8">
                <form [formGroup]="passwordForm" (ngSubmit)="onSubmit()">
                  <!-- Success/Error Messages -->
                  <div *ngIf="successMessage()" class="alert alert-custom alert-light-success fade show mb-6" role="alert">
                    <div class="alert-icon"><i class="fas fa-check-circle text-success"></i></div>
                    <div class="alert-text font-weight-bold">{{ successMessage() }}</div>
                  </div>
                  <div *ngIf="errorMessage()" class="alert alert-custom alert-light-danger fade show mb-6" role="alert">
                    <div class="alert-icon"><i class="fas fa-exclamation-triangle text-danger"></i></div>
                    <div class="alert-text font-weight-bold">{{ errorMessage() }}</div>
                  </div>

                  <!-- Current Password -->
                  <div class="form-group mb-4">
                    <label class="font-size-h7 font-weight-bolder text-dark">Current Password</label>
                    <div class="position-relative">
                      <input
                        class="form-control form-control-solid h-auto py-3 px-6 rounded-lg font-size-base"
                        [type]="showCurrentPassword() ? 'text' : 'password'"
                        formControlName="currentPassword"
                        placeholder="Enter current password"
                      />
                      <div class="password-toggle-icon" *ngIf="f['currentPassword'].value" (click)="toggleShowCurrentPassword()">
                        <i class="fas" [ngClass]="showCurrentPassword() ? 'fa-eye-slash' : 'fa-eye'"></i>
                      </div>
                    </div>
                    <div *ngIf="f['currentPassword'].touched && f['currentPassword'].errors?.['required']" class="text-danger mt-1 font-size-xs">Current password is required</div>
                  </div>

                  <!-- New Password -->
                  <div class="form-group mb-4">
                    <label class="font-size-h7 font-weight-bolder text-dark">New Password</label>
                    <div class="position-relative">
                      <input
                        class="form-control form-control-solid h-auto py-3 px-6 rounded-lg font-size-base"
                        [type]="showNewPassword() ? 'text' : 'password'"
                        formControlName="newPassword"
                        placeholder="Enter new password"
                      />
                      <div class="password-toggle-icon" *ngIf="f['newPassword'].value" (click)="toggleShowNewPassword()">
                        <i class="fas" [ngClass]="showNewPassword() ? 'fa-eye-slash' : 'fa-eye'"></i>
                      </div>
                    </div>
                    <div *ngIf="f['newPassword'].touched && f['newPassword'].errors?.['required']" class="text-danger mt-1 font-size-xs">New password is required</div>

                    <!-- Password Strength indicators -->
                    <div *ngIf="f['newPassword'].value" class="mt-2">
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
                        At least one special character (e.g., !@#$%^&*)
                      </div>
                    </div>
                  </div>

                  <!-- Confirm Password -->
                  <div class="form-group mb-4">
                    <label class="font-size-h7 font-weight-bolder text-dark">Confirm New Password</label>
                    <div class="position-relative">
                      <input
                        class="form-control form-control-solid h-auto py-3 px-6 rounded-lg font-size-base"
                        [type]="showConfirmPassword() ? 'text' : 'password'"
                        formControlName="confirmPassword"
                        placeholder="Confirm new password"
                      />
                      <div class="password-toggle-icon" *ngIf="f['confirmPassword'].value" (click)="toggleShowConfirmPassword()">
                        <i class="fas" [ngClass]="showConfirmPassword() ? 'fa-eye-slash' : 'fa-eye'"></i>
                      </div>
                    </div>
                    <div *ngIf="f['confirmPassword'].touched && f['confirmPassword'].errors?.['required']" class="text-danger mt-1 font-size-xs">Password confirmation is required</div>
                    <div *ngIf="f['confirmPassword'].touched && passwordForm.errors?.['mismatch']" class="text-danger mt-1 font-size-xs">Passwords do not match</div>
                  </div>

                  <div class="d-flex justify-content-end border-top pt-4 mt-4">
                    <button type="button" routerLink="/dashboard" class="btn btn-light-primary font-weight-bolder px-8 py-2 me-4">Cancel</button>
                    <button type="submit" [disabled]="passwordForm.invalid || isLoading()" class="btn btn-primary font-weight-bolder px-8 py-2">
                      <span *ngIf="!isLoading()">Update Password</span>
                      <span *ngIf="isLoading()" class="spinner-border spinner-border-sm"></span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .form-control-solid { background-color: #F3F6F9; border-color: #F3F6F9; color: #3F4254; }
    .form-control-solid:focus { background-color: #EBEDF3; border-color: #EBEDF3; color: #3F4254; }
    .card-stretch { height: 100%; min-height: calc(100vh - 120px); }
    @media (max-width: 991.98px) {
      .card-stretch { min-height: calc(100vh - 100px); }
    }
    .password-toggle-icon {
      position: absolute;
      top: 50%;
      right: 15px;
      transform: translateY(-50%);
      cursor: pointer;
      color: #7E8299;
      z-index: 10;
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .password-toggle-icon:hover { color: #3699FF; }
    .font-size-h7 { font-size: 0.9rem; }
    .alert-custom { border-radius: 0.42rem; }
    .alert-light-success { background-color: #C9F7F5; border-color: transparent; color: #1BC5BD; }
    .alert-light-danger { background-color: #FFE2E5; border-color: transparent; color: #F64E60; }
  `]
})
export class ChangePasswordComponent {
  passwordForm: FormGroup;
  isLoading = signal(false);
  successMessage = signal<string | null>(null);
  errorMessage = signal<string | null>(null);

  showCurrentPassword = signal(false);
  showNewPassword = signal(false);
  showConfirmPassword = signal(false);

  constructor(
    private fb: FormBuilder,
    private authService: NoSqlAuthService,
    private router: Router
  ) {
    this.passwordForm = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, passwordValidator()]],
      confirmPassword: ['', [Validators.required, passwordValidator()]]
    }, { validators: this.passwordMatchValidator });
  }

  get f() { return this.passwordForm.controls; }

  get passwordStrength() {
    const value = this.f['newPassword'].value || '';
    return {
      hasUpperCase: /[A-Z]/.test(value),
      hasLowerCase: /[a-z]/.test(value),
      hasNumeric: /[0-9]/.test(value),
      hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value)
    };
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('newPassword')?.value === g.get('confirmPassword')?.value
      ? null : { mismatch: true };
  }

  toggleShowCurrentPassword() { this.showCurrentPassword.update(v => !v); }
  toggleShowNewPassword() { this.showNewPassword.update(v => !v); }
  toggleShowConfirmPassword() { this.showConfirmPassword.update(v => !v); }

  onSubmit() {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    const { currentPassword, newPassword } = this.passwordForm.value;

    this.authService.changePassword(currentPassword, newPassword).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.successMessage.set('Password changed successfully!');
        this.passwordForm.reset();
        // Redirect to dashboard after a delay
        setTimeout(() => this.router.navigate(['/dashboard']), 2000);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(err.message || 'Failed to change password');
      }
    });
  }
}
