import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MaintenanceService } from '../../../core/services/maintenance.service';
import { PropertyService } from '../../../core/services/property.service';
import { TenantService } from '../../../core/services/tenant.service';
import { MaintenanceRequest } from '../../../core/models/maintenance.model';

@Component({
  selector: 'app-request-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './request-list.component.html'
})
export class RequestListComponent {
  private maintenanceService = inject(MaintenanceService);
  private propertyService = inject(PropertyService);
  private tenantService = inject(TenantService);
  private fb = inject(FormBuilder);

  requests = this.maintenanceService.requests;
  properties = this.propertyService.properties;
  tenants = this.tenantService.tenants;

  showAddModal = false;
  showStatusModal = false;
  selectedRequest: MaintenanceRequest | null = null;

  requestForm: FormGroup = this.fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    propertyId: ['', Validators.required],
    unitId: ['', Validators.required],
    tenantId: [''],
    category: ['General', Validators.required],
    priority: ['Medium', Validators.required]
  });

  statusControl = this.fb.control('Open');
  costControl = this.fb.control(0);

  getPriorityClass(priority: string): string {
    const baseClasses = 'px-3 py-1 text-[10px] font-bold rounded-full uppercase tracking-tight';
    switch (priority) {
      case 'Emergency': return `${baseClasses} bg-red-50 text-red-600`;
      case 'High': return `${baseClasses} bg-orange-50 text-orange-600`;
      case 'Medium': return `${baseClasses} bg-yellow-50 text-yellow-600`;
      case 'Low': return `${baseClasses} bg-green-50 text-green-600`;
      default: return `${baseClasses} bg-gray-50 text-gray-600`;
    }
  }

  getStatusClass(status: string): string {
    const baseClasses = 'px-3 py-1 text-[10px] font-bold rounded-full uppercase tracking-tight';
    switch (status) {
      case 'Open': return `${baseClasses} bg-blue-50 text-blue-600`;
      case 'In Progress': return `${baseClasses} bg-purple-50 text-purple-600`;
      case 'Resolved': return `${baseClasses} bg-green-50 text-green-600`;
      case 'Closed': return `${baseClasses} bg-gray-50 text-gray-600`;
      default: return baseClasses;
    }
  }

  openAddModal() {
    this.requestForm.reset({
      category: 'General',
      priority: 'Medium',
      propertyId: '',
      tenantId: ''
    });
    this.showAddModal = true;
  }

  closeAddModal() {
    this.showAddModal = false;
  }

  openUpdateStatusModal(request: MaintenanceRequest) {
    this.selectedRequest = request;
    this.statusControl.setValue(request.status);
    this.costControl.setValue(request.cost || null);
    this.showStatusModal = true;
  }

  closeStatusModal() {
    this.showStatusModal = false;
    this.selectedRequest = null;
  }

  onSubmitRequest() {
    if (this.requestForm.valid) {
      const formValue = this.requestForm.value;
      const newRequest: MaintenanceRequest = {
        ...formValue,
        id: 'm-' + Date.now(),
        status: 'Open',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      this.maintenanceService.addRequest(newRequest);
      this.closeAddModal();
    }
  }

  onSubmitStatus() {
    if (this.selectedRequest) {
      this.maintenanceService.updateRequest(this.selectedRequest.id, {
        status: this.statusControl.value as any,
        cost: this.costControl.value || undefined
      });
      this.closeStatusModal();
    }
  }

  confirmDelete(request: MaintenanceRequest) {
    if (confirm(`Are you sure you want to delete "${request.title}"?`)) {
      this.maintenanceService.deleteRequest(request.id);
    }
  }
}