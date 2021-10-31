import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-added-to-dataset-dialog',
  templateUrl: './added-to-dataset-dialog.component.html',
  styleUrls: ['./added-to-dataset-dialog.component.css']
})
export class AddedToDatasetDialogComponent implements OnInit {

  name: string = "";

  constructor() { }

  ngOnInit(): void {
  }
}
