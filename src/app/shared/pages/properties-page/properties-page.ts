import { Component, inject, OnInit, signal } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PropertyList } from '../../components/property-list/property-list';
import { PropertyAdd } from '../../components/property-add/property-add';
import { PropertyService } from '../../../core/services/property.service';
import { MockDataService } from '../../../core/services/mock-data.service';
import { Property } from '../../../core/models/property.model';

@Component({
  selector: 'app-properties-page',
  imports: [PropertyList, PropertyAdd, ReactiveFormsModule],
  templateUrl: './properties-page.html',
  styleUrl: './properties-page.css',
})
export class PropertiesPage implements OnInit {
  private fb: FormBuilder = inject(FormBuilder);
  private propertyService = inject(PropertyService);
  private mockDataService = inject(MockDataService);

  properties = this.propertyService.properties;

  propertyForm = this.fb.group({
    name: ['', Validators.required],
    type: ['Apartment', Validators.required],
    rent: [null, [Validators.required, Validators.min(1)]],
    billingCycle: ['Monthly', Validators.required],
    address: ['', Validators.required],
    bedrooms: [null, Validators.required],
    bathrooms: [null, Validators.required],
    size_sqft: [null, Validators.required],
    furnishing: ['Unfurnished', Validators.required],
    description: [''],
    amenities: this.fb.array([]),
    petsAllowed: [false],
    smokingAllowed: [false],
    partiesAllowed: [false],
    available: [true],
    ownerName: [''],
    ownerEmail: ['', [Validators.email]],
    images: this.fb.array([]),
  });

  isDrawerOpen = signal(false);
  editingPropertyId = signal<string | null>(null);
  isLoading = signal(true);

  ngOnInit() {
    // Give a slight delay for a premium feel or just to ensure render
    setTimeout(() => {
      this.isLoading.set(false);
    }, 800);
  }

  openDrawer() {
    document.body.classList.add('overflow-hidden');
    this.editingPropertyId.set(null);
    this.propertyForm.reset({
      type: 'Apartment',
      billingCycle: 'Monthly',
      furnishing: 'Unfurnished',
      available: true,
      petsAllowed: false,
      smokingAllowed: false,
      partiesAllowed: false
    });
    // Clear FormArrays
    (this.propertyForm.get('amenities') as FormArray).clear();
    (this.propertyForm.get('images') as FormArray).clear();

    this.isDrawerOpen.set(true);
  }

  editProperty(id: string) {
    const property = this.propertyService.getProperty(id);
    if (!property) return;

    this.editingPropertyId.set(id);
    document.body.classList.add('overflow-hidden');

    // Patch basic info
    this.propertyForm.patchValue({
      name: property.name,
      type: property.type,
      rent: property.price as any,
      billingCycle: property.billingCycle,
      address: property.location?.address || (property.address as string),
      bedrooms: property.bedrooms as any,
      bathrooms: property.bathrooms as any,
      size_sqft: property.size_sqft as any,
      description: property.description,
      available: property.available,
      ownerName: property.owner?.name,
      ownerEmail: property.owner?.email,
      petsAllowed: property.rules?.petsAllowed,
      smokingAllowed: property.rules?.smokingAllowed,
      partiesAllowed: property.rules?.partiesAllowed
    });

    // Handle FormArrays
    const amenitiesArr = this.propertyForm.get('amenities') as FormArray;
    amenitiesArr.clear();
    (property.amenities || []).forEach(a => amenitiesArr.push(this.fb.control(a, Validators.required)));

    const imagesArr = this.propertyForm.get('images') as FormArray;
    imagesArr.clear();
    (property.images || []).forEach(img => imagesArr.push(this.fb.control(img)));

    this.isDrawerOpen.set(true);
  }

  closeDrawer() {
    document.body.classList.remove('overflow-hidden');
    this.isDrawerOpen.set(false);
  }

  saveProperty() {
    if (this.propertyForm.invalid) {
      this.propertyForm.markAllAsTouched();
      return;
    }

    const formValue = this.propertyForm.getRawValue();
    const editingId = this.editingPropertyId();

    const propertyData: Property = {
      id: editingId || 'p-' + Date.now(),
      name: formValue.name!,
      type: formValue.type as any,
      status: 'Available',
      address: formValue.address!,
      location: {
        address: formValue.address!
      },
      price: formValue.rent!,
      currency: 'INR',
      billingCycle: formValue.billingCycle!,
      bedrooms: formValue.bedrooms!,
      bathrooms: formValue.bathrooms!,
      size_sqft: formValue.size_sqft!,
      amenities: formValue.amenities as string[],
      available: formValue.available!,
      images: (formValue.images || []).map((img: any) =>
        img instanceof File ? img.name : img
      ),
      description: formValue.description!,
      owner: {
        name: formValue.ownerName!,
        contact: '', // Optional for now
        email: formValue.ownerEmail!,
        verified: true
      },
      rules: {
        petsAllowed: !!formValue.petsAllowed,
        smokingAllowed: !!formValue.smokingAllowed,
        partiesAllowed: !!formValue.partiesAllowed
      },
      createdAt: editingId ? (this.propertyService.getProperty(editingId)?.createdAt || new Date()) : new Date(),
      updatedAt: new Date()
    };

    if (editingId) {
      this.propertyService.updateProperty(editingId, propertyData);
    } else {
      this.propertyService.addProperty(propertyData);
    }

    this.closeDrawer();
  }
}
