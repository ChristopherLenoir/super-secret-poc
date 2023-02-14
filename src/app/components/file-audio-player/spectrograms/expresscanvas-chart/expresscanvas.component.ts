import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
// import { CanvasXpress } from 'canvasxpress';
import { fromEvent, Observable, Subscription } from 'rxjs';
import { Canvas } from '../../../../canvas/Canvas';
import { ProcessedFFTData } from '../../../../engine/types/interfaces';
import { remapDataToTwoDimensionalMatrixForExpressCanvas } from '../../../../engine/utils';
import { CurrentFileService } from '../../../../services';

declare let CanvasXpress: any;

@Component({
  selector: 'app-expresscanvas-chart',
  templateUrl: './expresscanvas.component.html',
  styleUrls: ['./expresscanvas.component.css']
})
export class ExpresscanvasChartComponent implements OnInit, OnDestroy, AfterViewInit {
  spectrogramCanvasHeight: number = 500;

  private isMouseDown: boolean = false;
  private mouseDownInitialPosition: { x: number; y: number };
  private mouseDownCurrentPosition: { x: number; y: number };

  private _resize$: Observable<Event> = fromEvent(window, 'resize');
  private _resizeSubscription: Subscription;
  private _fileSelectionSubscription: Subscription;

  private audioBuffer: AudioBuffer;
  private leftChannelData: Float32Array;
  private processedFFTData: ProcessedFFTData;
  private remappedData: number[][];

  @ViewChild('canvasContainer', { static: true }) canvasContainerRef: ElementRef<HTMLCanvasElement>;
  @ViewChild('spectrogramCanvas', { static: true }) canvasSpectrogramRef: ElementRef<HTMLCanvasElement>;
  spectrogramCanvas: Canvas;
  // expresscanvas: CanvasXpress;
  expresscanvas: any;
  isExpressCanvasSetUp: boolean = false;

  startTime: number;
  endTime: number;

  constructor(public currentFileService: CurrentFileService) {}

  ngOnInit() {
    this.startTime = performance.now();
    this._resizeSubscription = this._resize$.subscribe(async value => {
      // this.spectrogramCanvas.resize(this.canvasContainerRef.nativeElement.clientWidth, this.spectrogramCanvasHeight);
      // this.isExpressCanvasSetUp = false;
    });
    this._fileSelectionSubscription = this.currentFileService.currentFile$.subscribe(async soundFile => {
      if (soundFile.audioBuffer != this.audioBuffer) {
        this.audioBuffer = this.currentFileService.getAudioBuffer();
        this.leftChannelData = this.audioBuffer.getChannelData(0);
        this.processedFFTData = this.currentFileService.getProcessedFFTData();
        this.remappedData = this.currentFileService.getRemappedData();
        // this.playbackRate = this.currentFileService.getPlaybackRate();
        this.isExpressCanvasSetUp = false;
      }
    });

    const config = {
      // colorSpectrum: ['magenta', 'blue', 'black', 'red', 'gold'],
      graphType: 'Heatmap',
      heatmapCellBox: 'false',
      heatmapCellBoxWidth: 0,
      // samplesClustered: 'false',
      // showSmpDendrogram: 'false',
      // showVarDendrogram: 'false',
      title: 'Cluster Heatmap Without Trees'
      // variablesClustered: 'false'
    };

    const dataFromFunction = remapDataToTwoDimensionalMatrixForExpressCanvas(
      this.processedFFTData.channel,
      this.processedFFTData.stride,
      this.processedFFTData.tickCount
    );

    // console.log('CanvasXpress : ', CanvasXpress);
    this.expresscanvas = new CanvasXpress('spectrogramCanvas', dataFromFunction, config);
  }

  ngOnDestroy() {
    this._fileSelectionSubscription.unsubscribe();
    this._resizeSubscription.unsubscribe();
  }

  ngAfterViewInit() {
    this.spectrogramCanvas = new Canvas(this.canvasSpectrogramRef.nativeElement);
    // this._registerMouseEvents();

    // this.spectrogramCanvas.resize(this.canvasContainerRef.nativeElement.clientWidth, this.spectrogramCanvasHeight);

    // this._draw();
    this.endTime = performance.now();
    console.log(`CanvasXpress component took ${this.endTime - this.startTime} milliseconds`);
  }

  /*
  private _registerMouseEvents() {
    this.canvasSpectrogramRef.nativeElement.addEventListener('mousedown', event => this._onMouseDown(event), false);
    this.canvasSpectrogramRef.nativeElement.addEventListener('mousemove', event => this._onMouseMove(event), false);
    this.canvasSpectrogramRef.nativeElement.addEventListener('mouseup', event => this._onMouseUp(event), false);
  }

  private _onMouseDown(event: MouseEvent) {
    this.isMouseDown = true;
    this.mouseDownInitialPosition = { x: event.offsetX, y: event.offsetY };
    // console.log('DOWN : event : ', event);
  }
  private _onMouseMove(event: MouseEvent) {
    this.mouseDownCurrentPosition = { x: event.offsetX, y: event.offsetY };
  }
  private _onMouseUp(event: MouseEvent) {
    this.isMouseDown = false;
    this.mouseDownInitialPosition = null;
  }

  private _draw() {
    // if (!this.isExpressCanvasSetUp) {
    // this.isExpressCanvasSetUp = true;

    // // DO STUFF
    // }

    if (this.isMouseDown) {
      this.spectrogramCanvas.clearCanvas();

      const pinWidth = 5;
      const pinBorder = 2;

      this.spectrogramCanvas.drawRectangle(
        this.mouseDownInitialPosition.x - pinWidth / 2,
        this.mouseDownInitialPosition.y - pinWidth / 2,
        pinWidth,
        pinWidth
      );

      this.spectrogramCanvas.drawRectangle(
        this.mouseDownInitialPosition.x - pinWidth / 2 + pinBorder / 2,
        this.mouseDownInitialPosition.y - pinWidth / 2 + pinBorder / 2,
        pinWidth - pinBorder,
        pinWidth - pinBorder,
        '#777777'
      );

      this.spectrogramCanvas.drawLine(
        this.mouseDownInitialPosition.x,
        this.mouseDownInitialPosition.y,
        this.mouseDownCurrentPosition.x,
        this.mouseDownCurrentPosition.y,
        '#777777'
      );

      this.spectrogramCanvas.drawRectangle(
        this.mouseDownCurrentPosition.x - pinWidth / 2,
        this.mouseDownCurrentPosition.y - pinWidth / 2,
        pinWidth,
        pinWidth
      );

      this.spectrogramCanvas.drawRectangle(
        this.mouseDownCurrentPosition.x - pinWidth / 2 + pinBorder / 2,
        this.mouseDownCurrentPosition.y - pinWidth / 2 + pinBorder / 2,
        pinWidth - pinBorder,
        pinWidth - pinBorder,
        '#777777'
      );
    } else {
      this.spectrogramCanvas.clearCanvas();
    }

    requestAnimationFrame(() => this._draw());
  }
  */
}
