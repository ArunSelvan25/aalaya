import { Injectable, signal } from '@angular/core';
import { Property, Unit } from '../models/property.model';
import { MockDataService } from './mock-data.service';

@Injectable({
    providedIn: 'root'
})
export class PropertyService {
    properties = signal<Property[]>([]);
    units = signal<Unit[]>([]);

    constructor(private mockData: MockDataService) {
        this.loadProperties();
        this.loadUnits();
    }

    loadProperties() {
        this.properties.set(this.mockData.getProperties());
    }

    loadUnits() {
        this.units.set(this.mockData.getUnits());
    }

    getProperty(id: string): Property | undefined {
        return this.properties().find(p => p.id === id);
    }

    getUnitsByProperty(propertyId: string): Unit[] {
        return this.units().filter(u => u.propertyId === propertyId);
    }

    getUnit(id: string): Unit | undefined {
        return this.units().find(u => u.id === id);
    }

    addProperty(property: Property) {
        this.properties.update(p => [...p, property]);
    }

    updateProperty(id: string, updates: Partial<Property>) {
        this.properties.update(current => {
            const index = current.findIndex(p => p.id === id);
            if (index !== -1) {
                const updated = [...current];
                updated[index] = { ...current[index], ...updates, updatedAt: new Date() };
                return updated;
            }
            return current;
        });
    }

    addUnit(unit: Unit) {
        this.units.update(u => [...u, unit]);
    }

    updateUnit(id: string, updates: Partial<Unit>) {
        this.units.update(current => {
            const index = current.findIndex(u => u.id === id);
            if (index !== -1) {
                const updated = [...current];
                updated[index] = { ...current[index], ...updates };
                return updated;
            }
            return current;
        });
    }

    updateUnitStatus(propertyId: string, unitId: string, status: 'Occupied' | 'Vacant' | 'Maintenance') {
        this.updateUnit(unitId, { status });
    }
}
