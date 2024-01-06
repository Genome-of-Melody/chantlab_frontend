import {Component, OnInit, ViewChild} from '@angular/core';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { DatasetManagementService } from 'src/app/services/dataset-management.service';
import { MissingDatasetNameDialogComponent } from '../dialogs/missing-dataset-name-dialog/missing-dataset-name-dialog.component';
import { UploadSuccessfulDialogComponent } from '../dialogs/upload-successful-dialog/upload-successful-dialog.component';
import {DatasetListComponent} from '../dataset-list/dataset-list.component';
import {Data} from '@angular/router';

@Component({
  selector: 'app-data-upload',
  templateUrl: './data-upload.component.html',
  styleUrls: ['./data-upload.component.css']
})
export class DataUploadComponent implements OnInit {

  fileToUpload: File = null;
  datasetName: string = null;

  @ViewChild(DatasetListComponent, {static: false}) datasetList: DatasetListComponent;

  constructor(
    private datasetManagementService: DatasetManagementService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
  }

  handleFileInput(files: FileList): void {
    this.fileToUpload = files.item(0);
  }

  upload(): void {
    if (!this.datasetName) {
      const dialogRef = this.dialog.open(MissingDatasetNameDialogComponent);
      return;
    }

    this.datasetManagementService
      .uploadDataset(this.fileToUpload, this.datasetName)
      .subscribe(
        _ => {
          this.dialog.open(UploadSuccessfulDialogComponent);
        }
      );
  }

  deleteSelection(): void {
    const selectedSourceNames = this.datasetList.selectedSourceNames;
    this.datasetManagementService.deleteMultipleDatasets(selectedSourceNames);
  }



}
