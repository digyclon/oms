import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartType } from 'chart.js';

@Component({
  selector: 'app-health-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, BaseChartDirective],
  template: `
    <div class="card card-custom gutter-b mb-6">
      <div class="card-header py-3">
        <div class="card-title">
          <h3 class="card-label font-weight-bolder text-dark font-size-h5">System Health Overview</h3>
        </div>
      </div>
      <div class="card-body p-5">
        <div class="mb-10" style="height: 300px; width: 100%;">
          <canvas baseChart
            [data]="barChartData()"
            [options]="barChartOptions"
            [type]="barChartType">
          </canvas>
        </div>
      </div>
    </div>

    <div class="card card-custom card-stretch">
      <div class="card-header border-0 py-5">
        <h3 class="card-title align-items-start flex-column">
          <span class="card-label font-weight-bolder text-dark">Unresolved Task List</span>
          <span class="text-muted mt-3 font-weight-bold font-size-sm">Detailed view of issues requiring immediate administrator action</span>
        </h3>
      </div>
      <div class="card-body py-0">
        <div class="table-responsive">
          <table class="table table-head-custom table-vertical-center border-bottom">
            <thead>
              <tr class="text-left text-uppercase">
                <th style="min-width: 150px">
                  <span class="d-block mb-2">Category</span>
                  <input type="text" class="form-control form-control-sm form-control-solid" placeholder="Search..." [ngModel]="searchCategory()" (ngModelChange)="searchCategory.set($event); currentPage.set(1)">
                </th>
                <th style="min-width: 250px">
                  <span class="d-block mb-2">Description</span>
                  <input type="text" class="form-control form-control-sm form-control-solid" placeholder="Search..." [ngModel]="searchDescription()" (ngModelChange)="searchDescription.set($event); currentPage.set(1)">
                </th>
                <th style="min-width: 150px">
                  <span class="d-block mb-2">Priority</span>
                  <select class="form-control form-control-sm form-control-solid" [ngModel]="searchPriority()" (ngModelChange)="searchPriority.set($event); currentPage.set(1)">
                    <option value="">All Priorities</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </th>
                <th style="min-width: 150px">
                  <span class="d-block mb-2">Due Time</span>
                  <input type="text" class="form-control form-control-sm form-control-solid" placeholder="Search..." [ngModel]="searchDue()" (ngModelChange)="searchDue.set($event); currentPage.set(1)">
                </th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let task of paginatedTasks()">
                <td class="text-dark-75 font-weight-bolder py-4">{{ task.category }}</td>
                <td class="text-muted font-weight-bold">{{ task.description }}</td>
                <td>
                  <span class="badge" [ngClass]="{
                    'badge-light-danger': task.priority === 'High',
                    'badge-light-warning': task.priority === 'Medium',
                    'badge-light-primary': task.priority === 'Low'
                  }">
                    {{ task.priority }}
                  </span>
                </td>
                <td class="text-muted font-weight-bold">{{ task.due }}</td>
              </tr>
              <tr *ngIf="filteredTasks().length === 0">
                <td colspan="4" class="text-center py-10 text-muted font-weight-bold">No unresolved tasks found matching your search.</td>
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
              Showing {{ startIndex() + 1 }} - {{ endIndex() }} of {{ filteredTasks().length }} tasks
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
    .badge-light-primary { color: #3699FF; background-color: #E1F0FF; }
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
export class HealthDetailComponent {
  public barChartType: ChartType = 'bar';
  public barChartData = computed<ChartConfiguration['data']>(() => {
    // Group tasks by category
    const countsByCategory: { [key: string]: number } = {};
    this.tasks.forEach(task => {
      countsByCategory[task.category] = (countsByCategory[task.category] || 0) + 1;
    });

    const labels = Object.keys(countsByCategory).sort();
    const data = labels.map(label => countsByCategory[label]);

    return {
      labels: labels,
      datasets: [
        {
          data: data,
          label: 'Unresolved Issues',
          backgroundColor: '#3699FF',
          hoverBackgroundColor: '#187DE4',
          borderRadius: 4
        }
      ]
    };
  });

  public barChartOptions: ChartConfiguration['options'] = {
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
  tasks = [
    { category: 'Block Application', description: 'Restricted software detected on 5 devices', priority: 'High', due: '12:00 PM' },
    { category: 'Block Network', description: 'Unauthorized IP access attempts in HK office', priority: 'High', due: '02:00 PM' },
    { category: 'Enroll Device', description: 'Pending enrollment for 8 new employee laptops', priority: 'Medium', due: '05:00 PM' },
    { category: 'Policy Update', description: 'Global security policy v2.4 not synced', priority: 'Medium', due: '06:00 PM' },
    { category: 'System Scan', description: 'Routine malware scan failed on Server-B', priority: 'Low', due: '08:00 PM' },
    { category: 'Credential Leak', description: 'Potential credential exposure on public repo', priority: 'High', due: '10:00 AM' },
    { category: 'Firewall Breach', description: 'Multiple attempts to bypass firewall rules', priority: 'High', due: '11:30 AM' },
    { category: 'Disk Space', description: 'Critical disk space warning on Storage-01', priority: 'Medium', due: '03:45 PM' },
    { category: 'SSL Expiry', description: 'SSL certificate for portal.oms.com expires in 3 days', priority: 'Medium', due: '04:15 PM' },
    { category: 'User Onboarding', description: 'Setup 10 new accounts for interns', priority: 'Low', due: '05:30 PM' },
  ];

  // Table State
  searchCategory = signal('');
  searchDescription = signal('');
  searchPriority = signal('');
  searchDue = signal('');
  pageSize = signal(5);
  currentPage = signal(1);

  // Filtered Data
  filteredTasks = computed(() => {
    return this.tasks.filter(task => {
      const matchCategory = task.category.toLowerCase().includes(this.searchCategory().toLowerCase());
      const matchDescription = task.description.toLowerCase().includes(this.searchDescription().toLowerCase());
      const matchPriority = this.searchPriority() === '' || task.priority === this.searchPriority();
      const matchDue = task.due.toLowerCase().includes(this.searchDue().toLowerCase());
      return matchCategory && matchDescription && matchPriority && matchDue;
    });
  });

  // Pagination Logic
  totalPages = computed(() => Math.ceil(this.filteredTasks().length / this.pageSize()) || 1);
  startIndex = computed(() => (this.currentPage() - 1) * this.pageSize());
  endIndex = computed(() => Math.min(this.startIndex() + Number(this.pageSize()), this.filteredTasks().length));

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

  paginatedTasks = computed(() => {
    return this.filteredTasks().slice(this.startIndex(), this.endIndex());
  });
}
