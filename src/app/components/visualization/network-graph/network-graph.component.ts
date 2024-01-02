import { Component, Input, OnInit, OnDestroy } from '@angular/core';

import * as d3 from 'd3';
import {IChant} from '../../../interfaces/chant.interface';

interface Node {
  'id': string;
  'dbid': string;
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
  @Input() chants: Map<string, IChant>;
  @Input() linkMaximumDistanceThreshold = 0.02;
  @Input() networkType: string;
  @Input() colorScheme: Map<string, string>;

  nodeLabel: d3.Selection<HTMLDivElement, unknown, HTMLElement, any>;
  edgeLabel: d3.Selection<HTMLDivElement, unknown, HTMLElement, any>;

  // Parameters for drawing the graph
  public baseWidth = 1200;
  public baseHeight = 1200;

  public nodeRadius = 5;
  public nodeCollideRadius = 1;
  public linkBaseThickness = 3;

  // Parameters for computing the graph
  public linkStrengthCoefficient = 0.1;
  public linkStrengthExponent = 10;

  public forceChargeStrength = -10;

  constructor() { }

  ngOnInit(): void {
    this.drawGraph(this.networkType);
  }

  ngOnDestroy(): void {
    if(this.nodeLabel != null){
      this.nodeLabel.remove();
    }
    if(this.edgeLabel != null){
      this.edgeLabel.remove();
    }
  }

  computeLinkStrength(distance: number): number {
    return (distance ** this.linkStrengthExponent) * this.linkStrengthCoefficient;
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
        if (distance <= this.linkMaximumDistanceThreshold) {
          // Only add link if the two chants are different
          // Check whether the reverse link is already in the set
          if (name1 !== name2 &&
              !usedLinks.has(name2 + '|' + name1)) {
            const linkStrength = this.computeLinkStrength(1 - distance);
            links.push({source: name1, target: name2, value: linkStrength});
            usedLinks.add(name1 + '|' + name2);
          }
        }
      });
    });

    // Set the correct return values
    networkGraphData.nodes = Array.from(nodeSet).map(name => ({
      id: name,
      dbid: name.split(' / ')[2],
      group: name.split(' / ')[1]
    }));
    networkGraphData.links = links;
    console.log('Network graph data -- nodes:');
    console.log(networkGraphData.nodes);

    console.log(networkGraphData);
    return networkGraphData;
  }

  /**
   * Based on the graph data, sets the visualization parameters
   * such as basic node size, edge thickness, etc. Possibly also display
   * parameters such as width and height...? but that should be estimated
   * rather *after* rendering.
   */
  setVisualizationParametersFromNetworkGraphData(networkGraphData): void {
    // TODO
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
        if (distance <= this.linkMaximumDistanceThreshold) {
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
      dbid: name,
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
        // The need to parse sigla out of the distanceMatrix pseudo-object shows
        // that the distance matrix should be refactored as a real object that carries
        // the IChant data as well as the distances themselves.
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

    // Note: so far, this does *NOT* take into account how much sources
    // overlap in repertory. If two sources share just one chant which is
    // extremely similar, it looks more similar than two sources which share
    // many chants but slightly different.

    return distanceMatrixSources;
  }

  /**
   * Renders the SVG of the NetworkGraph's data
   * @param type: 'chants' or 'manuscripts'
   */
  drawGraph(type: string): void {
    if (type !== 'chants' && type !== 'manuscripts') {
      return;
    }

    let data: NetworkGraphData;
    if (type === 'chants') {
      data = this.createDataFromDistanceMatrix(this.distanceMatrix);
    } else {
      data = this.createAggregatedData(this.distanceMatrix);
    }
    this.drawGraphFromData(type, data);
  }

  drawGraphFromData(type: string, data: NetworkGraphData): void {
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

    // append the svg object to the body of the page.
    // Note that this selects an element *outside* of the component's template.
    // It should be refactored.
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
        .style('stroke', '#444')
        .attr('stroke-width', d => d.value * (1 / this.linkStrengthCoefficient) * this.linkBaseThickness)
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
    const node = svg
      .selectAll('circle')
      .data(data.nodes)
      .enter()
      .append('circle')
        .attr('r', this.nodeRadius)
        .style('fill', d => this.colorScheme.get(d.group))
        .on('mousedown', (event, d) => {
          this.nodeLabel
              .transition()
              .duration(200)
              .style('opacity', .9);
          this.nodeLabel
              .html(this.createNodeLabelFromNodeId(d.id))
              .style('left', (event.pageX + 10) + 'px')
              .style('top', (event.pageY + 10) + 'px');
          })
        .on('mouseup', (d) => {
          this.nodeLabel
              .transition()
              .duration(500)
              .style('opacity', 0);
          })
        .on('dblclick', (event, d) => {
          window.open('/chants/' + d.dbid);
          });

    // Apply force
    const simulation = d3.forceSimulation(data.nodes as any)
        .force('link', d3.forceLink()                               // pushes linked nodes together, according to a link distance
              .id(d => d.id)
              .links(data.links)
        )
        .force('charge', d3.forceManyBody().strength(this.forceChargeStrength))  // apply general repulsion between nodes
        .force('center', d3.forceCenter(width / 2, height / 2))     // attracts every node to a specific position
        .force('collide', d3.forceCollide().radius(this.nodeCollideRadius).iterations(1))
        .on('end', ticked);

    // Function updating the nodes' position
    function ticked(): void {
      link
          .attr('x1', d => d.source.x)
          .attr('y1', d => d.source.y)
          .attr('x2', d => d.target.x)
          .attr('y2', d => d.target.y);

      node
          .attr('cx', d => d.x + 2)
          .attr('cy', d => d.y - 2);
    }

  }

  createNodeLabelFromNodeId(nodeId: string): string {
    const chant = this.chants.get(nodeId);
    let label = chant.incipit + ' / ' + chant.siglum + ' / ' + chant.folio + '<br>';
    if (chant.cantus_id) {
      label = label + 'cID: ' + chant.cantus_id + ' / ';
    }
    label = label + chant.genre_id + ' / ' + chant.feast_id;
    return label;
  }
}
