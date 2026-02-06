import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-property-list',
  imports: [],
  templateUrl: './property-list.html',
  styleUrl: './property-list.css',
})
export class PropertyList {
  @Input() properties: any;
  @Input() isLoading = false;
  @Output() edit = new EventEmitter<string>();



  private router: Router = inject(Router)

  viewProperty(id: string) {
    this.router.navigate(['/property', id]);
  }

  editProperty(event: Event, id: string) {
    event.stopPropagation();
    this.edit.emit(id);
  }
}
