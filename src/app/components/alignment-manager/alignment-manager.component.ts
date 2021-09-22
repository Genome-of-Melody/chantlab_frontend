import {Component, OnInit, ViewChild} from '@angular/core';
import {AlignmentListComponent} from './alignment-list/alignment-list.component';
import {AlignmentManagementService} from '../../services/alignment-management.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-alignment-manager',
  templateUrl: './alignment-manager.component.html',
  styleUrls: ['./alignment-manager.component.css']
})
export class AlignmentManagerComponent implements OnInit {

  @ViewChild(AlignmentListComponent, {static: false}) alignmentList: AlignmentListComponent;

  constructor(
    private alignmentManagementService: AlignmentManagementService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  deleteSelection(): void {
    const selectedAlignmentNames = this.alignmentList.selectedAlignmentNames;
    for (const name of selectedAlignmentNames) {
      this.alignmentManagementService.deleteAlignment(name);
    }
    this.alignmentList.unselectAll();
  }

  showSelection(): void {
    if (this.alignmentList.selectedAlignmentNames.length === 0) {
      return;
    }
    const selectedAlignmentName = this.alignmentList.selectedAlignmentNames[0];
    this.router.navigate(['/align/' + selectedAlignmentName]);
  }

  get nAlignmentsAvailable(): number { return this.alignmentManagementService.nAlignmentsAvailable; }
  get zeroAlignmentsAvailable(): boolean { return (this.nAlignmentsAvailable === 0); }
}
