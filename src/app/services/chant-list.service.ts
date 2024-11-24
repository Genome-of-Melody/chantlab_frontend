import { Injectable } from '@angular/core';

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

  get filterSettings(): { genres: string[]; offices: string[]; fontes: string[]; hideIncomplete: boolean } {
    const storedFilterSettings = this.storage.getItem('chantList_filterSettings');
    if (storedFilterSettings === null || storedFilterSettings === undefined || storedFilterSettings === "undefined") {
      return undefined;
    }
    return JSON.parse(storedFilterSettings);
  }
  
  set filterSettings(filterSettings: { genres: string[]; offices: string[]; fontes: string[]; hideIncomplete: boolean }) {
    if (filterSettings === undefined || null) {
      this.storage.setItem('chantList_filterSettings', undefined);
    } else {
      this.storage.setItem('chantList_filterSettings', JSON.stringify(filterSettings));
    }
  }

}
