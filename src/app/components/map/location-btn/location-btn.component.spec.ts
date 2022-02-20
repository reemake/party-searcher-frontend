import {ComponentFixture, TestBed} from '@angular/core/testing';

import {LocationBtnComponent} from './location-btn.component';

describe('LocationBtnComponent', () => {
  let component: LocationBtnComponent;
  let fixture: ComponentFixture<LocationBtnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LocationBtnComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationBtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
