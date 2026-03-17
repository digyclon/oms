import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="row">
      <div class="col-xl-3 col-lg-6 col-sm-12">
        <div class="card card-custom bg-info card-stretch gutter-b cursor-pointer" routerLink="/device-detail">
          <div class="card-body p-5">
            <i class="fas fa-laptop text-white icon-2x"></i>
            <div class="text-white font-weight-bolder font-size-h3 mt-2">150</div>
            <div class="text-white font-weight-bold font-size-sm mt-1">
              Total Devices
            </div>
          </div>
        </div>
      </div>

      <div class="col-xl-3 col-lg-6 col-sm-12">
        <div class="card card-custom bg-success card-stretch gutter-b cursor-pointer" routerLink="/app-detail">
          <div class="card-body p-5">
            <i class="fas fa-cubes text-white icon-2x"></i>
            <div class="text-white font-weight-bolder font-size-h3 mt-2">45</div>
            <div class="text-white font-weight-bold font-size-sm mt-1">
              Total Applications
            </div>
          </div>
        </div>
      </div>

      <div class="col-xl-3 col-lg-6 col-sm-12">
        <div class="card card-custom bg-danger card-stretch gutter-b cursor-pointer" routerLink="/alert-detail">
          <div class="card-body p-5">
            <i class="fas fa-exclamation-triangle text-white icon-2x"></i>
            <div class="text-white font-weight-bolder font-size-h3 mt-2">12</div>
            <div class="text-white font-weight-bold font-size-sm mt-1">
              Critical Alerts
            </div>
          </div>
        </div>
      </div>

      <div class="col-xl-3 col-lg-6 col-sm-12">
        <div class="card card-custom bg-primary card-stretch gutter-b cursor-pointer" routerLink="/health-detail">
          <div class="card-body p-5">
            <i class="fas fa-chart-line text-white icon-2x"></i>
            <div class="text-white font-weight-bolder font-size-h3 mt-2">89%</div>
            <div class="text-white font-weight-bold font-size-sm mt-1">
              System Health
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="row mt-2">
      <div class="col-lg-12">
        <div class="card card-custom gutter-b">
          <div class="card-header py-3">
            <div class="card-title">
              <h3 class="card-label font-weight-bolder text-dark font-size-h5">Recent Activity</h3>
            </div>
          </div>
          <div class="card-body p-5">
             <div class="table-responsive">
               <table class="table table-head-custom table-vertical-center border-bottom">
                 <thead>
                   <tr class="text-left text-uppercase">
                     <th style="min-width: 150px">
                       <span class="d-block mb-2">Activity</span>
                       <input type="text" class="form-control form-control-sm form-control-solid" placeholder="Search..." [ngModel]="searchActivity()" (ngModelChange)="searchActivity.set($event); currentPage.set(1)">
                     </th>
                     <th style="min-width: 150px">
                       <span class="d-block mb-2">Device</span>
                       <input type="text" class="form-control form-control-sm form-control-solid" placeholder="Search..." [ngModel]="searchDevice()" (ngModelChange)="searchDevice.set($event); currentPage.set(1)">
                     </th>
                     <th style="min-width: 150px">
                       <span class="d-block mb-2">Status</span>
                       <select class="form-control form-control-sm form-control-solid" [ngModel]="searchStatus()" (ngModelChange)="searchStatus.set($event); currentPage.set(1)">
                         <option value="">All Statuses</option>
                         <option value="Success">Success</option>
                         <option value="Pending">Pending</option>
                         <option value="Failed">Failed</option>
                       </select>
                     </th>
                     <th style="min-width: 150px">
                       <span class="d-block mb-2">Time</span>
                       <input type="text" class="form-control form-control-sm form-control-solid" placeholder="Search..." [ngModel]="searchTime()" (ngModelChange)="searchTime.set($event); currentPage.set(1)">
                     </th>
                   </tr>
                 </thead>
                 <tbody>
                   <tr *ngFor="let activity of paginatedActivities()">
                     <td class="py-4">{{ activity.name }}</td>
                     <td class="text-dark-75 font-weight-bolder">{{ activity.device }}</td>
                     <td>
                       <span class="badge" [ngClass]="{
                         'badge-light-success': activity.status === 'Success',
                         'badge-light-warning': activity.status === 'Pending',
                         'badge-light-danger': activity.status === 'Failed'
                       }">
                         {{ activity.status }}
                       </span>
                     </td>
                     <td class="text-muted font-weight-bold">{{ activity.time }}</td>
                   </tr>
                   <tr *ngIf="filteredActivities().length === 0">
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
                   Showing {{ startIndex() + 1 }} - {{ endIndex() }} of {{ filteredActivities().length }} activities
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
      </div>
    </div>
  `,
  styles: [`
    .icon-2x { font-size: 1.5rem; }
    .card-custom { border-radius: 0.5rem; }
    .gutter-b { margin-bottom: 1rem; }
    .cursor-pointer { cursor: pointer; }
    .cursor-pointer:hover { opacity: 0.9; }
    .badge-light-success { color: #1BC5BD; background-color: #C9F7F5; }
    .badge-light-warning { color: #FFA800; background-color: #FFF4DE; }
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
    .pagination .page-item.active .page-link { background-color: #3699FF; border-color: #3699FF; color: #ffffff; }
    .pagination .page-item:hover:not(.active):not(.disabled) .page-link { background-color: #F3F6F9; color: #3699FF; }
    .pagination .page-link { color: #7E8299; border: 0; margin: 0 2px; border-radius: 0.42rem; font-weight: 600; }
  `]
})
export class DashboardComponent {
  activities = [
    { name: 'App Installation', device: 'MacBook-Pro-14', status: 'Success', time: '2 mins ago' },
    { name: 'System Update', device: 'Windows-Desktop-Office', status: 'Pending', time: '15 mins ago' },
    { name: 'Network Alert', device: 'Linux-Server-Prod', status: 'Failed', time: '1 hour ago' },
    { name: 'Security Scan', device: 'Mobile-Android-01', status: 'Success', time: '3 hours ago' },
    { name: 'Policy Update', device: 'iPad-Marketing', status: 'Success', time: '5 hours ago' },
    { name: 'User Login', device: 'Surface-Laptop-4', status: 'Success', time: 'Yesterday' },
    { name: 'App Blocked', device: 'Dell-XPS-15', status: 'Failed', time: 'Yesterday' },
    { name: 'Firmware Update', device: 'Ubuntu-Workstation', status: 'Pending', time: '2 days ago' },
    { name: 'Data Sync', device: 'Samsung-Galaxy-S21', status: 'Success', time: '2 days ago' },
    { name: 'Backup Created', device: 'HP-Spectre-x360', status: 'Success', time: '3 days ago' },
  ];

  // Table State
  searchActivity = signal('');
  searchDevice = signal('');
  searchStatus = signal('');
  searchTime = signal('');
  pageSize = signal(5);
  currentPage = signal(1);

  // Filtered Data
  filteredActivities = computed(() => {
    return this.activities.filter(activity => {
      const matchName = activity.name.toLowerCase().includes(this.searchActivity().toLowerCase());
      const matchDevice = activity.device.toLowerCase().includes(this.searchDevice().toLowerCase());
      const matchStatus = this.searchStatus() === '' || activity.status === this.searchStatus();
      const matchTime = activity.time.toLowerCase().includes(this.searchTime().toLowerCase());
      return matchName && matchDevice && matchStatus && matchTime;
    });
  });

  // Pagination Logic
  totalPages = computed(() => Math.ceil(this.filteredActivities().length / this.pageSize()) || 1);
  startIndex = computed(() => (this.currentPage() - 1) * this.pageSize());
  endIndex = computed(() => Math.min(this.startIndex() + Number(this.pageSize()), this.filteredActivities().length));

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

  paginatedActivities = computed(() => {
    return this.filteredActivities().slice(this.startIndex(), this.endIndex());
  });
}
