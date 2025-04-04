import {AfterContentChecked, Component, Input, OnInit} from '@angular/core';
import {DistanceService} from '../../services/distance.service';

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

  getShortName(name: string): string {
    return name.split(' ').slice(0, 2).join(' ');
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
    const brightnessConstant = 80;
    const maxRed = 200;  // cap red intensity
    const rangeCoef = maxRed - brightnessConstant;
  
    if (distance === 0.0) {
      return `${brightnessConstant}, 255, ${brightnessConstant}`;
    }
  
    const scaled = 1 / (1 + Math.exp(-10 * (distance - 0.5)));
    const adjusted = Math.min(Math.max(scaled, 0), 1);
  
    const red = Math.round(rangeCoef * adjusted + brightnessConstant);
    const green = Math.round((255 - brightnessConstant) * (1 - adjusted) + brightnessConstant);
  
    return `${red}, ${green}, ${brightnessConstant}`;
  }

  selectCell(name1: string, name2: string): void {}

  showCellName(name1: string, name2: string): void {
    this._showCellNames.get(name1).set(name2, true);
  }
  hideCellName(name1: string, name2: string): void {
    this._showCellNames.get(name1).set(name2, false);
  }
}
