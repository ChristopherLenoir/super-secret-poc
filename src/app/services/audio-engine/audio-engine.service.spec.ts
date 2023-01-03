/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { AudioEngineService } from './audio-engine.service';

describe('Service: AudioEngine', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AudioEngineService]
    });
  });

  it('should ...', inject([AudioEngineService], (service: AudioEngineService) => {
    expect(service).toBeTruthy();
  }));
});
