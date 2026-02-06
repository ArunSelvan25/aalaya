import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LeaseService } from '../../../core/services/lease.service';
import { TenantService } from '../../../core/services/tenant.service';
import { PropertyService } from '../../../core/services/property.service';
import { Lease } from '../../../core/models/lease.model';

@Component({
  selector: 'app-lease-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './lease-list.component.html'
})
export class LeaseListComponent {
  private leaseService = inject(LeaseService);
  private tenantService = inject(TenantService);
  private propertyService = inject(PropertyService);
  private fb = inject(FormBuilder);

  leases = this.leaseService.leases;
  tenants = this.tenantService.tenants;
  properties = this.propertyService.properties;

  showModal = false;
  showViewModal = false;
  isEditing = false;
  selectedLease: any | null = null;

  leaseForm: FormGroup = this.fb.group({
    id: [''],
    propertyId: ['', Validators.required],
    unitId: ['', Validators.required],
    tenantId: ['', Validators.required],
    startDate: ['', Validators.required],
    endDate: ['', Validators.required],
    rentAmount: ['', [Validators.required, Validators.min(0)]],
    securityDeposit: ['', [Validators.required, Validators.min(0)]],
    paymentFrequency: ['Monthly', Validators.required],
    status: ['Active', Validators.required]
  });

  enrichedLeases = computed(() => {
    return this.leases().map(lease => {
      const tenant = this.tenantService.tenants().find(t => t.id === lease.tenantId);
      const property = this.propertyService.properties().find(p => p.id === lease.propertyId);

      return {
        ...lease,
        tenantName: tenant ? `${tenant.firstName} ${tenant.lastName}` : 'Unknown',
        propertyName: property?.name || 'Unknown Property'
      };
    });
  });

  getStatusClass(status: string): string {
    const baseClasses = 'px-3 py-1 text-[10px] font-bold rounded-full uppercase tracking-tight';
    switch (status) {
      case 'Active': return `${baseClasses} bg-green-50 text-green-600`;
      case 'Pending': return `${baseClasses} bg-orange-50 text-orange-600`;
      case 'Expired': return `${baseClasses} bg-red-50 text-red-600`;
      case 'Terminated': return `${baseClasses} bg-gray-50 text-gray-600`;
      default: return baseClasses;
    }
  }

  openAddModal() {
    this.isEditing = false;
    this.leaseForm.reset({
      paymentFrequency: 'Monthly',
      status: 'Active',
      startDate: new Date().toISOString().split('T')[0]
    });
    this.showModal = true;
  }

  openEditModal(lease: any) {
    this.isEditing = true;
    const formData = {
      ...lease,
      startDate: new Date(lease.startDate).toISOString().split('T')[0],
      endDate: new Date(lease.endDate).toISOString().split('T')[0]
    };
    this.leaseForm.patchValue(formData);
    this.showModal = true;
  }

  openViewModal(lease: any) {
    this.selectedLease = lease;
    this.showViewModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.leaseForm.reset();
  }

  closeViewModal() {
    this.showViewModal = false;
    this.selectedLease = null;
  }

  onSubmit() {
    if (this.leaseForm.valid) {
      const formValue = this.leaseForm.value;
      const leaseData: Lease = {
        ...formValue,
        startDate: new Date(formValue.startDate),
        endDate: new Date(formValue.endDate),
        rentAmount: Number(formValue.rentAmount),
        securityDeposit: Number(formValue.securityDeposit)
      };

      if (this.isEditing) {
        this.leaseService.updateLease(formValue.id, leaseData);
      } else {
        this.leaseService.addLease({
          ...leaseData,
          id: 'l-' + Date.now(),
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
      this.closeModal();
    }
  }

  confirmDelete(lease: Lease) {
    if (confirm('Are you sure you want to delete this lease?')) {
      this.leaseService.deleteLease(lease.id);
    }
  }
}