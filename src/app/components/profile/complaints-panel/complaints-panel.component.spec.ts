import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ComplaintsPanelComponent} from './complaints-panel.component';

describe('ComplaintsPanelComponent', () => {
  let component: ComplaintsPanelComponent;
  let fixture: ComponentFixture<ComplaintsPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ComplaintsPanelComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComplaintsPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
