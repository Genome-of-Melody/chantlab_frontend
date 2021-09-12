import { Injectable } from '@angular/core';
import {ChantService} from './chant.service';
import {Subject} from 'rxjs';
import {DataSourceService} from './data-source.service';

@Injectable({
  providedIn: 'root'
})
export class FontesService {

  constructor(
    private chantService: ChantService,
    private dataSourceService: DataSourceService
  ) { }

  private _allFontes: Subject<string[]> = new Subject<string[]>();

  getAllFontes(): Subject<string[]> {
    return this._allFontes;
  }

  refreshFontes(): void {
    const formData = new FormData();
    const dataSources = this.dataSourceService.getStoredSourceList();

    formData.append('dataSources',
      dataSources ? JSON.stringify(dataSources) : '[]');

    this.chantService.getFontes(formData).subscribe(
      data => {
        this._allFontes.next(data.fontes); }
    );
  }
}
