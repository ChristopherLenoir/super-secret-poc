import { BehaviorSubject, Observable } from 'rxjs';
import { Effect } from '../types/abstractClasses';
import { Channel } from '../types/abstractClasses/Channel.abstract.class';
import { EffectOptions, SoundFile } from '../types/interfaces';
import { Dic, SoundFilesLibrary } from '../types/types';
import { clamp } from '../utils';

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
  elapsed: number;
  isPlaying: boolean;
  // htmlAudioElement: HTMLAudioElement;
  // mediaElementAudioSourceNode: MediaElementAudioSourceNode;
}

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

  // /**
  //  * Summary. (use period)
  //  *
  //  * Description. (use period)
  //  *
  //  * @see  Function/class relied on
  //  *
  //  * @param {type}   var           Description.
  //  * @param {type}   [var]         Description of optional variable.
  //  * @param {type}   [var=default] Description of optional variable with default variable.
  //  * @param {Object} objectVar     Description.
  //  * @param {type}   objectVar.key Description of a key in the objectVar parameter.
  //  *
  //  * @return {type} Return value description.
  //  */
  // public async getSoundCursor(name: string): Promise<Observable<number>> {
  //   if (!this._customAudioElements[name]) {
  //     await this._loadSound(name);
  //   }
  //   return this._customAudioElements[name].cursor.asObservable();
  // }

  /**
   * Summary. (use period)
   *
   * Can connect to one node/channel only
   *
   * @see  Function/class relied on
   *
   * @param {type}   var           Description.
   * @param {type}   [var]         Description of optional variable.
   * @param {type}   [var=default] Description of optional variable with default variable.
   * @param {Object} objectVar     Description.
   * @param {type}   objectVar.key Description of a key in the objectVar parameter.
   *
   * @return {type} Return value description.
   */
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

  // /**
  //  * Summary. (use period)
  //  *
  //  * Description. (use period)
  //  *
  //  * @see  Function/class relied on
  //  *
  //  * @param {type}   var           Description.
  //  * @param {type}   [var]         Description of optional variable.
  //  * @param {type}   [var=default] Description of optional variable with default variable.
  //  * @param {Object} objectVar     Description.
  //  * @param {type}   objectVar.key Description of a key in the objectVar parameter.
  //  *
  //  * @return {type} Return value description.
  //  */
  setSoundVolume(name: string, volume: number) {
    this._output.gain.value = clamp(volume, 0, 1);
  }

  /**
   * Summary. (use period)
   *
   * Description. (use period)
   *
   * @see  Function/class relied on
   *
   * @param {type}   var           Description.
   * @param {type}   [var]         Description of optional variable.
   * @param {type}   [var=default] Description of optional variable with default variable.
   * @param {Object} objectVar     Description.
   * @param {type}   objectVar.key Description of a key in the objectVar parameter.
   *
   * @return {type} Return value description.
   */
  async playSound(name: string) {
    await this._loadSound(name);

    this._customAudioElements[name].bufferSourceNode.start(0, this._customAudioElements[name].elapsed);
    this._customAudioElements[name].startedAt = this._context.currentTime - this._customAudioElements[name].elapsed;
    this._customAudioElements[name].elapsed = 0;
    this._customAudioElements[name].isPlaying = true;

    this._computeIsPlaying();
  }

  /**
   * Summary. (use period)
   *
   * Description. (use period)
   *
   * @see  Function/class relied on
   *
   * @param {type}   var           Description.
   * @param {type}   [var]         Description of optional variable.
   * @param {type}   [var=default] Description of optional variable with default variable.
   * @param {Object} objectVar     Description.
   * @param {type}   objectVar.key Description of a key in the objectVar parameter.
   *
   * @return {type} Return value description.
   */
  async pauseSound(name: string) {
    if (this._customAudioElements[name]) {
      this._customAudioElements[name].bufferSourceNode.stop();
      // this._audioElements[name].elapsed = this._context.currentTime - this._audioElements[name].startedAt;
      this._customAudioElements[name].elapsed =
        this._context.currentTime -
        this._customAudioElements[name].startedAt * this._customAudioElements[name].bufferSourceNode.playbackRate.value;

      this._computeIsPlaying();
    }
  }

  /**
   * Summary. (use period)
   *
   * Description. (use period)
   *
   * @see  Function/class relied on
   *
   * @param {type}   var           Description.
   * @param {type}   [var]         Description of optional variable.
   * @param {type}   [var=default] Description of optional variable with default variable.
   * @param {Object} objectVar     Description.
   * @param {type}   objectVar.key Description of a key in the objectVar parameter.
   *
   * @return {type} Return value description.
   */
  stopSound(name: string) {
    if (this._customAudioElements[name]) {
      this._customAudioElements[name].bufferSourceNode.disconnect();
      this._customAudioElements[name].bufferSourceNode.stop();
      this._customAudioElements[name].bufferSourceNode = null;

      this._customAudioElements[name].elapsed = 0;
      this._customAudioElements[name].startedAt = 0;
      this._customAudioElements[name].isPlaying = false;
    }
    this._computeIsPlaying();
  }

  /**
   * Summary. (use period)
   *
   * Description. (use period)
   *
   * @see  Function/class relied on
   *
   * @param {type}   var           Description.
   * @param {type}   [var]         Description of optional variable.
   * @param {type}   [var=default] Description of optional variable with default variable.
   * @param {Object} objectVar     Description.
   * @param {type}   objectVar.key Description of a key in the objectVar parameter.
   *
   * @return {type} Return value description.
   */
  stopSounds() {
    Object.keys(this._customAudioElements).forEach(audioElementKey => {
      if (this._customAudioElements[audioElementKey]) {
        this._customAudioElements[audioElementKey].bufferSourceNode.disconnect();
        this._customAudioElements[audioElementKey].bufferSourceNode.stop();
        this._customAudioElements[audioElementKey].bufferSourceNode = null;

        this._customAudioElements[audioElementKey].elapsed = 0;
        this._customAudioElements[audioElementKey].startedAt = 0;
        this._customAudioElements[audioElementKey].isPlaying = false;
      }
    });
    this._computeIsPlaying();
  }

  /**
   * Summary. (use period)
   *
   * Description. (use period)
   *
   * @see  Function/class relied on
   *
   * @param {type}   var           Description.
   * @param {type}   [var]         Description of optional variable.
   * @param {type}   [var=default] Description of optional variable with default variable.
   * @param {Object} objectVar     Description.
   * @param {type}   objectVar.key Description of a key in the objectVar parameter.
   *
   * @return {type} Return value description.
   */
  private async _loadSound(name: string): Promise<void> {
    const sound: SoundFile = this._soundFilesLibrary[name];
    const bufferSourceNode: AudioBufferSourceNode = this._context.createBufferSource();
    // bufferSourceNode.loop = sound.type === 'loop' ? true : false;
    // bufferSourceNode.connect(this._output);
    const audioBuffer = await this._getSoundFileAudioBuffer(sound.file);
    bufferSourceNode.buffer = audioBuffer;
    // TO DO : Sample rate ? sample rate du _audioContext ?
    this._customAudioElements[name] = {
      bufferSourceNode: bufferSourceNode,
      duration: audioBuffer.duration,
      cursor: new BehaviorSubject<number>(0),
      elapsed: this._customAudioElements[name]?.elapsed ?? 0,
      startedAt: this._customAudioElements[name]?.startedAt ?? 0,
      isPlaying: this._customAudioElements[name]?.isPlaying ?? false
    };

    this._customAudioElements[name].bufferSourceNode.loop = sound.type === 'loop' ? true : false;
    // TO DO : WTF
    this._customAudioElements[name].bufferSourceNode.connect(this._output);
  }

  /**
   * Summary. (use period)
   *
   * Description. (use period)
   *
   * @see  Function/class relied on
   *
   * @param {type}   var           Description.
   * @param {type}   [var]         Description of optional variable.
   * @param {type}   [var=default] Description of optional variable with default variable.
   * @param {Object} objectVar     Description.
   * @param {type}   objectVar.key Description of a key in the objectVar parameter.
   *
   * @return {type} Return value description.
   */
  public async getSoundDuration(name: string): Promise<number> {
    if (!this._customAudioElements[name]) {
      await this._loadSound(name);
    }
    return this._customAudioElements[name].duration;
  }

  /**
   * Summary. (use period)
   *
   * Description. (use period)
   *
   * @see  Function/class relied on
   *
   * @param {type}   var           Description.
   * @param {type}   [var]         Description of optional variable.
   * @param {type}   [var=default] Description of optional variable with default variable.
   * @param {Object} objectVar     Description.
   * @param {type}   objectVar.key Description of a key in the objectVar parameter.
   *
   * @return {type} Return value description.
   */
  public async getStartedAt(name: string): Promise<number> {
    if (!this._customAudioElements[name]) {
      await this._loadSound(name);
    }
    return this._customAudioElements[name].startedAt;
  }

  /**
   * Summary. (use period)
   *
   * Description. (use period)
   *
   * @see  Function/class relied on
   *
   * @param {type}   var           Description.
   * @param {type}   [var]         Description of optional variable.
   * @param {type}   [var=default] Description of optional variable with default variable.
   * @param {Object} objectVar     Description.
   * @param {type}   objectVar.key Description of a key in the objectVar parameter.
   *
   * @return {type} Return value description.
   */
  public async getPlaybackRate(name: string): Promise<number> {
    if (!this._customAudioElements[name]) {
      await this._loadSound(name);
    }
    return this._customAudioElements[name].bufferSourceNode.playbackRate.value;
  }

  /**
   * Summary. (use period)
   *
   * Description. (use period)
   *
   * @see  Function/class relied on
   *
   * @param {type}   var           Description.
   * @param {type}   [var]         Description of optional variable.
   * @param {type}   [var=default] Description of optional variable with default variable.
   * @param {Object} objectVar     Description.
   * @param {type}   objectVar.key Description of a key in the objectVar parameter.
   *
   * @return {type} Return value description.
   */
  private async _getSoundFileAudioBuffer(file: File): Promise<AudioBuffer> {
    return await new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.onload = (ev: ProgressEvent<FileReader>) => {
        // TO DO : Error handling
        this._context.decodeAudioData(ev.target.result as ArrayBuffer).then((soundBuffer: AudioBuffer) => {
          resolve(soundBuffer);
        });
      };
      fileReader.readAsArrayBuffer(file);
    });
  }

  /**
   * Summary. (use period)
   *
   * Description. (use period)
   *
   * @see  Function/class relied on
   *
   * @param {type}   var           Description.
   * @param {type}   [var]         Description of optional variable.
   * @param {type}   [var=default] Description of optional variable with default variable.
   * @param {Object} objectVar     Description.
   * @param {type}   objectVar.key Description of a key in the objectVar parameter.
   *
   * @return {type} Return value description.
   */
  public async getSoundBuffer(name: string): Promise<AudioBuffer> {
    await this._loadSound(name);

    const sound: SoundFile = this._soundFilesLibrary[name];

    // return this._soundFilesLibrary[name].audioBuffer;
    return await this._getSoundFileAudioBuffer(sound.file);
    // return this._audioElements[name].bufferSourceNode.buffer;
  }

  // /**
  //  * Summary. (use period)
  //  *
  //  * Description. (use period)
  //  *
  //  * @see  Function/class relied on
  //  *
  //  * @param {type}   var           Description.
  //  * @param {type}   [var]         Description of optional variable.
  //  * @param {type}   [var=default] Description of optional variable with default variable.
  //  * @param {Object} objectVar     Description.
  //  * @param {type}   objectVar.key Description of a key in the objectVar parameter.
  //  *
  //  * @return {type} Return value description.
  //  */
  // private _updateSoundCursor(name: string, value: number) {
  //   this._customAudioElements[name].cursor.next(value);
  // }

  /**
   * Summary. (use period)
   *
   * Description. (use period)
   *
   * @see  Function/class relied on
   *
   * @param {type}   var           Description.
   * @param {type}   [var]         Description of optional variable.
   * @param {type}   [var=default] Description of optional variable with default variable.
   * @param {Object} objectVar     Description.
   * @param {type}   objectVar.key Description of a key in the objectVar parameter.
   *
   * @return {type} Return value description.
   */
  setGain(value: number): void {
    this._output.gain.value = value;
  }
}
