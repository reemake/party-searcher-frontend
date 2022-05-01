import {ComponentFixture, TestBed} from '@angular/core/testing';

import {OauthLoginDialogComponent} from './oauth-login-dialog.component';

describe('OauthLoginDialogComponent', () => {
  let component: OauthLoginDialogComponent;
  let fixture: ComponentFixture<OauthLoginDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OauthLoginDialogComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OauthLoginDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
