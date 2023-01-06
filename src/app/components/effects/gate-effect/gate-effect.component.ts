import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Canvas } from '../../../canvas/Canvas';
import { Gate } from '../../../engine/core/effects';
import { AudioEngineService, ChannelStripService, CurrentFileService } from '../../../services';

@Component({
  selector: 'app-gate-effect',
  templateUrl: './gate-effect.component.html',
  styleUrls: ['./gate-effect.component.scss']
})
export class GateEffectComponent implements OnInit, AfterViewInit {
  isPlaying: boolean;
  @Input() effect: Gate;
  @Input() effectIndex: number;

  duration: number = 0;
  canvasWidth: number = 20;
  canvasHeight: number = 128;
  requestAnimationFrameId: number;

  @ViewChild('gateCanvas', { static: true }) canvasRef: ElementRef<HTMLCanvasElement>;
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
    this._draw();
  }

  async ngAfterViewInit() {
    this.canvas.resize(this.canvasWidth, this.canvasHeight);
    this.canvas.background();
    // TO DO : fftSize adapté à la largeur du canvas ?
    // this.effect._gateNode.fftSize = 1 << (31 - Math.clz32(this.canvasWidth));
  }

  private async _draw() {
    this.canvas.background();

    // Get the frequency data from the currently playing music
    this.effect._visualizerNode.getByteTimeDomainData(this.effect.times);

    // Draw the time domain chart.
    var value = this.effect.times[this.effect.times.length - 1];
    // var percent = value / 256;
    var percent = ((value - 128) / 256) * 2;
    var height = this.canvas.canvas.height * percent;
    var offset = this.canvas.canvas.height - height - 1;

    this.canvas.ctx.fillStyle = 'black';
    this.canvas.ctx.fillRect(0, offset, this.canvas.canvas.width, height);

    requestAnimationFrame(() => this._draw());
  }

  onThresholdChange(event) {
    this.effect.setThreshold(event.value);
  }
}
