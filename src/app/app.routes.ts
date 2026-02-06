import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './shared/components/layouts/auth-layout-component/auth-layout-component';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { DashboardPage } from './shared/pages/dashboard-page/dashboard-page';
import { PropertiesPage } from './shared/pages/properties-page/properties-page';
import { PropertyView } from './shared/pages/property-view/property-view';
import { TenantListComponent } from './features/tenants/tenant-list/tenant-list.component';
import { LeaseListComponent } from './features/leases/lease-list/lease-list.component';
import { RequestListComponent } from './features/maintenance/request-list/request-list.component';
import { TransactionsComponent } from './features/finance/transactions/transactions.component';
import { TenantDetailComponent } from './features/tenants/tenant-detail/tenant-detail.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: "",
    component: AuthLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: "dashboard",
        component: DashboardPage
      },
      {
        path: "properties",
        component: PropertiesPage
      },
      {
        path: "property/:id",
        component: PropertyView
      },
      {
        path: "tenants",
        component: TenantListComponent
      },
      {
        path: "tenant/:id",
        component: TenantDetailComponent
      },
      {
        path: "leases",
        component: LeaseListComponent
      },
      {
        path: "maintenance",
        component: RequestListComponent
      },
      {
        path: "finance",
        component: TransactionsComponent
      }
    ]
  }
];
