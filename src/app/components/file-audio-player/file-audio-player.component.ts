import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { fromEvent, Observable, Subscription } from 'rxjs';
import { Canvas } from '../../canvas/Canvas';
import { AudioEngineService, CurrentFileService } from '../../services';

@Component({
  selector: 'app-file-audio-player',
  templateUrl: './file-audio-player.component.html',
  styleUrls: ['./file-audio-player.component.scss']
})
export class FileAudioPlayerComponent implements OnInit, AfterViewInit, OnDestroy, AfterViewInit {
  private audioBuffer;
  private leftChannelData: Float32Array;
  private bufferImageData: ImageData;
  private duration: number = 0;
  private startedAt: number;
  private playbackRate: number;
  // private _startTime: number;
  // canvasWidth: number = 600;
  canvasHeight: number = 100;
  requestAnimationFrameId: number;

  private _resize$: Observable<Event> = fromEvent(window, 'resize');
  private _resizeSubscription: Subscription;
  private _fileSelectionSubscription: Subscription;
  @ViewChild('canvasContainer', { static: true }) canvasContainerRef: ElementRef<HTMLCanvasElement>;
  @ViewChild('amplitudeCanvas', { static: true }) canvasRef: ElementRef<HTMLCanvasElement>;
  canvas: Canvas;

  constructor(private audioEngineService: AudioEngineService, public currentFileService: CurrentFileService) {}

  async ngOnInit() {
    this.canvas = new Canvas(this.canvasRef.nativeElement);
  }

  async ngAfterViewInit() {
    this.canvas.resize(this.canvasContainerRef.nativeElement.clientWidth, this.canvasHeight);
    this.audioBuffer = await this.currentFileService.getAudioBuffer();
    this.leftChannelData = this.audioBuffer.getChannelData(0);
    this.duration = await this.currentFileService.getSoundDuration();
    this.startedAt = await this.currentFileService.getStartedAt();
    this.playbackRate = await this.currentFileService.getPlaybackRate();

    this._draw();

    this._resizeSubscription = this._resize$.subscribe(async value => {
      this.canvas.resize(this.canvasContainerRef.nativeElement.clientWidth, this.canvasHeight);
      this._draw();
    });

    this._fileSelectionSubscription = this.currentFileService.currentFile$.subscribe(async value => {
      this.audioBuffer = await this.currentFileService.getAudioBuffer();
      this.leftChannelData = this.audioBuffer.getChannelData(0);
      this.duration = await this.currentFileService.getSoundDuration();
      this.startedAt = await this.currentFileService.getStartedAt();
      this.playbackRate = await this.currentFileService.getPlaybackRate();
      this._draw();
    });
  }

  ngOnDestroy() {
    this._resizeSubscription.unsubscribe();
  }

  private _draw() {
    this.canvas.background();

    if (!this.bufferImageData) {
      // console.log('no data');
      this._drawBuffer();
      this.bufferImageData = this.canvas.ctx.getImageData(0, 0, this.canvas.canvas.width, this.canvas.canvas.height);
    } else {
      // console.log('data');
      this.canvas.ctx.putImageData(this.bufferImageData, 0, 0);
    }
    this._drawHead();

    requestAnimationFrame(() => this._draw());
  }

  play() {
    // this._startTime = Date.now();
    this.currentFileService.play();
  }
  pause() {
    this.currentFileService.pause();
  }
  stop() {
    // this._startTime = 0;
    this.currentFileService.stop();
  }

  private _drawBuffer() {
    const leftChannel = this.audioBuffer.getChannelData(0); // Float32Array describing left channel
    for (let i = 0; i < this.canvas.canvas.width; i++) {
      const relativeIA = Math.floor((i * this.leftChannelData.length) / this.canvas.canvas.width);
      const yA = this.leftChannelData[relativeIA] * this.canvas.canvas.height + this.canvas.canvas.height / 2;
      const relativeIB = Math.floor((i * this.leftChannelData.length) / this.canvas.canvas.width);
      const yB = -(this.leftChannelData[relativeIB] * this.canvas.canvas.height - this.canvas.canvas.height / 2);
      this.canvas.drawLine(i, yA, i, yB);
    }
  }

  private _drawHead() {
    // const thresholdColor = 'rgb(224,27,106)';
    const elapsed = this.audioEngineService.audioEngine.masterContext.currentTime - this.startedAt * this.playbackRate;
    const elapsedX = (elapsed * this.canvas.canvas.width) / this.duration;
    // this.canvas.drawLine(elapsedX, this.canvas.canvas.height, elapsedX, 0);
    this.canvas.drawCircle(elapsedX, this.canvas.canvas.height / 2, 10);
    // this.canvas.drawLine(
    //   elapsedX,
    //   this.canvas.canvas.width / 2 - 25,
    //   elapsedX,
    //   this.canvas.canvas.width / 2 + 25,
    //   '#000000',
    //   5
    // );

    // requestAnimationFrame(() => this._drawHead());
  }
}
