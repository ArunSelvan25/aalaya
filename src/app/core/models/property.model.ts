export type PropertyStatus = 'Occupied' | 'Vacant' | 'Maintenance' | 'Available' | 'For Rent';
export type PropertyType = 'Apartment' | 'House' | 'Commercial' | 'Condo' | 'Loft';

export interface Address {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
}

export interface Property {
    id: string;
    name: string;
    type: PropertyType;
    status: PropertyStatus;
    address: Address | string; // Handle both structured and string addresses
    units?: number;
    yearBuilt?: number;
    description?: string;
    amenities: string[];
    images: string[];
    ownerId?: string;

    // UI specific fields
    price?: number;
    currency?: string;
    billingCycle?: string;
    bedrooms?: number;
    bathrooms?: number;
    size_sqft?: number;
    available?: boolean;
    location?: {
        address: string;
        latitude?: number;
        longitude?: number;
    };
    owner?: {
        name: string;
        contact: string;
        email: string;
        verified?: boolean;
    };
    rules?: {
        petsAllowed: boolean;
        smokingAllowed: boolean;
        partiesAllowed: boolean;
    };

    createdAt: Date;
    updatedAt: Date;
}

export interface Unit {
    id: string;
    propertyId: string;
    unitNumber: string;
    bedrooms: number;
    bathrooms: number;
    squareFeet: number;
    rentAmount: number;
    status: PropertyStatus; // Can differ from property status
    floor?: number;
}
