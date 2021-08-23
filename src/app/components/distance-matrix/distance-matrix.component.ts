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

}
