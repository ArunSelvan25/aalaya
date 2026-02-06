export type MaintenancePriority = 'Low' | 'Medium' | 'High' | 'Emergency';
export type MaintenanceStatus = 'Open' | 'In Progress' | 'Resolved' | 'Closed';

export interface MaintenanceRequest {
    id: string;
    propertyId: string;
    unitId?: string;
    tenantId: string;
    title: string;
    description: string;
    category: 'Plumbing' | 'Electrical' | 'HVAC' | 'Appliance' | 'General' | 'Other';
    priority: MaintenancePriority;
    status: MaintenanceStatus;
    images?: string[];
    assignedVendor?: string;
    cost?: number;
    scheduledDate?: Date;
    completedDate?: Date;
    createdAt: Date;
    updatedAt: Date;
}
