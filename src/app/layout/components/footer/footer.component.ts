import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="footer bg-white py-4 d-flex flex-lg-column" id="kt_footer">
      <div class="container-fluid d-flex flex-column flex-md-row align-items-center justify-content-between">
        <div class="text-dark order-2 order-md-1">
          <span class="text-muted font-weight-bold me-2">2026©</span>
          <a href="javascript:;" target="_blank" class="text-dark-75 text-hover-primary">Optima</a>
        </div>
<!--        <div class="nav nav-dark order-1 order-md-2">-->
<!--          <a href="javascript:;" target="_blank" class="nav-link ps-0 pe-5">About</a>-->
<!--          <a href="javascript:;" target="_blank" class="nav-link pe-5">Team</a>-->
<!--          <a href="javascript:;" target="_blank" class="nav-link pe-0">Contact</a>-->
<!--        </div>-->
      </div>
    </div>
  `,
  styles: [`
    .footer {
      border-top: 1px solid #ebedf3;
    }
    .nav-link {
      color: #7e8299;
    }
    .nav-link:hover {
      color: #3699ff;
    }
  `]
})
export class FooterComponent {}
