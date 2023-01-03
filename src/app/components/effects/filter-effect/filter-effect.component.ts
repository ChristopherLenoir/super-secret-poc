import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Canvas } from '../../../canvas/Canvas';
import { Filter } from '../../../engine/core/effects';
import { AudioEngineService, ChannelStripService, CurrentFileService } from '../../../services';

@Component({
  selector: 'app-filter-effect',
  templateUrl: './filter-effect.component.html',
  styleUrls: ['./filter-effect.component.scss']
})
export class FilterEffectComponent implements OnInit, AfterViewInit {
  // isPlaying: boolean;
  @Input() effect: Filter;
  @Input() effectIndex: number;

  duration: number = 0;
  canvasWidth: number = 300;
  canvasHeight: number = 128;
  requestAnimationFrameId: number;

  @ViewChild('filterCanvas', { static: true }) canvasRef: ElementRef<HTMLCanvasElement>;
  canvas: Canvas;

  filterTypes: BiquadFilterType[] = [
    'allpass',
    'bandpass',
    'highpass',
    'highshelf',
    'lowpass',
    'lowshelf',
    'notch',
    'peaking'
  ];

  constructor(
    private audioEngineService: AudioEngineService,
    private currentFileService: CurrentFileService,
    private channelStripService: ChannelStripService
  ) {}

  ngOnInit() {
    // this.currentFileService.isPlaying$.subscribe(isPlaying => {
    //   this.isPlaying = isPlaying;
    // });

    this.canvas = new Canvas(this.canvasRef.nativeElement);
    // this.canvas.background();

    this._draw();
  }

  async ngAfterViewInit() {
    this.canvas.resize(this.canvasWidth, this.canvasHeight);
    this.canvas.background('#000000');
  }

  onFilterTypeChange(event) {
    this.effect.setFilterType(event.value);
  }

  onFrequencyChange(event) {
    this.effect.setFrequency(event.value);
  }

  onQChange(event) {
    this.effect.setQ(event.value);
  }

  onGainChange(event) {
    this.effect.setGain(event.value);
  }

  private async _draw() {
    this.canvas.background('#000000');

    var curveColor = 'rgb(224,27,106)';
    var playheadColor = 'rgb(80, 100, 80)';
    var gridColor = 'rgb(100,100,100)';
    var textColor = 'rgb(81,127,207)';

    var dbScale = 60;
    var pixelsPerDb;

    // draw center
    const width = this.canvas.canvas.width;
    const height = this.canvas.canvas.height;

    this.canvas.ctx.strokeStyle = curveColor;
    this.canvas.ctx.lineWidth = 3;
    this.canvas.ctx.beginPath();
    this.canvas.ctx.moveTo(0, 0);

    pixelsPerDb = (0.5 * height) / dbScale;

    var noctaves = 11;

    var frequencyHz = new Float32Array(width);
    var magResponse = new Float32Array(width);
    var phaseResponse = new Float32Array(width);
    var nyquist = 0.5 * this.audioEngineService.audioEngine.masterContext.sampleRate;
    // First get response.
    for (var i = 0; i < width; ++i) {
      var f = i / width;

      // Convert to log frequency scale (octaves).
      f = nyquist * Math.pow(2.0, noctaves * (f - 1.0));

      frequencyHz[i] = f;
    }

    this.effect._filterNode.getFrequencyResponse(frequencyHz, magResponse, phaseResponse);

    for (var i = 0; i < width; ++i) {
      var f = magResponse[i];
      var response = magResponse[i];
      var dbResponse = (20.0 * Math.log(response)) / Math.LN10;

      var x = i;
      var y = this._dbToY(dbResponse, height, pixelsPerDb);

      if (i == 0) this.canvas.ctx.moveTo(x, y);
      else this.canvas.ctx.lineTo(x, y);
    }
    this.canvas.ctx.stroke();
    this.canvas.ctx.beginPath();
    this.canvas.ctx.lineWidth = 1;
    this.canvas.ctx.strokeStyle = gridColor;

    // Draw frequency scale.
    for (var octave = 0; octave <= noctaves; octave++) {
      var x = (octave * width) / noctaves;

      this.canvas.ctx.strokeStyle = gridColor;
      this.canvas.ctx.moveTo(x, 30);
      this.canvas.ctx.lineTo(x, height);
      this.canvas.ctx.stroke();

      var f = nyquist * Math.pow(2.0, octave - noctaves);
      var value = f.toFixed(0);
      var unit = 'Hz';
      if (f > 1000) {
        unit = 'KHz';
        value = (f / 1000).toFixed(1);
      }
      this.canvas.ctx.textAlign = 'center';
      this.canvas.ctx.strokeStyle = textColor;
      this.canvas.ctx.strokeText(value + unit, x, 20);
    }

    // Draw 0dB line.
    this.canvas.ctx.beginPath();
    this.canvas.ctx.moveTo(0, 0.5 * height);
    this.canvas.ctx.lineTo(width, 0.5 * height);
    this.canvas.ctx.stroke();

    // Draw decibel scale.

    for (var db = -dbScale; db < dbScale - 10; db += 10) {
      var y = this._dbToY(db, height, pixelsPerDb);
      this.canvas.ctx.strokeStyle = textColor;
      this.canvas.ctx.strokeText(db.toFixed(0) + 'dB', width - 40, y);
      this.canvas.ctx.strokeStyle = gridColor;
      this.canvas.ctx.beginPath();
      this.canvas.ctx.moveTo(0, y);
      this.canvas.ctx.lineTo(width, y);
      this.canvas.ctx.stroke();
    }

    // await waitForNextFrame();

    requestAnimationFrame(() => this._draw());
  }

  private _dbToY(db, height, pixelsPerDb) {
    var y = 0.5 * height - pixelsPerDb * db;
    return y;
  }
}
