import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { BehaviorSubject, combineLatest, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { IChant } from 'src/app/interfaces/chant.interface';
import { AlignmentService } from 'src/app/services/alignment.service';
import { ChantExportService } from 'src/app/services/chant-export.service';
import { ChantService } from 'src/app/services/chant.service';
import { CreateDatasetService } from 'src/app/services/create-dataset.service';
import { CsvTranslateService } from 'src/app/services/csv-translate.service';
import { DataSourceListService } from 'src/app/services/data-source-list.service';
import { DatasetManagementService } from 'src/app/services/dataset-management.service';
import { DownloadService } from 'src/app/services/download.service';
import { IdxOnAddToDatasetComponent } from '../dialogs/idx-on-add-to-dataset/idx-on-add-to-dataset.component';
import { NameOnCreateDatasetComponent } from '../dialogs/name-on-create-dataset/name-on-create-dataset.component';
import { NotEnoughToAlignDialogComponent } from '../dialogs/not-enough-to-aling-dialog/not-enough-to-aling-dialog.component';
import {SearchFilterComponent} from '../search-filter/search-filter.component';
import { ChantListService } from 'src/app/services/chant-list.service';

@Component({
  selector: 'app-chant-list',
  templateUrl: './chant-list.component.html',
  styleUrls: ['./chant-list.component.css']
})
export class ChantListComponent implements OnInit, OnDestroy {

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(SearchFilterComponent, {static: true}) searchFilterComponent: SearchFilterComponent;

  allChants: IChant[];
  chants: IChant[];
  currentChant?: IChant;
  currentIndex = -1;
  selected: boolean[] = [];
  selectedAll: boolean;
  concatenatedMode: boolean = false;
  keepLiquescents: boolean = false;
  sortedByCountusIDFrequency: boolean = false;
  selectedChants: Set<number>;
  hideIncompleteChants: boolean;
  hideChantsWithoutVolpiano: boolean;

  pageEvent = new BehaviorSubject<PageEvent>(null);
  pageIndex: number;
  pageSize: number;
  dataLength: number;

  allGenres: object;
  allOffices: object;

  private readonly componentDestroyed$ = new Subject();

  constructor(
    private router: Router,
    private chantService: ChantService,
    private chantExportService: ChantExportService,
    private createDatasetService: CreateDatasetService,
    private alignmentService: AlignmentService,
    private csvTranslateService: CsvTranslateService,
    private downloadService: DownloadService,
    private chantListService: ChantListService,
    private dataSourceListService: DataSourceListService,
    private datasetManagementService: DatasetManagementService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.retrieveChants();
  }

  ngOnDestroy(): void {
    this.componentDestroyed$.next();
    this.componentDestroyed$.complete();
  }

  retrieveChants(): void {
    combineLatest([this.chantService.getList(), this.pageEvent])
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe(
      ([data, event]) => {
        this.paginator.firstPage();

        const filters = this.chantListService.filterSettings;
        this.hideIncompleteChants = filters?.hideIncomplete ?? true;
        this.hideChantsWithoutVolpiano = filters?.hideChantsWithoutVolpiano ?? true;


        if (this.allChants !== data) {
          this.selectedChants = new Set(this.chantListService.selectedChants);
          this.selected = [];
          if (data) {
            this.allChants = data.filter(chant => (!this.hideIncompleteChants || this.isChantComplete(chant)) && (!this.hideChantsWithoutVolpiano || this.doesChantContainVolpiano(chant)));
            this.dataLength = this.allChants.length;
            for (let i = 0; i < this.allChants.length; i++) {
              this.selected.push(this.selectedChants.has(this.allChants[i].id));
            }
          }
          this.updateSelectedAll();
        }

        if (this.sortedByCountusIDFrequency) {
          this.sortByCantusIdFrequency();
        } else {
          this.sortByIncipit();
        }

        this.pageIndex = event ? event.pageIndex : 0;
        this.pageSize = event ? event.pageSize : 50;
        const start = this.pageIndex * this.pageSize;
        const end = (this.pageIndex + 1) * this.pageSize;
        if (this.allChants) {
          this.chants = this.allChants
          .filter(chant => {
            return (!this.hideIncompleteChants || this.isChantComplete(chant)) && (!this.hideChantsWithoutVolpiano || this.doesChantContainVolpiano(chant));
          })
          .slice(start, end);        
        }
      }
    );
  }

  sortByCantusIdFrequency(): void {
    if (this.allChants && this.selected) {
      const cantusIdFrequency = new Map<string, number>();
  
      this.allChants.forEach(chant => {
        const cantusId = chant.cantus_id;
        if ((!this.hideIncompleteChants || this.isChantComplete(chant)) && (!this.hideChantsWithoutVolpiano || this.doesChantContainVolpiano(chant))) {
          cantusIdFrequency.set(cantusId, (cantusIdFrequency.get(cantusId) || 0) + 1);
        } else {
          cantusIdFrequency.set(cantusId, (cantusIdFrequency.get(cantusId) || 0));
        }
      });
    
      const zippedList = this.allChants.map((chant, index) => ({
        chant,
        selected: this.selected[index],
        frequency: cantusIdFrequency.get(chant.cantus_id),
      }));
    
      zippedList.sort((a, b) => b.frequency - a.frequency);
      for (let i = 0; i < zippedList.length; i++) {
        this.allChants[i] = zippedList[i].chant;
        this.selected[i] = zippedList[i].selected;
      }
    }
  }


  
  sortByIncipit(): void {
    if (this.allChants && this.selected) {
          
      const zippedList = this.allChants.map((chant, index) => ({
        chant,
        selected: this.selected[index],
        incipit: chant.incipit || '',
      }));
    
      zippedList.sort((a, b) => a.incipit.localeCompare(b.incipit));
      for (let i = 0; i < zippedList.length; i++) {
        this.allChants[i] = zippedList[i].chant;
        this.selected[i] = zippedList[i].selected;
      }
    }
  }

  onSelectionChange(index: number): void {
    this.updateSelectedChants(index);
    this.chantListService.selectedChants = Array.from(this.selectedChants);
    this.updateSelectedAll();
  }

  updateSelectedChants(index: number): void {
    const chantId = this.allChants[index].id;
    if (this.selected[index]) {
      this.selectedChants.add(chantId);
    } else {
      this.selectedChants.delete(chantId);
    }
  }

  updateSelectedAll(): void {
    if (this.allChants && this.allChants.length > 0) {
      const consideredChantsIndices = this.allChants.map((chant, index) => ({
        chant,index
      })).filter(item => 
        (!this.hideIncompleteChants || this.isChantComplete(item.chant)) && (!this.hideChantsWithoutVolpiano || this.doesChantContainVolpiano(item.chant))
      ).map(item => item.index);
      if (consideredChantsIndices.length === 0) {
        this.selectedAll = false;
      } else{
        this.selectedAll = consideredChantsIndices.every(index => this.selected[index]);
      }
    }
  }

  changePage(event: PageEvent): void {
    this.pageEvent.next(event);
  }

  selectAll(): void {
    for (let i = 0; i < this.selected.length; i++) {
      this.selected[i] = this.selectedAll;
    }
  }

  selectAllVisible(): void {
    this.selectedChants = new Set<number>();
    for (let i = 0; i < this.selected.length; i++) {
      this.selected[i] = this.selectedAll;
      this.updateSelectedChants(i);
    }
    this.chantListService.selectedChants = Array.from(this.selectedChants);
  }

  selectNone(): void {
    for (let i = 0; i < this.selected.length; i++) {
      this.selected[i] = false;
    }
  }

  get nChantsSelected(): number {
    return this.selected.filter(s => s).length;
  }

  getSelected(): number[] {
    const checkboxChecked: number[] = [];
    for (let i = 0; i < this.selected.length; i++) {
      if (this.selected[i]) {
        checkboxChecked.push(this.allChants[i].id);
      }
    }
    return checkboxChecked;
  }

  getSelectedChants(): IChant[] {
    const selectedChants: IChant[] = [];
    for (let i = 0; i < this.selected.length; i++) {
      if (this.selected[i]) {
        selectedChants.push(this.allChants[i]);
      }
    }
    return selectedChants;
  }

  align(mode: string): void {
    // get list of selected chants
    const selectedChants = this.getSelectedChants();
    const selected = selectedChants.map(ch => ch.id);

    if (selected.length < 2) {
      const dialogRef = this.dialog.open(
        NotEnoughToAlignDialogComponent
      );
      return;
    }

    const result = this.alignmentService.setMode(mode);
    if (result === 1) {
      // show error
      return;
    }

    this.alignmentService.idsToAlign = selected;
    this.alignmentService.chantsToAlign = selectedChants;
    this.alignmentService.concatenatedMode = this.concatenatedMode;
    this.alignmentService.keepLiquescents = this.keepLiquescents;
    this.alignmentService.alignment = undefined;
    this.router.navigate(['/align']);
  }

  getGenreName(genreId: string): string {
    const genreName = this.csvTranslateService.getGenre(genreId);
    return genreName;
  }

  getOfficeName(officeId: string): string {
    // replace a long category with simpler description
    if (officeId === 'office_x') {
      return 'Others';
    }

    const officeName = this.csvTranslateService.getOffice(officeId);
    return officeName;
  }

  export(): void {
    const selected = this.getSelected();
    this.chantExportService.exportChants(selected)
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe(
        response => {
          const blob = new Blob([response], { type: 'text/csv' });
          this.downloadService.download(blob, 'dataset.csv');
        }
      );
  }

  createDataset(): void {
    const selected = this.getSelected();
    if (selected.length < 1) {
      alert('Select at least one chant');
      return;
    }
    let datasetName: string;

    const dialogRef = this.dialog.open(
      NameOnCreateDatasetComponent,
      { data: { name: datasetName }}
    );

    dialogRef.afterClosed()
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe(
        result => {
          datasetName = result;
          this.createDatasetService.createDataset(selected, datasetName);
        }
      );
  }

  addToDataset(): void {
    const selectedChants = this.getSelected();

    let dataSources: [number, string][];
    this.dataSourceListService.refreshSources();
    this.dataSourceListService.getAllSources()
      .pipe(take(1))
      .subscribe(
        data => {
          dataSources = data;

          const dialogRef = this.dialog.open(
            IdxOnAddToDatasetComponent,
            { data: dataSources}
          );

          let selectedDatasetIdx: number;

          dialogRef.afterClosed()
            .pipe(takeUntil(this.componentDestroyed$))
            .subscribe(
              result => {
                selectedDatasetIdx = result;
                console.log(selectedDatasetIdx);
                console.log(selectedChants);

                if (selectedDatasetIdx) {
                  this.datasetManagementService.addToDataset(selectedChants, selectedDatasetIdx);
                }
              }
            );
        }
      );
  }

  isChantComplete(chant: IChant): boolean {
    // This condition might get more complex later.
    if (chant.incipit.endsWith('*')) {
      return false;
    }
    return true;
  }


  doesChantContainVolpiano(chant: IChant): boolean {
    return !!chant.volpiano;
  }
}
