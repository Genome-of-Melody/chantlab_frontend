import { Injectable } from '@angular/core';
import {isEffectiveChar, isNoteChar} from '../models/alpiano';
import {AlignmentSettingsService} from './settings.service';

@Injectable({
  providedIn: 'root'
})
export class DistanceService {
  // This service computes the edit distances between pairs
  // and groups of aligned sequences.

  constructor() { }

  alignedPairwiseNPositionsDifferent(alpiano1: string, alpiano2: string, options: {}): number {
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
      throw new Error(`Pairwise distance: Aligned volpiano lengths do not match!  ${alpiano1.length} vs. ${alpiano2.length}`);
    }

    if ((alpiano1.length === 0) || (alpiano2.length === 0)) {
      // Distance is not defined for empty sequences.
      return undefined;
    }

    let nPositionsDifferent = 0;
    for (let i = 0; i < alpiano1.length; i++) {
      if (alpiano1[i] !== alpiano2[i]) { nPositionsDifferent += 1; }
    }
    return nPositionsDifferent;
  }

  alignedPairwiseRelativePositionsDifferent(
    alpiano1: string,
    alpiano2: string,
    options: {useEffectiveAlignedLength: true,
              onlyCountNotes: false}
  ): number {
    // This function computes the pairwise distance relative to the lengths
    // of the individual strings. That is: in what percentage of i's positions is
    // i different from j?
    //
    // In order to normalize the distance so that the maximum is 1, highly similar
    // pairs of short sequences are not penalized by the presence of longer sequences
    // in the alignment and vice versa, we use "effective aligned length": that is,
    // the number of positions in which at least one of the sequences has an effective
    // (that is, non-gap) character.
    if (alpiano1.length !== alpiano2.length) {
      throw new Error(`Pairwise distance: Aligned volpiano lengths do not match!  ${alpiano1.length} vs. ${alpiano2.length}`);
    }

    if ((alpiano1.length === 0) || (alpiano2.length === 0)) {
      // Distance is not defined for empty sequences.
      return undefined;
    }
    let nPositionsDifferent = 0;
    let effectiveAlignedLength = 0;
    // let effectiveLength2 = 0; // Only have to compute effective length for alpiano1 -- assymetrical!
    for (let i = 0; i < alpiano1.length; i++) {
      if (options.onlyCountNotes) {
        if (!(isNoteChar(alpiano1[i]) || isNoteChar(alpiano2[i]))) {
          continue;
        }
      }
      if (isEffectiveChar(alpiano1[i]) || isEffectiveChar(alpiano2[i])) { effectiveAlignedLength += 1; }
      // if (isEffectiveChar(alpiano2[i])) { effectiveLength2 += 1; }
      if (alpiano1[i] !== alpiano2[i]) {
        nPositionsDifferent += 1;
      }
    }
    if (options.useEffectiveAlignedLength) {
      return (nPositionsDifferent / effectiveAlignedLength);
    } else {
      return (nPositionsDifferent / alpiano1.length);
    }
  }

  alignedAllDistances(alpianos: string[], names: string[],
                      assumeSymmetry: boolean = true,
                      pairwiseDistance?: (a1: string, a2: string, options: object) => number,
                      pairwiseDistanceOptions?: object,
                      ): Map<string, Map<string, number>> {
    // Computes the pairwise (absolute) distances between all pairs of the provided
    // aligned volpianos. The names of alpiano items have to be given in order to create
    // the output data structure: a dictionary of dictionaries, indexed by first & second sequence
    // name.
    //
    // Pass a callback to compute the pairwise distances.
    // By default, uses the alignedPairwiseNPositionsDifferent function as the distance.
    if (alpianos.length !== names.length) {
      throw new Error('All distances: must get same number of alpianos and their names.');
    }

    if (alpianos.length === 0) {
      // Distance matrix not defined.
      return undefined;
    }

    if (pairwiseDistance === undefined) {
      pairwiseDistance = this.alignedPairwiseNPositionsDifferent;
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
      if (assumeSymmetry) {

        // If symmetric, iterate from j > i and use i and j interchangeably.
        for (let j = i + 1; j < names.length; j++) {
          // This is the potentially time-consuming step.
          const distance = pairwiseDistance(alpianos[i], alpianos[j], pairwiseDistanceOptions);

          allDistances.get(names[i]).set(names[j], distance);
          // Assumes the distance matrix is symmetrical.
          allDistances.get(names[j]).set(names[i], distance);
        }

      } else {

        // If not symmetric, iterate from j = 0 (so each pair is seen both as i,j and j,i).
        // The distance is then assumed *from* i *to* j.
        for (let j = 0; j < names.length; j++) {
          const distance = pairwiseDistance(alpianos[i], alpianos[j], pairwiseDistanceOptions);
          allDistances.get(names[i]).set(names[j], distance);
        }

      }
    }

    return allDistances;
  }

  distancesToMatrix(allDistances: Map<string, Map<string, number>>, names: string[]): number[][] {
    // In the end, we might not be using this number[][] representation much.
    if (allDistances.size !== names.length) {
      throw Error('Distances map must have same dimensionality as the number of names!');
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

  /**
   * Selects the right pairwise alignment function based on the AlignmentSettingsService.
   * This centralizes how the settings are interpreted at the point where they need
   * to be interpreted for various consumers of the service, instead of implementing this
   * in each of the consumers (e.g., AlignedComponent, ContrafactService).
   */
  alignedAllDistancesFromSettings(alpianos: string[],
                                  names: string[],
                                  settings: AlignmentSettingsService): Map<string, Map<string, number>> {

    let pairwiseDistanceFunction = this.alignedPairwiseRelativePositionsDifferent;
    const pairwiseDistanceOptions = {
      useEffectiveAlignedLength: true,
      onlyCountNotes: false,
    };
    if (settings.distanceMatrixUseAbsoluteDistances) {
      pairwiseDistanceFunction = this.alignedPairwiseNPositionsDifferent;
    }

    const distanceMap = this.alignedAllDistances(
      alpianos,
      names,
      false,
      pairwiseDistanceFunction,
      pairwiseDistanceOptions
    );

    return distanceMap;
  }


}
