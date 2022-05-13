import { Component, Input, OnInit } from '@angular/core';
import * as d3 from 'd3';
import {IChant} from '../../../interfaces/chant.interface';
import {SettingsService} from '../../../services/settings.service';

@Component({
  selector: 'app-network-graph-wrapper',
  templateUrl: './network-graph-wrapper.component.html',
  styleUrls: ['./network-graph-wrapper.component.css']
})
export class NetworkGraphWrapperComponent implements OnInit {

  @Input() distanceMatrix: Map<string, Map<string, number>>;
  @Input() chants: Map<string, IChant>;

  colorScheme: Map<string, string>;
  showChantNetwork = false;
  showManuscriptNetwork = false;

  constructor(
    public settingService: SettingsService
  ) { }

  ngOnInit(): void {
    this.colorScheme = this.createColorScheme(this.distanceMatrix);
  }

  createColorScheme(data: Map<string, Map<string, number>>): Map<string, string> {
    const groupSet = new Set<string>();
    const groupSizes = new Map<string, number>();

    data.forEach((_, key: string) => {
      const source = key.split(" / ")[1];
      groupSet.add(source);
      if (!groupSizes.has(source)) { groupSizes.set(source, 0); }
      groupSizes.set(source, groupSizes.get(source) + 1);
    });

    const sortedGroups = Array.from(groupSet.values())
      .sort((n1, n2) => groupSizes.get(n2) - groupSizes.get(n1));

    const nColors = groupSet.size + 2;
    const colorScale = d3.scaleSequential(d3.interpolateSpectral);

    const colorScheme = new Map<string, string>();
    // const interval = Math.floor(360 / groupSet.size);
    let colorIdx = 2;
    let isOdd = 1;
    sortedGroups.forEach(group => {
      let scaleColorIdx = Math.floor(colorIdx / 2);
      if (isOdd < 0) { scaleColorIdx = nColors - Math.floor(colorIdx / 2); }
      const color = colorScale(scaleColorIdx / nColors);
      // console.log('colorIdx = ' + colorIdx + ', isOdd = ' + isOdd + ', scaleColorIdx = ' + scaleColorIdx + ', color = ' + color);
      colorScheme.set(group, color);

      colorIdx++;
      isOdd *= -1;
    });

    return colorScheme;
  }

}
