import { Injectable } from '@angular/core';
import { IFilterSettings } from '../interfaces/filter-settings.interface';

@Injectable({
  providedIn: 'root'
})
export class ChantListService {

  // localStorage is typically ~5MB. 888k IDs as JSON is several MB and
  // throws QuotaExceededError; keep only modest selections across reloads.
  private static readonly MAX_STORED_SELECTION = 10000;

  constructor() { }

  private storage = window.localStorage;

  get selectedChants(): number[] {
    const selectedList = this.storage.getItem('chantList_selectedChants');
    if (selectedList === null || selectedList === undefined || selectedList === "undefined"){
      return [];
    }
    try {
      const parsed = JSON.parse(selectedList);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  set selectedChants(selectedChants: number[]){
    if (!selectedChants?.length || selectedChants.length > ChantListService.MAX_STORED_SELECTION) {
      this.storage.removeItem('chantList_selectedChants');
      return;
    }
    try {
      this.storage.setItem('chantList_selectedChants', JSON.stringify(selectedChants));
    } catch {
      this.storage.removeItem('chantList_selectedChants');
    }
  }

  get filterSettings(): IFilterSettings | undefined {
    const storedFilterSettings = this.storage.getItem('chantList_filterSettings');
    if (storedFilterSettings === null || storedFilterSettings === undefined || storedFilterSettings === "undefined") {
      return undefined;
    }
    return JSON.parse(storedFilterSettings);
  }
  
  set filterSettings(filterSettings: IFilterSettings | undefined | null) {
    if (filterSettings == null) {
      this.storage.removeItem('chantList_filterSettings');
    } else {
      this.storage.setItem('chantList_filterSettings', JSON.stringify(filterSettings));
    }
  }

}
