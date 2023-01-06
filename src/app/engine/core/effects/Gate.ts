import { Effect } from '../../types/abstractClasses';
import { GateOptions } from '../../types/interfaces';
import { clamp } from '../../utils';
import { gateModuleScript } from './audioWorklets';

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
export class Gate extends Effect<GateOptions> {
  private _gateNode: AudioWorkletNode;
  public readonly _visualizerNode: AnalyserNode;

  // private _freqs: Uint8Array;
  private _times: Uint8Array;

  /**
   * Create a point.
   * @param {number} x  The x value.
   */
  constructor(_context: AudioContext, options: GateOptions = {}) {
    super('Gate', _context, options);

    this._visualizerNode = new AnalyserNode(this._context, {});
    // this._freqs = new Uint8Array(this._visualizerNode.frequencyBinCount);
    this._times = new Uint8Array(this._visualizerNode.frequencyBinCount);
    this._wetChannel.addEffect(this._visualizerNode);

    const scriptUrl: string = URL.createObjectURL(new Blob([gateModuleScript], { type: 'text/javascript' }));

    this._context.audioWorklet.addModule(scriptUrl).then(() => {
      this._gateNode = new AudioWorkletNode(this._context, 'gate-processor', {
        processorOptions: {
          threshold: this.options.threshold
        }
      });

      this._wetChannel.addEffect(this._gateNode);
    });
  }

  // get freqs(): Uint8Array {
  //   return this._freqs;
  // }

  get times(): Uint8Array {
    return this._times;
  }

  get threshold(): number {
    return this.options.threshold;
  }

  setThreshold(value: number) {
    console.log('setThreshold value : ', value);
    this._updateOptions({
      threshold: clamp(value, 0, 1)
    });
    console.log('setThreshold this.options.threshold : ', this.options.threshold);

    this._wetChannel.removeEffect(this._gateNode);
    this._gateNode = new AudioWorkletNode(this._context, 'gate-processor', {
      processorOptions: {
        threshold: this.options.threshold
      }
    });
    this._wetChannel.addEffect(this._gateNode);
  }
}
