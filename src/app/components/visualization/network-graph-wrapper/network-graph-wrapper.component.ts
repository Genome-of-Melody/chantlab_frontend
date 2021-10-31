import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-network-graph-wrapper',
  templateUrl: './network-graph-wrapper.component.html',
  styleUrls: ['./network-graph-wrapper.component.css']
})
export class NetworkGraphWrapperComponent implements OnInit {

  @Input() distanceMatrix: Map<string, Map<string, number>>;

  colorScheme: Map<string, string>;
  showChantNetwork = false;
  showManuscriptNetwork = false;

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
    const interval = Math.floor(360 / groupSet.size);
    let i = 0;
    groupSet.forEach(group => {
      const hue = interval * i++;
      colorScheme.set(group,
        'hsl(' + hue.toString() + ', 100%, 50%');
    });

    return colorScheme;
  }

}
