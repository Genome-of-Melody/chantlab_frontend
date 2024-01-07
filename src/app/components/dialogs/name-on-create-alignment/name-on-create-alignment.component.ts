import {Component, Inject, OnInit} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface NameOnCreateAlignmentDialogData {
  name: string;
}

@Component({
  selector: 'app-name-on-create-alignment',
  templateUrl: './name-on-create-alignment.component.html',
  styleUrls: ['./name-on-create-alignment.component.css']
})
export class NameOnCreateAlignmentComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<NameOnCreateAlignmentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: NameOnCreateAlignmentDialogData
  ) { }

  ngOnInit(): void {
  }

}
