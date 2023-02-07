import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { PlotlyComponent } from 'angular-plotly.js';
import { fromEvent, Observable, Subscription } from 'rxjs';
import { ProcessedWaveForm } from '../../../../engine/types/interfaces';
import { CurrentFileService } from '../../../../services';

@Component({
  selector: 'app-plotly-chart',
  templateUrl: './plotly-chart.component.html',
  styleUrls: ['./plotly-chart.component.css']
})
export class PlotlyChartComponent implements OnInit, OnDestroy, AfterViewInit {
  spectrogramCanvasHeight: number = 500;

  private _resize$: Observable<Event> = fromEvent(window, 'resize');
  private _resizeSubscription: Subscription;
  private _fileSelectionSubscription: Subscription;

  private audioBuffer: AudioBuffer;
  private leftChannelData: Float32Array;
  private processedWaveForm: ProcessedWaveForm;
  private remappedData: number[][];

  @ViewChild('canvasContainer', { static: true }) canvasContainerRef: ElementRef<HTMLCanvasElement>;
  plotlyGraph: Partial<PlotlyComponent>;
  isPlotlySetUp: boolean = false;

  startTime: number;
  endTime: number;

  constructor(public currentFileService: CurrentFileService) {}

  ngOnInit() {
    this.startTime = performance.now();

    this._resizeSubscription = this._resize$.subscribe(async value => {
      this.isPlotlySetUp = false;
    });

    this._fileSelectionSubscription = this.currentFileService.currentFile$.subscribe(async soundFile => {
      if (soundFile.audioBuffer != this.audioBuffer) {
        this.audioBuffer = this.currentFileService.getAudioBuffer();
        this.leftChannelData = this.audioBuffer.getChannelData(0);
        this.processedWaveForm = this.currentFileService.getProcessedWaveForm();
        this.remappedData = this.currentFileService.getRemappedData();

        // this.playbackRate = this.currentFileService.getPlaybackRate();

        this.isPlotlySetUp = false;
      }
    });
  }

  ngOnDestroy() {
    this._fileSelectionSubscription.unsubscribe();
    this._resizeSubscription.unsubscribe();
  }

  ngAfterViewInit() {
    this._draw();
    this.endTime = performance.now();
    console.log(`Plotly component took ${this.endTime - this.startTime} milliseconds`);
  }

  private _draw() {
    if (!this.isPlotlySetUp) {
      this.isPlotlySetUp = true;

      const icon = {
        width: 1000,
        path: 'm833 5l-17 108v41l-130-65 130-66c0 0 0 38 0 39 0-1 36-14 39-25 4-15-6-22-16-30-15-12-39-16-56-20-90-22-187-23-279-23-261 0-341 34-353 59 3 60 228 110 228 110-140-8-351-35-351-116 0-120 293-142 474-142 155 0 477 22 477 142 0 50-74 79-163 96z m-374 94c-58-5-99-21-99-40 0-24 65-43 144-43 79 0 143 19 143 43 0 19-42 34-98 40v216h87l-132 135-133-135h88v-216z m167 515h-136v1c16 16 31 34 46 52l84 109v54h-230v-71h124v-1c-16-17-28-32-44-51l-89-114v-51h245v72z',
        ascent: 850,
        descent: -150
      };

      /* const axisTemplate = {
        range: [0, 1.6],
        autorange: false,
        showgrid: false,
        zeroline: false,
        linecolor: 'black',
        showticklabels: false,
        ticks: ''
      }; */

      this.plotlyGraph = {
        data: [
          {
            z: this.remappedData,
            type: 'heatmap'
          }
        ],
        layout: {
          // width: 320,
          // height: 240,
          // width: this.canvasContainerRef.nativeElement.width,
          // height: this.spectrogramCanvasHeight,
          title: 'Spectrogram'
          /*margin: {
            t: 0,
            r: 0,
            b: 0,
            l: 0
          },*/
          // xaxis: axisTemplate,
          // yaxis: axisTemplate,
          // autosize: true
        },
        config: {
          displaylogo: false,
          // responsive: true,
          scrollZoom: false,
          modeBarButtonsToAdd: [
            {
              title: 'color toggler',
              name: 'color toggler',
              icon: icon,
              click: gd => {
                alert('click');
              }
            }
          ],
          editable: true
        },
        updateOnDataChange: true
        // updateOnLayoutChange: true
      };
    }

    // srequestAnimationFrame(() => this._draw());
  }
}
