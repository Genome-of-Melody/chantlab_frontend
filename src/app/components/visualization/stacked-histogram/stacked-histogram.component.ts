import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { IStackedHistogram } from 'src/app/interfaces/stacked-histogram.interface';

import * as d3 from 'd3';
import { BehaviorSubject, combineLatest, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-stacked-histogram',
    templateUrl: './stacked-histogram.component.html',
    styleUrls: ['./stacked-histogram.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class StackedHistogramComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() set data(data: IStackedHistogram[]) {
    this.dataReceived.next(data);
  };
  @Input() chartTitle: string;
  @Input() groupName: string;
  @Input() valueXName: string;
  @Input() valueYName: string;

  @ViewChild('chart') chartElement: ElementRef<HTMLElement>;

  private svg;
  private margin = {
    top: 30,
    right: 30,
    bottom: 50,
    left: 80
  }
  private width = 700;
  private height = 500;
  private maxValue: number;

  private DOMRendered = new Subject<void>();
  private dataReceived = new BehaviorSubject<IStackedHistogram[]>([]);
  private readonly componentDestroyed$ = new Subject<void>();

  constructor() { }

  ngOnInit(): void {
    combineLatest([this.DOMRendered, this.dataReceived]).pipe(
      takeUntil(this.componentDestroyed$)
    ).subscribe(
    ([_, data]) => {
      if (!data || data.length === 0 || !this.chartElement) {
        return;
      }
      d3.select(this.chartElement.nativeElement).select('svg').remove();
      this.maxValue = d3.max(data, (d: any) => d.value as number) ?? 0;
      this.createSvg();
      this.drawHist(data)
      }
    )
  }

  ngAfterViewInit(): void {
    this.DOMRendered.next(undefined);
  }

  ngOnDestroy(): void {
    this.componentDestroyed$.next(undefined);
    this.componentDestroyed$.complete();
  }

  createSvg(): void {
    this.svg = d3.select(this.chartElement.nativeElement)
                 .append("svg")
                 .attr("width", this.width)
                 .attr("height", this.height + 50)
                 .append("g")
                 .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
  }

  drawHist(data: IStackedHistogram[]): void {
    if (!this.svg) {
      return;
    }

    // create the bin function
    const bins = d3.bin().domain([0, Math.max(this.maxValue, 1)]).thresholds(100);

    // group data
    const groupedData = d3.group(data, d => d.group);
    const groups = Array.from(groupedData.keys());
    const histDataByGroup = []
    groupedData.forEach((value, key, map) => {

      var currentGroupHistData = bins(value.map((d) => d.value));

      if (histDataByGroup.length === 0) {
        currentGroupHistData.forEach((d) => histDataByGroup.push({}));
      }

      currentGroupHistData.forEach((values, idx) => {
        histDataByGroup[idx][key] = values.length;
      });
    });

    if (!groups.length || !histDataByGroup.length) {
      return;
    }

    // stack data by group
    // the stacked data looks like this:
    // [ [group1_value1, group1_value2, group1_value3, ... ],
    //   [group2_value1, group2_value2, group2_value3, ... ], ... ]
    var stackedHistData = d3.stack()
                            .keys(groups)(histDataByGroup)
                            .slice(0, 10);

    if (!stackedHistData.length) {
      return;
    }
    
    // create scales
    const xScale = d3.scaleLinear()
                     .domain([0, stackedHistData[0].length])
                     .range([0, this.width - this.margin.left - this.margin.right]);

    var upperLimit = d3.max(stackedHistData[stackedHistData.length - 1], d => d[1]);
    const yScale = d3.scaleLinear()
                     .domain([0, upperLimit])
                     .range([this.height - this.margin.bottom, this.margin.top]);

    var color = d3.schemeCategory10;
    // create groups for each group and populate them with their data
    var sel = this.svg.selectAll("." + this.groupName)
            .data(stackedHistData)
            .enter()
            .append("g")
            .attr("class", this.groupName)
            .attr("id", (d, i) => groups[i])
            .style("fill", (d, i) => color[i])
            .style("stroke", (d, i) => d3.rgb(color[i]).darker())

    // for each genre group, draw the bars
    sel.selectAll(".bar")
            .data((d) => d)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", (d, i) => i * xScale(2))
            .attr("width", xScale(2))
            .attr("y", (d, i) => yScale(d[1]))
            .attr("height", (d, i) => yScale(d[0]) - yScale(d[1]));    
    
    // draw y-axis
    this.svg.append("g")
            .call(d3.axisLeft(yScale));

    // draw x-axis
    const xAxis = g => g
            .attr("transform", `translate(0,${this.height - this.margin.bottom})`)
            .call(d3.axisBottom(xScale).ticks(this.width / 40 ).tickSizeOuter(0))
            .call(g => g.append("text")
                .attr("x", this.width - this.margin.left)
                .attr("y", -4)
                .attr("fill", "currentColor")
                .attr("font-weight", "bold")
                .attr("text-anchor", "end")
                .text((d, i) => i * 2 + ""));

    this.svg.append("g").call(xAxis);

    // legend
    const legendX = this.width - this.margin.left - 200;
    const legendY = 100;
    groups.forEach((value, idx) => {
      // color marker
      this.svg.append("circle")
        .attr("cx", legendX)
        .attr("cy", legendY + 30 * idx)
        .attr("r", 6).style("fill", color[idx % 10]);
      // group name
      this.svg.append("text")
        .attr("x", legendX + 20)
        .attr("y", legendY + 30 * idx)
        .text(value).style("font-size", "15px")
        .attr("alignment-baseline","middle");
    });

    // add title
    this.svg.append("text")
            .attr("x", ((this.width - this.margin.left) / 2))
            .attr("y", 0)
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .style("text-decoration", "underline")
            .text(this.chartTitle);

    // axis labels
    this.svg.append("text")
            .attr("transform",
                  "translate(" + ((this.width - this.margin.left) / 2) + " ," +
                                (this.height - this.margin.bottom + 40) + ")")
            .style("text-anchor", "middle")
            .text(this.valueXName);

    this.svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 15 - this.margin.left)
            .attr("x", 0 - (this.height / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text(this.valueYName);
  }

}
