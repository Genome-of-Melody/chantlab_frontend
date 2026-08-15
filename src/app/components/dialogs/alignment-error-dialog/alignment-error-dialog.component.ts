import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-alignment-error-dialog',
    templateUrl: './alignment-error-dialog.component.html',
    styleUrls: ['./alignment-error-dialog.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AlignmentErrorDialogComponent {

  sources: string[];
  ids: number[];

}
