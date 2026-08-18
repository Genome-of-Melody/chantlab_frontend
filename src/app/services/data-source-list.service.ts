import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ChantService } from './chant.service';
import { DEFAULT_DATASET_NAMES } from '../constants/datasets';

@Injectable({
  providedIn: 'root'
})
export class DataSourceListService {

  constructor(
    private chantService: ChantService
  ) { }

  private _allSources = new BehaviorSubject<[number, string][] | null>(null);
  private _defaultNames: string[] = DEFAULT_DATASET_NAMES;
  private inFlight = false;

  getAllSources(): BehaviorSubject<[number, string][] | null> {
    return this._allSources;
  }

  isDefaultName(name: string): boolean {
    return this._defaultNames.includes(name);
  }

  refreshSources(): void {
    if (this.inFlight) {
      return;
    }
    this.inFlight = true;
    this.chantService.getDataSources().subscribe({
      next: data => {
        if (Array.isArray(data.defaultDatasetNames)) {
          this._defaultNames = data.defaultDatasetNames;
        }
        this._allSources.next(data.dataSources);
        this.inFlight = false;
      },
      error: () => {
        this.inFlight = false;
      }
    });
  }
}
