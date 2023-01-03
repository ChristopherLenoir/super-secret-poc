/* tslint:disable:no-unused-variable */

import { inject, TestBed } from '@angular/core/testing';
import { ChannelStripService } from './channel-strip.service';

describe('Service: CurrentFile', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ChannelStripService]
    });
  });

  it('should ...', inject([ChannelStripService], (service: ChannelStripService) => {
    expect(service).toBeTruthy();
  }));
});
