import {EventEmitter, Injectable, Output} from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SelectedDataSourcesService {
  constructor(  ) { }

  private storage = window.localStorage;
  private _sourceList = new BehaviorSubject<number[]>([]);

  @Output() selectedDataSourcesChange = new EventEmitter();

  /* *
   * Use this method to retrieve the simple list of strings from local storage.
   * The list of data sources is kept in local storage for persistence. */
  getStoredSourceList(): number[] {
    const sourcesString = this.storage.getItem('sourceList');
    if (null === sourcesString) {
      return [];
    }
    return JSON.parse(sourcesString);
  }

  getSourceList(): BehaviorSubject<number[]> {
    return this._sourceList;
  }

  setSourceList(list: number[]): void {
    this.storage.setItem('sourceList', JSON.stringify(list));
    this._sourceList.next(list);
    this.selectedDataSourcesChange.emit();
  }
}
