/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { CurrentFileService } from './current-file.service';

describe('Service: CurrentFile', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CurrentFileService]
    });
  });

  it('should ...', inject([CurrentFileService], (service: CurrentFileService) => {
    expect(service).toBeTruthy();
  }));
});
