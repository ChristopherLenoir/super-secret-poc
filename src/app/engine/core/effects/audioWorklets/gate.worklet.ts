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
  constructor(options) {
    super();
    console.log("options : ", options);

    this.threshold = options.processorOptions.threshold;
  }

  process (inputs, outputs, parameters) {
    // console.log("-----------------")
    // console.log("this.threshold : ", this.threshold)
    // By default, the node has single input and output.
    const input = inputs[0];
    const output = outputs[0];

    for (let channel = 0; channel < output.length; ++channel) {
      // console.log("input[channel] : ", input[channel])

      if(input[channel] && input[channel].length > 0) {
        const processedChannel = input[channel].map((value) => {
          return Math.abs(value) >= this.threshold ? value : 0;
          // return Math.random() * 2 - 1;
        })
        output[channel].set(processedChannel);
      }
    }

    return true;
  }
}

registerProcessor('gate-processor', GateProcessor);
`;
