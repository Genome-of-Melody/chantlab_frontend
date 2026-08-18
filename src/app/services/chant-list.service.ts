import { Injectable } from '@angular/core';
import { IFilterSettings } from '../interfaces/filter-settings.interface';

@Injectable({
  providedIn: 'root'
})
export class ChantListService {

  constructor() { }

  private storage = window.localStorage;

  get selectedChants(): number[] {
    const selectedList = this.storage.getItem('chantList_selectedChants');
    if (selectedList === null || selectedList === undefined || selectedList === "undefined"){
      return [];
    }
    return JSON.parse(selectedList);
  }

  set selectedChants(selectedChants: number[]){
    this.storage.setItem('chantList_selectedChants', JSON.stringify(selectedChants));
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
