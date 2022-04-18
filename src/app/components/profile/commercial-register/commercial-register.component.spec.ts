import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommercialRegisterComponent } from './commercial-register.component';

describe('CommercialRegisterComponent', () => {
  let component: CommercialRegisterComponent;
  let fixture: ComponentFixture<CommercialRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommercialRegisterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommercialRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
