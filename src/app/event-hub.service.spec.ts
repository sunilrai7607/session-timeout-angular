import { TestBed } from '@angular/core/testing';

import { EventHubService } from './event-hub.service';

describe('EventHubService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EventHubService = TestBed.get(EventHubService);
    expect(service).toBeTruthy();
  });
});
