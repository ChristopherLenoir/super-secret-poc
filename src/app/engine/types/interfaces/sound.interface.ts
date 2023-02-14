import { BehaviorSubject } from 'rxjs';
import { SoundType } from '../enums';

/**
 * Summary. (A channel to handle single/multiple effects)
 *
 * @property {string} path        Relative path to the sound file.
 *
 * @property {SoundType} type     Sound playback method.
 *
 * @property {number} volume      Sound volume coeficient. 1 is for 100%.
 *
 */
export interface SoundFile {
  file: File;
  type: SoundType;
  volume: number;
  audioBuffer: AudioBuffer;
  processedFFTData: ProcessedFFTData;
  remappedData: number[][];
  // remappedDataForExpressCanvas: number[][];
}

/**
 * Summary. (A channel to handle single/multiple effects)
 *
 * Description. (A channel to handle single/multiple effects)
 *
 */
export interface CustomAudioStructure {
  bufferSourceNode: AudioBufferSourceNode;
  duration: number;
  cursor: BehaviorSubject<number>;
  startedAt: number;
  pausedAt: number;
  elapsed: number;
  isPlaying: boolean;
  // htmlAudioElement: HTMLAudioElement;
  // mediaElementAudioSourceNode: MediaElementAudioSourceNode;
}

export interface ProcessedFFTData {
  channel: Uint8Array;
  channelDbRange: {
    minDecibels: number;
    maxDecibels: number;
  };
  stride: number;
  tickCount: number;
  maxFreq: number;
  duration: number;
}
