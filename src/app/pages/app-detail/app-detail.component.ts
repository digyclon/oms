import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartType } from 'chart.js';

@Component({
  selector: 'app-app-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, BaseChartDirective],
  template: `
    <div class="card card-custom gutter-b mb-6">
      <div class="card-header py-3">
        <div class="card-title">
          <h3 class="card-label font-weight-bolder text-dark font-size-h5">Application Status Overview</h3>
        </div>
      </div>
      <div class="card-body p-5">
        <div class="d-flex justify-content-center">
          <div style="max-width: 400px; width: 100%;">
            <canvas baseChart
              [data]="doughnutChartData()"
              [options]="doughnutChartOptions"
              [type]="doughnutChartType">
            </canvas>
          </div>
        </div>
      </div>
    </div>

    <div class="card card-custom card-stretch">
      <div class="card-header border-0 py-5">
        <h3 class="card-title align-items-start flex-column">
          <span class="card-label font-weight-bolder text-dark">Applications Detailed Information</span>
          <span class="text-muted mt-3 font-weight-bold font-size-sm">List of installed applications and their compliance status</span>
        </h3>
      </div>
      <div class="card-body py-0">
        <div class="table-responsive">
          <table class="table table-head-custom table-vertical-center border-bottom">
            <thead>
              <tr class="text-left text-uppercase">
                <th style="min-width: 200px">
                  <span class="d-block mb-2">Application Name</span>
                  <input type="text" class="form-control form-control-sm form-control-solid" placeholder="Search..." [ngModel]="searchName()" (ngModelChange)="searchName.set($event); currentPage.set(1)">
                </th>
                <th style="min-width: 150px">
                  <span class="d-block mb-2">List Type</span>
                  <select class="form-control form-control-sm form-control-solid" [ngModel]="searchType()" (ngModelChange)="searchType.set($event); currentPage.set(1)">
                    <option value="">All Types</option>
                    <option value="Allowlisted">Allowlisted</option>
                    <option value="Blocklisted">Blocklisted</option>
                  </select>
                </th>
                <th style="min-width: 150px">
                  <span class="d-block mb-2">Installed On</span>
                  <input type="text" class="form-control form-control-sm form-control-solid" placeholder="Search..." [ngModel]="searchInstalled()" (ngModelChange)="searchInstalled.set($event); currentPage.set(1)">
                </th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let app of paginatedApps()">
                <td class="text-dark-75 font-weight-bolder py-4">{{ app.name }}</td>
                <td>
                  <span class="badge" [ngClass]="app.type === 'Allowlisted' ? 'badge-light-success' : 'badge-light-danger'">
                    {{ app.type }}
                  </span>
                </td>
                <td class="text-muted font-weight-bold">{{ app.installed }}</td>
              </tr>
              <tr *ngIf="filteredApps().length === 0">
                <td colspan="3" class="text-center py-10 text-muted font-weight-bold">No applications found matching your search.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="d-flex justify-content-between align-items-center py-5 flex-wrap">
          <div class="d-flex align-items-center mb-2">
            <span class="text-muted font-weight-bold me-2">Show:</span>
            <select class="form-control form-control-sm form-control-solid w-75px" [(ngModel)]="pageSize" (change)="currentPage.set(1)">
              <option [value]="5">5</option>
              <option [value]="10">10</option>
              <option [value]="25">25</option>
              <option [value]="50">50</option>
            </select>
            <span class="text-muted font-weight-bold ms-4">
              Showing {{ startIndex() + 1 }} - {{ endIndex() }} of {{ filteredApps().length }} applications
            </span>
          </div>

          <div class="d-flex align-items-center mb-2">
            <ul class="pagination pagination-sm pagination-light-primary mb-0">
              <li class="page-item" [class.disabled]="currentPage() === 1">
                <a class="page-link cursor-pointer" (click)="currentPage() > 1 && currentPage.set(currentPage() - 1)">
                  <i class="fas fa-chevron-left"></i>
                </a>
              </li>
              <li *ngFor="let page of pages()" class="page-item" [class.active]="page === currentPage()">
                <a class="page-link cursor-pointer" (click)="currentPage.set(page)">{{ page }}</a>
              </li>
              <li class="page-item" [class.disabled]="currentPage() === totalPages()">
                <a class="page-link cursor-pointer" (click)="currentPage() < totalPages() && currentPage.set(currentPage() + 1)">
                  <i class="fas fa-chevron-right"></i>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .badge-light-success { color: #1BC5BD; background-color: #C9F7F5; }
    .badge-light-danger { color: #F64E60; background-color: #FFE2E5; }
    .table-head-custom th {
        color: #B5B5C3 !important;
        font-weight: 600;
        letter-spacing: 0.1rem;
        vertical-align: top;
        padding-top: 1rem;
        padding-bottom: 1rem;
    }
    .form-control-solid { background-color: #F3F6F9; border-color: #F3F6F9; color: #3F4254; }
    .form-control-solid:focus { background-color: #EBEDF3; border-color: #EBEDF3; color: #3F4254; }
    .w-75px { width: 75px !important; }
    .cursor-pointer { cursor: pointer; }
    .pagination .page-item.active .page-link { background-color: #3699FF; border-color: #3699FF; color: #ffffff; }
    .pagination .page-item:hover:not(.active):not(.disabled) .page-link { background-color: #F3F6F9; color: #3699FF; }
    .pagination .page-link { color: #7E8299; border: 0; margin: 0 2px; border-radius: 0.42rem; font-weight: 600; }
  `]
})
export class AppDetailComponent {
  public doughnutChartType: ChartType = 'doughnut';
  public doughnutChartData = computed<ChartConfiguration['data']>(() => {
    const allowlisted = this.applications.filter(a => a.type === 'Allowlisted').length;
    const blocklisted = this.applications.filter(a => a.type === 'Blocklisted').length;

    return {
      labels: ['Allowlisted', 'Blocklisted'],
      datasets: [
        {
          data: [allowlisted, blocklisted],
          backgroundColor: ['#3699FF', '#F64E60'],
          hoverBackgroundColor: ['#187DE4', '#F43B4E'],
          borderWidth: 0
        }
      ]
    };
  });

  public doughnutChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      }
    }
  };

  // Raw data
  applications = [
    { name: 'Chrome Browser', type: 'Allowlisted', installed: '142 Devices' },
    { name: 'Slack Desktop', type: 'Allowlisted', installed: '110 Devices' },
    { name: 'BitTorrent Client', type: 'Blocklisted', installed: '2 Devices' },
    { name: 'Zoom Client', type: 'Allowlisted', installed: '95 Devices' },
    { name: 'VLC Media Player', type: 'Blocklisted', installed: '5 Devices' },
    { name: 'Microsoft Teams', type: 'Allowlisted', installed: '130 Devices' },
    { name: 'Spotify Desktop', type: 'Blocklisted', installed: '12 Devices' },
    { name: 'VS Code', type: 'Allowlisted', installed: '80 Devices' },
    { name: 'Docker Desktop', type: 'Allowlisted', installed: '45 Devices' },
    { name: 'AnyDesk Remote', type: 'Blocklisted', installed: '3 Devices' },
    { name: 'IntelliJ IDEA', type: 'Allowlisted', installed: '30 Devices' },
    { name: 'Notion Desktop', type: 'Allowlisted', installed: '65 Devices' },
  ];

  // Table State
  searchName = signal('');
  searchType = signal('');
  searchInstalled = signal('');
  pageSize = signal(5);
  currentPage = signal(1);

  // Filtered Data
  filteredApps = computed(() => {
    return this.applications.filter(app => {
      const matchName = app.name.toLowerCase().includes(this.searchName().toLowerCase());
      const matchType = this.searchType() === '' || app.type === this.searchType();
      const matchInstalled = app.installed.toLowerCase().includes(this.searchInstalled().toLowerCase());
      return matchName && matchType && matchInstalled;
    });
  });

  // Pagination Logic
  totalPages = computed(() => Math.ceil(this.filteredApps().length / this.pageSize()) || 1);
  startIndex = computed(() => (this.currentPage() - 1) * this.pageSize());
  endIndex = computed(() => Math.min(this.startIndex() + Number(this.pageSize()), this.filteredApps().length));

  pages = computed(() => {
    const total = this.totalPages();
    const current = this.currentPage();
    const pagesArray = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, current - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(total, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pagesArray.push(i);
    }
    return pagesArray;
  });

  paginatedApps = computed(() => {
    return this.filteredApps().slice(this.startIndex(), this.endIndex());
  });
}
