import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { fromEvent, Observable, Subscription } from 'rxjs';
import { Canvas } from '../../canvas/Canvas';
import { processWaveForm } from '../../engine/utils';
import { AudioEngineService, CurrentFileService } from '../../services';

@Component({
  selector: 'app-file-audio-player',
  templateUrl: './file-audio-player.component.html',
  styleUrls: ['./file-audio-player.component.scss']
})
export class FileAudioPlayerComponent implements OnInit, AfterViewInit, OnDestroy, AfterViewInit {
  private audioBuffer: AudioBuffer;
  private leftChannelData: Float32Array;
  private amplitudeBufferImageData: ImageData;
  private spectrogramBufferImageData: ImageData;
  private isPlaying: boolean;
  private _isPlayingSubscription: Subscription;

  private duration: number = 0;
  private startedAt: number;
  private pausedAt: number;
  private playbackRate: number;
  // private _startTime: number;
  // canvasWidth: number = 600;
  amplitudeCanvasHeight: number = 100;
  spectrogramCanvasHeight: number = 300;
  requestAnimationFrameId: number;

  private _resize$: Observable<Event> = fromEvent(window, 'resize');
  private _resizeSubscription: Subscription;
  private _fileSelectionSubscription: Subscription;
  @ViewChild('canvasContainer', { static: true }) canvasContainerRef: ElementRef<HTMLCanvasElement>;
  @ViewChild('amplitudeCanvas', { static: true }) canvasAmplitudeRef: ElementRef<HTMLCanvasElement>;
  @ViewChild('spectrogramCanvas', { static: true }) canvasSpectrogramRef: ElementRef<HTMLCanvasElement>;
  amplitudeCanvas: Canvas;
  spectrogramCanvas: Canvas;

  constructor(private audioEngineService: AudioEngineService, public currentFileService: CurrentFileService) {}

  async ngOnInit() {
    this.amplitudeCanvas = new Canvas(this.canvasAmplitudeRef.nativeElement);
    this.spectrogramCanvas = new Canvas(this.canvasSpectrogramRef.nativeElement);
  }

  async ngAfterViewInit() {
    this.amplitudeCanvas.resize(this.canvasContainerRef.nativeElement.clientWidth, this.amplitudeCanvasHeight);
    this.spectrogramCanvas.resize(this.canvasContainerRef.nativeElement.clientWidth, this.spectrogramCanvasHeight);

    this.audioBuffer = this.currentFileService.getAudioBuffer();
    this.leftChannelData = this.audioBuffer.getChannelData(0);

    const processed = await processWaveForm(this.audioBuffer);

    this.duration = this.currentFileService.getSoundDuration();
    this.startedAt = this.currentFileService.getStartedAt();
    // TO DO : Le pausedat dynamique
    this.pausedAt = this.currentFileService.getPausedAt();
    this.playbackRate = this.currentFileService.getPlaybackRate();

    this._draw();

    this._resizeSubscription = this._resize$.subscribe(async value => {
      this.amplitudeCanvas.resize(this.canvasContainerRef.nativeElement.clientWidth, this.amplitudeCanvasHeight);
      this.spectrogramCanvas.resize(this.canvasContainerRef.nativeElement.clientWidth, this.spectrogramCanvasHeight);
      this._draw();
    });

    this._isPlayingSubscription = this.currentFileService.isPlaying$.subscribe(value => {
      this.isPlaying = value;
    });

    this._fileSelectionSubscription = this.currentFileService.currentFile$.subscribe(async value => {
      this.audioBuffer = this.currentFileService.getAudioBuffer();
      this.leftChannelData = this.audioBuffer.getChannelData(0);
      this.duration = this.currentFileService.getSoundDuration();
      this.startedAt = this.currentFileService.getStartedAt();
      this.pausedAt = this.currentFileService.getPausedAt();
      this.playbackRate = this.currentFileService.getPlaybackRate();
      this._draw();
    });
  }

  ngOnDestroy() {
    this._resizeSubscription.unsubscribe();
    this._isPlayingSubscription.unsubscribe();
  }

  private _draw() {
    this.amplitudeCanvas.background();
    this.spectrogramCanvas.background();

    if (!this.amplitudeBufferImageData) {
      // console.log('no data');
      this._drawBuffer();
      this.amplitudeBufferImageData = this.amplitudeCanvas.ctx.getImageData(
        0,
        0,
        this.amplitudeCanvas.canvas.width,
        this.amplitudeCanvas.canvas.height
      );
    } else {
      // console.log('data');
      this.amplitudeCanvas.ctx.putImageData(this.amplitudeBufferImageData, 0, 0);
    }

    if (!this.spectrogramBufferImageData) {
      // console.log('no data');
      this._drawSpectrogram();
      this.spectrogramBufferImageData = this.spectrogramCanvas.ctx.getImageData(
        0,
        0,
        this.spectrogramCanvas.canvas.width,
        this.spectrogramCanvas.canvas.height
      );
    } else {
      // console.log('data');
      this.spectrogramCanvas.ctx.putImageData(this.spectrogramBufferImageData, 0, 0);
    }

    this._drawHead();

    requestAnimationFrame(() => this._draw());
  }

  private _drawBuffer() {
    for (let i = 0; i < this.amplitudeCanvas.canvas.width; i++) {
      const relativeIA = Math.floor((i * this.leftChannelData.length) / this.amplitudeCanvas.canvas.width);
      const yA =
        this.leftChannelData[relativeIA] * this.amplitudeCanvas.canvas.height + this.amplitudeCanvas.canvas.height / 2;
      const relativeIB = Math.floor((i * this.leftChannelData.length) / this.amplitudeCanvas.canvas.width);
      const yB = -(
        this.leftChannelData[relativeIB] * this.amplitudeCanvas.canvas.height -
        this.amplitudeCanvas.canvas.height / 2
      );
      this.amplitudeCanvas.drawLine(i, yA, i, yB);
    }
  }

  private _drawSpectrogram() {
    for (let i = 0; i < this.amplitudeCanvas.canvas.width; i++) {
      const relativeIA = Math.floor((i * this.leftChannelData.length) / this.amplitudeCanvas.canvas.width);
      const yA =
        this.leftChannelData[relativeIA] * this.amplitudeCanvas.canvas.height + this.amplitudeCanvas.canvas.height / 2;
      const relativeIB = Math.floor((i * this.leftChannelData.length) / this.amplitudeCanvas.canvas.width);
      const yB = -(
        this.leftChannelData[relativeIB] * this.amplitudeCanvas.canvas.height -
        this.amplitudeCanvas.canvas.height / 2
      );
      this.amplitudeCanvas.drawLine(i, yA, i, yB);
    }
  }

  private _drawHead() {
    if (this.isPlaying) {
      // const thresholdColor = 'rgb(224,27,106)';
      let elapsed;
      console.log('this.pausedAt : ', this.pausedAt);
      if (this.pausedAt > 0) {
        elapsed = this.pausedAt * this.playbackRate;
      } else {
        elapsed = this.audioEngineService.audioEngine.masterContext.currentTime - this.startedAt * this.playbackRate;
      }
      const elapsedX = (elapsed * this.amplitudeCanvas.canvas.width) / this.duration;
      // this.canvas.drawLine(elapsedX, this.canvas.canvas.height, elapsedX, 0);
      this.amplitudeCanvas.drawCircle(elapsedX, this.amplitudeCanvas.canvas.height / 2, 10);
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
}
