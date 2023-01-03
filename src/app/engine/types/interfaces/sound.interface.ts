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
}
