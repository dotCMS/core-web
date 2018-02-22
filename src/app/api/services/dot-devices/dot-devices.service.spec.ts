import { TestBed, inject } from '@angular/core/testing';

import { DotDevicesService } from './dot-devices.service';

describe('DotDevicesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DotDevicesService]
    });
  });

  it('should be created', inject([DotDevicesService], (service: DotDevicesService) => {
    expect(service).toBeTruthy();
  }));
});
