import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-network-reports',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card card-custom gutter-b shadow-sm">
      <div class="card-header py-3">
        <div class="card-title">
          <h3 class="card-label font-weight-bolder text-dark font-size-h5">Network Reports</h3>
        </div>
      </div>
      <div class="card-body p-5">
        <div class="row">
          <div class="col-lg-6 col-sm-12 mb-4">
            <div class="card card-custom border bg-light-primary border-0 p-5 h-100">
              <div class="d-flex align-items-center mb-3">
                <span class="symbol symbol-40 me-4">
                  <span class="symbol-label bg-white"><i class="fas fa-arrow-down text-primary font-size-h4"></i></span>
                </span>
                <div>
                  <span class="text-dark-75 font-weight-bolder font-size-h6 d-block">Incoming Traffic</span>
                  <span class="text-muted font-weight-bold font-size-sm">Live Data</span>
                </div>
              </div>
              <div class="text-primary font-weight-bolder font-size-h2">1.2 GB <small class="font-size-sm">/ day</small></div>
            </div>
          </div>
          <div class="col-lg-6 col-sm-12 mb-4">
            <div class="card card-custom border bg-light-success border-0 p-5 h-100">
              <div class="d-flex align-items-center mb-3">
                <span class="symbol symbol-40 me-4">
                  <span class="symbol-label bg-white"><i class="fas fa-arrow-up text-success font-size-h4"></i></span>
                </span>
                <div>
                  <span class="text-dark-75 font-weight-bolder font-size-h6 d-block">Outgoing Traffic</span>
                  <span class="text-muted font-weight-bold font-size-sm">Live Data</span>
                </div>
              </div>
              <div class="text-success font-weight-bolder font-size-h2">800 MB <small class="font-size-sm">/ day</small></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .bg-light-primary { background-color: #F3F6F9 !important; }
    .bg-light-success { background-color: #F3F6F9 !important; }
    .symbol-light-primary .symbol-label { background-color: #E1F0FF; color: #3699FF; }
    .symbol-light-success .symbol-label { background-color: #C9F7F5; color: #1BC5BD; }
    .symbol-40 .symbol-label { width: 40px; height: 40px; border-radius: 0.42rem; }
    .card-custom { border-radius: 0.5rem; }
    .gutter-b { margin-bottom: 1rem; }
  `]
})
export class NetworkReportsComponent {}
