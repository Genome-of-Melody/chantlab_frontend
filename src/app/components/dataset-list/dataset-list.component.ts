import { Component, OnInit } from '@angular/core';
import {DataSourceListService} from '../../services/data-source-list.service';

@Component({
  selector: 'app-dataset-list',
  templateUrl: './dataset-list.component.html',
  styleUrls: ['./dataset-list.component.css']
})
export class DatasetListComponent implements OnInit {

  dataSources: [number, string][];
  selectedDatasets = new Array<boolean>();

  constructor(
    private dataSourceListService: DataSourceListService
  ) { }

  ngOnInit(): void {
    this.dataSourceListService.refreshSources();
    this.getDataSources();
  }

  getDataSources(): void {
    // As opposed to SelectDataSourceComponent, here we do *not*
    // interact with local storage of active datasets for querying.
    // Here, we use the selection for dataset management operations.
    // We will just need to *tell* the data source selection component
    // to refresh when datasets are added or removed.
    this.dataSourceListService.getAllSources().subscribe(
      data => {
        this.selectedDatasets = [];
        this.dataSources = data;
        this.dataSources.forEach(element => {
          this.selectedDatasets.push(false);
        });
      }
    );
  }

  get length(): number {
    return this.dataSources.length;
  }

  get selectedSources(): [number, string][] {
    const selectedSources = new Array<[number, string]>();
    for (let i = 0; i < this.length; i++) {
      if (this.selectedDatasets[i]) {
        selectedSources.push(this.dataSources[i]);
      }
    }
    return selectedSources;
  }

  get selectedSourceNames(): string[] {
    return this.selectedSources.map((item) => item[1]);
  }

}
