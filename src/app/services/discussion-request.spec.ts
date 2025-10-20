import { TestBed } from '@angular/core/testing';

import { DiscussionRequest } from './discussion-request';

describe('DiscussionRequest', () => {
  let service: DiscussionRequest;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DiscussionRequest);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
