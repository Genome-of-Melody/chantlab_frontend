import { Injectable } from '@angular/core';
import {DistanceService} from './distance.service';
import {SettingsService} from './settings.service';
import {Alignment} from '../models/alignment';


export class ContrafactSet {
  constructor(
    public alignment: Alignment,
    public tightness: number
  ) {}
}

/**
 * This service provides functionality related to contrafact discovery.
 * The main API is its discover() method, which takes an Alignment object
 * and outputs list of sets of chants that are, in its opinion, contrafacts.
 */
@Injectable({
  providedIn: 'root'
})
export class ContrafactService {

  public readonly contrafactDistanceLimit: number = 0.35;

  constructor(
    private distanceService: DistanceService,
    private settingsService: SettingsService
  ) { }

  discover(alignment: Alignment, distanceMap?: Map<string, Map<string, number>>): ContrafactSet {
    console.log('ContrafactService.discover() called');
    let output: ContrafactSet;

    if (!distanceMap) {
      distanceMap = this.computeDistanceMap(alignment);
    }

    // Find subsets that are close together.
    // For now we just lump everything into one set.
    let tightness = 0.0;
    const contrafactCandidatePairs: string[][] = [];
    const contrafactCandidateNames: string[] = [];
    for (const name1 of distanceMap.keys()) {
      for (const name2 of distanceMap.get(name1).keys()) {
        if (name1 === name2) { continue; }
        const distance: number = distanceMap.get(name1).get(name2);
        console.log('Checking if ' + name1 + ' and ' + name2 + ' are contrafacts: distance ' + distance);
        if (distance <= this.contrafactDistanceLimit) {
          console.log(' ...distance low enough, checking cantus ID diff.');
          // Find aligned IChants by URL
          const idx1 = alignment.urls.findIndex(url => (url === name1));
          const cantusID1 = alignment.iChants[idx1].cantus_id;
          const idx2 = alignment.urls.findIndex(url => (url === name2));
          const cantusID2 = alignment.iChants[idx2].cantus_id;
          if (cantusID1 === cantusID2) {
            console.log('  ...not contrafacts: same cantus ID: ' + cantusID1);
            continue;
          }
          console.log('   ...cantus IDs different, found contrafact!');
          contrafactCandidatePairs.push([name1, name2]);
          contrafactCandidateNames.push(name1);
          contrafactCandidateNames.push(name2);
          if (distance > tightness) {
            tightness = distance;
          }
        }
      }
    }

    // Select the subset of the alignment that are contrafacts
    const contrafactCandidateNameSet = new Set<string>(contrafactCandidateNames);
    const contrafactCandidateIdxs: number[] = [];
    for (let i = 0; i < alignment.urls.length; i++) {
      if (contrafactCandidateNameSet.has(alignment.urls[i])) {
        contrafactCandidateIdxs.push(i);
      }
    }

    console.log('Contrafact candidate name set: ');
    console.log(contrafactCandidateNameSet);

    const outputAlignment = alignment.selectSubset(contrafactCandidateIdxs);
    output = new ContrafactSet(outputAlignment, tightness);

    return output;
  }

  computeDistanceMap(alignment: Alignment): Map<string, Map<string, number>> {
    return this.distanceService.alignedAllDistancesFromSettings(
      alignment.alpianos,
      alignment.urls,
      this.settingsService.alignmentSettingsService
    );
  }

}
