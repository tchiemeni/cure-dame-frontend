import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscussionRequest } from './discussion-request';

describe('DiscussionRequest', () => {
  let component: DiscussionRequest;
  let fixture: ComponentFixture<DiscussionRequest>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiscussionRequest]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiscussionRequest);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
