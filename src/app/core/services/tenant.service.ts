import { Injectable, signal } from '@angular/core';
import { Tenant } from '../models/tenant.model';
import { MockDataService } from './mock-data.service';

@Injectable({
    providedIn: 'root'
})
export class TenantService {
    tenants = signal<Tenant[]>([]);

    constructor(private mockData: MockDataService) {
        this.load();
    }

    load() {
        this.tenants.set(this.mockData.getTenants());
    }

    addTenant(tenant: Tenant) {
        this.tenants.update(t => [...t, tenant]);
    }

    updateTenant(id: string, updates: Partial<Tenant>) {
        this.tenants.update(current => {
            const index = current.findIndex(t => t.id === id);
            if (index !== -1) {
                const updated = [...current];
                updated[index] = { ...current[index], ...updates, updatedAt: new Date() };
                return updated;
            }
            return current;
        });
    }

    deleteTenant(id: string) {
        this.tenants.update(current => current.filter(t => t.id !== id));
    }

    updateTenantStatus(id: string, status: 'Active' | 'Past' | 'Prospect'): void {
        this.updateTenant(id, { status });
    }

    getTenant(id: string): Tenant | undefined {
        return this.tenants().find(t => t.id === id);
    }
}
