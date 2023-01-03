import { Effect } from '../../types/abstractClasses';
import { VisualizerOptions } from '../../types/interfaces';

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
export class Visualizer extends Effect<VisualizerOptions> {
  public readonly _visualizerNode: AnalyserNode;
  public freqs: Uint8Array;
  public times: Uint8Array;

  /**
   * Create a point.
   * @param {number} x  The x value.
   */
  constructor(_context: AudioContext, options: VisualizerOptions = {}) {
    super('Visualizer', _context, options);

    this._visualizerNode = new AnalyserNode(this._context, this.options);
    this._wetChannel.addEffect(this._visualizerNode);
    // this._visualizerNode.maxDecibels = 0;
    // this._visualizerNode.minDecibels = -140;

    this.freqs = new Uint8Array(this._visualizerNode.frequencyBinCount);
    this.times = new Uint8Array(this._visualizerNode.frequencyBinCount);
  }

  // /**
  //  *
  //  * @see function
  //  * @param {number}  value Value of the ....
  //  */
  // public get freqs(): Uint8Array {
  //   return this._freqs;
  // }

  // /**
  //  *
  //  * @see function
  //  * @param {number}  value Value of the ....
  //  */
  // public get times(): Uint8Array {
  //   return this._times;
  // }
}
