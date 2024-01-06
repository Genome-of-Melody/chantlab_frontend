import { Component, Inject, OnInit } from '@angular/core';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';

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
