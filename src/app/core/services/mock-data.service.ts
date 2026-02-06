import { Injectable } from '@angular/core';
import { Property, Unit } from '../models/property.model';
import { Tenant } from '../models/tenant.model';
import { Lease } from '../models/lease.model';
import { Transaction } from '../models/finance.model';

@Injectable({
    providedIn: 'root'
})
export class MockDataService {
    getProperties(): Property[] {
        return [
            {
                id: 'p-1',
                name: 'Sunset Apartments',
                type: 'Apartment',
                status: 'Occupied',
                address: '123 Sunset Blvd, Los Angeles, CA 90012',
                location: {
                    address: '123 Sunset Blvd, Los Angeles, CA 90012'
                },
                price: 2500,
                currency: 'USD',
                billingCycle: 'Monthly',
                bedrooms: 2,
                bathrooms: 1,
                size_sqft: 850,
                available: false,
                units: 10,
                yearBuilt: 2015,
                amenities: ['Pool', 'Gym', 'Parking'],
                images: ['home.jpg'],
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: 'p-2',
                name: 'Oceanview Condo',
                type: 'Condo',
                status: 'Vacant',
                address: '456 Ocean Dr, Miami, FL 33139',
                location: {
                    address: '456 Ocean Dr, Miami, FL 33139'
                },
                price: 4500,
                currency: 'USD',
                billingCycle: 'Monthly',
                bedrooms: 3,
                bathrooms: 2,
                size_sqft: 1500,
                available: true,
                units: 1,
                yearBuilt: 2020,
                amenities: ['Sea View', 'Concierge'],
                images: ['home1.jpg'],
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ];
    }

    getUnits(): Unit[] {
        return [
            {
                id: 'u-1',
                propertyId: 'p-1',
                unitNumber: '101',
                bedrooms: 2,
                bathrooms: 1,
                squareFeet: 850,
                rentAmount: 2500,
                status: 'Occupied'
            },
            {
                id: 'u-2',
                propertyId: 'p-1',
                unitNumber: '102',
                bedrooms: 1,
                bathrooms: 1,
                squareFeet: 650,
                rentAmount: 1800,
                status: 'Vacant'
            },
            {
                id: 'u-3',
                propertyId: 'p-2',
                unitNumber: 'PH-1',
                bedrooms: 3,
                bathrooms: 2,
                squareFeet: 1500,
                rentAmount: 4500,
                status: 'Vacant'
            }
        ];
    }

    getTenants(): Tenant[] {
        return [
            {
                id: 't-1',
                firstName: 'John',
                lastName: 'Doe',
                email: 'john@example.com',
                phone: '555-0101',
                status: 'Active',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: 't-2',
                firstName: 'Jane',
                lastName: 'Smith',
                email: 'jane@example.com',
                phone: '555-0102',
                status: 'Active',
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ];
    }

    getLeases(): Lease[] {
        return [
            {
                id: 'l-1',
                propertyId: 'p-1',
                unitId: 'u-1',
                tenantId: 't-1',
                startDate: new Date('2025-01-01'),
                endDate: new Date('2026-01-01'),
                rentAmount: 2500,
                securityDeposit: 2500,
                paymentFrequency: 'Monthly',
                status: 'Active',
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ];
    }

    getFinance(): Transaction[] {
        return [
            {
                id: 'tx-1',
                propertyId: 'p-1',
                date: new Date('2025-02-01'),
                amount: 2500,
                type: 'Income',
                category: 'Rent',
                description: 'Feb Rent - John Doe',
                status: 'Paid',
                createdAt: new Date()
            }
        ];
    }

    getMaintenance(): any[] {
        return [
            {
                id: 'm-1',
                propertyId: 'p-1',
                unitId: 'u-1',
                tenantId: 't-1',
                title: 'Leaking Faucet in Kitchen',
                description: 'The kitchen faucet has been dripping constantly for the past week.',
                category: 'Plumbing',
                priority: 'Medium',
                status: 'Open',
                createdAt: new Date('2026-01-20'),
                updatedAt: new Date('2026-01-20')
            },
            {
                id: 'm-2',
                propertyId: 'p-1',
                unitId: 'u-1',
                tenantId: 't-1',
                title: 'AC Not Cooling',
                description: 'Air conditioning unit is running but not cooling the apartment.',
                category: 'HVAC',
                priority: 'High',
                status: 'In Progress',
                cost: 350,
                createdAt: new Date('2026-01-15'),
                updatedAt: new Date('2026-01-22')
            }
        ];
    }
}
