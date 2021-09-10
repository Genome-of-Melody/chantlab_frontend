import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ChantService } from './chant.service';
import { DataSourceListService } from './data-source-list.service';

@Injectable({
  providedIn: 'root'
})
export class DatasetManagementService {

  constructor(
    private dataSourceListService: DataSourceListService,
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

}
