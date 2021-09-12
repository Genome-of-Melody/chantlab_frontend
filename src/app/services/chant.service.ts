import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import CONFIG from '../config.json';
import { IChantPrecomputed } from '../interfaces/chant-precomputed.interface';
import { IChant } from '../interfaces/chant.interface';
import { DataSourceService } from './data-source.service';
import { IncipitService } from './incipit.service';
import { SearchFilterService } from './search-filter.service';
import {FontesService} from './fontes.service';


@Injectable({
  providedIn: 'root'
})
export class ChantService {

  constructor(
    private http: HttpClient,
    private dataSourceService: DataSourceService,
    private searchFilterService: SearchFilterService,
    private incipitService: IncipitService,
  ) { }

  private readonly _chantList = new BehaviorSubject<IChant[]>(null);
  private readonly _baseUrl = CONFIG['BACKEND_URL'];

  getChant(id: number): Observable<IChantPrecomputed> {
    return this.http.get<IChantPrecomputed>(`${this._baseUrl}/${id}`);
  }

  loadData(): Observable<IChant[]> {
    console.log('chantService.loadData(): filter settings');
    console.log(this.searchFilterService.getFilterSettings());
    return combineLatest([
      this.dataSourceService.getSourceList(),
      this.searchFilterService.getFilterSettings(),
      this.incipitService.getIncipit(),
    ]).pipe(
      switchMap(
        ([dataSources, filterSettings, incipit]) => {
          const formData = new FormData();
          formData.append('dataSources', dataSources ? JSON.stringify(dataSources) : "[]");
          formData.append('incipit', incipit ? incipit : '');
          formData.append('genres', filterSettings ? JSON.stringify(filterSettings['genres']) : "[]");
          formData.append('offices', filterSettings ? JSON.stringify(filterSettings['offices']) : "[]");
          formData.append('fontes', filterSettings ? JSON.stringify(filterSettings['fontes']) : "[]");
          return this.http.post(this._baseUrl + '/', formData);
        }
      ),
      tap((data: IChant[]) => this._chantList.next(data))
    );
  }

  getList(): BehaviorSubject<IChant[]> {
    return this._chantList;
  }

  getAlignment(formData: FormData): Observable<any> {
    return this.http.post(`${this._baseUrl}/align/`, formData);
  }

  getDataSources(): Observable<any> {
    return this.http.get(`${this._baseUrl}/data-sources`);
  }

  getFontes(data: FormData): Observable<any> {
    return this.http.post(`${this._baseUrl}/fontes`, data);
  }

  exportChants(data: FormData): Observable<any> {
    return this.http.post(`${this._baseUrl}/export/`, data, {responseType: 'arraybuffer'});
  }

  createDataset(data: FormData): Observable<any> {
    return this.http.post(`${this._baseUrl}/create-dataset/`, data);
  }

  uploadData(data: FormData): Observable<any> {
    return this.http.post(`${this._baseUrl}/upload/`, data);
  }

  deleteData(data: FormData): Observable<any> {
    return this.http.post(`${this._baseUrl}/delete-dataset/`, data);
  }
}
