import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DatasetCreatedDialogComponent } from '../components/dialogs/dataset-created-dialog/dataset-created-dialog.component';
import { ChantService } from './chant.service';
import { DataSourceListService } from './data-source-list.service';

@Injectable({
  providedIn: 'root'
})
export class CreateDatasetService {

  constructor(
    private chantService: ChantService,
    private dataSourceListService: DataSourceListService,
    private dialog: MatDialog
  ) { }

  createDataset(ids: number[], dataset_name: string): void {
    const formData = new FormData();
    formData.append('idsToExport', JSON.stringify(ids));
    formData.append('name', dataset_name);
    this.chantService.createDataset(formData).subscribe(
      response => {
        const name = response['name'];
        const index = response['index'];
        this.dataSourceListService.refreshSources();

        const dialogRef = this.dialog.open(DatasetCreatedDialogComponent);
        const instance = dialogRef.componentInstance;
        instance.name = name;
      }
    )
  }
}
