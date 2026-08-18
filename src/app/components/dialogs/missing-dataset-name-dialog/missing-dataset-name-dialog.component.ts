import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-missing-dataset-name-dialog',
    templateUrl: './missing-dataset-name-dialog.component.html',
    styleUrls: ['./missing-dataset-name-dialog.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class MissingDatasetNameDialogComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
