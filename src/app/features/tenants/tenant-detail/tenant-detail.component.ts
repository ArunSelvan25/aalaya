import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { TenantService } from '../../../core/services/tenant.service';
import { LeaseService } from '../../../core/services/lease.service';
import { FinanceService } from '../../../core/services/finance.service';
import { MaintenanceService } from '../../../core/services/maintenance.service';
import { PropertyService } from '../../../core/services/property.service';
import { Tenant } from '../../../core/models/tenant.model';

@Component({
    selector: 'app-tenant-detail',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './tenant-detail.component.html'
})
export class TenantDetailComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private tenantService = inject(TenantService);
    private leaseService = inject(LeaseService);
    private financeService = inject(FinanceService);
    private maintenanceService = inject(MaintenanceService);
    private propertyService = inject(PropertyService);

    tenantId = signal<string | null>(null);

    tenant = computed(() =>
        this.tenantService.tenants().find(t => t.id === this.tenantId())
    );

    tenantLeases = computed(() => {
        const id = this.tenantId();
        if (!id) return [];
        return this.leaseService.leases()
            .filter(l => l.tenantId === id)
            .map(lease => {
                const property = this.propertyService.properties().find(p => p.id === lease.propertyId);
                return {
                    ...lease,
                    propertyName: property?.name || 'Unknown Property'
                };
            });
    });

    tenantTransactions = computed(() => {
        const id = this.tenantId();
        if (!id) return [];
        return this.financeService.transactions()
            .filter(tx => tx.tenantId === id)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    });

    tenantMaintenance = computed(() => {
        const id = this.tenantId();
        if (!id) return [];
        return this.maintenanceService.requests()
            .filter(m => m.tenantId === id)
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    });

    ngOnInit() {
        this.route.paramMap.subscribe(params => {
            this.tenantId.set(params.get('id'));
        });
    }

    getStatusClass(status: string): string {
        const base = 'px-3 py-1 rounded-full text-xs font-semibold';
        switch (status) {
            case 'Active': return `${base} bg-green-100 text-green-800`;
            case 'Past': return `${base} bg-gray-100 text-gray-800`;
            case 'Prospect': return `${base} bg-yellow-100 text-yellow-800`;
            default: return base;
        }
    }

    getLeaseStatusClass(status: string): string {
        const base = 'px-2 py-0.5 rounded text-xs font-medium';
        switch (status) {
            case 'Active': return `${base} bg-green-100 text-green-700`;
            case 'Pending': return `${base} bg-blue-100 text-blue-700`;
            case 'Expired': return `${base} bg-red-100 text-red-700`;
            default: return `${base} bg-gray-100 text-gray-700`;
        }
    }

    getPaymentStatusClass(status: string): string {
        const base = 'px-2 py-0.5 rounded-full text-xs font-medium';
        switch (status) {
            case 'Paid': return `${base} bg-green-100 text-green-700`;
            case 'Pending': return `${base} bg-yellow-100 text-yellow-700`;
            case 'Overdue': return `${base} bg-red-100 text-red-700`;
            default: return `${base} bg-gray-100 text-gray-700`;
        }
    }

    getMaintenanceStatusClass(status: string): string {
        const base = 'px-2 py-0.5 rounded text-xs font-medium';
        switch (status) {
            case 'Open': return `${base} bg-blue-50 text-blue-700`;
            case 'In Progress': return `${base} bg-purple-50 text-purple-700`;
            case 'Resolved': return `${base} bg-green-50 text-green-700`;
            case 'Closed': return `${base} bg-gray-50 text-gray-700`;
            default: return base;
        }
    }

    getPriorityDot(priority: string): string {
        const base = 'h-2.5 w-2.5 rounded-full';
        switch (priority) {
            case 'Emergency': return `${base} bg-red-600`;
            case 'High': return `${base} bg-orange-500`;
            case 'Medium': return `${base} bg-yellow-500`;
            case 'Low': return `${base} bg-green-500`;
            default: return `${base} bg-gray-400`;
        }
    }
}
