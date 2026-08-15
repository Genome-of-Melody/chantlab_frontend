import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-phylogeny-error-dialog',
    templateUrl: './phylogeny-error-dialog.component.html',
    styleUrls: ['./phylogeny-error-dialog.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class PhylogenyErrorDialogComponent {

  error_message: string;
}
