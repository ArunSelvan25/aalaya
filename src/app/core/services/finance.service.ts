import { Injectable, signal } from '@angular/core';
import { Transaction } from '../models/finance.model';
import { LoggerService } from './logger.service';
import { MockDataService } from './mock-data.service';

@Injectable({
    providedIn: 'root'
})
export class FinanceService {
    transactions = signal<Transaction[]>([]);

    constructor(
        private mockData: MockDataService,
        private logger: LoggerService
    ) {
        this.load();
    }

    load() {
        this.transactions.set(this.mockData.getFinance());
    }

    addTransaction(transaction: Transaction) {
        this.transactions.update(t => [...t, transaction]);
        this.logger.info(`Transaction added: ${transaction.type} - ${transaction.amount} (${transaction.category})`);
    }

    generateRentTransaction(leaseId: string, tenantId: string, propertyId: string, unitId: string, amount: number) {
        const transaction: Transaction = {
            id: 'tx-' + Date.now(),
            propertyId,
            unitId,
            leaseId,
            tenantId,
            date: new Date(),
            amount,
            type: 'Income',
            category: 'Rent',
            description: `Automated Rent Generation for Lease ${leaseId}`,
            status: 'Pending',
            createdAt: new Date()
        };
        this.addTransaction(transaction);
    }

    getRecentTransactions(limit: number): Transaction[] {
        return this.transactions()
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, limit);
    }

    updateTransaction(id: string, updates: Partial<Transaction>) {
        this.transactions.update(current => {
            const index = current.findIndex(t => t.id === id);
            if (index !== -1) {
                const updatedList = [...current];
                updatedList[index] = { ...current[index], ...updates };
                return updatedList;
            }
            return current;
        });
    }

    deleteTransaction(id: string) {
        this.transactions.update(current => current.filter(t => t.id !== id));
    }
}
