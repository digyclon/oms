import { Component, Output, EventEmitter, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { NoSqlAuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header
      class="header bg-white shadow-sm py-1 px-4 px-lg-6 d-flex align-items-center justify-content-between"
    >
      <div class="d-flex align-items-center overflow-hidden">
        <button
          class="btn btn-icon btn-clean-primary d-lg-none me-2 me-sm-4"
          (click)="onToggleSidebar()"
        >
          <i class="fas fa-bars"></i>
        </button>
        <h1 class="font-size-h4 font-weight-bolder mb-0 text-dark text-truncate">
          OPTIMA MONITORING SYSTEM
        </h1>
      </div>
      <div class="topbar d-flex align-items-center">
        <!-- User Dropdown -->
        <div class="dropdown position-relative">
          <div
            class="topbar-item d-flex align-items-center cursor-pointer px-3 py-2 rounded"
            (click)="toggleUserDropdown($event)"
          >
            <div class="d-none d-sm-flex flex-column text-end me-3">
              <span class="text-muted font-weight-bold font-size-sm">Hi,</span>
              <span class="text-dark-50 font-weight-bolder font-size-base">{{
                authService.currentUser()?.fullName
              }}</span>
            </div>
            <div class="symbol symbol-35 symbol-light-success overflow-hidden">
              <div *ngIf="authService.currentUser()?.avatar" [style.backgroundImage]="'url(' + authService.currentUser()?.avatar + ')'" class="symbol-label rounded-circle h-100 w-100" style="background-size: cover; background-position: center; background-repeat: no-repeat;"></div>
              <span *ngIf="!authService.currentUser()?.avatar" class="symbol-label font-size-h5 font-weight-bold">
                {{ authService.currentUser()?.fullName?.charAt(0) || 'A' }}
              </span>
            </div>
          </div>

          <!-- Dropdown Menu -->
          <div
            class="dropdown-menu dropdown-menu-end p-0 m-0 dropdown-menu-anim-up dropdown-menu-md"
            [class.show]="isUserDropdownOpen()"
          >
            <div class="d-flex align-items-center p-5 rounded-top bg-primary">
              <div class="symbol symbol-40 me-4 overflow-hidden">
                <div *ngIf="authService.currentUser()?.avatar" [style.backgroundImage]="'url(' + authService.currentUser()?.avatar + ')'" class="symbol-label rounded-circle h-100 w-100" style="background-size: cover; background-position: center; background-repeat: no-repeat;"></div>
                <span
                  *ngIf="!authService.currentUser()?.avatar"
                  class="symbol-label font-size-h5 font-weight-bold bg-white-o-15 text-white"
                >
                  {{ authService.currentUser()?.fullName?.charAt(0) || 'A' }}
                </span>
              </div>
              <div class="text-white">
                <div class="font-size-base font-weight-bolder">
                  {{ authService.currentUser()?.fullName }}
                </div>
                <div class="font-size-sm opacity-70 font-weight-bold">
                  {{ authService.currentUser()?.email }}
                </div>
              </div>
            </div>
            <div class="navi navi-spacer-x-0">
              <a
                routerLink="/user-profile"
                class="navi-item px-6 py-2 d-flex align-items-center text-decoration-none"
              >
                <div class="navi-icon me-3"><i class="fas fa-user text-primary font-size-lg"></i></div>
                <div class="navi-text font-weight-bold">User Profile</div>
              </a>
              <a
                routerLink="/change-password"
                class="navi-item px-6 py-2 d-flex align-items-center text-decoration-none border-top"
              >
                <div class="navi-icon me-3"><i class="fas fa-lock text-warning font-size-lg"></i></div>
                <div class="navi-text font-weight-bold">Change Password</div>
              </a>
              <a
                routerLink="/alert-detail"
                class="navi-item px-6 py-2 d-flex align-items-center justify-content-between text-decoration-none border-top"
              >
                <div class="d-flex align-items-center">
                  <div class="navi-icon me-3"><i class="fas fa-exclamation-triangle text-danger font-size-lg"></i></div>
                  <div class="navi-text font-weight-bold">Critical Alerts</div>
                </div>
                <span class="badge badge-light-danger font-weight-bolder">12</span>
              </a>
              <div class="navi-footer px-6 py-3 border-top">
                <a
                  href="javascript:;"
                  (click)="logout()"
                  class="btn btn-light-primary font-weight-bold w-100 text-center btn-sm"
                  >Sign Out</a
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .header {
      height: 65px;
      z-index: 99;
    }
    .cursor-pointer {
      cursor: pointer;
    }
    .topbar-item:hover {
      background-color: #f3f6f9;
    }
    .dropdown-menu {
      border: none;
      box-shadow: 0 0 50px 0 rgba(82, 63, 105, 0.15);
      display: none;
      min-width: 275px;
      max-width: calc(100vw - 2rem);
      border-radius: 0.85rem;
      overflow: hidden;
      position: absolute;
      right: 0;
      top: 100%;
      margin-top: 0.5rem;
      z-index: 1000;
    }
    @media (max-width: 575.98px) {
      .dropdown-menu {
        min-width: calc(100vw - 2rem);
        right: -0.5rem;
      }
    }
    .dropdown-menu.show {
      display: block;
    }
    .dropdown-menu-anim-up {
      animation: dropdown-menu-fade-in 0.3s ease;
    }
    @keyframes dropdown-menu-fade-in {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    .bg-white-o-15 {
      background-color: rgba(255, 255, 255, 0.15);
    }
    .btn-light-primary {
      color: #3699ff;
      background-color: #e1f0ff;
      border-color: transparent;
    }
    .btn-light-primary:hover {
      color: #ffffff;
      background-color: #3699ff;
    }
    .symbol {
      display: inline-block;
      flex-shrink: 0;
      position: relative;
      border-radius: 0.42rem;
    }
    .symbol.symbol-35 .symbol-label {
      width: 35px;
      height: 35px;
    }
    .symbol-light-success .symbol-label {
      background-color: #c9f7f5;
      color: #1bc5bd;
    }
    .symbol-label {
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 500;
      color: #3f4254;
      background-color: #f3f6f9;
    }
    .btn-clean-primary {
      color: #3699ff;
      background-color: transparent;
    }
    .btn-clean-primary:hover {
      background-color: #f3f6f9;
    }
    .badge-light-danger {
      color: #F64E60;
      background-color: #FFE2E5;
      padding: 0.2rem 0.5rem;
      border-radius: 0.25rem;
      font-size: 0.75rem;
    }
    .navi-item:hover {
      background-color: #f3f6f9;
    }
    .navi-item .navi-text {
      color: #3f4254;
      font-size: 0.95rem;
    }
    .navi-item:hover .navi-text {
      color: #3699ff;
    }
    .font-size-base {
      font-size: 1rem;
    }
    .font-weight-bolder {
      font-weight: 600;
    }
    .btn-sm {
      padding: 0.45rem 1rem;
      font-size: 0.85rem;
    }
    .symbol.symbol-40 {
      width: 40px;
      height: 40px;
      flex-shrink: 0;
    }
    .symbol.symbol-40 .symbol-label {
      width: 40px;
      height: 40px;
    }
  `],
})
export class HeaderComponent {
  @Output() toggleSidebar = new EventEmitter<void>();
  isUserDropdownOpen = signal(false);

  constructor(
    public authService: NoSqlAuthService,
    private router: Router
  ) {}

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    this.isUserDropdownOpen.set(false);
  }

  @HostListener('window:resize')
  onResize() {
    this.isUserDropdownOpen.set(false);
  }

  onToggleSidebar() {
    this.toggleSidebar.emit();
  }

  toggleUserDropdown(event: Event) {
    event.stopPropagation();
    this.isUserDropdownOpen.update((v) => !v);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
