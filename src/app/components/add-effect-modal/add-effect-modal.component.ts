import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EffectsNames } from '../../engine/types/enums';

@Component({
  selector: 'bdn-add-effect-modal',
  templateUrl: './add-effect-modal.component.html',
  styleUrls: ['./add-effect-modal.component.scss']
})
export class AddEffectModalComponent implements OnInit {
  typesOfEffects: EffectsNames[] = ['Distortion', 'Visualizer', 'Gate', 'Filter'];

  constructor(public dialogRef: MatDialogRef<AddEffectModalComponent>, @Inject(MAT_DIALOG_DATA) public data: {}) {}

  ngOnInit() {}

  returnEffectNameToCreate(effectName: EffectsNames) {
    this.dialogRef.close(effectName);
  }
}
