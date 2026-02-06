import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintenanceCard } from './maintenance-card';

describe('MaintenanceCard', () => {
  let component: MaintenanceCard;
  let fixture: ComponentFixture<MaintenanceCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaintenanceCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaintenanceCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
