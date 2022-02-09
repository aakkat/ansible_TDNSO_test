import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstallNSOComponent } from './install-nso.component';

describe('InstallNSOComponent', () => {
  let component: InstallNSOComponent;
  let fixture: ComponentFixture<InstallNSOComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InstallNSOComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InstallNSOComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
