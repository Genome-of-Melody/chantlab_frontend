import { Component, OnInit } from '@angular/core';
import {AlignmentManagementService} from '../../../services/alignment-management.service';

@Component({
  selector: 'app-alignment-list',
  templateUrl: './alignment-list.component.html',
  styleUrls: ['./alignment-list.component.css']
})
export class AlignmentListComponent implements OnInit {

  public selectedAlignment: string;

  constructor(
    private alignmentManagementService: AlignmentManagementService
  ) { }

  ngOnInit(): void {

  }

  get availableAlignments(): string[] {
    return Array.from(this.alignmentManagementService.availableAlignments.keys()).sort();
  }

  get selectedAlignmentName(): string {
    return this.selectedAlignment;
  }

  resetSelectedAlignment() {
    this.selectedAlignment = undefined;
  }

}
