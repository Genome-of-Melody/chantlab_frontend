import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-snapshot-export-failed-dialog',
    templateUrl: './snapshot-export-failed-dialog.component.html',
    styleUrls: ['./snapshot-export-failed-dialog.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class SnapshotExportFailedDialogComponent {
  detail = '';
}
