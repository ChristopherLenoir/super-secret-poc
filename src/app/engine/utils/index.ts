export * as acceleration from './acceleration';
export * as audioWorklets from './audioWorklets';
export * from './buildImpulse';
export * from './converts';
export * from './hidash';
export * as interpolation from './interpolation';
export * from './makeDistortionCurve';

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
export async function getSoundFileAudioBuffer(context: AudioContext, file: File): Promise<AudioBuffer> {
  return await new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.onload = (ev: ProgressEvent<FileReader>) => {
      // TO DO : Error handling
      context.decodeAudioData(ev.target.result as ArrayBuffer).then((soundBuffer: AudioBuffer) => {
        resolve(soundBuffer);
      });
    };
    fileReader.readAsArrayBuffer(file);
  });
}

/**
 *
 * Process a AudioBuffer and create FFT Data for Spectrogram from it.
 *
 * @see  Function/class relied on
 *
 * @param   {AudioBuffer}     audioBuffer   AudioBuffer to process into FFT data.
 *
 * @returns {WaveFormData}                  Processed data
 */
export async function processWaveForm(
  audioBuffer: AudioBuffer,
  fftSize: number = 4096,
  smoothingTimeConstant: number = 0.8,
  processorBufferSize: number = 2048
) {
  // Create a new OfflineAudioContext with information from the pre-created audioBuffer
  // The OfflineAudioContext can be used to process a audio file as fast as possible.
  // Normal AudioContext would process the file at the speed of playback.
  const offlineCtx = new OfflineAudioContext(audioBuffer.numberOfChannels, audioBuffer.length, audioBuffer.sampleRate);
  // Create a new source, in this case we have a AudioBuffer to create it for, so we create a buffer source
  const source = offlineCtx.createBufferSource();
  // Set the buffer to the audio buffer we are using
  source.buffer = audioBuffer;
  // Set source channel count to the audio buffer channel count, if this wasn't set, the source would default to 2 channels.
  source.channelCount = audioBuffer.numberOfChannels;

  // We want to create spectrogram for each channel in the buffer, so we need to separate the channels to separate outputs.
  const splitter = offlineCtx.createChannelSplitter(source.channelCount);
  // Create a analyzer node for the full context
  const generalAnalyzer = offlineCtx.createAnalyser();
  generalAnalyzer.fftSize = fftSize;
  generalAnalyzer.smoothingTimeConstant = smoothingTimeConstant;

  // Prepare buffers and analyzers for each channel
  const channelFFtDataBuffers = [];
  const channelDbRanges = [];
  const analyzers = [];
  for (let i = 0; i < source.channelCount; i += 1) {
    channelFFtDataBuffers[i] = new Uint8Array((audioBuffer.length / processorBufferSize) * (fftSize / 2));
    // Setup analyzer for this channel
    analyzers[i] = offlineCtx.createAnalyser();
    analyzers[i].smoothingTimeConstant = smoothingTimeConstant;
    analyzers[i].fftSize = fftSize;
    // Connect the created analyzer to a single channel from the splitter
    splitter.connect(analyzers[i], i);
    channelDbRanges.push({
      minDecibels: analyzers[i].minDecibels,
      maxDecibels: analyzers[i].maxDecibels
    });
  }
  // Script processor is used to process all of the audio data in fftSize sized blocks
  // Script processor is a deprecated API but the replacement APIs have really poor browser support
  offlineCtx.createScriptProcessor = offlineCtx.createScriptProcessor || (offlineCtx as any).createJavaScriptNode;
  const processor = offlineCtx.createScriptProcessor(processorBufferSize, 1, 1);
  let offset = 0;
  processor.onaudioprocess = ev => {
    // Run FFT for each channel
    for (let i = 0; i < source.channelCount; i += 1) {
      const freqData = new Uint8Array(channelFFtDataBuffers[i].buffer, offset, analyzers[i].frequencyBinCount);
      analyzers[i].getByteFrequencyData(freqData);
    }
    offset += generalAnalyzer.frequencyBinCount;
  };
  // Connect source buffer to correct nodes,
  // source feeds to:
  // splitter, to separate the channels
  // processor, to do the actual processing
  // generalAanalyzer, to get collective information
  source.connect(splitter);
  source.connect(processor);
  processor.connect(offlineCtx.destination);
  source.connect(generalAnalyzer);
  // Start the source, other wise start rendering would not process the source
  source.start(0);

  // Process the audio buffer
  await offlineCtx.startRendering();
  return {
    channels: channelFFtDataBuffers,
    channelDbRanges,
    stride: fftSize / 2,
    tickCount: Math.ceil(audioBuffer.length / processorBufferSize),
    maxFreq: offlineCtx.sampleRate / 2, // max freq is always half the sample rate
    duration: audioBuffer.duration
  };
}
