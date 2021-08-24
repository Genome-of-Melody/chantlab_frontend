import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { AlignmentService } from 'src/app/services/alignment.service';
import { ChantService } from 'src/app/services/chant.service';
import { AlignmentErrorDialogComponent } from '../dialogs/alignment-error-dialog/alignment-error-dialog.component';
import { ConservationProfileService } from 'src/app/services/conservation-profile.service';
import { DownloadService } from 'src/app/services/download.service';
import {DistanceService} from '../../services/distance.service';

@Component({
  selector: 'app-aligned',
  templateUrl: './aligned.component.html',
  styleUrls: ['./aligned.component.css']
})
export class AlignedComponent implements OnInit {

  idsToAlign: number[];
  alignmentMode: string;

  aligned: any;
  blob: Blob;
  visibleDetails: {[id: number]: boolean} = {};
  alignmentPresent: boolean[] = [];
  alignmentUncollapsed: boolean[] = [];

  showColors = false;
  showHeaders = true;
  showConservation = false;
  showText = true;

  showDistanceMatrix = false;

  conservationProfile: number[][][][];
  conservationOfSet: number;
  conservationChanged = true;

  displayMode = 'volpiano';

  constructor(
    private chantService: ChantService,
    private downloadService: DownloadService,
    private alignmentService: AlignmentService,
    private conservationProfileService: ConservationProfileService,
    private distanceService: DistanceService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.idsToAlign = this.alignmentService.idsToAlign;
    this.alignmentMode = this.alignmentService.getMode();

    const formData: FormData = new FormData();
    formData.append('idsToAlign', JSON.stringify(this.idsToAlign));
    formData.append('mode', this.alignmentMode);

    this.chantService.getAlignment(formData).subscribe(
      response => {
        this.aligned = response;
        this.aligned.chants.forEach(_ => {
          this.alignmentPresent.push(true);
          this.alignmentUncollapsed.push(true);
        });

        if (this.aligned.errors.length > 0) {
          const dialogRef = this.dialog.open(AlignmentErrorDialogComponent);
          const instance = dialogRef.componentInstance;
          instance.sources = this.aligned.errors;
        }
      }
    );
  }

  showDetail(id): void {
    this.visibleDetails[id] = !this.visibleDetails[id];
  }

  deleteAlignment(i: number): void {
    this.alignmentPresent[i] = false;
    this.alignmentUncollapsed[i] = false;
    this.visibleDetails[this.aligned.success.ids[i]] = false;

    this.conservationChanged = true;
  }

  collapseAlignment(i: number): void {
    this.alignmentUncollapsed[i] = false;
    this.visibleDetails[this.aligned.success.ids[i]] = false;
  }

  uncollapseAlignment(i: number): void {
    this.alignmentUncollapsed[i] = true;
  }

  drop(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.aligned.chants, event.previousIndex, event.currentIndex);
    moveItemInArray(this.aligned.success.ids, event.previousIndex, event.currentIndex);
    moveItemInArray(this.aligned.success.sources, event.previousIndex, event.currentIndex);
    moveItemInArray(this.aligned.success.volpianos, event.previousIndex, event.currentIndex);
    moveItemInArray(this.aligned.success.urls, event.previousIndex, event.currentIndex);
    moveItemInArray(this.alignmentPresent, event.previousIndex, event.currentIndex);
    moveItemInArray(this.alignmentUncollapsed, event.previousIndex, event.currentIndex);

    this.conservationChanged = true;
  }

  createBlob(): Blob {
    let blobText = '';
    for (let i = 0; i < this.aligned.success.urls.length; i++) {
      if (this.alignmentPresent[i]) {
        blobText += '> ' + this.aligned.success.urls[i] + '\n';
        blobText += this.aligned.success.volpianos[i] + '\n';
      }
    }

    const blob = new Blob([blobText], {type: 'text/plain'});
    return blob;
  }

  downloadAligned(): void {
    const blob = this.createBlob();
    this.downloadService.download(blob, 'aligned.txt');
  }

  getConservationValue(volpianoIdx: number,
                       wordIdx: number,
                       sylIdx: number,
                       neumeIdx: number): number {
    if (this.conservationChanged) {
      const conservation =
        this.conservationProfileService.calculateConservationProfile(
          this.aligned.success.volpianos);
      this.conservationProfile = conservation["conservationProfile"];
      this.conservationOfSet = conservation["conservationOfSet"];
      this.conservationChanged = false;
    }

    // check if syllable is actually 'syllable' type
    // if not, return 0
    const realSylIdx = this.getRealSyllableIndex(volpianoIdx, wordIdx, sylIdx);
    if (realSylIdx === -1) {
      return 0;
    }

    return this.conservationProfile[volpianoIdx][wordIdx][realSylIdx][neumeIdx];
  }

  getColor(neume: string): object {
    let color: string = null;
    switch (neume) {
      case '9': case 'j': case 's': case 'H': case 'R': color = '#D3FF5C'; break;
      case 'a': case 'k': case ')': case 'J': case 'S': color = '#06D6A0'; break;
      case 'b': case 'l': case 'A': case 'K': color = '#1B9AAA'; break;
      case 'c': case 'm': case 'B': case 'L': color = '#EF476F'; break;
      case 'd': case 'n': case 'C': case 'M': color = '#FFC43D'; break;
      case 'e': case 'o': case 'D': case 'N': color = '#FF6700'; break;
      case 'f': case 'p': case 'E': case 'O': color = '#004E98'; break;
      case 'g': case 'q': case 'F': case 'P': color = '#FFE5D9'; break;
      case 'h': case 'r': case 'G': case 'Q': color = '#A23F8F'; break;
      default: color = '#FFFFFF';
    }
    return {'background-color': color};
  }

  getConservationColor(volpianoIdx: number,
                       wordIdx: number,
                       sylIdx: number,
                       neumeIdx: number): object {
    let color: string = null;
    const conservationValue = this.getConservationValue(
                                  volpianoIdx, wordIdx, sylIdx, neumeIdx);
    if (conservationValue === 0) {
      color = '#FFFFFF';
    }
    else if (conservationValue <= 0.1) {
      color = '#FDECED';
    }
    else if (conservationValue <= 0.2) {
      color = '#F9C8CB';
    }
    else if (conservationValue <= 0.3) {
      color = '#F5A3A9';
    }
    else if (conservationValue <= 0.4) {
      color = '#F17E86';
    }
    else if (conservationValue <= 0.5) {
      color = '#ED5A64';
    }
    else if (conservationValue <= 0.6) {
      color = '#E93541';
    }
    else if (conservationValue <= 0.7) {
      color = '#DC1826';
    }
    else if (conservationValue <= 0.8) {
      color = '#B8141F';
    }
    else if (conservationValue <= 0.9) {
      color = '#931019';
    }
    else {
      color = '#6E0C13';
    }

    return {'background-color': color};
  }

  getRealSyllableIndex(volpianoIdx: number,
                       wordIdx: number,
                       sylIdx: number): number {
    // if element is any other type than syllable, return -1
    if (this.aligned.chants[volpianoIdx][wordIdx][sylIdx].type !== 'syllable') {
      return -1;
    }

    // otherwise, count how many 'syllable' type elements there are before
    // the desired one
    let idx = 0;
    for (let i = 0; i < sylIdx; i++) {
      if (this.aligned.chants[volpianoIdx][wordIdx][i].type === 'syllable') {
        idx++;
      }
    }

    return idx;
  }

  computeDistances(): Map<string, Map<string, number>> {
    if (!this.alignmentPresent) {
      return undefined;
    }
    const distanceMap = this.distanceService.alignedAllDistances(
      this.aligned.success.volpianos,
      this.aligned.success.urls,
      false,
      this.distanceService.alignedPairwiseRelativePositionsDifferent,
      {
        useEffectiveAlignedLength: true,
        onlyCountNotes: false,
      });
    return distanceMap;
  }

  doShowDistanceMatrix(): void {
    this.showDistanceMatrix = !this.showDistanceMatrix;
  }
  get showDistanceMatrixColor(): string {
    if (this.showDistanceMatrix) { return 'accent'; }
    return 'primary';
  }

}
