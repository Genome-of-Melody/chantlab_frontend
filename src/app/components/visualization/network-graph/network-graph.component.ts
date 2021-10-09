import { Component, Input, OnInit } from '@angular/core';

import * as d3 from 'd3';
import { SimulationLinkDatum, SimulationNodeDatum } from 'd3';

interface NetworkGraphData {
  "nodes": object[],
  "links": SimulationLinkDatum<SimulationNodeDatum>[]
}

@Component({
  selector: 'app-network-graph',
  templateUrl: './network-graph.component.html',
  styleUrls: ['./network-graph.component.css']
})
export class NetworkGraphComponent implements OnInit {

  @Input() distanceMatrix: Map<string, Map<string, number>>;
  @Input() distanceThreshold: number = 0.7;

  constructor() { }

  ngOnInit(): void {
    this.drawGraph();
  }

  createDataFromDistanceMatrix(distanceMatrix: Map<string, Map<string, number>>): NetworkGraphData {
    let networkGraphData: NetworkGraphData = {
      "nodes": [],
      "links": []
    };

    if (!distanceMatrix) {
      return networkGraphData;
    }

    // Define ID of each chant name
    let nameIdCorrespondence = new Map<string, number>();
    let i = 0;
    distanceMatrix.forEach((_, key: string) => {
      nameIdCorrespondence.set(key, i);
      i++;
    });

    // Retrieve the list of links
    let links: SimulationLinkDatum<SimulationNodeDatum>[] = [];
    let usedLinks = new Set<string>();

    distanceMatrix.forEach((distanceMap: Map<string, number>, name1: string) => {
      distanceMap.forEach((distance: number, name2: string) => {
        // Only consider links with a low enough distance
        if (distance <= this.distanceThreshold) {
          const id1 = nameIdCorrespondence.get(name1);
          const id2 = nameIdCorrespondence.get(name2);
          // Only add link if the two chants are different
          // Check whether the reverse link is already in the set
          if (id1 !== id2 &&
              !usedLinks.has(id2.toString() + "|" + id1.toString())) {
            links.push({"source": id1, "target": id2})
            usedLinks.add(id1.toString() + "|" + id2.toString());
          }
        }
      });
    });

    // Set the correct return values
    nameIdCorrespondence.forEach((value: number, key: string) => {
      networkGraphData.nodes.push({"id": value, "name": key});
    });
    networkGraphData.links = links;

    console.log(networkGraphData);
    return networkGraphData;
  }

  drawGraph(): void {
    // set the dimensions and margins of the graph
    var margin = {top: 10, right: 30, bottom: 30, left: 40},
    width = 2000 - margin.left - margin.right,
    height = 1000 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select(".network-graph")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");


    let data: NetworkGraphData = this.createDataFromDistanceMatrix(this.distanceMatrix);

    // Initialize the links
    var link = svg
      .selectAll("line")
      .data(data.links)
      .enter()
      .append("line")
        .style("stroke", "#aaa")

    // Initialize the nodes
    var node = svg
      .selectAll("circle")
      .data(data.nodes)
      .enter()
      .append("circle")
        .attr("r", 10)
        .style("fill", "#69b3a2")

    // Let's list the force we wanna apply on the network
    var simulation = d3.forceSimulation(data.nodes)                 // Force algorithm is applied to data.nodes
        .force("link", d3.forceLink()                               // This force provides links between nodes
              .id(function(d: any) { return d.id; })                     // This provide  the id of a node
              .links(data.links)                                    // and this the list of links
        )
        .force("charge", d3.forceManyBody().strength(-400))         // This adds repulsion between nodes. Play with the -400 for the repulsion strength
        .force("center", d3.forceCenter(width / 2, height / 2))     // This force attracts nodes to the center of the svg area
        .on("end", ticked);

    // This function is run at each iteration of the force algorithm, updating the nodes position.
    function ticked() {
      link
          .attr("x1", function(d: any) { return d.source.x; })
          .attr("y1", function(d: any) { return d.source.y; })
          .attr("x2", function(d: any) { return d.target.x; })
          .attr("y2", function(d: any) { return d.target.y; });

      node
          .attr("cx", function (d: any) { return d.x+6; })
          .attr("cy", function(d: any) { return d.y-6; });
    }
  }

}
