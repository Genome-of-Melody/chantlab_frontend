import {Component, OnInit, ViewChild} from '@angular/core';
import {AlignmentListComponent} from './alignment-list/alignment-list.component';
import {AlignmentManagementService} from '../../services/alignment-management.service';
import {Router} from '@angular/router';
import { Alignment } from 'src/app/models/alignment';

@Component({
  selector: 'app-alignment-manager',
  templateUrl: './alignment-manager.component.html',
  styleUrls: ['./alignment-manager.component.css']
})
export class AlignmentManagerComponent implements OnInit {

  @ViewChild(AlignmentListComponent, {static: false}) alignmentList: AlignmentListComponent;

  alignmentName: string;
  fileToUpload: File;

  constructor(
    private alignmentManagementService: AlignmentManagementService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  deleteSelection(): void {
    const name = this.alignmentList.selectedAlignmentName;
    if (name) {
      this.alignmentManagementService.deleteAlignment(name);
    }
    this.alignmentList.resetSelectedAlignment();
  }

  showSelection(): void {
    const name = this.alignmentList.selectedAlignmentName;
    if (name) {
      this.router.navigate(['/align/' + name]);
    }
  }

  handleFileInput(files: FileList): void {
    this.fileToUpload = files.item(0);
  }

  upload(): void {
    if (!this.alignmentName) {
      this.alignmentName = "Stored alignment";
    }

    const fileReader = new FileReader();
    fileReader.readAsText(this.fileToUpload, "UTF-8");
    fileReader.onload = () => {
      let parsedAlignment = JSON.parse(fileReader.result.toString());
      let alignment = Alignment.fromJson(parsedAlignment);
      this.alignmentManagementService.storeAlignment(this.alignmentName, alignment);
    }
    fileReader.onerror = (error) => {
      console.log(error);
    }

    // this.alignmentManagementService
    //   .uploadDataset(this.fileToUpload, this.datasetName)
    //   .subscribe(
    //     _ => {
    //       this.dialog.open(UploadSuccessfulDialogComponent);
    //     }
    //   );
  }

  get nAlignmentsAvailable(): number { return this.alignmentManagementService.nAlignmentsAvailable; }
  get zeroAlignmentsAvailable(): boolean { return (this.nAlignmentsAvailable === 0); }
}
