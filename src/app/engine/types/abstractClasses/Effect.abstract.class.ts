import { ChannelStrip, MixChannel } from '../../core/channels';
import { clamp, makeDistortionCurve } from '../../utils';
import { EffectsNames } from '../enums';
import { EffectOptions } from '../interfaces';
import { Channel } from './Channel.abstract.class';
import { HasOptions } from './HasOptions.abstract';

/**
 * Summary. (A channel to handle single/multiple effects)
 *
 * Description. (A channel to handle single/multiple effects)
 *
 *  @class Classname
 *  @constructor
 * @augments parent
 *
 * @return {ChannelStrip} Return value description.
 */
export abstract class Effect<OT extends EffectOptions> extends HasOptions<OT> {
  protected readonly _dryChannel: MixChannel;
  protected readonly _wetChannel: ChannelStrip;
  protected readonly _output: GainNode;
  protected readonly _input: GainNode;

  /**
   * Create a point.
   * @param {number} x  The x value.
   */
  constructor(protected name: EffectsNames, protected _context: AudioContext, options: OT) {
    // super(options);
    super();

    if (name === '_3BandEQ') {
      this._updateOptions<EffectOptions>({
        ...{
          muted: false,
          dryWet: 1,
          gain: 1,
          breakPoints: {
            lowMid: 200,
            midHigh: 2000
          },
          low: {
            gain: 1,
            Q: 1,
            detune: 0
          },
          mid: {
            gain: 1,
            Q: 1,
            detune: 0
          },
          high: {
            gain: 1,
            Q: 1,
            detune: 0
          }
        },
        ...options
      });
    } else if (name === 'Delay') {
      this._updateOptions<EffectOptions>({
        ...{
          muted: false,
          dryWet: 0.5,
          gain: 1,
          delayTime: 0.5,
          feedback: 0.5
        },
        ...options
      });
    } else if (name === 'Distortion') {
      this._updateOptions<EffectOptions>({
        ...{
          muted: false,
          dryWet: 1,
          gain: 1,
          curve: makeDistortionCurve(100, this._context.sampleRate),
          oversample: '2x'
        },
        ...options
      });
    } else if (name === 'Filter') {
      this._updateOptions<EffectOptions>({
        ...{
          muted: false,
          dryWet: 1,
          gain: 1,

          type: 'lowpass',
          frequency: 5000,
          Q: 5,
          detune: 0
        },
        ...options
      });
    } else if (name === 'Pan') {
      this._updateOptions<EffectOptions>({
        ...{ muted: false, dryWet: 1, gain: 1, pan: 0 },
        ...options
      });
    } else if (name === 'Reverb') {
      this._updateOptions<EffectOptions>({
        ...{
          muted: false,
          dryWet: 0.5,
          gain: 1,
          seconds: 3,
          decay: 2,
          reverse: false
        },
        ...options
      });
    } else if (name === 'Visualizer') {
      this._updateOptions<EffectOptions>({
        ...{
          muted: false,
          dryWet: 1,
          gain: 1,

          // fftSize: 256,
          fftSize: 2048,
          maxDecibels: 0,
          // maxDecibels: -30,
          minDecibels: -140,
          // minDecibels: -100,
          smoothingTimeConstant: 0.8
        },
        ...options
      });
    } else if (name === 'Gate') {
      this._updateOptions<EffectOptions>({
        ...{
          muted: false,
          dryWet: 1,
          gain: 1,

          // threshold: 0.25
          threshold: 0.025
        },
        ...options
      });
    } else if (name === 'Compressor') {
      this._updateOptions<EffectOptions>({
        ...{
          muted: false,
          dryWet: 1,
          gain: 1,

          threshold: -24,
          attack: 0.003,
          knee: 30,
          ratio: 12,
          release: 0.25
        },
        ...options
      });
    }

    this._input = new GainNode(this._context);
    this._dryChannel = new MixChannel(this._context);
    this._wetChannel = new ChannelStrip(this._context);
    this._output = new GainNode(this._context);

    this.setDryWetRatio(this.options.dryWet);

    // Dry
    this._input.connect(this._dryChannel.input);
    this._dryChannel.output.connect(this._output);

    // Wet
    this._input.connect(this._wetChannel.input);
    this._wetChannel.output.connect(this._output);
  }

  // TO DO trouver le moyen d'executer ca
  // /**
  //  * Get the effect output.
  //  *
  //  * @see  Function
  //  *
  //  * @return {type} Return the effect output.
  //  */
  // abstract _rootWetChannel(): void;

  /**
   * Get the muted effect status.
   *
   * @see  Function
   *
   * @return {type} Return the muted effect status.
   */
  get muted(): boolean {
    return this.options.muted;
  }

  /**
   * Get the muted effect status.
   *
   * @see  Function
   *
   * @return {type} Return the muted effect status.
   */
  set muted(value: boolean) {
    // this._updateOptions({ muted: value } as EffectOptions);
    this._updateOptions<EffectOptions>({ muted: value });
    // TO DO : Router l'input dans l'output si false et inversement
    if (this.options.muted === true) {
      // this._input.disconnect();
      // this._input.connect(this._dryChannel.input);
      this._input.disconnect(this._wetChannel.input);
    } else {
      this._input.connect(this._wetChannel.input);
    }
  }

  /**
   * Get the efect input.
   *
   * @see  Function
   *
   * @return {type} Return the effect input.
   */
  get input() {
    return this._input;
  }

  /**
   * Get the effect output.
   *
   * @see  Function
   *
   * @return {type} Return the effect output.
   */
  get output() {
    return this._output;
  }

  // get options() {
  //   return {};
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
  connect(item: AudioNode | Effect<EffectOptions> | Channel): AudioNode {
    if ('input' in item && 'output' in item) {
      this._output.connect(item.input);
      return item.output;
    } else {
      return this._output.connect(item);
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
  disconnect() {
    return this._output.disconnect();
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
  setGain(value: number) {
    this._updateOptions<EffectOptions>({ outputGain: value });
    this._output.gain.value = value;
  }

  // /**
  //  * Set the low/mid frequency breakpoint
  //  *
  //  */
  // get dryWet() {
  //   return this._delayNode.delayTime;
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
  setDryWetRatio(ratio: number) {
    this._updateOptions<EffectOptions>({ dryWet: clamp(ratio, 0, 1) });
    this._dryChannel.output.gain.value = 1 - this.options.dryWet;
    this._wetChannel.output.gain.value = this.options.dryWet;
  }
}
