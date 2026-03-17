import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { LayoutComponent } from './layout/layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { DevicesComponent } from './pages/devices/devices.component';
import { InstalledAppsComponent } from './pages/installed-apps/installed-apps.component';
import { ActivityReportsComponent } from './pages/activity-reports/activity-reports.component';
import { NetworkReportsComponent } from './pages/network-reports/network-reports.component';
import { AlertsExportsComponent } from './pages/alerts-exports/alerts-exports.component';
import { UserProfileComponent } from './pages/user-profile/user-profile.component';
import { ChangePasswordComponent } from './pages/change-password/change-password.component';
import { DeviceDetailComponent } from './pages/device-detail/device-detail.component';
import { AppDetailComponent } from './pages/app-detail/app-detail.component';
import { AlertDetailComponent } from './pages/alert-detail/alert-detail.component';
import { HealthDetailComponent } from './pages/health-detail/health-detail.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent, data: { permission: 'view_dashboard' } },
      { path: 'devices', component: DevicesComponent, data: { permission: 'view_devices' } },
      { path: 'installed-apps', component: InstalledAppsComponent, data: { permission: 'view_apps' } },
      { path: 'activity-reports', component: ActivityReportsComponent, data: { permission: 'view_reports' } },
      { path: 'network-reports', component: NetworkReportsComponent, data: { permission: 'view_reports' } },
      { path: 'alerts-exports', component: AlertsExportsComponent, data: { permission: 'view_alerts' } },
      { path: 'user-profile', component: UserProfileComponent },
      { path: 'change-password', component: ChangePasswordComponent },
      { path: 'device-detail', component: DeviceDetailComponent, data: { permission: 'view_devices' } },
      { path: 'app-detail', component: AppDetailComponent, data: { permission: 'view_apps' } },
      { path: 'alert-detail', component: AlertDetailComponent, data: { permission: 'view_alerts' } },
      { path: 'health-detail', component: HealthDetailComponent, data: { permission: 'view_dashboard' } },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: 'login' }
];
