import {ChangeDetectionStrategy, Component, HostListener, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {AlignmentService} from 'src/app/services/alignment.service';
import {ChantService} from 'src/app/services/chant.service';
import {ConservationProfileService} from 'src/app/services/conservation-profile.service';
import {DownloadService} from 'src/app/services/download.service';
import {DistanceService} from '../../services/distance.service';
import {Alignment, AlignmentResponse} from '../../models/alignment';
import {SettingsService} from '../../services/settings.service';
import {IChant} from '../../interfaces/chant.interface';
import {AlignmentManagementService} from '../../services/alignment-management.service';
import {NameOnCreateAlignmentComponent} from '../dialogs/name-on-create-alignment/name-on-create-alignment.component';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {ContrafactService} from '../../services/contrafact.service';
import {NetworkGraphWrapperComponent} from '../visualization/network-graph-wrapper/network-graph-wrapper.component';
import { Router } from '@angular/router';
import { PhylogenyService } from 'src/app/services/phylogeny.service';

@Component({
  selector: 'app-aligned',
  templateUrl: './aligned.component.html',
  styleUrls: ['./aligned.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlignedComponent implements OnInit, OnDestroy {

  idsToAlign: number[];
  chantsToAlign: IChant[];
  alignmentMode: string;

  alignedResponse: AlignmentResponse;

  @Input() alignment: Alignment;

  @ViewChild(NetworkGraphWrapperComponent, {static: true}) networkGraphWrapper: NetworkGraphWrapperComponent;

  alignedChants: IChant[];
  blob: Blob;
  visibleDetails: {[id: number]: boolean} = {};
  alignmentPresent: boolean[] = [];
  alignmentUncollapsed: boolean[] = [];

  showColors = false;
  showWordBars = false;
  isNotesOnly = true;
  showHeaders = true;
  showConservation = false;
  showText = true;

  showDistanceMatrix = false;
  showGuideTree = false;

  showChantNetwork = false;
  showManuscriptNetwork = false;

  conservationProfile: number[][][][];
  conservationOfSet: number;
  conservationChanged = true;

  displayMode = 'volpiano';

  private _distanceMatrix: Map<string, Map<string, number>> = undefined;
  get distanceMatrix(): Map<string, Map<string, number>> {
    console.log('Asked for DistanceMatrix...');
    if (!this._distanceMatrix) {
      console.log('...nothing cached, recomputing distances');
      this._distanceMatrix = this.computeDistances(true);
    } else {
      console.log('...using cached distances');
    }
    console.log('...total distances: ' + this._distanceMatrix.size);
    return this._distanceMatrix;
  }

  private readonly componentDestroyed$ = new Subject();

  constructor(
    private chantService: ChantService,
    private downloadService: DownloadService,
    private alignmentService: AlignmentService,
    private phylogenyService: PhylogenyService,
    private alignmentManagementService: AlignmentManagementService,
    private conservationProfileService: ConservationProfileService,
    private distanceService: DistanceService,
    private settingsService: SettingsService,
    private contrafactService: ContrafactService,
    public dialog: MatDialog,
    private router: Router
  ) { }

  ngOnInit(): void {
    console.log('AlignedComponent.onInit() started');

    this.idsToAlign = this.alignment.ids;
    this.alignmentMode = this.alignment.alignmentMode;
    this.chantsToAlign = this.alignmentService.chantsToAlign; // Probably not used anywhere
    console.log('AlignedComponent.alignment:');
    console.log(this.alignment);

    this.alignedChants = this.alignment.iChants;
    this.alignedChants.forEach(_ => {
      this.alignmentPresent.push(true);
      this.alignmentUncollapsed.push(true);
    });

    console.log('AlignedComponent.onInit() done.');
    console.log('AlignedChants:');
    console.log(this.alignedChants);
  }

  ngOnDestroy(): void {
    this.componentDestroyed$.next();
    this.componentDestroyed$.complete();
  }

  get visibleAlignmentSubset(): Alignment {
    const idxs = [];
    for (let i = 0; i < this.alignment.length; i++) {
      if (this.alignmentPresent[i]) {
        idxs.push(i);
      }
    }
    const subAlignment = this.alignment.selectSubset(idxs);
    console.log('Visible sub-alignment: length ' + subAlignment.length);
    return subAlignment;
  }

  showDetail(id): void {
    this.visibleDetails[id] = !this.visibleDetails[id];
  }

  /**
   * Invalidate caches upon an alignment change.
   */
  alignmentChanged(): void {
    this._distanceMatrix = undefined;
  }

  get nAlignmentsShown(): number {
    return this.alignmentPresent.filter(a => a).length;
  }

  deleteAlignment(i: number): void {
    this.alignmentPresent[i] = false;
    this.alignmentUncollapsed[i] = false;
    this.visibleDetails[this.alignment.ids[i]] = false;

    this.conservationChanged = true;
    this.alignmentChanged();
  }

  collapseAlignment(i: number): void {
    this.alignmentUncollapsed[i] = false;
    this.visibleDetails[this.alignment.ids[i]] = false;
  }

  uncollapseAlignment(i: number): void {
    this.alignmentUncollapsed[i] = true;
  }

  drop(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.alignedChants, event.previousIndex, event.currentIndex);

    moveItemInArray(this.alignment.parsedChants, event.previousIndex, event.currentIndex);
    moveItemInArray(this.alignment.iChants, event.previousIndex, event.currentIndex);
    moveItemInArray(this.alignment.ids, event.previousIndex, event.currentIndex);
    moveItemInArray(this.alignment.sources, event.previousIndex, event.currentIndex);
    moveItemInArray(this.alignment.alpianos, event.previousIndex, event.currentIndex);
    moveItemInArray(this.alignment.urls, event.previousIndex, event.currentIndex);

    moveItemInArray(this.alignmentPresent, event.previousIndex, event.currentIndex);
    moveItemInArray(this.alignmentUncollapsed, event.previousIndex, event.currentIndex);

    this.conservationChanged = true;
  }

  createBlob(): Blob {
    let blobText = '';
    for (let i = 0; i < this.alignment.urls.length; i++) {
      if (this.alignmentPresent[i]) {
        blobText += '> ' + this.alignment.urls[i] + '\n';
        blobText += this.alignment.alpianos[i] + '\n';
      }
    }

    const blob = new Blob([blobText], {type: 'text/plain'});
    return blob;
  }

  downloadAlignedFasta(): void {
    const blob = this.createBlob();
    this.downloadService.download(blob, 'aligned.txt');
  }

  downloadAlignedJson(): void {
    const blob = new Blob([this.alignment.toJson()], {type: 'text/json'});
    this.downloadService.download(blob, 'aligned.json');
  }

  downloadPhyloNewick(): void {
    const blob = new Blob([this.alignment.guideTree], {type: 'text'});
    this.downloadService.download(blob, 'guide_tree.txt');
  }

  saveAlignment(): void {

    let alignmentName: string;
    const dialogRef = this.dialog.open(
      NameOnCreateAlignmentComponent,
      { data: { name: alignmentName }}
    );

    dialogRef.afterClosed().pipe(takeUntil(this.componentDestroyed$))
      .subscribe(
        result => {
          alignmentName = result;
          this.alignmentManagementService.storeAlignment(alignmentName, this.alignment);
        }
      );
  }

  getConservationValue(volpianoIdx: number,
                       wordIdx: number,
                       sylIdx: number,
                       neumeIdx: number): number {
    if (this.conservationChanged) {
      const conservation =
        this.conservationProfileService.calculateConservationProfile(
          this.alignment.alpianos);
      this.conservationProfile = conservation.conservationProfile;
      this.conservationOfSet = conservation.conservationOfSet;
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
    if (this.alignment.parsedChants[volpianoIdx][wordIdx][sylIdx].type !== 'syllable') {
      return -1;
    }

    // otherwise, count how many 'syllable' type elements there are before
    // the desired one
    let idx = 0;
    for (let i = 0; i < sylIdx; i++) {
      if (this.alignment.parsedChants[volpianoIdx][wordIdx][i].type === 'syllable') {
        idx++;
      }
    }

    return idx;
  }

  computeDistances(visibleOnly: boolean): Map<string, Map<string, number>> {
    if (!this.alignment) {
      return undefined;
    }
    let pairwiseDistanceFunction = this.distanceService.alignedPairwiseRelativePositionsDifferent;
    const pairwiseDistanceOptions = {
      useEffectiveAlignedLength: true,
      onlyCountNotes: false,
    };
    if (this.settingsService.alignmentSettingsService.distanceMatrixUseAbsoluteDistances){
      pairwiseDistanceFunction = this.distanceService.alignedPairwiseNPositionsDifferent;
    }

    // It is not entirely obvious which subset of sequences needs to have distances
    // computed. For now, we assume that the distances are always computed only for
    // the visible alignment. This should be refactored into functions for computing
    // the distances of visible alignments, which is the variable that goes e.g. into
    // the DistanceMatrix upon each alignment modification, and for computing the distances
    // between all pairs of aligned sequences, regardless of how they are shown.
    let alignmentForDistanceComputation = this.alignment;
    let chantNamesForDistanceComputation = this.distanceMatrixChantNames;
    if (visibleOnly) {
      alignmentForDistanceComputation = this.visibleAlignmentSubset;
      chantNamesForDistanceComputation = this.visibleSequencesDistanceMatrixChantNames;
    }

    const distanceMap = this.distanceService.alignedAllDistances(
      alignmentForDistanceComputation.alpianos,
      chantNamesForDistanceComputation,
      false,
      pairwiseDistanceFunction,
      pairwiseDistanceOptions
      );
    return distanceMap;
  }

  computeAndCacheDistances(): void {
    this._distanceMatrix = this.computeDistances(true);
  }

  doShowDistanceMatrix(): void {
    if (this.alignment) {
      this.showDistanceMatrix = !this.showDistanceMatrix;
    }
  }
  ensureDistanceMatrixClosed(): void {
    if (this.showDistanceMatrix) { this.doShowDistanceMatrix(); }
  }
  get showDistanceMatrixColor(): string {
    if (this.showDistanceMatrix) { return 'accent'; }
    return 'primary';
  }

  private getSerializedReversedNamesDict(): Map<string, string> {
    return new Map(
      Object.entries(this.alignment.newickNamesDict).map(([key, value]) => [
        JSON.stringify(value),
        key,
      ])
    );
  }

  private getSequenceNames(ids: (number[] | number)[]): string[] {
    const serializedDict = this.getSerializedReversedNamesDict();
    return ids
      .map(sub_ids => serializedDict.get(JSON.stringify(sub_ids)))
  }

  get distanceMatrixChantNames(): string[] {
    return this.getSequenceNames(this.alignment.ids);
  }

  get visibleSequencesDistanceMatrixChantNames(): string[] {
    return this.getSequenceNames(this.visibleAlignmentSubset.ids);
  }

  get chantsMapForNetworkGraphs(): Map<string, IChant> {
    const chantsForNetworkGraphs = new Map<string, IChant>();
    this.visibleAlignmentSubset.iChants.forEach(ch => {
      chantsForNetworkGraphs.set(ch.incipit + ' / ' + ch.siglum + ' / ' + ch.id, ch);
    });
    return chantsForNetworkGraphs;
  }

  doShowChantNetwork(): void {
    if (this.alignment) {
      this.showChantNetwork = !this.showChantNetwork;
      this.networkGraphWrapper.showChantNetwork = this.showChantNetwork;
    }
  }
  get showChantNetworkColor(): string {
    if (this.showChantNetwork) { return 'accent'; }
    return 'primary';
  }
  ensureChantNetworkClosed(): void {
    if (this.showChantNetwork) { this.doShowChantNetwork(); }
  }


  doShowManuscriptNetwork(): void {
    if (this.alignment) {
      this.showManuscriptNetwork = !this.showManuscriptNetwork;
      this.networkGraphWrapper.showManuscriptNetwork = this.showManuscriptNetwork;
    }
  }
  get showManuscriptNetworkColor(): string {
    if (this.showManuscriptNetwork) { return 'accent'; }
    return 'primary';
  }
  ensureManuscriptNetworkClosed(): void {
    if (this.showManuscriptNetwork) { this.doShowManuscriptNetwork(); }
  }

  doShowGuideTree(): void {
    if (this.alignment) {
      this.showGuideTree = !this.showGuideTree;
    }
  }
  get showGuideTreeColor(): string {
    if (this.showGuideTree) { return 'accent'; }
    return 'primary';
  }
  ensureGuideTreeClosed(): void {
    if (this.showGuideTree) { this.doShowGuideTree(); }
  }

  restrictToContrafacts(): void {
    if (!this.alignment) { return; }
    const distanceMap: Map<string, Map<string, number>> = this.contrafactService.computeDistanceMap(this.visibleAlignmentSubset);
    const contrafacts = this.contrafactService.discover(this.alignment, distanceMap);

    if (contrafacts.alignment.length < 1) {
      console.log('No contrafacts found.');
      return;
    }

    // Find which alignment members are not contrafacts and remove them
    const nonContrafactIdxs: number[] = [];
    const contrafactIds = new Set(contrafacts.alignment.ids);
    for (let i = 0; i < this.alignment.length; i++) {
      if (!contrafactIds.has(this.alignment.ids[i])) {
        nonContrafactIdxs.push(i);
      }
    }
    for (const idx of nonContrafactIdxs.sort()) {
      // The members of the Alignment object are not removed
      // upon deleteAlignment(idx), so we do *not* need to subtract
      // the number of already deleted items from the pre-computed idxs.
      console.log('Removing alignment idx ' + idx);
      this.deleteAlignment(idx);
    }

    // this.alignment.reduceGaps(); -- TODO: uncomment
    this.computeAndCacheDistances();
  }

  @HostListener('document:keyup', ['$event'])
  onKeyUp(event: KeyboardEvent): void {
    console.log('AlignedComponent onKeyUp(' + event.key + ')');
    if (event.key === 'Escape') {
      this.ensureDistanceMatrixClosed();
      this.ensureChantNetworkClosed();
      this.ensureManuscriptNetworkClosed();
      this.ensureGuideTreeClosed();
    }
    // event.preventDefault();
  }

  openPhylogeneticAnalysis(): void {
    // Save the current chant alignment for phylogeny to local storage
    this.phylogenyService.alignmentForPhylogeny = this.alignmentService.alignment
    this.phylogenyService.newick = undefined
    this.router.navigate(['/phylogeny']);
  }

  normalizeVolpianoCharacter(volpiano_character: string): string {
    // Hide bars visualizing Word Boundaries
    if (!this.showWordBars && volpiano_character === '3') {
      return '-';
    }
  
    // If in 'volpiano' display mode and 'notesOnly' is true, keep only notes
    // remove flats and pause breaks
    if (this.displayMode === 'volpiano' && this.isNotesOnly) {
      const replaceSet = ['7', 'i', 'I', 'y', 'Y', 'z', 'Z', 'x', 'X'];
      if (replaceSet.includes(volpiano_character)) {
        return '-';
      }
    }
    return volpiano_character;
  }
}
