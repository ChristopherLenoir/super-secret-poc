// import { AudioWorkletProcessor } from './AudioWorkletProcessor';
// // import { registerProcessor } from './registerProcessor';

// export class GateProcessor extends AudioWorkletProcessor {
//   process(inputs, outputs, parameters) {
//     const output = outputs[0];
//     output.forEach(channel => {
//       for (let i = 0; i < channel.length; i++) {
//         channel[i] = Math.random() * 1.0 - 0.5;
//       }
//     });
//     return true;
//   }
// }

// registerProcessor('white-noise-processor', GateProcessor);

export const gateModuleScript = `
class GateProcessor extends AudioWorkletProcessor {
  process (inputs, outputs, parameters) {
    console.log("parameters.threshold : ", parameters.threshold)
    const input = inputs[0]
    const output = outputs[0]
      output.forEach(channel => {
        for (let i = 0; i < channel.length; i++) {
          // channel[i] = Math.random() - 0.5
          output[i] =
          input[i] > parameters.threshold
           ? input[i]
           : 0;
        }
      })
    return true
  }
}

registerProcessor('gate-processor', GateProcessor);
`;
