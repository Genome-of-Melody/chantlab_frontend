import { Injectable } from '@angular/core';
import {IChant} from '../interfaces/chant.interface';

import {parse, Vertex } from 'newick-js';
// import {hasOwnProperty} from 'tslint/lib/utils';
// import getOwnPropertyDescriptor = Reflect.getOwnPropertyDescriptor;

@Injectable({
  providedIn: 'root'
})
export class PhyloService {

  constructor() { }

  /**
   * Parses the node names that the server sends in the Newick string back
   * into incipit and siglum, so that the tree node can be matched against
   * a chant.
   *
   * This is a relatively stupid solution. A smarter one would be to carry
   * the mapping between chants and newick node names in the server response.
   */
  getFieldsFromPhyloChantName(name: string): Array<string> {

    return [];
  }

  /**
   * Parses the from and to years form a century code.
   *
   * @param centuryCode Cantus Corpus century code: century_1300_1399 etc.
   */
  parseCenturyCode(centuryCode: string): [number, number] {
    const centuryElements = centuryCode.split('_');
    const from = Number(centuryElements[1]);
    const to = Number(centuryElements[2]);
    return [from, to];
  }

  /**
   * Parses out the Newick node name from label (which has the 1__, 2__, etc.
   * ordering from MAFFT guide tree computation). Returns incipit__siglum.
   *
   * @param newickLabel String with format X__incipit__siglum.
   */
  newickNodeNameFromNewickLabel(newickLabel: string): string {
    const elements = newickLabel.split('__');
    const newickName = elements.slice(1).join('__');
    return newickName;
  }

  /**
   * Compute the proportion of tree nodes such that the subtrees
   * have century intervals that do not intersect.
   */
  computeOrderedCenturiesProportion(treeString: string,
                                    newickNamesDict: Map<string, number>,
                                    chants: Array<IChant>): number {

    const chantMap: Map<number, IChant> = new Map<number, IChant>();
    for (const chant of chants) {
      chantMap[chant.id] = chant;
    }

    const tree = parse(treeString);
    const vertices = tree.graph[0];
    const arcs = tree.graph[1];

    function _children(vertex): Array<Vertex> {
      const children: Array<Vertex> = [];
      for (const arc of arcs.values()) {
        if (arc[0] === vertex) {
          children.push(arc[1]);
        }
      }
      return children;
    }

    const _parseCenturyCode = this.parseCenturyCode;
    const _newickNodeNameFromNewickLabel = this.newickNodeNameFromNewickLabel;

    function _visit(vertex: Vertex): void {
      const children = _children(vertex);

      if (children.length === 0) {
        // Assume all leaf nodes are named. (They should be.)
        const newickName = _newickNodeNameFromNewickLabel(vertex.label);
        const chant: IChant = chantMap[newickNamesDict[newickName]];
        if (!chant) {
          console.log('No chant found for leaf node with label ' + vertex.label);
          console.log(chantMap);
          console.log(newickNamesDict);
          return;
        }
        const vertexInterval = _parseCenturyCode(chant.century_code);
        if (!vertexInterval) {
          console.log('Vertex ' + vertex.label + ' has no century code in chant:');
          console.log(chant);
        }
        Object.defineProperty(vertex, 'interval', vertexInterval);
        console.log('Adding interval to leaf vertex ' + vertex.label + ': ' + vertex['interval']);
        return;
      }

      // Post-order traversal: first we visit children.
      for (const child of children) {
        _visit(child);
      }

      let intervalMin = 100000;
      let intervalMax = 0;
      for (const child of children) {
        if (child.hasOwnProperty('interval')) {
          const childInterval = vertex['interval'];
          if (childInterval[0] < intervalMin) {
            intervalMin = childInterval[0];
          }
          if (childInterval[1] > intervalMax) {
            intervalMax = childInterval[1];
          }
        }
      }
      // This vertex interval...
      Object.defineProperty(vertex, 'interval', [intervalMin, intervalMax]);
      console.log('Adding interval to upstream vertex: ' + vertex['interval']);
      return;
    }

    // Populate tree bottom-up with intervals. This is a post-order DFS.
    // Assumes the tree is cycle-free.
    // To modify from tree to DAG, add a set of closed vertices.
    _visit(tree.root);

    // console.log(newickNamesDict);
    console.log('Computation finished');
    console.log(tree);
    return -1.0;
  }
}

