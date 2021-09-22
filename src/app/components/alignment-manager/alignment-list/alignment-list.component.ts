import { Component, OnInit } from '@angular/core';
import {AlignmentManagementService} from '../../../services/alignment-management.service';

@Component({
  selector: 'app-alignment-list',
  templateUrl: './alignment-list.component.html',
  styleUrls: ['./alignment-list.component.css']
})
export class AlignmentListComponent implements OnInit {

  public selectedAlignments: boolean[] = [];

  constructor(
    private alignmentManagementService: AlignmentManagementService
  ) { }

  ngOnInit(): void {
    for (const alnName of this.availableAlignments) {
      this.selectedAlignments.push(false);
    }
  }

  get availableAlignments(): string[] {
    return Array.from(this.alignmentManagementService.availableAlignments.keys()).sort();
  }

  get selectedAlignmentNames(): string[] {
    const selectedAlignmentNames = [];
    const alignmentNames = this.availableAlignments;
    for (let idx = 0; idx < alignmentNames.length; idx++) {
      if (this.selectedAlignments[idx]) {
        selectedAlignmentNames.push(alignmentNames[idx]);
      }
    }
    return selectedAlignmentNames;
  }

  unselectAll(): void {
    this.selectedAlignments.forEach((x, i) => this.selectedAlignments[i] = false);
  }

  requestShowAlignment(name: string): void {
    console.log('Requesting show alignment: ' + name);
  }

}
