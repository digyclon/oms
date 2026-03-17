import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AsideComponent } from './components/aside/aside.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, AsideComponent, HeaderComponent, FooterComponent],
  template: `
    <div class="d-flex flex-column flex-root">
      <div class="d-flex flex-row flex-column-fluid page">
        <!-- Sidebar overlay for mobile -->
        <div
          *ngIf="isSidebarVisible()"
          class="aside-overlay d-lg-none"
          (click)="toggleSidebar()"
        ></div>

        <!-- Sidebar -->
        <app-aside
          [isVisible]="isSidebarVisible()"
          (close)="toggleSidebar()"
          (itemClick)="onMenuItemClick()"
        ></app-aside>

        <!-- Main Content -->
        <div class="d-flex flex-column flex-row-fluid wrapper bg-light">
          <!-- Header -->
          <app-header (toggleSidebar)="toggleSidebar()"></app-header>

          <!-- Content Body -->
          <main class="content d-flex flex-column flex-column-fluid">
             <div class="p-3 p-lg-6 flex-column-fluid">
               <router-outlet></router-outlet>
             </div>

             <!-- Footer -->
             <app-footer></app-footer>
          </main>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .flex-root {
        display: flex;
        flex-direction: column;
        height: 100vh;
      }
      .page {
        display: flex;
        flex-direction: row;
        flex: 1 1 auto;
        position: relative;
        min-height: 0;
      }
      .wrapper {
        flex: 1 1 auto;
        display: flex;
        flex-direction: column;
        padding-left: 265px;
        transition: all 0.3s ease;
        min-width: 0;
      }
      .content {
        flex: 1 1 auto;
        overflow: auto;
      }

      @media (max-width: 991.98px) {
        .wrapper {
          padding-left: 0;
        }
        .aside-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          z-index: 1000;
        }
      }
    `,
  ],
})
export class LayoutComponent {
  isSidebarVisible = signal(false);

  toggleSidebar() {
    this.isSidebarVisible.update((v) => !v);
  }

  onMenuItemClick() {
    if (window.innerWidth < 992) {
      this.isSidebarVisible.set(false);
    }
  }
}
