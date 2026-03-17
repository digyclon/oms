import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-devices',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card card-custom gutter-b shadow-sm">
      <div class="card-header py-3">
        <div class="card-title">
          <h3 class="card-label font-weight-bolder text-dark font-size-h5">Devices Management</h3>
        </div>
        <div class="card-toolbar d-flex align-items-center">
          <button class="btn btn-primary font-weight-bolder px-4 py-2 font-size-sm">
            <i class="fas fa-plus me-2"></i> Add New Device
          </button>
        </div>
      </div>
      <div class="card-body p-5">
        <div class="table-responsive">
          <table class="table table-hover table-vertical-center mb-0">
            <thead>
              <tr class="text-left text-uppercase text-muted font-weight-bolder">
                <th style="min-width: 100px">ID</th>
                <th style="min-width: 200px">Name</th>
                <th style="min-width: 150px">Status</th>
                <th style="min-width: 150px">Last Seen</th>
                <th class="text-right" style="min-width: 100px">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><span class="text-dark-75 font-weight-bolder">DEV-001</span></td>
                <td>
                  <div class="d-flex align-items-center">
                    <div class="symbol symbol-40 bg-light-primary me-3">
                      <span class="symbol-label font-size-h5"><i class="fas fa-mobile-alt text-primary"></i></span>
                    </div>
                    <div>
                      <span class="text-dark-75 font-weight-bolder d-block">Mobile Phone A</span>
                      <span class="text-muted font-weight-bold">Android 13</span>
                    </div>
                  </div>
                </td>
                <td><span class="badge badge-light-success px-3 py-2">Online</span></td>
                <td><span class="text-muted font-weight-bold">Just now</span></td>
                <td class="text-right">
                  <button class="btn btn-icon btn-light btn-hover-primary btn-sm mx-1"><i class="fas fa-edit"></i></button>
                  <button class="btn btn-icon btn-light btn-hover-danger btn-sm mx-1"><i class="fas fa-trash"></i></button>
                </td>
              </tr>
              <tr>
                <td><span class="text-dark-75 font-weight-bolder">DEV-002</span></td>
                <td>
                  <div class="d-flex align-items-center">
                    <div class="symbol symbol-40 bg-light-info me-3">
                      <span class="symbol-label font-size-h5"><i class="fas fa-tablet-alt text-info"></i></span>
                    </div>
                    <div>
                      <span class="text-dark-75 font-weight-bolder d-block">Tablet B</span>
                      <span class="text-muted font-weight-bold">iOS 16</span>
                    </div>
                  </div>
                </td>
                <td><span class="badge badge-light-danger px-3 py-2">Offline</span></td>
                <td><span class="text-muted font-weight-bold">2 hours ago</span></td>
                <td class="text-right">
                  <button class="btn btn-icon btn-light btn-hover-primary btn-sm mx-1"><i class="fas fa-edit"></i></button>
                  <button class="btn btn-icon btn-light btn-hover-danger btn-sm mx-1"><i class="fas fa-trash"></i></button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .symbol { display: inline-block; flex-shrink: 0; position: relative; border-radius: 0.42rem; }
    .symbol.symbol-40 .symbol-label { width: 35px; height: 35px; }
    .symbol-light-primary .symbol-label { background-color: #E1F0FF; color: #3699FF; }
    .symbol-light-info .symbol-label { background-color: #EEE5FF; color: #8950FC; }
    .badge-light-success { color: #1BC5BD; background-color: #C9F7F5; }
    .badge-light-danger { color: #F64E60; background-color: #FFE2E5; }
    .btn-icon { height: 28px; width: 28px; display: inline-flex; align-items: center; justify-content: center; padding: 0; border: none; }
    .gutter-b { margin-bottom: 1rem; }
    .card-custom { border-radius: 0.5rem; }
    .btn-light { background-color: #F3F6F9; color: #7E8299; }
    .btn-hover-primary:hover { color: #ffffff !important; background-color: #3699FF !important; }
    .btn-hover-danger:hover { color: #ffffff !important; background-color: #F64E60 !important; }
  `]
})
export class DevicesComponent {}
