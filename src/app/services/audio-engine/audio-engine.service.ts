import { Injectable } from '@angular/core';
import AE from '../../engine';
import { AudioEngine } from '../../engine/core/AudioEngine';

@Injectable({
  providedIn: 'root'
})
export class AudioEngineService {
  private _audioEngine: AudioEngine = new AE.AudioEngine();

  constructor() {}

  get audioEngine(): AudioEngine {
    return this._audioEngine;
  }
}
