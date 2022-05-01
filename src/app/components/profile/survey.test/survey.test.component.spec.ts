import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyTest } from './survey.test.component';

describe('SurveyTest', () => {
  let component: SurveyTest;
  let fixture: ComponentFixture<SurveyTest>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SurveyTest ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SurveyTest);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
