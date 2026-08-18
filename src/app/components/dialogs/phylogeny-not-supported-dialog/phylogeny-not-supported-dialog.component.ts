import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-phylogeny-not-supported-dialog',
    templateUrl: './phylogeny-not-supported-dialog.component.html',
    styleUrls: ['./phylogeny-not-supported-dialog.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class PhylogenyNotSupportedDialogComponent {

  numberOfSequences: number = 0;

}
