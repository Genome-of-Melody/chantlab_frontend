import {Component, OnDestroy, OnInit, ChangeDetectionStrategy} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CsvTranslateService } from 'src/app/services/csv-translate.service';
import { SearchFilterService } from 'src/app/services/search-filter.service';
import { SavedFilterDialogComponent } from '../dialogs/saved-filter-dialog/saved-filter-dialog.component';
import {FontesService} from '../../services/fontes.service';
import {SelectedDataSourcesService} from '../../services/selected-data-sources.service';
import {forkJoin, Observable, Subject, Subscription, EMPTY} from 'rxjs';
import { catchError, map, switchMap, take } from 'rxjs/operators';
import { ChantListService } from 'src/app/services/chant-list.service';
import { IFilterSettings } from '../../interfaces/filter-settings.interface';

interface FilterOption {
  id: string;
  name: string;
  checked: boolean;
}

@Component({
    selector: 'app-search-filter',
    templateUrl: './search-filter.component.html',
    styleUrls: ['./search-filter.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class SearchFilterComponent implements OnInit, OnDestroy {

  private _subscriptions = new Subscription();
  private refresh$ = new Subject<void>();

  genres: FilterOption[] = [];
  offices: FilterOption[] = [];
  fontes: FilterOption[] = [];
  filteredFontes: FilterOption[] = [];
  fonteQuery = '';

  checkedAllGenres = true;
  checkedAllOffices = true;
  checkedAllFontes = true;

  hideIncompleteChants: boolean = true;
  hideChantsWithoutVolpiano: boolean = true;

  visible = false;

  constructor(
    private csvTranslateService: CsvTranslateService,
    private searchFilterService: SearchFilterService,
    private fontesService: FontesService,
    private selectedDataSourcesService: SelectedDataSourcesService,
    private chantListService: ChantListService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    const prevFilters = this.chantListService.filterSettings;
    if (prevFilters) {
      this.hideIncompleteChants = prevFilters.hideIncomplete ?? true;
      this.hideChantsWithoutVolpiano = prevFilters.hideChantsWithoutVolpiano ?? true;
    }
    this._subscriptions.add(
      this.refresh$.pipe(
        switchMap(() => forkJoin([
          this.initGenresAndOffices(),
          this.updateFontes()
        ]).pipe(
          catchError(err => {
            console.error('Error occurred while initializing:', err);
            return EMPTY;
          })
        ))
      ).subscribe(() => {
        const filters = this.chantListService.filterSettings;
        if (filters) {
          this.hideIncompleteChants = filters.hideIncomplete ?? true;
          this.hideChantsWithoutVolpiano = filters.hideChantsWithoutVolpiano ?? true;
        } else {
          this.hideIncompleteChants = true;
          this.hideChantsWithoutVolpiano = true;
        }
        this.onSelectionChange();
        this.saveFilter(false);
      })
    );
    this._subscriptions.add(
      this.selectedDataSourcesService.selectedDataSourcesChange.subscribe(() => this.refresh())
    );
    this.refresh();
  }

  ngOnDestroy(): void {
    this._subscriptions.unsubscribe();
  }

  refresh(): void {
    this.refresh$.next();
  }
  
  initGenresAndOffices(): Observable<void> {
    return forkJoin([
      this.csvTranslateService.getAllValues('genres'),
      this.csvTranslateService.getAllValues('offices')
    ]).pipe(
      take(1),
      map(([genresData, officesData]) => {
        const prevFilters = this.chantListService.filterSettings;
        this.genres = this.buildOptions(genresData, prevFilters?.genres);
        this.offices = this.buildOptions(officesData, prevFilters?.offices);
        this.onSelectionChange();
      })
    );
  }
  
  initFontes(): Observable<void> {
    return this.fontesService.getAllFontes()
      .pipe(
        take(1),
        map(data => {
          const prevFilters = this.chantListService.filterSettings;
          this.fontes = this.buildFontesOptions(data, prevFilters?.fontes);
          this.applyFonteFilter();
          this.onSelectionChange();
        })
      );
  }

  onSelectionChange(): void {
    this.checkedAllFontes = this.fontes.length > 0 && this.fontes.every(item => item.checked);
    this.checkedAllGenres = this.genres.length > 0 && this.genres.every(item => item.checked);
    this.checkedAllOffices = this.offices.length > 0 && this.offices.every(item => item.checked);
  }


  updateFontes(): Observable<void> {
    return this.fontesService.refreshFontes().pipe(
      switchMap(() => this.initFontes())
    );
  }
  

  getFilterSettings(): IFilterSettings {
    return {
      genres: this.selectedIds(this.genres),
      offices: this.selectedIds(this.offices),
      fontes: this.selectedIds(this.fontes),
      hideIncomplete: this.hideIncompleteChants,
      hideChantsWithoutVolpiano: this.hideChantsWithoutVolpiano
    };
  }

  saveFilter(manuallyFiltered: boolean = true): void {
    const filterSettings = this.getFilterSettings();
    this.searchFilterService.setFilterSettings(filterSettings);
    this.chantListService.filterSettings = filterSettings;
    if (manuallyFiltered) {
      this.chantListService.selectedChants = [];
      this.dialog.open(SavedFilterDialogComponent);
    }
  }

  checkAllGenres(): void {
    this.genres.forEach(genre => genre.checked = this.checkedAllGenres);
  }

  checkAllOffices(): void {
    this.offices.forEach(office => office.checked = this.checkedAllOffices);
  }

  checkAllFontes(): void {
    this.fontes.forEach(fonte => fonte.checked = this.checkedAllFontes);
  }

  applyFonteFilter(): void {
    const query = this.fonteQuery.trim().toLowerCase();
    this.filteredFontes = query
      ? this.fontes.filter(fonte => fonte.name.toLowerCase().includes(query))
      : this.fontes;
  }

  trackFonte(_index: number, fonte: FilterOption): string {
    return fonte.id;
  }

  private buildOptions(data: object, previousIds: string[] | null | undefined): FilterOption[] {
    if (!data) {
      return [];
    }
    const checkAll = previousIds == null;
    return Object.keys(data).map(id => ({
      id,
      name: data[id]?.name ?? id,
      checked: checkAll || previousIds.includes(id)
    }));
  }

  private buildFontesOptions(sigla: string[], previousIds: string[] | null | undefined): FilterOption[] {
    const options = (sigla ?? []).map(siglum => ({
      id: siglum,
      name: siglum,
      checked: true
    }));
    if (previousIds == null || options.length === 0) {
      return options;
    }
    const previous = new Set(previousIds);
    const anyMatch = options.some(option => previous.has(option.id));
    options.forEach(option => {
      option.checked = anyMatch ? previous.has(option.id) : true;
    });
    return options;
  }

  private selectedIds(options: FilterOption[]): string[] | null {
    if (options.length === 0) {
      return null;
    }
    if (options.every(option => option.checked)) {
      return null;
    }
    return options.filter(option => option.checked).map(option => option.id);
  }
}
