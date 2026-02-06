import { Component, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FinanceService } from '../../../core/services/finance.service';
import { PropertyService } from '../../../core/services/property.service';
import { Transaction } from '../../../core/models/finance.model';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './transactions.component.html'
})
export class TransactionsComponent implements OnInit {
  private financeService = inject(FinanceService);
  private propertyService = inject(PropertyService);
  private fb = inject(FormBuilder);

  // Expose Signals directly from services
  transactions = this.financeService.transactions;
  properties = this.propertyService.properties;

  showModal = false;
  isEditing = false;

  transactionForm: FormGroup = this.fb.group({
    id: [''],
    description: ['', Validators.required],
    amount: ['', [Validators.required, Validators.min(0)]],
    type: ['Income', Validators.required],
    category: ['Rent', Validators.required],
    date: ['', Validators.required],
    status: ['Paid', Validators.required],
    propertyId: ['']
  });

  ngOnInit() {
    // Explicitly call load methods to ensure data renders on initial load
    // Assuming these methods exist in your services. 
    // If your service uses an effect or fetches in constructor, 
    // ensure the logic inside these is non-destructive.
    this.financeService.getRecentTransactions(10);
    this.propertyService.loadProperties();
  }

  sortedTransactions = computed(() => {
    return [...this.transactions()].sort((a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  });

  totalIncome = computed(() => {
    return this.transactions()
      .filter(t => t.type === 'Income')
      .reduce((sum, t) => sum + t.amount, 0);
  });

  totalExpenses = computed(() => {
    return this.transactions()
      .filter(t => t.type === 'Expense')
      .reduce((sum, t) => sum + t.amount, 0);
  });

  netIncome = computed(() => this.totalIncome() - this.totalExpenses());

  getStatusClass(status: string): string {
    const baseClasses = 'px-2.5 py-1 text-[10px] font-bold rounded-full uppercase tracking-tight';
    switch (status) {
      case 'Paid': return `${baseClasses} bg-[#EAF9F0] text-[#34C759]`;
      case 'Pending': return `${baseClasses} bg-[#FFF9E6] text-[#FF9500]`;
      case 'Overdue': return `${baseClasses} bg-[#FFF2F2] text-[#FF3B30]`;
      case 'Failed': return `${baseClasses} bg-[#F2F2F7] text-[#8E8E93]`;
      default: return baseClasses;
    }
  }

  openAddModal() {
    this.isEditing = false;
    this.transactionForm.reset({
      type: 'Income',
      category: 'Rent',
      status: 'Paid',
      date: new Date().toISOString().split('T')[0]
    });
    this.showModal = true;
  }

  openEditModal(transaction: Transaction) {
    this.isEditing = true;
    const formData = {
      ...transaction,
      date: new Date(transaction.date).toISOString().split('T')[0]
    };
    this.transactionForm.patchValue(formData);
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.transactionForm.reset();
  }

  onSubmit() {
    if (this.transactionForm.valid) {
      const formValue = this.transactionForm.value;
      const transactionData: Transaction = {
        ...formValue,
        amount: Number(formValue.amount),
        date: new Date(formValue.date)
      };

      if (this.isEditing) {
        this.financeService.updateTransaction(formValue.id, transactionData);
      } else {
        const newTransaction: Transaction = {
          ...transactionData,
          id: 'tx-' + Date.now(),
          createdAt: new Date()
        };
        this.financeService.addTransaction(newTransaction);
      }
      this.closeModal();
    }
  }

  confirmDelete(transaction: Transaction) {
    if (confirm(`Delete this transaction? This action cannot be undone.`)) {
      this.financeService.deleteTransaction(transaction.id);
    }
  }
}