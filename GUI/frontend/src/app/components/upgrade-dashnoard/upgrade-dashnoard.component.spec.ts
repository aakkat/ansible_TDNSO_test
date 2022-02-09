import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpgradeDashnoardComponent } from './upgrade-dashnoard.component';

describe('UpgradeDashnoardComponent', () => {
  let component: UpgradeDashnoardComponent;
  let fixture: ComponentFixture<UpgradeDashnoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpgradeDashnoardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpgradeDashnoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
