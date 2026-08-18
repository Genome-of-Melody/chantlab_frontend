import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-saved-filter-dialog',
    templateUrl: './saved-filter-dialog.component.html',
    styleUrls: ['./saved-filter-dialog.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class SavedFilterDialogComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
