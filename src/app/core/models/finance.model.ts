export type TransactionType = 'Income' | 'Expense';
export type TransactionCategory = 'Rent' | 'Deposit' | 'Maintenance' | 'Utilities' | 'Insurance' | 'Tax' | 'Other';
export type PaymentStatus = 'Paid' | 'Pending' | 'Overdue' | 'Failed';

export interface Transaction {
    id: string;
    propertyId: string;
    unitId?: string; // Optional if property-wide expense
    leaseId?: string; // For rent payments
    tenantId?: string; // Who paid or related tenant
    date: Date;
    amount: number;
    type: TransactionType;
    category: TransactionCategory;
    description: string;
    status: PaymentStatus;
    referenceNumber?: string; // Cheque #, Transaction ID
    createdAt: Date;
}
