import { BehaviorSubject, Observable } from 'rxjs';
import { Effect } from '../types/abstractClasses';
import { Channel } from '../types/abstractClasses/Channel.abstract.class';
import { CustomAudioStructure, EffectOptions, SoundFile } from '../types/interfaces';
import { Dic, SoundFilesLibrary } from '../types/types';
import { clamp } from '../utils';

/**
 * Summary. (A channel to handle single/multiple effects)
 *
 * Description. (A channel to handle single/multiple effects)
 *
 *  @class Classname
 *  @extends ParentClass
 *  @constructor
 * @augments parent
 *
 * @return {ChannelStrip} Return value description.
 */
// export class SoundPlayer extends AudioInstrument {
export class SoundPlayer {
  // TO DO : Stop le isPlaying quand lecture finie
  private _isPlaying$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  private _customAudioElements: Dic<CustomAudioStructure> = {};

  protected _output: GainNode;

  /**
   * Create a point.
   * @param {number} x  The x value.
   */
  // constructor(
  //   _context: AudioContext,
  //   _soundsLibrary: SoundsLibrary,
  //   effect?: Effect<EffectOptions>
  // );
  // constructor(
  //   _context: AudioContext,
  //   _soundsLibrary: SoundsLibrary,
  //   channel?: Channel
  // );
  // constructor(
  //   _context: AudioContext,
  //   _soundsLibrary: SoundsLibrary,
  //   node?: AudioNode
  // );
  constructor(
    private _context: AudioContext,
    private _soundFilesLibrary: SoundFilesLibrary,
    item?: AudioNode | Effect<EffectOptions> | Channel
  ) {
    // Object.keys(this._soundFilesLibrary).forEach(soundFileKey => {
    //   // this._customAudioElements[this._soundFilesLibrary[soundFileKey].file.name];
    //   this._loadSound(this._soundFilesLibrary[soundFileKey].file.name);
    // });

    this._output = new GainNode(this._context);

    if (item) {
      this.connect(item);
    } else {
      this.connect(this._context.destination);
    }
  }

  public addSoundToLibrary(name: string, soundFile: SoundFile) {
    this._soundFilesLibrary[name] = soundFile;
  }

  private _computeIsPlaying() {
    if (
      Object.keys(this._customAudioElements)
        .map(customAudioElementKey => this._customAudioElements[customAudioElementKey].isPlaying)
        .some(value => {
          return value;
        })
    ) {
      this._isPlaying$.next(true);
    } else {
      this._isPlaying$.next(false);
    }
  }

  public get isPlaying$(): Observable<boolean> {
    return this._isPlaying$.asObservable();
  }

  public get isPlaying(): boolean {
    return this._isPlaying$.getValue();
  }

  // public async getSoundCursor(name: string): Promise<Observable<number>> {
  //   if (!this._customAudioElements[name]) {
  //     await this._loadSound(name);
  //   }
  //   return this._customAudioElements[name].cursor.asObservable();
  // }

  connect(item: AudioNode | Effect<EffectOptions> | Channel): AudioNode {
    this._output.disconnect();
    if ('input' in item && 'output' in item && 'options' in item) {
      this._output.connect(item.input);
      return item.output;
    } else if ('input' in item && 'output' in item) {
      this._output.connect(item.input);
      return item.output;
    } else {
      return this._output.connect(item);
    }
  }

  setSoundVolume(name: string, volume: number) {
    this._output.gain.value = clamp(volume, 0, 1);
  }

  playSound(name: string) {
    this._loadSound(name);

    this._customAudioElements[name].bufferSourceNode.start(0, this._customAudioElements[name].elapsed);
    this._customAudioElements[name].startedAt = this._context.currentTime - this._customAudioElements[name].elapsed;
    this._customAudioElements[name].pausedAt = 0;
    this._customAudioElements[name].elapsed = 0;
    this._customAudioElements[name].isPlaying = true;

    this._computeIsPlaying();
  }

  pauseSound(name: string) {
    if (this._customAudioElements[name]) {
      this._customAudioElements[name].bufferSourceNode.stop();
      this._customAudioElements[name].pausedAt = this._context.currentTime - this._customAudioElements[name].elapsed;
      // this._audioElements[name].elapsed = this._context.currentTime - this._audioElements[name].startedAt;
      this._customAudioElements[name].elapsed =
        this._context.currentTime -
        this._customAudioElements[name].startedAt * this._customAudioElements[name].bufferSourceNode.playbackRate.value;

      this._computeIsPlaying();
    }
  }

  stopSound(name: string) {
    if (this._customAudioElements[name]) {
      this._customAudioElements[name].bufferSourceNode.disconnect();
      this._customAudioElements[name].bufferSourceNode.stop();
      this._customAudioElements[name].bufferSourceNode = null;

      this._customAudioElements[name].elapsed = 0;
      this._customAudioElements[name].startedAt = 0;
      this._customAudioElements[name].pausedAt = 0;
      this._customAudioElements[name].isPlaying = false;
    }
    this._computeIsPlaying();
  }

  stopSounds() {
    Object.keys(this._customAudioElements).forEach(audioElementKey => {
      if (this._customAudioElements[audioElementKey]) {
        if (this._customAudioElements[audioElementKey].bufferSourceNode) {
          this._customAudioElements[audioElementKey].bufferSourceNode.disconnect();
          this._customAudioElements[audioElementKey].bufferSourceNode.stop();
          this._customAudioElements[audioElementKey].bufferSourceNode = null;
        }

        this._customAudioElements[audioElementKey].elapsed = 0;
        this._customAudioElements[audioElementKey].startedAt = 0;
        this._customAudioElements[audioElementKey].isPlaying = false;
      }
    });
    this._computeIsPlaying();
  }

  private _loadSound(name: string): void {
    // TO DO : WTF les noms avec des espaces ?
    const sound: SoundFile = this._soundFilesLibrary[name];
    const bufferSourceNode: AudioBufferSourceNode = this._context.createBufferSource();

    bufferSourceNode.buffer = sound.audioBuffer;
    // TO DO : Sample rate ? sample rate du _audioContext ?
    this._customAudioElements[name] = {
      bufferSourceNode: bufferSourceNode,
      duration: sound.audioBuffer.duration,
      cursor: new BehaviorSubject<number>(0),
      elapsed: this._customAudioElements[name]?.elapsed ?? 0,
      startedAt: this._customAudioElements[name]?.startedAt ?? 0,
      pausedAt: this._customAudioElements[name]?.pausedAt ?? 0,
      isPlaying: this._customAudioElements[name]?.isPlaying ?? false
    };

    this._customAudioElements[name].bufferSourceNode.loop = sound.type === 'loop' ? true : false;
    // TO DO : WTF
    this._customAudioElements[name].bufferSourceNode.connect(this._output);
  }

  public getSoundDuration(name: string): number {
    if (!this._customAudioElements[name]) {
      this._loadSound(name);
    }
    return this._customAudioElements[name].duration;
  }

  public getStartedAt(name: string): number {
    if (!this._customAudioElements[name]) {
      this._loadSound(name);
    }
    return this._customAudioElements[name].startedAt;
  }

  public getPausedAt(name: string): number {
    if (!this._customAudioElements[name]) {
      this._loadSound(name);
    }
    return this._customAudioElements[name].pausedAt;
  }

  public getPlaybackRate(name: string): number {
    if (!this._customAudioElements[name]) {
      this._loadSound(name);
    }
    return this._customAudioElements[name].bufferSourceNode.playbackRate.value;
  }

  public getSoundBuffer(name: string): AudioBuffer {
    // await this._loadSound(name);

    const sound: SoundFile = this._soundFilesLibrary[name];

    // return this._soundFilesLibrary[name].audioBuffer;
    return sound.audioBuffer;
    // return this._audioElements[name].bufferSourceNode.buffer;
  }

  // private _updateSoundCursor(name: string, value: number) {
  //   this._customAudioElements[name].cursor.next(value);
  // }

  setGain(value: number): void {
    this._output.gain.value = value;
  }
}
