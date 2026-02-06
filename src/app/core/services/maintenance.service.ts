import { Injectable, signal } from '@angular/core';
import { MaintenanceRequest } from '../models/maintenance.model';
import { FinanceService } from './finance.service';
import { LoggerService } from './logger.service';
import { Transaction } from '../models/finance.model';
import { MockDataService } from './mock-data.service';

@Injectable({
    providedIn: 'root'
})
export class MaintenanceService {
    requests = signal<MaintenanceRequest[]>([]);

    constructor(
        private mockData: MockDataService,
        private financeService: FinanceService,
        private logger: LoggerService
    ) {
        this.load();
    }

    load() {
        this.requests.set(this.mockData.getMaintenance());
    }

    addRequest(request: MaintenanceRequest) {
        this.requests.update(r => [...r, request]);
        this.logger.info(`Maintenance request added: ${request.title}`);
    }

    updateRequest(id: string, updates: Partial<MaintenanceRequest>) {
        this.requests.update(current => {
            const index = current.findIndex(r => r.id === id);
            if (index !== -1) {
                const originalRequest = current[index];
                const updatedRequest = { ...originalRequest, ...updates, updatedAt: new Date() };
                const updatedList = [...current];
                updatedList[index] = updatedRequest;

                // Automation: Create Expense Transaction if Resolved with Cost
                const isResolved = updatedRequest.status === 'Resolved';
                const wasResolved = originalRequest.status === 'Resolved';
                const hasCost = (updatedRequest.cost || 0) > 0;

                if (isResolved && !wasResolved && hasCost) {
                    const transaction: Transaction = {
                        id: 'tx-' + Date.now(),
                        propertyId: updatedRequest.propertyId,
                        unitId: updatedRequest.unitId,
                        tenantId: updatedRequest.tenantId,
                        date: new Date(),
                        amount: updatedRequest.cost!,
                        type: 'Expense',
                        category: 'Maintenance',
                        description: `Maintenance: ${updatedRequest.title}`,
                        status: 'Paid',
                        createdAt: new Date()
                    };
                    this.financeService.addTransaction(transaction);
                    this.logger.info(`Maintenance resolution triggered expense transaction for request: ${id}`);
                }

                this.logger.info(`Maintenance request updated: ${id}`);
                return updatedList;
            }
            return current;
        });
    }

    deleteRequest(id: string) {
        this.requests.update(current => current.filter(r => r.id !== id));
        this.logger.info(`Maintenance request deleted: ${id}`);
    }
}
