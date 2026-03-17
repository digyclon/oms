import { Component, signal, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NoSqlAuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-aside',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <aside
      class="aside aside-left aside-fixed d-flex flex-column flex-row-auto bg-dark"
      [class.aside-on]="isVisible"
    >
      <div
        class="brand flex-column-auto px-6 py-8 d-flex align-items-center justify-content-between"
      >
        <button class="btn btn-icon btn-sm btn-clean-light d-lg-none" (click)="closeSidebar()">
          <i class="fas fa-times text-white"></i>
        </button>
      </div>

      <div class="aside-menu-wrapper flex-column-fluid">
        <div class="aside-menu my-4">
          <ul class="menu-nav list-unstyled">
            <li
              *ngIf="hasPermission('view_dashboard')"
              class="menu-item mb-2"
              routerLinkActive="menu-item-active"
              (click)="onItemClick()"
            >
              <a
                routerLink="/dashboard"
                class="menu-link px-6 py-2 d-flex align-items-center text-decoration-none"
              >
                <span class="menu-icon me-4"><i class="fas fa-th-large"></i></span>
                <span class="menu-text">Dashboard</span>
              </a>
            </li>

            <!-- Deep Dive Reports Section -->
            <li class="menu-section mt-5 mb-2 px-6 d-flex align-items-center justify-content-between cursor-pointer" (click)="isDeepDiveExpanded.set(!isDeepDiveExpanded())">
                <span class="menu-section-text text-uppercase font-weight-bolder font-size-xs text-muted">Deep Dive Analysis</span>
                <i class="fas fa-chevron-down font-size-xs text-muted transition-02" [class.rotate-n90]="!isDeepDiveExpanded()"></i>
            </li>
            <div [class.d-none]="!isDeepDiveExpanded()">
                <li
                  *ngIf="hasPermission('view_devices')"
                  class="menu-item mb-2"
                  routerLinkActive="menu-item-active"
                  (click)="onItemClick()"
                >
                  <a
                    routerLink="/device-detail"
                    class="menu-link px-6 py-2 d-flex align-items-center text-decoration-none"
                  >
                    <span class="menu-icon me-4"><i class="fas fa-tablet-alt"></i></span>
                    <span class="menu-text">Device Analysis</span>
                  </a>
                </li>
                <li
                  *ngIf="hasPermission('view_apps')"
                  class="menu-item mb-2"
                  routerLinkActive="menu-item-active"
                  (click)="onItemClick()"
                >
                  <a
                    routerLink="/app-detail"
                    class="menu-link px-6 py-2 d-flex align-items-center text-decoration-none"
                  >
                    <span class="menu-icon me-4"><i class="fas fa-box-open"></i></span>
                    <span class="menu-text">App Compliance</span>
                  </a>
                </li>
                <li
                  *ngIf="hasPermission('view_alerts')"
                  class="menu-item mb-2"
                  routerLinkActive="menu-item-active"
                  (click)="onItemClick()"
                >
                  <a
                    routerLink="/alert-detail"
                    class="menu-link px-6 py-2 d-flex align-items-center text-decoration-none"
                  >
                    <span class="menu-icon me-4"><i class="fas fa-biohazard"></i></span>
                    <span class="menu-text">Critical Alerts</span>
                  </a>
                </li>
                <li
                  *ngIf="hasPermission('view_dashboard')"
                  class="menu-item mb-2"
                  routerLinkActive="menu-item-active"
                  (click)="onItemClick()"
                >
                  <a
                    routerLink="/health-detail"
                    class="menu-link px-6 py-2 d-flex align-items-center text-decoration-none"
                  >
                    <span class="menu-icon me-4"><i class="fas fa-heartbeat"></i></span>
                    <span class="menu-text">System Health</span>
                  </a>
                </li>
            </div>

            <!-- Management Section -->
            <li class="menu-section mt-5 mb-2 px-6 d-flex align-items-center justify-content-between cursor-pointer" (click)="isManagementExpanded.set(!isManagementExpanded())">
                <span class="menu-section-text text-uppercase font-weight-bolder font-size-xs text-muted">Management</span>
                <i class="fas fa-chevron-down font-size-xs text-muted transition-02" [class.rotate-n90]="!isManagementExpanded()"></i>
            </li>
            <div [class.d-none]="!isManagementExpanded()">
                <li
                  *ngIf="hasPermission('view_devices')"
                  class="menu-item mb-2"
                  routerLinkActive="menu-item-active"
                  (click)="onItemClick()"
                >
                  <a
                    routerLink="/devices"
                    class="menu-link px-6 py-2 d-flex align-items-center text-decoration-none"
                  >
                    <span class="menu-icon me-4"><i class="fas fa-laptop"></i></span>
                    <span class="menu-text">Devices</span>
                  </a>
                </li>
                <li
                  *ngIf="hasPermission('view_apps')"
                  class="menu-item mb-2"
                  routerLinkActive="menu-item-active"
                  (click)="onItemClick()"
                >
                  <a
                    routerLink="/installed-apps"
                    class="menu-link px-6 py-2 d-flex align-items-center text-decoration-none"
                  >
                    <span class="menu-icon me-4"><i class="fas fa-cubes"></i></span>
                    <span class="menu-text">Installed Apps</span>
                  </a>
                </li>
                <li
                  *ngIf="hasPermission('view_reports')"
                  class="menu-item mb-2"
                  routerLinkActive="menu-item-active"
                  (click)="onItemClick()"
                >
                  <a
                    routerLink="/activity-reports"
                    class="menu-link px-6 py-2 d-flex align-items-center text-decoration-none"
                  >
                    <span class="menu-icon me-4"><i class="fas fa-chart-line"></i></span>
                    <span class="menu-text">Activity Reports</span>
                  </a>
                </li>
                <li
                  *ngIf="hasPermission('view_reports')"
                  class="menu-item mb-2"
                  routerLinkActive="menu-item-active"
                  (click)="onItemClick()"
                >
                  <a
                    routerLink="/network-reports"
                    class="menu-link px-6 py-2 d-flex align-items-center text-decoration-none"
                  >
                    <span class="menu-icon me-4"><i class="fas fa-network-wired"></i></span>
                    <span class="menu-text">Network Reports</span>
                  </a>
                </li>
                <li
                  *ngIf="hasPermission('view_alerts')"
                  class="menu-item mb-2"
                  routerLinkActive="menu-item-active"
                  (click)="onItemClick()"
                >
                  <a
                    routerLink="/alerts-exports"
                    class="menu-link px-6 py-2 d-flex align-items-center text-decoration-none"
                  >
                    <span class="menu-icon me-4"><i class="fas fa-exclamation-triangle"></i></span>
                    <span class="menu-text">Alerts / Exports</span>
                  </a>
                </li>
            </div>
          </ul>
        </div>
      </div>
    </aside>
  `,
  styles: [`
    .aside {
      width: 265px;
      z-index: 1001;
      background-color: #1e1e2d !important;
      transition: left 0.3s ease;
      display: flex;
      flex-direction: column;
      flex-shrink: 0;
    }
    .aside-fixed {
      position: fixed;
      top: 0;
      bottom: 0;
      left: 0;
    }
    @media (max-width: 991.98px) {
      .aside {
        left: -265px;
      }
      .aside.aside-on {
        left: 0;
      }
    }
    .brand {
      background-color: #1e1e2d;
      border-bottom: 1px solid #29293d;
    }
    .aside-menu-wrapper {
      overflow-y: auto;
      height: 100%;
    }
    .aside-menu-wrapper::-webkit-scrollbar {
      width: 4px;
    }
    .aside-menu-wrapper::-webkit-scrollbar-track {
      background: transparent;
    }
    .aside-menu-wrapper::-webkit-scrollbar-thumb {
      background: #2d2d3f;
      border-radius: 4px;
    }
    .aside-menu-wrapper::-webkit-scrollbar-thumb:hover {
      background: #3699ff;
    }
    .menu-link {
      color: #a2a5b9;
      transition: color 0.2s ease, background-color 0.2s ease;
      border-radius: 0.42rem;
      margin: 0 0.5rem;
    }
    .menu-link:hover {
      color: #ffffff;
      background-color: #1b1b28;
    }
    .menu-item-active .menu-link {
      color: #ffffff;
      background-color: #1b1b28;
    }
    .menu-item-active .menu-link .menu-text {
      color: #3699ff;
    }
    .menu-item-active .menu-link .menu-icon i {
      color: #3699ff;
    }
    .menu-icon i {
      font-size: 1.1rem;
      color: #494b74;
    }
    .btn-clean-light {
      color: #ffffff;
      background-color: transparent;
    }
    .btn-clean-light:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }
    .menu-section {
      display: flex;
      align-items: center;
      height: 40px;
    }
    .menu-section-text {
      font-size: 0.8rem;
      color: #494b74;
      letter-spacing: 0.05rem;
    }
    .cursor-pointer {
      cursor: pointer;
    }
    .transition-02 {
      transition: all 0.2s ease;
    }
    .rotate-n90 {
      transform: rotate(-90deg);
    }
    .font-size-xs {
      font-size: 0.75rem !important;
    }
  `]
})
export class AsideComponent {
  @Input() isVisible = false;
  @Output() close = new EventEmitter<void>();
  @Output() itemClick = new EventEmitter<void>();

  isDeepDiveExpanded = signal(true);
  isManagementExpanded = signal(true);

  constructor(private authService: NoSqlAuthService) {}

  closeSidebar() {
    this.close.emit();
  }

  onItemClick() {
    this.itemClick.emit();
  }

  hasPermission(permission: string): boolean {
    const user = this.authService.currentUser();
    return user ? user.permissions.includes(permission) : false;
  }
}
