import { Component, inject, computed } from '@angular/core';
import { StatCard } from '../../components/dashboard/stat-card/stat-card';
import { RevenueCard } from '../../components/dashboard/revenue-card/revenue-card';
import { OccupancyCard } from '../../components/dashboard/occupancy-card/occupancy-card';
import { MaintenanceCard } from '../../components/dashboard/maintenance-card/maintenance-card';
import { ActivityFeed } from '../../components/dashboard/activity-feed/activity-feed';
import { QuickActions } from '../../components/dashboard/quick-actions/quick-actions';
import { PropertyService } from '../../../core/services/property.service';
import { LeaseService } from '../../../core/services/lease.service';
import { FinanceService } from '../../../core/services/finance.service';
import { MaintenanceService } from '../../../core/services/maintenance.service';

@Component({
  selector: 'app-dashboard-page',
  imports: [StatCard, RevenueCard, OccupancyCard, MaintenanceCard, ActivityFeed, QuickActions],
  templateUrl: './dashboard-page.html',
  styleUrl: './dashboard-page.css',
})
export class DashboardPage {
  private propertyService = inject(PropertyService);
  private leaseService = inject(LeaseService);
  private financeService = inject(FinanceService);
  private maintenanceService = inject(MaintenanceService);

  // Computed stats from services
  totalProperties = computed(() => this.propertyService.properties().length);

  activeLeases = computed(() =>
    this.leaseService.leases().filter(l => l.status === 'Active').length
  );

  vacantUnits = computed(() => {
    const totalUnits = this.propertyService.properties().reduce((sum, p) => sum + (p.units || 0), 0);
    return totalUnits - this.activeLeases();
  });

  monthlyRevenue = computed(() => {
    const income = this.financeService.transactions()
      .filter(t => t.type === 'Income')
      .reduce((sum, t) => sum + t.amount, 0);
    return this.formatCurrency(income);
  });

  openMaintenance = computed(() =>
    this.maintenanceService.requests().filter(r => r.status === 'Open' || r.status === 'In Progress').length
  );

  private formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }
}
