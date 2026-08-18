import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-zoomable-svg-view',
    templateUrl: './zoomable-svg-view.component.html',
    styleUrls: ['./zoomable-svg-view.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ZoomableSvgViewComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
