import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Canvas } from '../../../canvas/Canvas';
import { Visualizer } from '../../../engine/core/effects';
import { AudioEngineService, ChannelStripService, CurrentFileService } from '../../../services';

@Component({
  selector: 'app-visualizer-effect',
  templateUrl: './visualizer-effect.component.html',
  styleUrls: ['./visualizer-effect.component.scss']
})
export class VisualizerEffectComponent implements OnInit, AfterViewInit {
  isPlaying: boolean;
  @Input() effect: Visualizer;
  @Input() effectIndex: number;

  duration: number = 0;
  // canvasWidth: number = 300;
  canvasWidth: number = 250;
  canvasHeight: number = 128;
  requestAnimationFrameId: number;

  @ViewChild('visualizerCanvas', { static: true }) canvasRef: ElementRef<HTMLCanvasElement>;
  canvas: Canvas;

  constructor(
    private audioEngineService: AudioEngineService,
    private currentFileService: CurrentFileService,
    private channelStripService: ChannelStripService
  ) {}

  ngOnInit() {
    this.currentFileService.isPlaying$.subscribe(isPlaying => {
      this.isPlaying = isPlaying;
    });

    this.canvas = new Canvas(this.canvasRef.nativeElement);
    // this.canvas.background();

    this._draw();
  }

  async ngAfterViewInit() {
    this.canvas.resize(this.canvasWidth, this.canvasHeight);
    // this.canvas.background();
    // this.effect._visualizerNode.fftSize = 1 << (31 - Math.clz32(this.canvasWidth));
  }

  private _draw() {
    this.canvas.background();

    // if (this.isPlaying) {
    //   // if (this.isPlaying) {
    //   //   this.requestAnimationFrameId(this.draw.bind(this));
    //   // }

    //   // Get the frequency data from the currently playing music
    //   this.effect._visualizerNode.getByteFrequencyData(this.effect.freqs);
    //   // this.effect._visualizerNode.getByteTimeDomainData(this.effect.times);
    //   // console.log('this.effect.freqs : ', this.effect.freqs);
    //   const lineWidth = 20;
    //   for (let i = 0; i < this.canvas.canvas.width; i += lineWidth) {
    //     const relativeI = Math.floor((i * this.effect._visualizerNode.fftSize) / this.canvas.canvas.width);
    //     var value = this.canvas.canvas.height * (this.effect.freqs[relativeI] / 256);
    //     // var percent = value / 256;
    //     // var height = this.canvas.canvas.height * percent;
    //     // var offset = this.canvas.canvas.height - height - 1;
    //     // var barWidth = this.canvas.canvas.width / this.effect._visualizerNode.frequencyBinCount;
    //     // var hue = (i / this.effect._visualizerNode.frequencyBinCount) * 360;
    //     this.canvas.drawLine(
    //       i * lineWidth,
    //       this.canvas.canvas.height,
    //       i * lineWidth,
    //       this.canvas.canvas.height - value,
    //       '#000000',
    //       lineWidth
    //     );
    //     // this.canvas.ctx.fillStyle = 'hsl(' + hue + ', 100%, 50%)';
    //     // this.canvas.ctx.fillRect(i * barWidth, offset, barWidth, height);
    //   }

    //   // // Draw the time domain chart.
    //   // for (var i = 0; i < this.effect.frequencyBinCount; i++) {
    //   //   var value = this.effect.times[i];
    //   //   var percent = value / 256;
    //   //   var height = this.canvas.canvas.height * percent;
    //   //   var offset = this.canvas.canvas.height - height - 1;
    //   //   var barWidth = WIDTH / this.effect.frequencyBinCount;
    //   //   this.canvas.ctx.fillStyle = 'white';
    //   //   this.canvas.ctx.fillRect(i * barWidth, offset, 1, 2);
    //   // }

    //   // if (this.isPlaying) {
    //   //   requestAnimFrame(this.draw.bind(this));
    //   // }
    // }

    // if (this.isPlaying) {
    // if (true) {
    // console.log('Draw !');
    // Get the frequency data from the currently playing music
    this.effect._visualizerNode.getByteFrequencyData(this.effect.freqs);
    this.effect._visualizerNode.getByteTimeDomainData(this.effect.times);

    // var width = Math.floor(1 / this.effect.freqs.length, 10);
    var width = Math.floor(1 / this.effect.freqs.length);

    // Draw the frequency domain chart.
    for (var i = 0; i < this.effect._visualizerNode.frequencyBinCount; i++) {
      var value = this.effect.freqs[i];
      var percent = value / 256;
      var height = this.canvas.canvas.height * percent;
      var offset = this.canvas.canvas.height - height - 1;
      var barWidth = this.canvas.canvas.width / this.effect._visualizerNode.frequencyBinCount;
      var hue = (i / this.effect._visualizerNode.frequencyBinCount) * 360;
      this.canvas.ctx.fillStyle = 'hsl(' + hue + ', 100%, 50%)';
      this.canvas.ctx.fillRect(i * barWidth, offset, barWidth, height);
    }

    // // Draw the time domain chart.
    // for (var i = 0; i < this.effect._visualizerNode.frequencyBinCount; i++) {
    //   var value = this.effect.times[i];
    //   var percent = value / 256;
    //   var height = this.canvas.canvas.height * percent;
    //   var offset = this.canvas.canvas.height - height - 1;
    //   var barWidth = this.canvas.canvas.width / this.effect._visualizerNode.frequencyBinCount;
    //   this.canvas.ctx.fillStyle = 'white';
    //   this.canvas.ctx.fillRect(i * barWidth, offset, 1, 2);
    // }
    // }
    // await waitForNextFrame();
    // this._draw();
    requestAnimationFrame(() => this._draw());
  }

  private _getFrequencyValue(freq: number) {
    var nyquist = this.audioEngineService.audioEngine.masterContext.sampleRate / 2;
    var index = Math.round((freq / nyquist) * this.effect.freqs.length);
    return this.effect.freqs[index];
  }
}
