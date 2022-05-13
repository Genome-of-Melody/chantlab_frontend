import {AfterContentChecked, Component, Input, OnInit} from '@angular/core';
import {DistanceService} from '../../services/distance.service';
import {AlignmentService} from '../../services/alignment.service';

@Component({
  selector: 'app-distance-matrix',
  templateUrl: './distance-matrix.component.html',
  styleUrls: ['./distance-matrix.component.css']
})
export class DistanceMatrixComponent implements OnInit, AfterContentChecked {

  @Input() allDistances: Map<string, Map<string, number>> = undefined;
  @Input() names: string[];

  get shortNames(): string[] {
    return this.names.map(n => n.split(' ').slice(0, 2).join(' '));
  }

  /**
   * Handles displaying overlays with cell names to help orient the user in a large matrix.
   */
  public _showCellNames: Map<string, Map<string, boolean>>;
  get showCellNames(): Map<string, Map<string, boolean>> { return this._showCellNames; }
  get showCellNamesList(): string[] { return Array.from(this._showCellNames.keys()); }

  private _distanceMatrix: number[][] = undefined;
  get distanceMatrix(): number[][] {
    if (this._distanceMatrix === undefined) {
      this._distanceMatrix = this.distanceService.distancesToMatrix(this.allDistances, this.names);
    }
    return this._distanceMatrix;
  }

  constructor(
    private distanceService: DistanceService
  ) { }

  ngOnInit(): void {
    // Initialize showing cell names.
    this._showCellNames = new Map<string, Map<string, boolean>>();
    for (const name1 of this.names) {
      this._showCellNames.set(name1, new Map<string, boolean>());
      for (const name2 of this.names) {
        this._showCellNames.get(name1).set(name2, false);
      }
    }
    console.log('Show cell names array:');
    console.log(this._showCellNames);
  }

  ngAfterContentChecked(): void {
  }

  backgroundColorRGB(distance: number): string {
    // Assumes distances are numbers between 0 and 1 for now.
    const brightnessConstant = 170;
    const rangeCoef = 255.0 - brightnessConstant;

    // For zero distance, returns light gray. This should always stand out.
    if (distance === 0.0) {
      return '' + brightnessConstant + ',' + 255 + ',' + brightnessConstant;
    }

    const greenval = Math.round(rangeCoef * (1 - distance) + brightnessConstant);
    const redval = Math.round(rangeCoef * distance + brightnessConstant);
    return '' + redval + ',' + greenval + ',' + brightnessConstant;
  }

  selectCell(name1: string, name2: string): void {}

  showCellName(name1: string, name2: string): void {
    this._showCellNames.get(name1).set(name2, true);
  }
  hideCellName(name1: string, name2: string): void {
    this._showCellNames.get(name1).set(name2, false);
  }
}
