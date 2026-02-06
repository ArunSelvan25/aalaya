import { Injectable, signal } from '@angular/core';
import { Lease } from '../models/lease.model';
import { PropertyService } from './property.service';
import { FinanceService } from './finance.service';
import { TenantService } from './tenant.service';
import { LoggerService } from './logger.service';
import { Transaction } from '../models/finance.model';
import { MockDataService } from './mock-data.service';

@Injectable({
    providedIn: 'root'
})
export class LeaseService {
    leases = signal<Lease[]>([]);

    constructor(
        private mockData: MockDataService,
        private propertyService: PropertyService,
        private financeService: FinanceService,
        private tenantService: TenantService,
        private logger: LoggerService
    ) {
        this.load();
    }

    load() {
        this.leases.set(this.mockData.getLeases());
    }

    addLease(lease: Lease) {
        this.leases.update(l => [...l, lease]);

        // Automation: Update Unit Status to Occupied
        if (lease.propertyId && lease.unitId) {
            this.propertyService.updateUnitStatus(lease.propertyId, lease.unitId, 'Occupied');
        }

        // Automation: Update Tenant Status to Active
        if (lease.tenantId) {
            this.tenantService.updateTenantStatus(lease.tenantId, 'Active');
        }

        // Automation: Create Security Deposit Transaction in Finance
        if (lease.securityDeposit > 0) {
            const transaction: Transaction = {
                id: 'tx-' + Date.now(),
                propertyId: lease.propertyId,
                unitId: lease.unitId,
                leaseId: lease.id,
                tenantId: lease.tenantId,
                date: new Date(),
                amount: lease.securityDeposit,
                type: 'Income',
                category: 'Deposit',
                description: `Security Deposit for Lease ${lease.id}`,
                status: 'Paid',
                createdAt: new Date()
            };
            this.financeService.addTransaction(transaction);
        }

        // Automation: Generate First Rent Transaction
        if (lease.rentAmount > 0) {
            this.financeService.generateRentTransaction(
                lease.id,
                lease.tenantId,
                lease.propertyId,
                lease.unitId,
                lease.rentAmount
            );
        }

        this.logger.info(`Lease added and automations triggered for lease: ${lease.id}`);
    }

    updateLease(id: string, updates: Partial<Lease>) {
        this.leases.update(current => {
            const index = current.findIndex(l => l.id === id);
            if (index !== -1) {
                const updatedList = [...current];
                updatedList[index] = { ...current[index], ...updates, updatedAt: new Date() };
                return updatedList;
            }
            return current;
        });
    }

    deleteLease(id: string) {
        const current = this.leases();
        const lease = current.find(l => l.id === id);
        this.leases.update(l => l.filter(item => item.id !== id));

        // Automation: Update Unit Status to Vacant
        if (lease && lease.propertyId && lease.unitId) {
            this.propertyService.updateUnitStatus(lease.propertyId, lease.unitId, 'Vacant');
        }

        // Automation: Update Tenant Status to Past
        if (lease && lease.tenantId) {
            this.tenantService.updateTenantStatus(lease.tenantId, 'Past');
        }

        this.logger.info(`Lease deleted and unit/tenant statuses updated: ${id}`);
    }

    getLease(id: string): Lease | undefined {
        return this.leases().find(l => l.id === id);
    }
}
