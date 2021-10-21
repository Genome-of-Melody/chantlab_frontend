import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-network-graph-wrapper',
  templateUrl: './network-graph-wrapper.component.html',
  styleUrls: ['./network-graph-wrapper.component.css']
})
export class NetworkGraphWrapperComponent implements OnInit {

  @Input() distanceMatrix: Map<string, Map<string, number>>;

  colorScheme: Map<string, string>;

  constructor() { }

  ngOnInit(): void {
    this.colorScheme = this.createColorScheme(this.distanceMatrix);
  }

  createColorScheme(data: Map<string, Map<string, number>>): Map<string, string> {
    const groupSet = new Set<string>();

    data.forEach((_, key: string) => {
      const source = key.split(" / ")[1];
      groupSet.add(source);
    });

    const colorScheme = new Map<string, string>();
    const rgbValue = () => (Math.floor(Math.random() * 255));
    groupSet.forEach(group => {
      const r = rgbValue();
      const g = rgbValue();
      const b = rgbValue();
      colorScheme.set(group,
         'rgb(' + r.toString() + ',' + g.toString() + ',' + b.toString() + ')');
    });

    return colorScheme;
  }

}
