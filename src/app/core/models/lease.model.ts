import { Tenant } from './tenant.model';
import { Unit } from './property.model';

export type LeaseStatus = 'Active' | 'Pending' | 'Expired' | 'Terminated';
export type PaymentFrequency = 'Monthly' | 'Quarterly' | 'Yearly';

export interface Lease {
    id: string;
    propertyId: string;
    unitId: string;
    tenantId: string;
    startDate: Date;
    endDate: Date;
    rentAmount: number;
    securityDeposit: number;
    paymentFrequency: PaymentFrequency;
    status: LeaseStatus;
    documents?: string[]; // URLs or paths to files
    terms?: string;
    createdAt: Date;
    updatedAt: Date;

    // Expanded for UI convenience in some views, but typically normalized
    tenant?: Tenant;
    unit?: Unit;
}
