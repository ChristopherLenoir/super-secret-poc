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
