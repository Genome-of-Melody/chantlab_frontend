import { Injectable } from '@angular/core';
import {ChantService} from './chant.service';
import {BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import {SelectedDataSourcesService} from './selected-data-sources.service';

@Injectable({
  providedIn: 'root'
}) export class FontesService {
  private _allFontes: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);

  constructor(
    private chantService: ChantService,
    private selectedDataSourcesService: SelectedDataSourcesService
  ) {}

  getAllFontes(): Observable<string[]> {
    return this._allFontes.asObservable();
  }

  refreshFontes(): Observable<any> {
    const formData = new FormData();
    const dataSources = this.selectedDataSourcesService.getStoredSourceList();
    formData.append('dataSources', dataSources ? JSON.stringify(dataSources) : '[]');

    return this.chantService.getFontes(formData).pipe(
      tap(data => this._allFontes.next(this.normalizeFontes(data?.fontes)))
    );
  }

  private normalizeFontes(fontes: unknown): string[] {
    if (!Array.isArray(fontes)) {
      return [];
    }
    const seen = new Set<string>();
    const normalized: string[] = [];
    for (const item of fontes) {
      const siglum = Array.isArray(item) ? item[0] : item;
      if (typeof siglum === 'string' && siglum.length > 0 && !seen.has(siglum)) {
        seen.add(siglum);
        normalized.push(siglum);
      }
    }
    return normalized;
  }
}
