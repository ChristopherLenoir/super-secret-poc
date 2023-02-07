import { DragDropModule } from '@angular/cdk/drag-drop';
import { LayoutModule } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSliderModule } from '@angular/material/slider';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PlotlyModule } from 'angular-plotly.js';
import * as PlotlyJS from 'plotly.js-dist-min';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AddEffectModalComponent } from './components/add-effect-modal/add-effect-modal.component';
import { CompressorEffectComponent } from './components/effects/compressor-effect/compressor-effect.component';
import { FilterEffectComponent } from './components/effects/filter-effect/filter-effect.component';
import { GateEffectComponent } from './components/effects/gate-effect/gate-effect.component';
import { VisualizerEffectComponent } from './components/effects/visualizer-effect/visualizer-effect.component';
// import { AddEffectDialogModule } from './components/add-effect-dialog/add-effect-dialog.module';
import { AudioChannelComponent } from './components/file-audio-channel/file-audio-channel.component';
import { FileAudioPlayerComponent } from './components/file-audio-player/file-audio-player.component';
import { DiyComponent } from './components/file-audio-player/spectrograms/diy/diy.component';
import { ExpresscanvasChartComponent } from './components/file-audio-player/spectrograms/expresscanvas-chart/expresscanvas.component';
import { LightningChartComponent } from './components/file-audio-player/spectrograms/lightning-chart/lightning-chart.component';
import { PlotlyChartComponent } from './components/file-audio-player/spectrograms/plotly-chart/plotly-chart.component';
import { NavigationComponent } from './components/navigation/navigation.component';

PlotlyModule.plotlyjs = PlotlyJS;

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    FileAudioPlayerComponent,
    AudioChannelComponent,
    NavigationComponent,
    AddEffectModalComponent,
    VisualizerEffectComponent,
    FilterEffectComponent,
    GateEffectComponent,
    CompressorEffectComponent,

    DiyComponent,
    LightningChartComponent,
    PlotlyChartComponent,
    ExpresscanvasChartComponent
  ],
  imports: [
    // AddEffectDialogModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatIconModule,
    DragDropModule,
    LayoutModule,
    MatButtonModule,
    MatSidenavModule,
    MatDialogModule,
    MatFormFieldModule,
    MatChipsModule,
    MatListModule,
    MatSliderModule,
    MatSelectModule,
    PlotlyModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
