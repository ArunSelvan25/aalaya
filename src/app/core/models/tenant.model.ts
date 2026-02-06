export interface Tenant {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth?: Date;
    employmentStatus?: string;
    annualIncome?: number;
    emergencyContact?: {
        name: string;
        phone: string;
        relation: string;
    };
    status: 'Active' | 'Past' | 'Prospect';
    createdAt: Date;
    updatedAt: Date;
}
