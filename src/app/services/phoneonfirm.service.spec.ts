import {TestBed} from '@angular/core/testing';

import {PhoneConfirmService} from './phone-confirm.service';

describe('PhoneonfirmService', () => {
  let service: PhoneConfirmService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PhoneConfirmService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
