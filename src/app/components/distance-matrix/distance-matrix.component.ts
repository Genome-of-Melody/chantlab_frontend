import {Component, Input, OnInit} from '@angular/core';
import {DistanceService} from '../../services/distance.service';
import {AlignmentService} from '../../services/alignment.service';

@Component({
  selector: 'app-distance-matrix',
  templateUrl: './distance-matrix.component.html',
  styleUrls: ['./distance-matrix.component.css']
})
export class DistanceMatrixComponent implements OnInit {

  @Input() allDistances: Map<string, Map<string, number>> = undefined;
  @Input() names: string[];

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
  }

  backgroundColorRGB(distance: number): string {
    // Assumes distances are numbers between 0 and 1 for now.
    const brightnessConstant = 170;
    const rangeCoef = 255.0 - brightnessConstant;

    const greenval = Math.round(rangeCoef * (1 - distance) + brightnessConstant);
    const redval = Math.round(rangeCoef * distance + brightnessConstant);
    return '' + redval + ',' + greenval + ',' + brightnessConstant;
  }
}
