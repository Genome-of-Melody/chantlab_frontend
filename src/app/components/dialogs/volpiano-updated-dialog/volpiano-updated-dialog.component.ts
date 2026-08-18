import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-volpiano-updated-dialog',
    templateUrl: './volpiano-updated-dialog.component.html',
    styleUrls: ['./volpiano-updated-dialog.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class VolpianoUpdatedDialogComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
