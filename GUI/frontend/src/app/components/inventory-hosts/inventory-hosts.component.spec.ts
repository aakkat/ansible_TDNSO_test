import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryHostsComponent } from './inventory-hosts.component';

describe('InventoryHostsComponent', () => {
  let component: InventoryHostsComponent;
  let fixture: ComponentFixture<InventoryHostsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InventoryHostsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryHostsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
