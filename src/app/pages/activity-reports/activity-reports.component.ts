import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-activity-reports',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card card-custom gutter-b shadow-sm">
      <div class="card-header py-3">
        <div class="card-title">
          <h3 class="card-label font-weight-bolder text-dark font-size-h5">Activity Reports</h3>
        </div>
      </div>
      <div class="card-body p-5">
        <div class="row">
          <div class="col-lg-12">
            <div class="card card-custom border mb-6">
              <div class="card-header py-3 px-6">
                <div class="card-title">
                  <span class="card-icon me-3"><i class="fas fa-user-clock text-primary"></i></span>
                  <h4 class="card-label font-weight-bolder mb-0 font-size-h6">User Sessions</h4>
                </div>
              </div>
              <div class="card-body p-5">
                <p class="text-muted font-weight-bold mb-3 font-size-sm">Summary of recent user interactions across all devices.</p>
                <div class="chart-placeholder bg-light rounded d-flex align-items-center justify-content-center">
                   <div class="text-center">
                      <i class="fas fa-chart-bar icon-2x text-muted mb-2"></i>
                      <div class="text-muted font-weight-bolder font-size-sm">Chart Data Visualization</div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .chart-placeholder { height: 250px; }
    .icon-2x { font-size: 1.5rem; }
    .card-custom { border-radius: 0.5rem; }
    .gutter-b { margin-bottom: 1rem; }
  `]
})
export class ActivityReportsComponent {}
