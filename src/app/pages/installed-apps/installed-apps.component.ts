import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-installed-apps',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card card-custom gutter-b shadow-sm">
      <div class="card-header py-3">
        <div class="card-title">
          <h3 class="card-label font-weight-bolder text-dark font-size-h5">Installed Applications</h3>
        </div>
      </div>
      <div class="card-body p-5">
        <div class="row">
          <div class="col-xl-3 col-lg-6 col-sm-12 mb-4">
            <div class="card card-custom border p-4 h-100">
              <div class="d-flex align-items-center mb-3">
                <div class="symbol symbol-35 bg-light-primary me-3">
                  <span class="symbol-label font-size-h5"><i class="fab fa-chrome text-primary"></i></span>
                </div>
                <div>
                  <a href="javascript:;" class="text-dark-75 font-weight-bolder text-hover-primary font-size-base text-decoration-none">Browser</a>
                  <span class="text-muted font-weight-bold d-block font-size-sm">v1.2.3</span>
                </div>
              </div>
              <div class="mb-3">
                <div class="d-flex justify-content-between align-items-center mb-1">
                  <span class="text-muted font-weight-bold font-size-sm">Usage</span>
                  <span class="text-dark-75 font-weight-bolder font-size-sm">65%</span>
                </div>
                <div class="progress progress-xs w-100">
                  <div class="progress-bar bg-primary" role="progressbar" style="width: 65%;" aria-valuenow="65" aria-valuemin="0" aria-valuemax="100"></div>
                </div>
              </div>
              <button class="btn btn-sm btn-light-primary font-weight-bolder w-100 py-1">Details</button>
            </div>
          </div>

          <div class="col-xl-3 col-lg-6 col-sm-12 mb-4">
            <div class="card card-custom border p-4 h-100">
              <div class="d-flex align-items-center mb-3">
                <div class="symbol symbol-35 bg-light-success me-3">
                  <span class="symbol-label font-size-h5"><i class="fas fa-microchip text-success"></i></span>
                </div>
                <div>
                  <a href="javascript:;" class="text-dark-75 font-weight-bolder text-hover-primary font-size-base text-decoration-none">System Monitor</a>
                  <span class="text-muted font-weight-bold d-block font-size-sm">v2.0.1</span>
                </div>
              </div>
              <div class="mb-3">
                <div class="d-flex justify-content-between align-items-center mb-1">
                  <span class="text-muted font-weight-bold font-size-sm">Usage</span>
                  <span class="text-dark-75 font-weight-bolder font-size-sm">25%</span>
                </div>
                <div class="progress progress-xs w-100">
                  <div class="progress-bar bg-success" role="progressbar" style="width: 25%;" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
                </div>
              </div>
              <button class="btn btn-sm btn-light-primary font-weight-bolder w-100 py-1">Details</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .symbol { display: inline-block; flex-shrink: 0; position: relative; border-radius: 0.42rem; }
    .symbol.symbol-35 .symbol-label { width: 35px; height: 35px; }
    .symbol-light-primary .symbol-label { background-color: #E1F0FF; color: #3699FF; }
    .symbol-light-success .symbol-label { background-color: #C9F7F5; color: #1BC5BD; }
    .progress-xs { height: 6px; border-radius: 0.42rem; }
    .btn-light-primary { color: #3699FF; background-color: #E1F0FF; border-color: transparent; }
    .gutter-b { margin-bottom: 1rem; }
    .card-custom { border-radius: 0.5rem; }
    .btn-light-primary:hover { color: #ffffff; background-color: #3699FF; }
  `]
})
export class InstalledAppsComponent {}
