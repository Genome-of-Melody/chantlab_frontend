import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-chant-not-found-dialog',
    templateUrl: './chant-not-found-dialog.component.html',
    styleUrls: ['./chant-not-found-dialog.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ChantNotFoundDialogComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
