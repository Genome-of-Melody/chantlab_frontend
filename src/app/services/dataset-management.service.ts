import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AddedToDatasetDialogComponent } from '../components/dialogs/added-to-dataset-dialog/added-to-dataset-dialog.component';
import { ChantService } from './chant.service';
import { DataSourceListService } from './data-source-list.service';
import {SelectedDataSourcesService} from './selected-data-sources.service';

@Injectable({
  providedIn: 'root'
})
export class DatasetManagementService {

  constructor(
    private dataSourceListService: DataSourceListService,
    private selectedDataSourcesService: SelectedDataSourcesService,
    private chantService: ChantService,
    private dialog: MatDialog
  ) { }

  uploadDataset(fileToUpload: File, datasetName: string): Observable<boolean> {
    const formData: FormData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);
    formData.append('name', datasetName);
    return this.chantService.uploadData(formData)
      .pipe(map(() => {
        this.dataSourceListService.refreshSources();
        return true;
      }));
  }

  addToDataset(ids: number[], dataset_idx: number): void {
    const formData = new FormData();
    formData.append('idsToExport', JSON.stringify(ids));
    formData.append('idx', dataset_idx.toString());
    this.chantService.addToDatset(formData).subscribe(
      response => {
        const name = response['name'];
        const index = response['index'];
        this.dataSourceListService.refreshSources();

        const dialogRef = this.dialog.open(AddedToDatasetDialogComponent);
        const instance = dialogRef.componentInstance;
        instance.name = name;
      }
    )
  }

  deleteDataset(datasetName: string): Observable<boolean> {
    const formData: FormData = new FormData();
    formData.append('name', datasetName);
    return this.chantService.deleteData(formData)
      .pipe(map(() => {
        this.dataSourceListService.refreshSources();
        this.selectedDataSourcesService.ensureDatasetNotSelected(this.datasetNameToNumber(datasetName));
        return true;
      }));
  }

  deleteMultipleDatasets(datasetNames: string[]): Observable<boolean>[] {
    const results = [];
    for (const name of datasetNames) {
      // .subscribe() important so that the request gets actually sent!
      const result = this.deleteDataset(name).subscribe();
      results.push(result);
    }
    return results;
  }

  /**
   * Returns the dataset number for a given dataset name. This number is used
   * in data source selection persistence. This is a workaround for now -- the
   * dataset list service should provide this.
   *
   * @param datasetName The dataset name for which we want to fetch the index.
   *                    If not found, returns null.
   */
  datasetNameToNumber(datasetName: string): number {
    const names = this.dataSourceListService.refreshSources();
    const sourceNamesToIdxs = new Map<string, number>();
    this.dataSourceListService.getAllSources().subscribe(data => {
      data.forEach(s => sourceNamesToIdxs.set(s[1], s[0]));
    });
    if (!sourceNamesToIdxs.has(datasetName)) {
      return null;
    }
    return sourceNamesToIdxs.get(datasetName);
  }

}
