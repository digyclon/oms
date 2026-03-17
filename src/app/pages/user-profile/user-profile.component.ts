import { Component, signal, SecurityContext, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NoSqlAuthService, User } from '../../services/auth.service';
import { QuillModule } from 'ngx-quill';
import { passwordValidator } from '../register/register.component';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, QuillModule],
  template: `
    <div class="card card-custom card-stretch">
      <!-- Header -->
      <div class="card-header py-3">
        <div class="card-title align-items-start flex-column">
          <h3 class="card-label font-weight-bolder text-dark">User Profile</h3>
          <span class="text-muted font-weight-bold font-size-sm mt-1">Update your personal information</span>
        </div>
      </div>

      <!-- Body -->
      <div class="card-body p-6">
        <div class="row">
          <!-- Sidebar: Profile Pic & Password -->
          <div class="col-xl-3 col-lg-4">
            <div class="flex-column">
              <!-- Profile Picture -->
              <div class="card card-custom card-stretch gutter-b bg-light-primary border-0 p-5 text-center mb-6">
                 <div class="symbol symbol-120 mb-4 mx-auto overflow-hidden">
                    <div class="symbol-label rounded-circle border border-white border-4 shadow-sm" [style.backgroundImage]="'url(' + (avatarPreview() || 'assets/media/users/default.jpg') + ')'" style="background-size: cover; background-position: center; background-repeat: no-repeat;"></div>
                 </div>
                 <div class="mt-2">
                    <input type="file" #fileInput (change)="onFileChange($event)" accept="image/png, image/jpeg, image/jpg" style="display: none;" />
                    <button class="btn btn-sm btn-primary font-weight-bold" (click)="fileInput.click()">Change Avatar</button>
                    <div class="text-muted font-size-xs mt-2">Max 1MB (JPG/PNG)</div>
                    <div *ngIf="avatarError()" class="text-danger font-size-xs mt-1">{{ avatarError() }}</div>
                 </div>
              </div>
            </div>
          </div>

          <!-- Main Content: Personal Info & Signature -->
          <div class="col-xl-9 col-lg-8">
             <form [formGroup]="profileForm" (ngSubmit)="onSaveProfile()">
                <div class="row">
                   <div class="col-md-6">
                      <div class="form-group mb-4">
                         <label class="font-weight-bold text-dark-75">Full Name</label>
                         <input type="text" class="form-control form-control-solid" formControlName="fullName" />
                      </div>
                   </div>
                   <div class="col-md-6">
                      <div class="form-group mb-4">
                         <label class="font-weight-bold text-dark-75">Email Address</label>
                         <input type="email" class="form-control form-control-solid" formControlName="email" />
                      </div>
                   </div>
                </div>

                <div class="form-group mb-10">
                   <label class="font-weight-bold text-dark-75 mb-2">Email Signature</label>
                   <div class="editor-container border rounded overflow-hidden">
                      <quill-editor formControlName="signature" [modules]="quillConfig" [placeholder]="'Type your signature here...'"></quill-editor>
                   </div>
                </div>

                <div class="d-flex justify-content-end mt-4">
                   <button type="submit" [disabled]="profileForm.invalid || isProfileLoading()" class="btn btn-primary font-weight-bolder px-8 py-2">
                      <span *ngIf="!isProfileLoading()">Save Changes</span>
                      <span *ngIf="isProfileLoading()" class="spinner-border spinner-border-sm"></span>
                   </button>
                </div>
             </form>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .form-control-solid { background-color: #F3F6F9; border-color: #F3F6F9; color: #3F4254; }
    .form-control-solid:focus { background-color: #EBEDF3; border-color: #EBEDF3; color: #3F4254; }
    .card-stretch { height: 100%; }
    .gutter-b { margin-bottom: 25px; }
    .bg-light-primary { background-color: #E1F0FF !important; }
    .text-dark-75 { color: #3F4254 !important; }
    .btn-light-danger { color: #F64E60; background-color: #FFE2E5; border-color: transparent; }
    .btn-light-danger:hover { color: #FFFFFF; background-color: #F64E60; }
    .symbol.symbol-120 .symbol-label {
      width: 120px;
      height: 120px;
      background-size: cover;
      background-repeat: no-repeat;
      background-position: center;
    }
    .editor-container {
      background: #F3F6F9;
      border: 1px solid #ebedf3 !important;
    }
    ::ng-deep .ql-toolbar {
      background-color: #F3F6F9 !important;
      border: none !important;
      border-bottom: 1px solid #ebedf3 !important;
    }
    ::ng-deep .ql-container {
      background-color: #ffffff !important;
      border: none !important;
      min-height: 200px !important;
      max-height: 400px !important;
      font-family: 'Poppins', 'Helvetica', sans-serif !important;
      font-size: 1rem !important;
    }
    ::ng-deep .ql-editor {
      min-height: 200px !important;
      color: #3F4254 !important;
    }
  `]
})
export class UserProfileComponent {
  profileForm: FormGroup;
  isProfileLoading = signal(false);
  avatarPreview = signal<string | null>(null);
  avatarError = signal<string | null>(null);

  quillConfig = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
      ['blockquote', 'code-block'],
      [{ 'header': 1 }, { 'header': 2 }],               // custom button values
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
      [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
      [{ 'direction': 'rtl' }],                         // text direction
      [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
      [{ 'font': [] }],
      [{ 'align': [] }],
      ['clean'],                                         // remove formatting button
      ['link', 'image']                         // link and image
    ]
  };

  constructor(
    private fb: FormBuilder,
    private authService: NoSqlAuthService,
    private sanitizer: DomSanitizer
  ) {
    const user = this.authService.currentUser() as User;

    this.profileForm = this.fb.group({
      fullName: [user.fullName, [Validators.required]],
      email: [user.email, [Validators.required, Validators.email]],
      signature: [user.signature || '']
    });

    if (user.avatar) {
      this.avatarPreview.set(user.avatar);
    }
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    // Validate type
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      this.avatarError.set('Only JPG and PNG are allowed');
      return;
    }

    // Validate size (1MB)
    if (file.size > 1024 * 1024) {
      this.avatarError.set('File size must be less than 1MB');
      return;
    }

    this.avatarError.set(null);
    const reader = new FileReader();
    reader.onload = () => {
      const base64String = reader.result as string;
      this.avatarPreview.set(base64String);
    };
    reader.readAsDataURL(file);
  }

  onSaveProfile() {
    if (this.profileForm.invalid) return;

    this.isProfileLoading.set(true);

    const rawSignature = this.profileForm.get('signature')?.value || '';
    // XSS Mitigation: Sanitize the HTML signature before saving
    // Although Angular's sanitizer is primarily for displaying,
    // we use it here to ensure we aren't saving obviously malicious scripts.
    const sanitizedSignature = this.sanitizer.sanitize(SecurityContext.HTML, rawSignature) || '';

    const profileData = {
      fullName: this.profileForm.get('fullName')?.value,
      email: this.profileForm.get('email')?.value,
      signature: sanitizedSignature,
      avatar: this.avatarPreview() as string | null
    };

    this.authService.updateProfile(profileData).subscribe({
      next: () => {
        this.isProfileLoading.set(false);
        alert('Profile updated successfully!');
      },
      error: (err) => {
        this.isProfileLoading.set(false);
        alert(err.message || 'Failed to update profile');
      }
    });
  }
}
