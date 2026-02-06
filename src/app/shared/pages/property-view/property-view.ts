import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PropertyService } from '../../../core/services/property.service';
import { Property } from '../../../core/models/property.model';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-property-view',
  imports: [CurrencyPipe],
  templateUrl: './property-view.html',
  styleUrl: './property-view.css',
})
export class PropertyView implements OnInit {
  private route = inject(ActivatedRoute);
  private propertyService = inject(PropertyService);

  property = signal<Property | undefined>(undefined);
  selectedImage = signal<string>('');

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        const found = this.propertyService.getProperty(id);
        if (found) {
          this.property.set(found);
          if (found.images && found.images.length > 0) {
            this.selectedImage.set(found.images[0]);
          }
        }
      }
    });
  }

  selectImage(img: string) {
    this.selectedImage.set(img);
  }
}
