import { Injectable } from '@angular/core';
import { ChannelStrip } from '../../engine/core/channels';
import { Effect } from '../../engine/types/abstractClasses';
import { EffectsNames } from '../../engine/types/enums';
import { EffectOptions } from '../../engine/types/interfaces';
import { AudioEngineService } from '../audio-engine/audio-engine.service';

@Injectable({
  providedIn: 'root'
})
export class ChannelStripService {
  // private _isThereAFileSelectedSubject$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  // private _effectsSubject$: BehaviorSubject<File> = new BehaviorSubject<File>({} as File);

  // _channelStripSubject$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>(['Gate', 'Filter', 'Frequency']);
  private _channelStrip: ChannelStrip;

  constructor(private audioEngineService: AudioEngineService) {
    this._channelStrip = this.audioEngineService.audioEngine.createChannelStrip('processing', []);

    // this.addEffect('Gate');
    // this.addEffect('Filter');
    // this.addEffect('Compressor');
    this.addEffect('Visualizer');
  }

  public get channelStrip() {
    return this._channelStrip;
  }

  // TO DO : Déplacerle switch dans la lib et enlever la surcharge
  public addEffect(effectName: EffectsNames) {
    let effect: Effect<EffectOptions>;
    switch (effectName) {
      case 'Delay':
        effect = this.audioEngineService.audioEngine.createEffect(effectName);
        break;
      case 'Distortion':
        effect = this.audioEngineService.audioEngine.createEffect(effectName);
        break;
      case 'Filter':
        effect = this.audioEngineService.audioEngine.createEffect(effectName);
        break;
      case 'Visualizer':
        effect = this.audioEngineService.audioEngine.createEffect(effectName);
        break;
      case 'Gate':
        effect = this.audioEngineService.audioEngine.createEffect(effectName);
        break;
      case 'Compressor':
        effect = this.audioEngineService.audioEngine.createEffect(effectName);
        break;

      default:
        break;
    }

    this._channelStrip.addEffect(effect);
  }

  public removeEffect(index: number) {
    this._channelStrip.removeEffect(index);
  }

  public muteEffect() {}

  public unmuteEffect() {}
}
