import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DataSourceListService } from 'src/app/services/data-source-list.service';
import { DataSourceService } from 'src/app/services/data-source.service';
import { SourceSelectionSavedDialogComponent } from '../dialogs/source-selection-saved-dialog/source-selection-saved-dialog.component';

@Component({
  selector: 'app-select-data-source',
  templateUrl: './select-data-source.component.html',
  styleUrls: ['./select-data-source.component.css']
})
export class SelectDataSourceComponent implements OnInit {

  dataSources: [number, string][];
  selectedDatasets = new Array<boolean>();
  displaySelection = true;

  constructor(
    private dataSourceListService: DataSourceListService,
    private dataSourceService: DataSourceService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.dataSourceListService.refreshSources();
    this.getDataSources();
  }

  changeSelection(showDialog: boolean = true): void {
    let selected: number[] = [];
    for (let i = 0; i < this.selectedDatasets.length; i++) {
      if (this.selectedDatasets[i]) selected.push(this.dataSources[i][0]);
    }
    this.dataSourceService.setSourceList(selected);

    if (showDialog) {
      this.dialog.open(SourceSelectionSavedDialogComponent);
    }
  }

  getDataSources(): void {
    this.dataSourceListService.getAllSources().subscribe(
      data => {
        this.selectedDatasets = [];
        this.dataSources = data;

        const storedSelection = this.dataSourceService.getStoredSourceList();
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

        // always include at least the default data source
        if (allUnselected)
        {
          this.selectedDatasets[0] = true;
        }

        this.changeSelection(false);
      }
    );
  }

}
