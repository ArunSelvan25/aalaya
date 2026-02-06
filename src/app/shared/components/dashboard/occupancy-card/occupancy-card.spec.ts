import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OccupancyCard } from './occupancy-card';

describe('OccupancyCard', () => {
  let component: OccupancyCard;
  let fixture: ComponentFixture<OccupancyCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OccupancyCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OccupancyCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
