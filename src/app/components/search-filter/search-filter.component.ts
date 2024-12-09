import {Component, OnDestroy, OnInit} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { take } from 'rxjs/operators';
import { CsvTranslateService } from 'src/app/services/csv-translate.service';
import { SearchFilterService } from 'src/app/services/search-filter.service';
import { SavedFilterDialogComponent } from '../dialogs/saved-filter-dialog/saved-filter-dialog.component';
import {IChant} from '../../interfaces/chant.interface';
import {FontesService} from '../../services/fontes.service';
import {SelectedDataSourcesService} from '../../services/selected-data-sources.service';
import {Subscription} from 'rxjs';
import { ChantListService } from 'src/app/services/chant-list.service';
import { Observable, forkJoin, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-search-filter',
  templateUrl: './search-filter.component.html',
  styleUrls: ['./search-filter.component.css']
})
export class SearchFilterComponent implements OnInit, OnDestroy {

  private _subscriptions = new Subscription();

  allGenres: object;
  genreIds: string[] = [];
  checkedGenres: boolean[] = [];
  checkedAllGenres = true;

  allOffices: object;
  officeIds: string[] = [];
  checkedOffices: boolean[] = [];
  checkedAllOffices = true;

  allFontes: object;
  fontesSigla: string[] = [];
  checkedFontes: boolean[] = [];
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
      this.hideIncompleteChants = prevFilters.hideIncomplete;
      this.hideChantsWithoutVolpiano = prevFilters.hideChantsWithoutVolpiano;
    }
    this._subscriptions.add(this.selectedDataSourcesService.selectedDataSourcesChange.subscribe(() => this.refresh()));
  }

  ngOnDestroy(): void {
    this._subscriptions.unsubscribe();
  }

  refresh(): void {
    forkJoin([
      this.initGenresAndOffices(),
      this.updateFontes()
    ]).subscribe({
      next: () => {
        // Once both initial options observables have completed, proceed with postprocessing and saving
        const filters = this.chantListService.filterSettings;
        if (filters) {
          this.hideIncompleteChants = filters.hideIncomplete;
          this.hideChantsWithoutVolpiano = filters.hideChantsWithoutVolpiano;
        } else {
          this.hideIncompleteChants = true;
          this.hideChantsWithoutVolpiano = true;
        }
        this.onSelectionChange();
        this.saveFilter(false);
      },
      error: (err) => {
        console.error('Error occurred while initializing:', err);
      }
    });
  }
  
  initGenresAndOffices(): Observable<any> {
    return forkJoin([
      this.csvTranslateService.getAllValues('genres'),
      this.csvTranslateService.getAllValues('offices')
    ]).pipe(
      take(1),
      map(([genresData, officesData]) => {
        this.allGenres = genresData;
        this.checkedGenres = [];
        const prevFilters = this.chantListService.filterSettings;
        Object.keys(this.allGenres).forEach(key => {
          this.genreIds.push(key);
          if (prevFilters) {
            this.checkedGenres.push(prevFilters.genres.includes(key));
          } else {
            this.checkedGenres.push(true);
          }
        });         

        this.allOffices = officesData;
        this.checkedOffices = [];
        Object.keys(this.allOffices).forEach(key => {
          this.officeIds.push(key);
          if (prevFilters) {
            this.checkedOffices.push(prevFilters.offices.includes(key));
          } else {
            this.checkedOffices.push(true);
          }
        });
        this.onSelectionChange();
      })
    );
  }
  
  initFontes(): Observable<any> {
    return this.fontesService.getAllFontes()
      .pipe(
        take(1),
        map(data => {
          this.checkedFontes = [];
          this.allFontes = data;
          const prevFilters = this.chantListService.filterSettings;
          Object.keys(this.allFontes).forEach(key => {
            this.fontesSigla.push(data[key][0]);
            if (prevFilters) {
              this.checkedFontes.push(prevFilters.fontes.includes(data[key][0]));
            } else {
              this.checkedFontes.push(true);
            }
            this.onSelectionChange();
          });
        })
      );
  }

  onSelectionChange(): void {
    this.checkedAllFontes = this.checkedFontes.every(item => item === true);
    this.checkedAllGenres = this.checkedGenres.every(item => item === true);
    this.checkedAllOffices = this.checkedOffices.every(item => item === true);
  }


  updateFontes(): Observable<any> {
    return this.fontesService.refreshFontes().pipe(
      switchMap(() => this.initFontes())
    );
  }
  

  getFilterSettings(): { genres: string[]; offices: string[]; fontes: string[]; hideIncomplete: boolean, hideChantsWithoutVolpiano: boolean } {
    const genres = [];
    for (let g = 0; g < this.checkedGenres.length; g++) {
      if (this.checkedGenres[g]) {
        genres.push(this.genreIds[g]);
      }
    }

    const offices = [];
    for (let o = 0; o < this.checkedOffices.length; o++) {
      if (this.checkedOffices[o]) {
        offices.push(this.officeIds[o]);
      }
    }

    const fontes = [];
    for (let f = 0; f < this.checkedFontes.length; f++) {
      if (this.checkedFontes[f]) {
        fontes.push(this.fontesSigla[f]);
      }
    }

    const hideIncomplete = this.hideIncompleteChants;
    const hideChantsWithoutVolpiano = this.hideChantsWithoutVolpiano;

    return {
      genres: genres,
      offices: offices,
      fontes: fontes,
      hideIncomplete: hideIncomplete,
      hideChantsWithoutVolpiano: hideChantsWithoutVolpiano
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
    for (let i = 0; i < this.checkedGenres.length; i++) {
      this.checkedGenres[i] = this.checkedAllGenres;
    }
  }

  checkAllOffices(): void {
    for (let i = 0; i < this.checkedOffices.length; i++) {
      this.checkedOffices[i] = this.checkedAllOffices;
    }
  }

  checkAllFontes(): void {
    for (let i = 0; i < this.checkedFontes.length; i++) {
      this.checkedFontes[i] = this.checkedAllFontes;
    }
  }
}
