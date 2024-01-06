import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-idx-on-add-to-dataset',
  templateUrl: './idx-on-add-to-dataset.component.html',
  styleUrls: ['./idx-on-add-to-dataset.component.css']
})
export class IdxOnAddToDatasetComponent implements OnInit {

  selectedDataset: number;

  constructor(
    public dialogRef: MatDialogRef<IdxOnAddToDatasetComponent>,
    @Inject(MAT_DIALOG_DATA) public data: [number, string][]
  ) { }

  ngOnInit(): void {
  }

}
