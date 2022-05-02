import {TestBed} from '@angular/core/testing';

import {ComplaintsResolverGuard} from './complaints-resolver.guard';

describe('ComplaintsResolverGuard', () => {
  let guard: ComplaintsResolverGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(ComplaintsResolverGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
