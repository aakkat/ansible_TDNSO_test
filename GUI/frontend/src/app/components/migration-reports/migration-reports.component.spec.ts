import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MigrationReportsComponent } from './migration-reports.component';

describe('MigrationReportsComponent', () => {
  let component: MigrationReportsComponent;
  let fixture: ComponentFixture<MigrationReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MigrationReportsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MigrationReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
