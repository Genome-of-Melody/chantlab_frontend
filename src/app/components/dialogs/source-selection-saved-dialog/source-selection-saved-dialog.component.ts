import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-source-selection-saved-dialog',
    templateUrl: './source-selection-saved-dialog.component.html',
    styleUrls: ['./source-selection-saved-dialog.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class SourceSelectionSavedDialogComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
