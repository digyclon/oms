import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-alerts-exports',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card card-custom gutter-b shadow-sm">
      <div class="card-header py-3">
        <div class="card-title">
          <h3 class="card-label font-weight-bolder text-dark font-size-h5">Alerts / Exports</h3>
        </div>
      </div>
      <div class="card-body p-5">
        <div class="row">
          <div class="col-xl-6 col-lg-12 mb-4">
            <div class="card card-custom border h-100">
              <div class="card-header py-3 px-6">
                <h4 class="card-label font-weight-bolder mb-0 font-size-h6">Recent Alerts</h4>
              </div>
              <div class="card-body p-5">
                <div class="d-flex align-items-center bg-light-warning rounded p-4 mb-4">
                  <span class="symbol symbol-35 me-4">
                    <span class="symbol-label bg-white"><i class="fas fa-exclamation-triangle text-warning font-size-sm"></i></span>
                  </span>
                  <div class="d-flex flex-column flex-grow-1 me-2">
                    <a href="javascript:;" class="font-weight-bolder text-dark-75 text-hover-primary font-size-base mb-0 text-decoration-none">Low Disk Space</a>
                    <span class="text-muted font-weight-bold font-size-sm">Device: DEV-001</span>
                  </div>
                  <span class="font-weight-bolder text-warning py-1 font-size-xs">Warning</span>
                </div>

                <div class="d-flex align-items-center bg-light-danger rounded p-4 mb-4">
                  <span class="symbol symbol-35 me-4">
                    <span class="symbol-label bg-white"><i class="fas fa-network-wired text-danger font-size-sm"></i></span>
                  </span>
                  <div class="d-flex flex-column flex-grow-1 me-2">
                    <a href="javascript:;" class="font-weight-bolder text-dark-75 text-hover-primary font-size-base mb-0 text-decoration-none">Network Outage</a>
                    <span class="text-muted font-weight-bold font-size-sm">Region: REGION-02</span>
                  </div>
                  <span class="font-weight-bolder text-danger py-1 font-size-xs">Critical</span>
                </div>
              </div>
            </div>
          </div>

          <div class="col-xl-6 col-lg-12 mb-4">
            <div class="card card-custom border h-100">
              <div class="card-header py-3 px-6">
                <h4 class="card-label font-weight-bolder mb-0 font-size-h6">Data Exports</h4>
              </div>
              <div class="card-body p-5">
                <p class="text-muted font-weight-bold mb-5 font-size-sm">Export your monitoring data to various formats for offline analysis and reporting.</p>
                <div class="d-flex flex-column">
                  <button class="btn btn-light-primary font-weight-bolder py-2 mb-3 d-flex align-items-center justify-content-center border-0 font-size-sm">
                    <i class="fas fa-file-csv me-2"></i> Export as CSV
                  </button>
                  <button class="btn btn-light-danger font-weight-bolder py-2 mb-3 d-flex align-items-center justify-content-center border-0 font-size-sm">
                    <i class="fas fa-file-pdf me-2"></i> Export as PDF
                  </button>
                  <button class="btn btn-light-success font-weight-bolder py-2 d-flex align-items-center justify-content-center border-0 font-size-sm">
                    <i class="fas fa-file-excel me-2"></i> Export as Excel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .bg-light-warning { background-color: #FFF4DE !important; }
    .bg-light-danger { background-color: #FFE2E5 !important; }
    .symbol-35 .symbol-label { width: 35px; height: 35px; }
    .font-size-xs { font-size: 0.75rem; }
    .gutter-b { margin-bottom: 1rem; }
    .card-custom { border-radius: 0.5rem; }
    .btn-light-primary { color: #3699FF; background-color: #E1F0FF; border-color: transparent; }
    .btn-light-primary:hover { color: #ffffff; background-color: #3699FF; }
    .btn-light-danger { color: #F64E60; background-color: #FFE2E5; border-color: transparent; }
    .btn-light-danger:hover { color: #ffffff; background-color: #F64E60; }
    .btn-light-success { color: #1BC5BD; background-color: #C9F7F5; border-color: transparent; }
    .btn-light-success:hover { color: #ffffff; background-color: #1BC5BD; }
  `]
})
export class AlertsExportsComponent {}
