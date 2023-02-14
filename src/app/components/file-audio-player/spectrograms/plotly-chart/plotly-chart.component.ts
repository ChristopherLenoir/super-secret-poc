import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { PlotlyComponent } from 'angular-plotly.js';
import { fromEvent, Observable, Subscription } from 'rxjs';
import { Canvas } from '../../../../canvas/Canvas';
import { ProcessedFFTData } from '../../../../engine/types/interfaces';
import { CurrentFileService } from '../../../../services';

@Component({
  selector: 'app-plotly-chart',
  templateUrl: './plotly-chart.component.html',
  styleUrls: ['./plotly-chart.component.scss']
})
export class PlotlyChartComponent implements OnInit, OnDestroy, AfterViewInit {
  public isOverlayActive: boolean = false;
  private isMouseDown: boolean = false;
  private mouseDownInitialPosition: { x: number; y: number };
  private mouseDownCurrentPosition: { x: number; y: number };

  spectrogramCanvasHeight: number = 600;

  private _resize$: Observable<Event> = fromEvent(window, 'resize');
  private _resizeSubscription: Subscription;
  private _fileSelectionSubscription: Subscription;

  private audioBuffer: AudioBuffer;
  private leftChannelData: Float32Array;
  private processedFFTData: ProcessedFFTData;
  private remappedData: number[][];

  @ViewChild('canvasContainer', { static: true }) canvasContainerRef: ElementRef<HTMLCanvasElement>;
  private _canvasOverlayRef: ElementRef<HTMLCanvasElement>;
  // @ViewChild('canvasOverlay', { static: false }) get canvasOverlayRef(): ElementRef<HTMLCanvasElement> {
  //   return this._canvasOverlayRef;
  // }
  @ViewChild('canvasOverlay', { static: false }) set content(element: ElementRef<HTMLCanvasElement>) {
    this._canvasOverlayRef = element;
  }
  spectrogramCanvas: Canvas;
  measurement: number = 0;

  plotlyGraph: Partial<PlotlyComponent>;
  isPlotlySetUp: boolean = false;
  zoomRatio: number = 0.1;

  startTime: number;
  endTime: number;

  constructor(public currentFileService: CurrentFileService) {}

  ngOnInit() {
    this.startTime = performance.now();

    this._resizeSubscription = this._resize$.subscribe(async value => {
      // this.isPlotlySetUp = false;
      // this._drawPlotly();
    });

    this._fileSelectionSubscription = this.currentFileService.currentFile$.subscribe(async soundFile => {
      if (soundFile.audioBuffer != this.audioBuffer) {
        this.audioBuffer = this.currentFileService.getAudioBuffer();
        this.leftChannelData = this.audioBuffer.getChannelData(0);
        this.processedFFTData = this.currentFileService.getProcessedFFTData();
        this.remappedData = this.currentFileService.getRemappedData();

        // this.playbackRate = this.currentFileService.getPlaybackRate();

        // this.isPlotlySetUp = false;
        // this._drawPlotly();
      }
    });
  }

  ngOnDestroy() {
    this._fileSelectionSubscription.unsubscribe();
    this._resizeSubscription.unsubscribe();
  }

  ngAfterViewInit() {
    this._drawPlotly();
    // this.plotlyRelayout();

    this.endTime = performance.now();
    console.log(`Plotly component took ${this.endTime - this.startTime} milliseconds`);

    this._drawLoop();
  }

  private _drawPlotly() {
    if (!this.isPlotlySetUp) {
      this.isPlotlySetUp = true;

      const icon = {
        width: 1000,
        path: 'M174.9 494.1c-18.7 18.7-49.1 18.7-67.9 0L14.9 401.9c-18.7-18.7-18.7-49.1 0-67.9l50.7-50.7 48 48c6.2 6.2 16.4 6.2 22.6 0s6.2-16.4 0-22.6l-48-48 41.4-41.4 48 48c6.2 6.2 16.4 6.2 22.6 0s6.2-16.4 0-22.6l-48-48 41.4-41.4 48 48c6.2 6.2 16.4 6.2 22.6 0s6.2-16.4 0-22.6l-48-48 41.4-41.4 48 48c6.2 6.2 16.4 6.2 22.6 0s6.2-16.4 0-22.6l-48-48 50.7-50.7c18.7-18.7 49.1-18.7 67.9 0l92.1 92.1c18.7 18.7 18.7 49.1 0 67.9L174.9 494.1z',
        ascent: 850,
        descent: -150
      };

      // const axisTemplate = {
      //   // range: [0, 1.6],
      //   autorange: false,
      //   showgrid: false,
      //   zeroline: false,
      //   linecolor: 'black',
      //   showticklabels: false,
      //   ticks: ''
      // };
      console.log('this.remappedData', this.remappedData);
      console.log('this.remappedData[0]', this.remappedData[0]);

      this.plotlyGraph = {
        data: [
          {
            x: [0, 0.046],
            // y: [0, 156],
            y: [0, 78],
            // z: [0, 1, 2],
            z: this.remappedData,
            // y: [0, 5500, 11000],
            type: 'heatmap',
            hovertemplate: '%{x} | %{y}<extra>%{z:.2f}db</extra>',
            showlegend: false
          }
        ],
        layout: {
          // width: this.canvasContainerRef.nativeElement.width,
          height: this.spectrogramCanvasHeight,
          // title: 'Spectrogram',
          margin: {
            t: 0,
            r: 0,
            b: 50,
            l: 50
          },
          padding: {
            // t: 100,
            // r: 10,
            // b: 100
            // l: 10
          },
          // autosize: true
          xaxis: {
            // title: {
            //   text: 'Duration (s)'
            //   // font: {
            //   //   // family: 'Courier New, monospace',
            //   //   // size: 18,
            //   //   // color: '#7f7f7f'
            //   // }
            // },
            // tickmode: 'linear', //  If "linear", the placement of the ticks is determined by a starting position `tick0` and a tick step `dtick`
            // tickmode: 'array',
            // tickText: ['0', '25', '50'],
            // tickvals: [0, 25, 50]
            // tick0: 0.5
            // dtick: 500,
            showticksuffix: 'all',
            ticksuffix: 's'
          },
          yaxis: {
            // title: {
            //   text: 'Fréquency (Hz)',
            //   font: {
            //     // family: 'Courier New, monospace',
            //     // size: 18,
            //     // color: '#7f7f7f'
            //   }
            // },
            // tickmode: 'linear', //  If "linear", the placement of the ticks is determined by a starting position `tick0` and a tick step `dtick`
            // tickmode: 'array',
            // tickText: ['0', '25', '50'],
            // tickvals: [0, 25, 50]
            showticksuffix: 'all',
            ticksuffix: 'Hz'
          },
          zaxis: {
            title: {
              text: 'Intencity (db)',
              font: {
                // family: 'Courier New, monospace',
                // size: 18,
                // color: '#7f7f7f'
              }
            },
            showticksuffix: 'all',
            ticksuffix: 'db'
          }
          /* Set the ticks to display with a suffix: "all" or "first" or "last" or "none" */
        },
        config: {
          // displayModeBar: false,
          displaylogo: false,
          // responsive: true,
          scrollZoom: false,
          modeBarButtonsToRemove: ['zoom', 'pan', 'zoomin', 'zoomout', 'autoscale'],
          modeBarButtonsToAdd: [
            {
              title: 'Ruler',
              name: 'Ruler',
              icon: icon,
              click: gd => {
                console.log('click : gd : ', gd);
                this.toggleOveray();
              }
            }
          ],
          editable: true
        },
        updateOnDataChange: true
        // updateOnLayoutChange: true
      };
    }

    // srequestAnimationFrame(() => this._drawPlotly());
  }

  private _drawLoop() {
    if (this.isOverlayActive && !!this._canvasOverlayRef && !this.spectrogramCanvas) {
      this.spectrogramCanvas = new Canvas(this._canvasOverlayRef.nativeElement);
      this.spectrogramCanvas.resize(this.canvasContainerRef.nativeElement.clientWidth, this.spectrogramCanvasHeight);

      this._registerMouseEvents();
    }

    if (this.isOverlayActive && !!this.spectrogramCanvas && this.isMouseDown) {
      this.spectrogramCanvas.clearCanvas();

      const pinWidth = 5;
      const pinBorder = 2;

      this.spectrogramCanvas.drawLine(
        this.mouseDownInitialPosition.x,
        this.mouseDownInitialPosition.y,
        this.mouseDownCurrentPosition.x,
        this.mouseDownCurrentPosition.y,
        '#FFFFFF'
      );

      this.spectrogramCanvas.drawRectangle(
        this.mouseDownInitialPosition.x - pinWidth / 2,
        this.mouseDownInitialPosition.y - pinWidth / 2,
        pinWidth,
        pinWidth,
        '#FFFFFF'
      );

      this.spectrogramCanvas.drawRectangle(
        this.mouseDownInitialPosition.x - pinWidth / 2 + pinBorder / 2,
        this.mouseDownInitialPosition.y - pinWidth / 2 + pinBorder / 2,
        pinWidth - pinBorder,
        pinWidth - pinBorder,
        '#000000'
      );

      this.spectrogramCanvas.drawRectangle(
        this.mouseDownCurrentPosition.x - pinWidth / 2,
        this.mouseDownCurrentPosition.y - pinWidth / 2,
        pinWidth,
        pinWidth,
        '#FFFFFF'
      );

      this.spectrogramCanvas.drawRectangle(
        this.mouseDownCurrentPosition.x - pinWidth / 2 + pinBorder / 2,
        this.mouseDownCurrentPosition.y - pinWidth / 2 + pinBorder / 2,
        pinWidth - pinBorder,
        pinWidth - pinBorder,
        '#000000'
      );

      this.spectrogramCanvas.drawRectangle(
        (this.mouseDownInitialPosition.x + this.mouseDownCurrentPosition.x) / 2 - 26,
        (this.mouseDownInitialPosition.y + this.mouseDownCurrentPosition.y) / 2 - 51,
        54,
        22,
        '#FFFFFF'
      );

      this.spectrogramCanvas.drawRectangle(
        (this.mouseDownInitialPosition.x + this.mouseDownCurrentPosition.x) / 2 - 25,
        (this.mouseDownInitialPosition.y + this.mouseDownCurrentPosition.y) / 2 - 50,
        52,
        20,
        '#777777'
      );

      this.spectrogramCanvas.drawText(
        `${(this.measurement * 1000).toFixed(0)}ms`,
        (this.mouseDownInitialPosition.x + this.mouseDownCurrentPosition.x) / 2 - 20,
        (this.mouseDownInitialPosition.y + this.mouseDownCurrentPosition.y) / 2 - 36,
        '#FFFFFF',
        12
      );
    } else if (this.isOverlayActive && !!this.spectrogramCanvas && !this.isMouseDown) {
      this.spectrogramCanvas.clearCanvas();
    }

    requestAnimationFrame(() => this._drawLoop());
  }

  public toggleOveray() {
    this.isOverlayActive = !this.isOverlayActive;
    if (!this.isOverlayActive) {
      this._canvasOverlayRef = null;
      this.spectrogramCanvas = null;
    }
    // this._canvasOverlayRef.nativeElement.hidden = !this.isOverlayActive;
  }
  private _registerMouseEvents() {
    this._canvasOverlayRef.nativeElement.addEventListener('mousedown', event => this._onMouseDown(event), false);
    this._canvasOverlayRef.nativeElement.addEventListener('mousemove', event => this._onMouseMove(event), false);
    this._canvasOverlayRef.nativeElement.addEventListener('mouseup', event => this._onMouseUp(event), false);
  }

  plotlyRelayout(eventData?) {
    console.log('eventData : ', eventData);
    if (!!eventData['xaxis.range[0]'] && !!eventData['xaxis.range[1]']) {
      const xRangeMin = eventData['xaxis.range[0]'];
      const xRangeMax = eventData['xaxis.range[1]'];
      const graphWidth = this.canvasContainerRef.nativeElement
        .getElementsByClassName('nsewdrag drag')[0]
        .getBoundingClientRect().width;

      console.log('graphWidth / (xRangeMax - xRangeMin) : ', graphWidth / (xRangeMax - xRangeMin));
      this.zoomRatio = (xRangeMax - xRangeMin) / graphWidth;
    }
  }

  private _onMouseDown(event: MouseEvent) {
    this.isMouseDown = true;
    this.mouseDownInitialPosition = { x: event.offsetX, y: event.offsetY };
    // console.log('DOWN : event : ', event);
  }
  private _onMouseMove(event: MouseEvent) {
    this.mouseDownCurrentPosition = { x: event.offsetX, y: event.offsetY };

    this.measurement = (this.mouseDownCurrentPosition.x - this.mouseDownInitialPosition.x) * this.zoomRatio;
  }
  private _onMouseUp(event: MouseEvent) {
    this.isMouseDown = false;
    this.mouseDownInitialPosition = null;
    this.toggleOveray();
  }

  getChartDimensions(chart) {
    return chart.querySelector('.bglayer > .bg').getBBox();
  }

  constrainOverlay() {
    var chart = document.getElementById('plot');
    var overlay = document.getElementById('plot-overlay');

    var chartSize = this.getChartDimensions(chart);
    var x_offset = (chart as any)._fullLayout.xaxis._offset;
    var y_offset = (chart as any)._fullLayout.yaxis._offset;

    overlay.style.left = x_offset + 'px';
    overlay.style.top = y_offset + 'px';
    overlay.style.height = chartSize.height + 'px';
    overlay.style.width = chartSize.width + 'px';

    console.log('constrainOverlay', chartSize, x_offset, y_offset);
  }
}
