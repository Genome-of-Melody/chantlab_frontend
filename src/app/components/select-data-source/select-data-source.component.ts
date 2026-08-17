import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DataSourceListService } from 'src/app/services/data-source-list.service';
import { SelectedDataSourcesService } from 'src/app/services/selected-data-sources.service';
import { SourceSelectionSavedDialogComponent } from '../dialogs/source-selection-saved-dialog/source-selection-saved-dialog.component';
import { ChantListService } from 'src/app/services/chant-list.service';

@Component({
    selector: 'app-select-data-source',
    templateUrl: './select-data-source.component.html',
    styleUrls: ['./select-data-source.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class SelectDataSourceComponent implements OnInit {

  dataSources: [number, string][];
  selectedDatasets = new Array<boolean>();
  displaySelection = true;

  constructor(
    private dataSourceListService: DataSourceListService,
    private selectedDataSourceService: SelectedDataSourcesService,
    private chantListService: ChantListService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.dataSourceListService.refreshSources();
    this.getDataSources();
  }

  changeSelection(manuallySelected: boolean = true): void {
    if (manuallySelected) {
      this.chantListService.selectedChants = [];
      this.chantListService.filterSettings = undefined;
    }

    const selected: number[] = [];
    for (let i = 0; i < this.selectedDatasets.length; i++) {
      if (this.selectedDatasets[i]) { selected.push(this.dataSources[i][0]); }
    }
    this.selectedDataSourceService.setSourceList(selected);

    if (manuallySelected) {
      this.dialog.open(SourceSelectionSavedDialogComponent);
    }
  }

  getDataSources(): void {
    this.dataSourceListService.getAllSources().subscribe(
      data => {
        this.selectedDatasets = [];
        this.dataSources = data;

        const storedSelection = this.selectedDataSourceService.getStoredSourceList();
        let allUnselected = true;

        this.dataSources.forEach(element => {
          if (storedSelection.includes(element[0])) {
            this.selectedDatasets.push(true);
            allUnselected = false;
          }
          else {
            this.selectedDatasets.push(false);
          }
        });

        if (allUnselected) {
          const defaultIndex = this.dataSources.findIndex(
            source => this.dataSourceListService.isDefaultName(source[1])
          );
          this.selectedDatasets[defaultIndex >= 0 ? defaultIndex : 0] = true;
        }

        this.changeSelection(false);
      }
    );
  }

}
