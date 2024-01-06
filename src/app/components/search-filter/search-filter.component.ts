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

  hideIncompleteChants = true;

  visible = false;

  constructor(
    private csvTranslateService: CsvTranslateService,
    private searchFilterService: SearchFilterService,
    private fontesService: FontesService,
    private selectedDataSourcesService: SelectedDataSourcesService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.initGenresAndOffices();

    this.fontesService.refreshFontes();
    this.initFontes();

    this._subscriptions.add(this.selectedDataSourcesService.selectedDataSourcesChange.subscribe(() => this.refresh()));
  }

  ngOnDestroy(): void {
    this._subscriptions.unsubscribe();
  }

  refresh(): void {
    this.initGenresAndOffices();
    this.updateFontes();
  }

  initGenresAndOffices(): void {
    this.csvTranslateService.getAllValues('genres')
      .pipe(take(1))
      .subscribe(
        data => {
          this.allGenres = data;
          Object.keys(this.allGenres).forEach(key => {
            this.genreIds.push(key);
            this.checkedGenres.push(true);
          });
        }
      );
    this.csvTranslateService.getAllValues('offices')
      .pipe(take(1))
      .subscribe(
        data => {
          this.allOffices = data;
          Object.keys(this.allOffices).forEach(key => {
            this.officeIds.push(key);
            this.checkedOffices.push(true);
          });
          this.saveFilter(false);
        }
      );
  }

  initFontes(): void {
    const fontes = this.fontesService.getAllFontes()
      .pipe(take(1))
      .subscribe(
        data => {
          this.checkedFontes = [];
          this.allFontes = data;
          Object.keys(this.allFontes).forEach(key => {
            this.checkedFontes.push(this.checkedAllFontes);
            // I haven't been able to track down why the fontes are retrieved
            // as an array of lists of length 1, like [["D GSTA III 9"], ["CH E-611"]].
            // The [0] index is a working band-aid solution for now.
            this.fontesSigla.push(data[key][0]);
          });
        }
      );
  }

  updateFontes(): void {
    this.fontesService.refreshFontes();
    this.initFontes();
  }

  getFilterSettings(): object {
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

    return {
      genres: genres,
      offices: offices,
      fontes: fontes,
      hideIncomplete: hideIncomplete
    };
  }

  saveFilter(showDialog: boolean = true): void {
    const filterSettings = this.getFilterSettings();
    this.searchFilterService.setFilterSettings(filterSettings);
    if (showDialog) {
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
