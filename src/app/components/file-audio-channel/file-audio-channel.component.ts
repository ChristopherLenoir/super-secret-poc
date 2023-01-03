import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
// import { Effect } from '../../engine/types/abstractClasses';
import { EffectsNames } from '../../engine/types/enums';
// import { EffectOptions } from '../../engine/types/interfaces';
import { ChannelStripService } from '../../services';
import { AddEffectModalComponent } from '../add-effect-modal/add-effect-modal.component';

@Component({
  selector: 'app-file-audio-channel',
  templateUrl: './file-audio-channel.component.html',
  styleUrls: ['./file-audio-channel.component.scss']
})
export class AudioChannelComponent implements OnInit {
  showFiller = false;
  // effects = ['Gate', 'Filter', 'Frequency'];
  // effects: (Effect<EffectOptions> | AudioNode)[] = [];

  constructor(public dialog: MatDialog, public channelStripService: ChannelStripService) {
    // this.effects = this.channelStripService.channelStrip.effects;
  }

  ngOnInit() {}

  public drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.channelStripService.channelStrip.effects, event.previousIndex, event.currentIndex);
    this.channelStripService.channelStrip.reorderEffects();
  }

  // TO DO : Handle the case where the modal return nothing
  async openAddEffectDialog(): Promise<void> {
    const dialogRef = this.dialog.open(AddEffectModalComponent, {
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.channelStripService.addEffect(result as EffectsNames);
      }
    });
  }
}
