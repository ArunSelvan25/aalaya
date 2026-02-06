import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FilePreviewPipe } from '../../../pipes/file-preview.pipe';

@Component({
  selector: 'app-property-add',
  imports: [ReactiveFormsModule, FilePreviewPipe],
  templateUrl: './property-add.html',
  styleUrl: './property-add.css',
})
export class PropertyAdd {
  @Input({ required: true }) form!: FormGroup;
  @Input() open = false;
  @Input() mode: 'add' | 'edit' = 'add';

  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<void>();

  get amenitiesArray(): FormArray {
    return this.form.get('amenities') as FormArray;
  }

  get images(): FormArray {
    return this.form.get('images') as FormArray;
  }

  addAmenity() {
    this.amenitiesArray.push(new FormControl('', Validators.required));
  }

  removeAmenity(index: number) {
    this.amenitiesArray.removeAt(index);
  }

  onImageSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;

    Array.from(input.files).forEach(file => {
      this.images.push(new FormControl(file));
    });

    input.value = '';
  }

  removeImage(index: number) {
    this.images.removeAt(index);
  }
}
