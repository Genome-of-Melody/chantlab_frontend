import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-upload-successful-dialog',
    templateUrl: './upload-successful-dialog.component.html',
    styleUrls: ['./upload-successful-dialog.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class UploadSuccessfulDialogComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
