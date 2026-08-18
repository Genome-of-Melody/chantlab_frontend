import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IFilterSettings } from '../interfaces/filter-settings.interface';

@Injectable({
  providedIn: 'root'
})
export class SearchFilterService {

  private _filterSettings = new BehaviorSubject<IFilterSettings>(null);

  constructor() { }

  getFilterSettings(): BehaviorSubject<IFilterSettings> {
    return this._filterSettings;
  }

  setFilterSettings(settings: IFilterSettings | null): void {
    if (JSON.stringify(this._filterSettings.value) === JSON.stringify(settings)) {
      return;
    }
    this._filterSettings.next(settings);
  }

  /** Drop exclusive filters so a dataset switch can reload immediately. */
  resetToUnfiltered(): void {
    this.setFilterSettings({
      genres: null,
      offices: null,
      fontes: null,
      hideIncomplete: true,
      hideChantsWithoutVolpiano: true
    });
  }
}
