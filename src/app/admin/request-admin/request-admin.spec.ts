import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestAdmin } from './request-admin';

describe('RequestAdmin', () => {
  let component: RequestAdmin;
  let fixture: ComponentFixture<RequestAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequestAdmin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestAdmin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
