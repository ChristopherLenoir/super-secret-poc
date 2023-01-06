import { Effect } from '../../types/abstractClasses';
import { CompressorOptions } from '../../types/interfaces';
import { clamp } from '../../utils';

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
export class Compressor extends Effect<CompressorOptions> {
  // TO DO : un gain node pour relever l'output ?
  public readonly _compressorNode: DynamicsCompressorNode;

  /**
   * Create a point.
   * @param {number} x  The x value.
   */
  constructor(_context: AudioContext, options: CompressorOptions = {}) {
    super('Compressor', _context, options);

    this._compressorNode = new DynamicsCompressorNode(this._context, this.options);
    this._wetChannel.addEffect(this._compressorNode);
  }

  get threshold(): number {
    return this._compressorNode.threshold.value;
  }

  setThreshold(value: number) {
    this._updateOptions({ threshold: clamp(value, -100, 0) });
    this._compressorNode.threshold.value = this.options.threshold;
  }

  get attack(): number {
    return this._compressorNode.attack.value;
  }

  setAttack(value: number) {
    this._updateOptions({ attack: value });
    this._compressorNode.attack.value = this.options.attack;
  }

  get knee(): number {
    return this._compressorNode.knee.value;
  }

  setKnee(value: number) {
    this._updateOptions({ knee: clamp(value, 0, 40) });
    this._compressorNode.knee.value = this.options.knee;
  }

  get ratio(): number {
    return this._compressorNode.ratio.value;
  }

  setRatio(value: number) {
    this._updateOptions({ ratio: clamp(value, 1, 20) });
    this._compressorNode.ratio.value = this.options.ratio;
  }

  get release(): number {
    return this._compressorNode.release.value;
  }

  setRelease(value: number) {
    this._updateOptions({ release: clamp(value, 0, 1) });
    this._compressorNode.release.value = this.options.release;
  }
}
