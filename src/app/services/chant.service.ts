import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of, EMPTY, BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, tap, catchError } from 'rxjs/operators';
import CONFIG from '../config.json';
import { IChantPrecomputed } from '../interfaces/chant-precomputed.interface';
import { IChant } from '../interfaces/chant.interface';
import { IFilterSettings } from '../interfaces/filter-settings.interface';
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
  private readonly _loading = new BehaviorSubject<boolean>(true);
  private readonly _baseUrl = CONFIG['BACKEND_URL'];

  getChant(id: number): Observable<IChantPrecomputed> {
    return this.http.get<IChantPrecomputed>(`${this._baseUrl}/${id}`);
  }

  loadData(): Observable<IChant[]> {
    return combineLatest([
      this.dataSourceService.getSourceList(),
      this.searchFilterService.getFilterSettings(),
      this.incipitService.getIncipit(),
    ]).pipe(
      debounceTime(300),
      distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)),
      switchMap(
        ([dataSources, filterSettings, incipit]) => {
          if (!dataSources?.length) {
            this._loading.next(false);
            return of([]);
          }
          // Filters are rebuilt after a dataset switch; keep the current list
          // instead of querying with stale or missing filter options.
          if (!filterSettings) {
            this._loading.next(true);
            return EMPTY;
          }
          if (this.hasEmptyExclusiveFilter(filterSettings)) {
            this._loading.next(false);
            return of([]);
          }
          this._loading.next(true);
          const formData = new FormData();
          formData.append('dataSources', JSON.stringify(dataSources));
          formData.append('incipit', incipit ? incipit : '');
          // Using null means that the back-end will *not* filter results based on this field,
          // while if the filterSettings do contain an empty list, the back-end *will* filter
          // (and thus the query result will be empty).
          formData.append('genres', JSON.stringify(filterSettings.genres));
          formData.append('offices', JSON.stringify(filterSettings.offices));
          formData.append('fontes', JSON.stringify(filterSettings.fontes));
          formData.append('hideIncomplete', JSON.stringify(!!filterSettings.hideIncomplete));
          formData.append('hideChantsWithoutVolpiano', JSON.stringify(!!filterSettings.hideChantsWithoutVolpiano));
          return this.http.post<IChant[]>(this._baseUrl + '/', formData).pipe(
            catchError((err) => {
              console.error('Error loading chants:', err);
              return of([]);
            })
          );
        }
      ),
      tap((data: IChant[]) => {
        this._chantList.next(data);
        this._loading.next(false);
      })
    );
  }

  getList(): BehaviorSubject<IChant[]> {
    return this._chantList;
  }

  isLoading(): BehaviorSubject<boolean> {
    return this._loading;
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

  mrbayesVolpiano(data: FormData): Observable<any> {
    return this.http.post(`${this._baseUrl}/mrbayes-volpiano/`, data);
  }

  private hasEmptyExclusiveFilter(filterSettings: IFilterSettings): boolean {
    return (filterSettings.genres !== null && filterSettings.genres.length === 0)
      || (filterSettings.offices !== null && filterSettings.offices.length === 0)
      || (filterSettings.fontes !== null && filterSettings.fontes.length === 0);
  }
}
