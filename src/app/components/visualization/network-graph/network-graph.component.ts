import { Component, Input, OnInit, OnDestroy } from '@angular/core';

import * as d3 from 'd3';

interface Node {
  'id': string;
  'group'?: string;
  'count'?: number;
}

interface Link {
  'source': string;
  'target': string;
  'value': number;
}

interface NetworkGraphData {
  'nodes': Node[];
  'links': Link[];
}

@Component({
  selector: 'app-network-graph',
  templateUrl: './network-graph.component.html',
  styleUrls: ['./network-graph.component.css']
})
export class NetworkGraphComponent implements OnInit, OnDestroy {

  @Input() distanceMatrix: Map<string, Map<string, number>>;
  @Input() distanceThreshold = 0.7;
  @Input() networkType: string;
  @Input() colorScheme: Map<string, string>;

  nodeLabel: d3.Selection<HTMLDivElement, unknown, HTMLElement, any>;
  edgeLabel: d3.Selection<HTMLDivElement, unknown, HTMLElement, any>;

  public readonly baseWidth = 1200;
  public readonly baseHeight = 1200;

  constructor() { }

  ngOnInit(): void {
    this.drawGraph(this.networkType);
  }

  ngOnDestroy(): void {
    this.nodeLabel.remove();
    this.edgeLabel.remove();
  }

  createDataFromDistanceMatrix(distanceMatrix: Map<string, Map<string, number>>): NetworkGraphData {
    const networkGraphData: NetworkGraphData = {
      nodes: [],
      links: []
    };

    if (!distanceMatrix) {
      return networkGraphData;
    }

    // Retrieve the list of links
    const links: Link[] = [];
    const usedLinks = new Set<string>();

    // Create set of nodes
    const nodeSet = new Set<string>();

    distanceMatrix.forEach((distanceMap: Map<string, number>, name1: string) => {
      distanceMap.forEach((distance: number, name2: string) => {
        // Create a node with its full name as its ID and
        // its signature as its group
        nodeSet.add(name1);
        // Only consider links with a low enough distance
        if (distance <= this.distanceThreshold) {
          // Only add link if the two chants are different
          // Check whether the reverse link is already in the set
          if (name1 !== name2 &&
              !usedLinks.has(name2 + '|' + name1)) {
            links.push({source: name1, target: name2, value: 1 - distance});
            usedLinks.add(name1 + '|' + name2);
          }
        }
      });
    });

    // Set the correct return values
    networkGraphData.nodes = Array.from(nodeSet).map(name => ({
      id: name,
      group: name.split(' / ')[1]
    }));
    networkGraphData.links = links;

    console.log(networkGraphData);
    return networkGraphData;
  }

  createAggregatedData(distanceMatrix: Map<string, Map<string, number>>): NetworkGraphData {
    const networkGraphData: NetworkGraphData = {
      nodes: [],
      links: []
    };

    if (!distanceMatrix) {
      return networkGraphData;
    }

    const distanceMatrixSources = this.transformDistanceMatrix(distanceMatrix);
    console.log(distanceMatrixSources);
    const sourceCounts = new Map<string, number>();
    distanceMatrix.forEach((_, key: string) => {
      const source = key.split(' / ')[1];
      sourceCounts.set(source, sourceCounts.has(source) ? sourceCounts.get(source) + 1 : 1);
    });

    // Retrieve the list of links
    const links: Link[] = [];
    const usedLinks = new Set<string>();

    // Create set of nodes
    const nodeSet = new Set<string>();

    distanceMatrixSources.forEach((distanceMap: Map<string, number>, name1: string) => {
      distanceMap.forEach((distance: number, name2: string) => {
        // Create a node with its full name as its ID and
        // its signature as its group
        nodeSet.add(name1);
        // Only consider links with a low enough distance
        if (distance <= this.distanceThreshold) {
          // Only add link if the two chants are different
          // Check whether the reverse link is already in the set
          if (name1 !== name2 &&
              !usedLinks.has(name2 + '|' + name1)) {
            links.push({source: name1, target: name2, value: 1 - distance});
            usedLinks.add(name1 + '|' + name2);
          }
        }
      });
    });

    // Set the correct return values
    networkGraphData.nodes = Array.from(nodeSet).map(name => ({
      id: name,
      group: name,
      count: sourceCounts[name]
    }));
    networkGraphData.links = links;

    console.log('Aggregated links', networkGraphData);
    return networkGraphData;
  }

  transformDistanceMatrix(distanceMatrix: Map<string, Map<string, number>>): Map<string, Map<string, number>> {
    const distanceMatrixAggregated = new Map<string, Map<string, number[]>>();

    distanceMatrix.forEach((distanceMap: Map<string, number>, name1: string) => {
      distanceMap.forEach((distance: number, name2: string) => {
        const source1 = name1.split(' / ')[1];
        const source2 = name2.split(' / ')[1];
        if (distanceMatrixAggregated.has(source1) && distanceMatrixAggregated.get(source1).has(source2)) {
          distanceMatrixAggregated.get(source1).get(source2).push(distance);
        }
        else {
          if (!distanceMatrixAggregated.has(source1)) {
            distanceMatrixAggregated.set(source1, new Map<string, number[]>());
          }
          distanceMatrixAggregated.get(source1).set(source2, [distance]);
        }
      });
    });

    // Take the mean of the distances as the distance between the nodes
    const distanceMatrixSources = new Map<string, Map<string, number>>();
    distanceMatrixAggregated.forEach((distanceMap: Map<string, number[]>, source1: string) => {
      distanceMap.forEach((distances: number[], source2: string) => {
        if (!distanceMatrixSources.has(source1)) {
          distanceMatrixSources.set(source1, new Map<string, number>());
        }
        distanceMatrixSources.get(source1).set(source2, distances.reduce((a, b) => a + b, 0) / distances.length);
      });
    });

    return distanceMatrixSources;
  }

  drawGraph(type: string): void {
    if (type !== 'chants' && type !== 'manuscripts') {
      return;
    }

    let data: NetworkGraphData;
    if (type === 'chants') {
      data = this.createDataFromDistanceMatrix(this.distanceMatrix);
    }
    else {
      data = this.createAggregatedData(this.distanceMatrix);
    }

    // set the dimensions and margins of the graph
    const margin = {top: 10, right: 30, bottom: 30, left: 40};
    const width = this.baseWidth - margin.left - margin.right;
    const height = this.baseHeight - margin.top - margin.bottom;

    // define the label for nodes
    this.nodeLabel = d3.select('body').append('div')
        .attr('class', '.label-' + this.networkType)
        .style('opacity', 0)
        .style('top', '0px')
        .style('left', '0px')
        .style('position', 'absolute')
        .style('cursor', 'default')
        .style('background', 'lightsteelblue')
        .style('border-radius', '8px')
        .style('padding', '5px')
        .style('pointer-events', 'none');

    this.edgeLabel = d3.select('body').append('div')
        .attr('class', '.label-' + this.networkType)
        .style('opacity', 0)
        .style('top', '0px')
        .style('left', '0px')
        .style('position', 'absolute')
        .style('cursor', 'default')
        .style('background', 'lightsteelblue')
        .style('border-radius', '8px')
        .style('padding', '5px')
        .style('pointer-events', 'none');

    // append the svg object to the body of the page
    const svg = d3.select('.network-graph-' + type)
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform',
          'translate(' + margin.left + ',' + margin.top + ')');

    // Initialize the links
    const link = svg
      .selectAll('line')
      .data(data.links)
      .enter()
      .append('line')
        .style('stroke', '#aaa')
        .attr('stroke-width', d => d.value * 10)
        .on('mousedown', (event, d) => {
          this.edgeLabel
              .transition()
              .duration(200)
              .style('opacity', .9);
          this.edgeLabel
              .html(d.value.toString())
              .style('left', (event.pageX + 10) + 'px')
              .style('top', (event.pageY + 10) + 'px');
          })
        .on('mouseup', (d) => {
          this.edgeLabel
              .transition()
              .duration(500)
              .style('opacity', 0);
      });

    // Initialize the nodes
    // TODO show tooltip with the name of the node on hover
    const node = svg
      .selectAll('circle')
      .data(data.nodes)
      .enter()
      .append('circle')
        .attr('r', 10)
        .style('fill', d => this.colorScheme.get(d.group))
        .on('mousedown', (event, d) => {
          this.nodeLabel
              .transition()
              .duration(200)
              .style('opacity', .9);
          this.nodeLabel
              .html(d.id)
              .style('left', (event.pageX + 10) + 'px')
              .style('top', (event.pageY + 10) + 'px');
          })
        .on('mouseup', (d) => {
          this.nodeLabel
              .transition()
              .duration(500)
              .style('opacity', 0);
      });

    // Apply force
    const simulation = d3.forceSimulation(data.nodes as any)
        .force('link', d3.forceLink()                               // pushes linked nodes together, according to a link distance
              .id(function(d: any) { return d.id; })
              .links(data.links)
        )
        .force('charge', d3.forceManyBody())                        // apply general attraction or repulsion between nodes
        .force('center', d3.forceCenter(width / 2, height / 2))     // attracts every node to a specific position
        .on('end', ticked);

    // Function updating the nodes' position
    function ticked(): void {
      link
          .attr('x1', function(d: any) { return d.source.x; })
          .attr('y1', function(d: any) { return d.source.y; })
          .attr('x2', function(d: any) { return d.target.x; })
          .attr('y2', function(d: any) { return d.target.y; });

      node
          .attr('cx', function(d: any) { return d.x + 6; })
          .attr('cy', function(d: any) { return d.y - 6; });
    }

  }
}
