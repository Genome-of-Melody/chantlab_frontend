import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ChantService } from './chant.service';
import { DEFAULT_DATASET_NAMES } from '../constants/datasets';

@Injectable({
  providedIn: 'root'
})
export class DataSourceListService {

  constructor(
    private chantService: ChantService
  ) { }

  private _allSources: Subject<[number, string][]> = new Subject<[number, string][]>();
  private _defaultNames: string[] = DEFAULT_DATASET_NAMES;

  getAllSources(): Subject<[number, string][]> {
    return this._allSources;
  }

  isDefaultName(name: string): boolean {
    return this._defaultNames.includes(name);
  }

  refreshSources(): void {
    this.chantService.getDataSources().subscribe(
      data => {
        if (Array.isArray(data.defaultDatasetNames)) {
          this._defaultNames = data.defaultDatasetNames;
        }
        this._allSources.next(data.dataSources);
      }
    );
  }
}
