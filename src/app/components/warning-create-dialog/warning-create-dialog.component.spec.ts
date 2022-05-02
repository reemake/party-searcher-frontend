import {ComponentFixture, TestBed} from '@angular/core/testing';

import {WarningCreateDialogComponent} from './warning-create-dialog.component';

describe('WarningCreateDialogComponent', () => {
  let component: WarningCreateDialogComponent;
  let fixture: ComponentFixture<WarningCreateDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WarningCreateDialogComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WarningCreateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
