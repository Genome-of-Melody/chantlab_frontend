import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
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
    private chantService: ChantService
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
