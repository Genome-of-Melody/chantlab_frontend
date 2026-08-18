import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-contrafact-reduction-dialog',
    templateUrl: './contrafact-reduction-result-dialog.component.html',
    styleUrls: ['./contrafact-reduction-result-dialog.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ContrafactReductionResultDialogComponent {

  reducedSequenceIds: number[] = [];

}
