import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TenantService } from '../../../core/services/tenant.service';
import { Tenant } from '../../../core/models/tenant.model';

@Component({
  selector: 'app-tenant-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './tenant-list.component.html'
})
export class TenantListComponent {
  private tenantService = inject(TenantService);
  private fb = inject(FormBuilder);

  tenants = this.tenantService.tenants;

  // Modal states
  showModal = false;
  isEditing = false;

  tenantForm: FormGroup = this.fb.group({
    id: [''],
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', Validators.required],
    status: ['Active', Validators.required]
  });

  getStatusClass(status: string): string {
    const baseClasses = 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full';
    switch (status) {
      case 'Active': return `${baseClasses} bg-green-100 text-green-800`;
      case 'Past': return `${baseClasses} bg-gray-100 text-gray-800`;
      case 'Prospect': return `${baseClasses} bg-yellow-100 text-yellow-800`;
      default: return baseClasses;
    }
  }

  openAddModal() {
    this.isEditing = false;
    this.tenantForm.reset({ status: 'Active' });
    this.showModal = true;
  }

  openEditModal(tenant: Tenant) {
    this.isEditing = true;
    this.tenantForm.patchValue(tenant);
    this.showModal = true;
  }


  closeModal() {
    this.showModal = false;
    this.tenantForm.reset();
  }


  onSubmit() {
    if (this.tenantForm.valid) {
      const formValue = this.tenantForm.value;

      if (this.isEditing) {
        this.tenantService.updateTenant(formValue.id, formValue);
      } else {
        const newTenant: Tenant = {
          ...formValue,
          id: 't-' + Date.now(),
          createdAt: new Date(),
          updatedAt: new Date()
        };
        this.tenantService.addTenant(newTenant);
      }
      this.closeModal();
    }
  }

  confirmDelete(tenant: Tenant) {
    if (confirm(`Are you sure you want to delete ${tenant.firstName} ${tenant.lastName}?`)) {
      this.tenantService.deleteTenant(tenant.id);
    }
  }
}
