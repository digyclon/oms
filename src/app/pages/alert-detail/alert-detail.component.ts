import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartType } from 'chart.js';

@Component({
  selector: 'app-alert-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, BaseChartDirective],
  template: `
    <div class="card card-custom gutter-b mb-6">
      <div class="card-header py-3">
        <div class="card-title">
          <h3 class="card-label font-weight-bolder text-dark font-size-h5">Forbidden Activity Trend</h3>
        </div>
      </div>
      <div class="card-body p-5">
        <div class="mb-10" style="height: 300px; width: 100%;">
          <canvas baseChart
            [data]="lineChartData()"
            [options]="lineChartOptions"
            [type]="lineChartType">
          </canvas>
        </div>
      </div>
    </div>

    <div class="card card-custom card-stretch">
      <div class="card-header border-0 py-5">
        <h3 class="card-title align-items-start flex-column">
          <span class="card-label font-weight-bolder text-dark">Critical Issues Detailed Information</span>
          <span class="text-muted mt-3 font-weight-bold font-size-sm">List of forbidden activities detected in the system</span>
        </h3>
      </div>
      <div class="card-body py-0">
        <div class="table-responsive">
          <table class="table table-head-custom table-vertical-center border-bottom">
            <thead>
              <tr class="text-left text-uppercase">
                <th style="min-width: 200px">
                  <span class="d-block mb-2">Activity</span>
                  <input type="text" class="form-control form-control-sm form-control-solid" placeholder="Search..." [ngModel]="searchActivity()" (ngModelChange)="searchActivity.set($event); currentPage.set(1)">
                </th>
                <th style="min-width: 200px">
                  <span class="d-block mb-2">User / Device</span>
                  <input type="text" class="form-control form-control-sm form-control-solid" placeholder="Search..." [ngModel]="searchUser()" (ngModelChange)="searchUser.set($event); currentPage.set(1)">
                </th>
                <th style="min-width: 150px">
                  <span class="d-block mb-2">Risk Level</span>
                  <select class="form-control form-control-sm form-control-solid" [ngModel]="searchRisk()" (ngModelChange)="searchRisk.set($event); currentPage.set(1)">
                    <option value="">All Levels</option>
                    <option value="Critical">Critical</option>
                    <option value="Warning">Warning</option>
                  </select>
                </th>
                <th style="min-width: 150px">
                  <span class="d-block mb-2">Detection Date</span>
                  <input type="text" class="form-control form-control-sm form-control-solid" placeholder="Search..." [ngModel]="searchDate()" (ngModelChange)="searchDate.set($event); currentPage.set(1)">
                </th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let alert of paginatedAlerts()">
                <td class="text-dark-75 font-weight-bolder py-4">{{ alert.activity }}</td>
                <td class="text-muted font-weight-bold">{{ alert.user }}</td>
                <td>
                  <span class="badge" [ngClass]="alert.risk === 'Critical' ? 'badge-light-danger' : 'badge-light-warning'">
                    {{ alert.risk }}
                  </span>
                </td>
                <td class="text-muted font-weight-bold">{{ alert.date }}</td>
              </tr>
              <tr *ngIf="filteredAlerts().length === 0">
                <td colspan="4" class="text-center py-10 text-muted font-weight-bold">No activities found matching your search.</td>
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
              Showing {{ startIndex() + 1 }} - {{ endIndex() }} of {{ filteredAlerts().length }} alerts
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
    .badge-light-danger { color: #F64E60; background-color: #FFE2E5; }
    .badge-light-warning { color: #FFA800; background-color: #FFF4DE; }
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
export class AlertDetailComponent {
  public lineChartType: ChartType = 'line';
  public lineChartData = computed<ChartConfiguration['data']>(() => {
    // Group alerts by date (YYYY-MM-DD)
    const countsByDate: { [key: string]: number } = {};
    this.alerts.forEach(alert => {
      const date = alert.date.split(' ')[0];
      countsByDate[date] = (countsByDate[date] || 0) + 1;
    });

    const sortedDates = Object.keys(countsByDate).sort();
    const displayLabels = sortedDates.map(d => {
      const [y, m, day] = d.split('-');
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return `${months[parseInt(m) - 1]} ${day}`;
    });
    const displayData = sortedDates.map(d => countsByDate[d]);

    return {
      labels: displayLabels,
      datasets: [
        {
          data: displayData,
          label: 'Forbidden Activities',
          backgroundColor: 'rgba(246, 78, 96, 0.1)',
          borderColor: '#F64E60',
          pointBackgroundColor: '#F64E60',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: '#F64E60',
          fill: 'origin',
          tension: 0.4
        }
      ]
    };
  });

  public lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          display: true,
          drawOnChartArea: true
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  };

  // Raw data
  alerts = [
    { activity: 'Blocked App Install', user: 'j.doe@company.com / MacBook-01', risk: 'Critical', date: '2026-03-16 10:20' },
    { activity: 'Unauthorized File Transfer', user: 'a.smith@company.com / Win-PC-04', risk: 'Critical', date: '2026-03-15 14:45' },
    { activity: 'VPN Policy Bypass', user: 'm.wilson@company.com / Linux-Srv', risk: 'Warning', date: '2026-03-15 09:12' },
    { activity: 'Forbidden Website Access', user: 's.brown@company.com / Mobile-01', risk: 'Warning', date: '2026-03-14 17:30' },
    { activity: 'External Drive Insertion', user: 'k.lee@company.com / iMac-Design', risk: 'Critical', date: '2026-03-14 08:05' },
    { activity: 'Social Media Access', user: 'r.taylor@company.com / MacBook-02', risk: 'Warning', date: '2026-03-13 11:15' },
    { activity: 'Mass File Deletion', user: 'p.jones@company.com / Win-PC-01', risk: 'Critical', date: '2026-03-12 16:40' },
    { activity: 'Registry Modification', user: 'h.clark@company.com / Win-PC-02', risk: 'Critical', date: '2026-03-11 10:55' },
    { activity: 'Unusual Login Location', user: 't.white@company.com / Mobile-02', risk: 'Warning', date: '2026-03-10 22:30' },
    { activity: 'Port Scanning', user: 'l.davis@company.com / Linux-Srv-02', risk: 'Critical', date: '2026-03-09 13:20' },
  ];

  // Table State
  searchActivity = signal('');
  searchUser = signal('');
  searchRisk = signal('');
  searchDate = signal('');
  pageSize = signal(5);
  currentPage = signal(1);

  // Filtered Data
  filteredAlerts = computed(() => {
    return this.alerts.filter(alert => {
      const matchActivity = alert.activity.toLowerCase().includes(this.searchActivity().toLowerCase());
      const matchUser = alert.user.toLowerCase().includes(this.searchUser().toLowerCase());
      const matchRisk = this.searchRisk() === '' || alert.risk === this.searchRisk();
      const matchDate = alert.date.toLowerCase().includes(this.searchDate().toLowerCase());
      return matchActivity && matchUser && matchRisk && matchDate;
    });
  });

  // Pagination Logic
  totalPages = computed(() => Math.ceil(this.filteredAlerts().length / this.pageSize()) || 1);
  startIndex = computed(() => (this.currentPage() - 1) * this.pageSize());
  endIndex = computed(() => Math.min(this.startIndex() + Number(this.pageSize()), this.filteredAlerts().length));

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

  paginatedAlerts = computed(() => {
    return this.filteredAlerts().slice(this.startIndex(), this.endIndex());
  });
}
