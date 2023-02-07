import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { fromEvent, Observable, Subscription } from 'rxjs';
import { Canvas } from '../../../../canvas/Canvas';
import { ProcessedWaveForm } from '../../../../engine/types/interfaces';
import { AudioEngineService, CurrentFileService } from '../../../../services';

@Component({
  selector: 'app-diy',
  templateUrl: './diy.component.html',
  styleUrls: ['./diy.component.css']
})
export class DiyComponent implements OnInit, OnDestroy, AfterViewInit {
  spectrogramCanvasHeight: number = 500;

  private _resize$: Observable<Event> = fromEvent(window, 'resize');
  private _resizeSubscription: Subscription;
  private _fileSelectionSubscription: Subscription;

  private audioBuffer: AudioBuffer;
  private leftChannelData: Float32Array;
  private processedWaveForm: ProcessedWaveForm;
  private remappedData: number[][];
  private spectrogramBufferImageData: ImageData;

  @ViewChild('canvasContainer', { static: true }) canvasContainerRef: ElementRef<HTMLCanvasElement>;
  @ViewChild('spectrogramCanvas', { static: true }) canvasSpectrogramRef: ElementRef<HTMLCanvasElement>;
  spectrogramCanvas: Canvas;

  constructor(private audioEngineService: AudioEngineService, public currentFileService: CurrentFileService) {}

  ngOnInit() {
    this.spectrogramCanvas = new Canvas(this.canvasSpectrogramRef.nativeElement);

    this._resizeSubscription = this._resize$.subscribe(async value => {
      this.spectrogramCanvas.resize(this.canvasContainerRef.nativeElement.clientWidth, this.spectrogramCanvasHeight);
    });

    this._fileSelectionSubscription = this.currentFileService.currentFile$.subscribe(async soundFile => {
      if (soundFile.audioBuffer != this.audioBuffer) {
        this.audioBuffer = this.currentFileService.getAudioBuffer();
        this.leftChannelData = this.audioBuffer.getChannelData(0);
        this.processedWaveForm = this.currentFileService.getProcessedWaveForm();
        this.remappedData = this.currentFileService.getRemappedData();

        // this.playbackRate = this.currentFileService.getPlaybackRate();
      }
    });
  }

  ngOnDestroy() {
    this._fileSelectionSubscription.unsubscribe();
    this._resizeSubscription.unsubscribe();
  }

  ngAfterViewInit() {
    this.spectrogramCanvas.resize(this.canvasContainerRef.nativeElement.clientWidth, this.spectrogramCanvasHeight);

    this._draw();
  }

  private _draw() {
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

    // this._drawMousePosition();

    requestAnimationFrame(() => this._draw());
  }

  private _drawSpectrogram() {
    var startTime = performance.now();

    for (let y = 0; y < this.spectrogramCanvas.canvas.height; y++) {
      const relativeY = Math.floor((y * this.remappedData.length) / this.spectrogramCanvas.canvas.height);
      for (let x = 0; x < this.spectrogramCanvas.canvas.width; x++) {
        const relativeX = Math.floor((x * this.remappedData[y].length) / this.spectrogramCanvas.canvas.width);
        const rgb: string = (((this.remappedData[relativeY][relativeX] / 8) * 255) | 0).toString(16);
        const color = '#' + rgb + rgb + rgb;
        // console.log('color : ', color);
        this.spectrogramCanvas.drawRectangle(x, this.spectrogramCanvas.canvas.height - y, 1, 1, color);
      }
    }

    var endTime = performance.now();

    console.log(`Call to _drawSpectrogram took ${endTime - startTime} milliseconds`);
  }

  // private _drawMousePosition() {
  //   this.spectrogramCanvas.ctx.textAlign = 'center';
  //   this.spectrogramCanvas.ctx.strokeStyle = '#FFFFFF';
  //   this.spectrogramCanvas.ctx.strokeText('lol', 20, 20);
  // }
}
