/**
 * Parent interface for effects options
 *
 */
export interface EffectOptions {
  muted?: boolean;
  dryWet?: number;
  outputGain?: number;
}

/**
 * Options for _3BandEQ
 *
 */
export interface _3BandEQOptions extends EffectOptions {
  breakPoints?: {
    lowMid: number;
    midHigh: number;
  };

  low?: _3BandEQBandOptions;
  mid?: _3BandEQBandOptions;
  high?: _3BandEQBandOptions;
}
// Check BiquadFilterOptions

/**
 * Options for _3BandEQ
 *
 */
export interface _3BandEQBandOptions {
  gain?: number;
  Q?: number;
  detune?: number;
}

/**
 * Options for Delay
 *
 */
export interface MyDelayOptions extends EffectOptions {
  delayTime?: number;
  feedback?: number;
}
// Check DelayOptions

/**
 * Options for distortion
 *
 */
export interface DistortionOptions extends EffectOptions {
  curve?: Float32Array;
  oversample?: OverSampleType;
}
// Check WaveShaperOptions

/**
 * Options for filter
 *
 */
export interface FilterOptions extends EffectOptions {
  type?: BiquadFilterType;
  Q?: number;
  frequency?: number;
  detune?: number;
  gain?: number;
}
// Check BiquadFilterOptions

/**
 * Options for pan (panning)
 *
 */
export interface PanOptions extends EffectOptions {
  pan?: number;
}
// Check PannerOptions

/**
 * Options for reverb
 *
 */
export interface ReverbOptions extends EffectOptions {
  seconds?: number;
  decay?: number;
  reverse?: boolean;
}
// Check ConvolverOptions

// /**
//  * Options for reverb
//  *
//  */
// export interface ConvolutionReverbOptions extends BaseEffectOptions {}
// // Check ConvolverOptions

/**
 * Options for visualizer
 *
 */
export interface VisualizerOptions extends EffectOptions {
  fftSize?: number;
  maxDecibels?: number;
  minDecibels?: number;
  smoothingTimeConstant?: number;
}

/**
 * Options for gate
 *
 */
export interface GateOptions extends EffectOptions {
  threshold?: number;
}

/**
 * Options for visualizer
 *
 */
export interface CompressorOptions extends EffectOptions {
  threshold?: number;
  attack?: number;
  knee?: number;
  ratio?: number;
  release?: number;
}
