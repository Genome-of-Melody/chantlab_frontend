import { Injectable } from '@angular/core';
import {AssertionError} from 'assert';

@Injectable({
  providedIn: 'root'
})
export class DistanceService {
  // This service computes the edit distances between pairs
  // and groups of aligned sequences.

  constructor() { }

  alignedPairwiseDistance(alpiano1: string, alpiano2: string): number {
    // The pairwise distance between two aligned Volpiano strings is simply
    // the number of positions in which they differ.
    //
    // Note that in order to get the *proportion* of positions in which they differ,
    // gaps and perhaps other irrelevant characters need to be discounted. Also,
    // since after dicsounting gaps the sequences might not have the same length,
    // relative distance might not be the same from A to B as from B to A.
    // This, however, will be resolved in another method. This method only
    // computes the absolute distance between two aligned volpianos.
    if (alpiano1.length !== alpiano2.length) {
      throw new AssertionError({message: `Pairwise distance: Aligned volpiano lengths do not match!  ${alpiano1.length} vs. ${alpiano2.length}`});
    }

    if (alpiano1.length === 0) {
      // Distance is not defined for empty sequences.
      return undefined;
    }

    let nPositionsDifferent = 0;
    for (let i = 0; i < alpiano1.length; i++) {
      if (alpiano1[i] !== alpiano2[i]) { nPositionsDifferent += 1; }
    }
    return nPositionsDifferent;
  }

  alignedAllDistances(alpianos: string[], names: string[]): Map<string, Map<string, number>> {
    // Computes the pairwise (absolute) distances between all pairs of the provided
    // aligned volpianos. The names of alpiano items have to be given in order to create
    // the output data structure: a dictionary of dictionaries, indexed by first & second sequence
    // name.
    if (alpianos.length !== names.length) {
      throw new AssertionError({message: 'All distances: must get same number of alpianos and their names.'});
    }

    if (alpianos.length === 0) {
      // Distance matrix not defined.
      return undefined;
    }

    // Prepare output structure: initialize with zeroes.
    // The diagonal of the distances matrix will stay zero
    // (no distance from sequence to itself)
    const allDistances = new Map<string, Map<string, number>>();
    for (const name1 of names) {
      allDistances.set(name1, new Map<string, number>());
      for (const name2 of names) {
        allDistances.get(name1).set(name2, 0);
      }
    }

    for (let i = 0; i < names.length; i++) {
      for (let j = i + 1; j < names.length; j++) {
        // This is the potentially time-consuming step.
        const distance = this.alignedPairwiseDistance(alpianos[i], alpianos[j]);

        allDistances.get(names[i]).set(names[j], distance);
        // Assumes the distance matrix is symmetrical.
        allDistances.get(names[j]).set(names[i], distance);
      }
    }

    return allDistances;
  }

  distancesToMatrix(allDistances: Map<string, Map<string, number>>, names: string[]): number[][] {
    if (allDistances.size !== names.length) {
      throw AssertionError({message: 'Distances map must have same dimensionality as the number of names!'});
    }
    const distanceMatrix = [];
    for (const name1 of names) {
      const distanceVector = [];
      for (const name2 of names) {
        distanceVector.push(allDistances.get(name1).get(name2));
      }
      distanceMatrix.push(distanceVector);
    }
    return distanceMatrix;
  }


}
