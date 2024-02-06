import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import CONFIG from '../config.json';
import { IChantPrecomputed } from '../interfaces/chant-precomputed.interface';
import { IChant } from '../interfaces/chant.interface';
import { SelectedDataSourcesService } from './selected-data-sources.service';
import { IncipitService } from './incipit.service';
import { SearchFilterService } from './search-filter.service';


@Injectable({
  providedIn: 'root'
})
export class ChantService {

  constructor(
    private http: HttpClient,
    private dataSourceService: SelectedDataSourcesService,
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
          // Using null means that the back-end will *not* filter results based on this field,
          // while if the filterSettings do contain an empty list, the back-end *will* filter
          // (and thus the query result will be empty).
          formData.append('genres', filterSettings ? JSON.stringify(filterSettings['genres']) : "null");
          formData.append('offices', filterSettings ? JSON.stringify(filterSettings['offices']) : "null");
          formData.append('fontes', filterSettings ? JSON.stringify(filterSettings['fontes']) : "null");
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

  addToDatset(data: FormData): Observable<any> {
    return this.http.post(`${this._baseUrl}/add-to-dataset/`, data);
  }

  uploadData(data: FormData): Observable<any> {
    return this.http.post(`${this._baseUrl}/upload/`, data);
  }

  deleteData(data: FormData): Observable<any> {
    return this.http.post(`${this._baseUrl}/delete-dataset/`, data);
  }

  updateVolpiano(data: FormData): Observable<any> {
    return this.http.post(`${this._baseUrl}/update-volpiano/`, data);
  }
}
