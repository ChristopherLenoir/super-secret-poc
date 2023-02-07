import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  AxisScrollStrategies,
  AxisTickStrategies,
  ChartXY,
  ColorHSV,
  emptyFill,
  emptyLine,
  lightningChart,
  LUT,
  PalettedFill
} from '@arction/lcjs';
import { fromEvent, Observable, Subscription } from 'rxjs';
import { ProcessedWaveForm } from '../../../../engine/types/interfaces';
import { intensityDataToDb } from '../../../../engine/utils';
import { CurrentFileService } from '../../../../services';

@Component({
  selector: 'app-lightning-chart',
  templateUrl: './lightning-chart.component.html',
  styleUrls: ['./lightning-chart.component.css']
})
export class LightningChartComponent implements OnInit, OnDestroy, AfterViewInit {
  spectrogramCanvasHeight: number = 500;

  private _resize$: Observable<Event> = fromEvent(window, 'resize');
  private _resizeSubscription: Subscription;
  private _fileSelectionSubscription: Subscription;

  private audioBuffer: AudioBuffer;
  private processedWaveForm: ProcessedWaveForm;
  private remappedData: number[][];

  @ViewChild('canvasContainer', { static: true }) canvasContainerRef: ElementRef<HTMLCanvasElement>;
  isChartSetUp: boolean = false;
  chart: ChartXY;
  chartId: number;
  chartStyle: string;

  constructor(public currentFileService: CurrentFileService) {}

  _computeChartStyle() {
    return `height: ${this.spectrogramCanvasHeight}px`;
  }

  async ngOnInit() {
    // Generate random ID to us as the containerId for the chart and the target div id
    this.chartId = Math.trunc(Math.random() * 1000000);
    this.chartStyle = this._computeChartStyle();

    this._resizeSubscription = this._resize$.subscribe(async value => {
      this.isChartSetUp = false;
    });

    this._fileSelectionSubscription = this.currentFileService.currentFile$.subscribe(async soundFile => {
      if (soundFile.audioBuffer != this.audioBuffer) {
        this.audioBuffer = this.currentFileService.getAudioBuffer();
        this.processedWaveForm = this.currentFileService.getProcessedWaveForm();
        this.remappedData = this.currentFileService.getRemappedData();

        this.isChartSetUp = false;
      }
    });
  }

  async ngAfterViewInit() {
    // Create chartXY
    this.chart = lightningChart()
      .ChartXY({ container: `${this.chartId}` })
      .setTitleFillStyle(emptyFill);
    // Set chart title
    this.chart.setTitle('Spectrogram');

    this.isChartSetUp = false;
    this._draw();
  }

  ngOnDestroy() {
    this._fileSelectionSubscription.unsubscribe();
    this._resizeSubscription.unsubscribe();

    // "dispose" should be called when the component is unmounted to free all the resources used by the chart
    this.chart.dispose();
  }

  private _draw() {
    if (!this.isChartSetUp) {
      this.isChartSetUp = true;
      const _drawSpectrogramWithLibStartTime = performance.now();
      this._drawSpectrogramWithLib();
      const _drawSpectrogramWithLibEndTime = performance.now();
      console.log(
        `Call to _drawSpectrogramWithLib took ${
          _drawSpectrogramWithLibEndTime - _drawSpectrogramWithLibStartTime
        } milliseconds`
      );
    }

    requestAnimationFrame(() => this._draw());
  }

  /**
   * Render a spectrogram for given data set
   * @param {WaveFormData} data Data set to render
   */
  private _drawSpectrogramWithLib() {
    // Create a chart for the channel

    // Start position of the heatmap
    const start = {
      x: 0,
      y: 0
    };
    // End position of the heatmap
    const end = {
      x: this.processedWaveForm.duration,
      // Use half of the fft data range
      y: Math.ceil(this.processedWaveForm.maxFreq / 2)
    };

    // Create the series
    const series = this.chart
      .addHeatmapGridSeries({
        // Data columns, defines horizontal resolution
        columns: this.processedWaveForm.tickCount,
        // Use half of the fft data range
        rows: Math.ceil(this.processedWaveForm.stride / 2),
        // Start position, defines where one of the corners for hetmap is
        start,
        // End position, defines the opposite corner of the start corner
        end,
        dataOrder: 'rows',
        heatmapDataType: 'intensity'
      })
      // Use palletted fill style, intensity values define the color for each data point based on the LUT
      .setFillStyle(
        new PalettedFill({
          lut: new LUT({
            steps: [
              {
                value: 0,
                color: ColorHSV(0, 1, 0),
                label: `${Math.round(
                  intensityDataToDb(
                    255 * (0 / 6),
                    this.processedWaveForm.channelDbRange.minDecibels,
                    this.processedWaveForm.channelDbRange.maxDecibels
                  )
                )}`
              },
              {
                value: 255 * (1 / 6),
                color: ColorHSV(270, 0.84, 0.2),
                label: `${Math.round(
                  intensityDataToDb(
                    255 * (1 / 6),
                    this.processedWaveForm.channelDbRange.minDecibels,
                    this.processedWaveForm.channelDbRange.maxDecibels
                  )
                )}`
              },
              {
                value: 255 * (2 / 6),
                color: ColorHSV(289, 0.86, 0.35),
                label: `${Math.round(
                  intensityDataToDb(
                    255 * (2 / 6),
                    this.processedWaveForm.channelDbRange.minDecibels,
                    this.processedWaveForm.channelDbRange.maxDecibels
                  )
                )}`
              },
              {
                value: 255 * (3 / 6),
                color: ColorHSV(324, 0.97, 0.56),
                label: `${Math.round(
                  intensityDataToDb(
                    255 * (3 / 6),
                    this.processedWaveForm.channelDbRange.minDecibels,
                    this.processedWaveForm.channelDbRange.maxDecibels
                  )
                )}`
              },
              {
                value: 255 * (4 / 6),
                color: ColorHSV(1, 1, 1),
                label: `${Math.round(
                  intensityDataToDb(
                    255 * (4 / 6),
                    this.processedWaveForm.channelDbRange.minDecibels,
                    this.processedWaveForm.channelDbRange.maxDecibels
                  )
                )}`
              },
              {
                value: 255 * (5 / 6),
                color: ColorHSV(44, 0.64, 1),
                label: `${Math.round(
                  intensityDataToDb(
                    255 * (5 / 6),
                    this.processedWaveForm.channelDbRange.minDecibels,
                    this.processedWaveForm.channelDbRange.maxDecibels
                  )
                )}`
              },
              {
                value: 255,
                color: ColorHSV(62, 0.32, 1),
                label: `${Math.round(
                  intensityDataToDb(
                    255 * (6 / 6),
                    this.processedWaveForm.channelDbRange.minDecibels,
                    this.processedWaveForm.channelDbRange.maxDecibels
                  )
                )}`
              }
            ],
            units: 'dB',
            interpolate: true
          })
        })
      )
      .setWireframeStyle(emptyLine)
      .setCursorResultTableFormatter((builder, series, dataPoint) =>
        builder
          .addRow(series.getName())
          .addRow('X:', '', series.axisX.formatValue(dataPoint.x))
          .addRow('Y:', '', series.axisY.formatValue(dataPoint.y))
          .addRow(
            '',
            intensityDataToDb(
              dataPoint.intensity,
              this.processedWaveForm.channelDbRange.minDecibels,
              this.processedWaveForm.channelDbRange.maxDecibels
            ).toFixed(1) + ' dB'
          )
      );

    // Set default X axis settings
    series.axisX
      .setInterval(start.x, end.x)
      .setTickStrategy(AxisTickStrategies.Empty)
      .setTitleMargin(0)
      .setScrollStrategy(undefined)
      .setMouseInteractions(false);
    // Set default chart settings
    this.chart.setPadding({ left: 0, top: 8, right: 8, bottom: 1 }).setMouseInteractions(false);
    // Set default X axis settings
    series.axisY
      .setInterval(start.y, end.y)
      .setTitle(`Channel ${0 + 1} (Hz)`)
      .setScrollStrategy(AxisScrollStrategies.fitting);

    // // TO DO : le remappedData dans le audioFIle
    // // Setup the data for the chart
    // const remappedData = remapDataToTwoDimensionalMatrix(
    //   this.processedWaveForm.channel,
    //   this.processedWaveForm.stride,
    //   this.processedWaveForm.tickCount
    // )
    //   // Slice only first half of data (rest are 0s).
    //   .slice(0, this.processedWaveForm.stride / 2);

    // Set the heatmap data
    series.invalidateIntensityValues({
      iRow: 0,
      iColumn: 0,
      values: this.remappedData
    });

    // Style to bottom most chart axis to use it as the common axis for each chart
    series.axisX
      .setTickStrategy(AxisTickStrategies.Numeric)
      .setScrollStrategy(AxisScrollStrategies.fitting)
      .setTitle(`Duration (s)`)
      .setMouseInteractions(true);

    // TO DO : To do
    // // Add LegendBox.
    // const legend = dashboard
    //   .addLegendBox()
    //   // Dispose example UI elements automatically if they take too much space. This is to avoid bad UI on mobile / etc. devices.
    //   .setAutoDispose({
    //     type: 'max-width',
    //     maxWidth: 0.3
    //   })
    //   .setPosition({ x: 100, y: 50 })
    //   .setOrigin({ x: 1, y: 0 });
    // charts.forEach(c => legend.add(c.chart));

    // TO DO : To do
    // // Link chart X axis scales
    // const syncedAxes = charts.map(chart => chart.series.axisX);
    // synchronizeAxisIntervals(...syncedAxes);

    // return dashboard;
  }
}
