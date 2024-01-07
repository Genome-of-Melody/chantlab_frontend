import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface DialogData {
  name: string;
}

@Component({
  selector: 'app-name-on-create-dataset',
  templateUrl: './name-on-create-dataset.component.html',
  styleUrls: ['./name-on-create-dataset.component.css']
})
export class NameOnCreateDatasetComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<NameOnCreateDatasetComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) { }

  ngOnInit(): void {
  }

}
