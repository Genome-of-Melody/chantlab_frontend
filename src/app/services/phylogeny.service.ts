import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {IChant} from '../interfaces/chant.interface';
import { Alignment, AlignmentResponse } from '../models/alignment';

@Injectable({
  providedIn: 'root'
})
export class PhylogenyService {

  constructor() { }

  private readonly _ids = new BehaviorSubject<number[]>(null);
  private _mode: string = null;
  private storage = window.localStorage;

  get newick(): string {
    const tree = this.storage.getItem('phylogeny_newick');
    if (tree === "undefined" || tree === undefined){ return undefined;}
    if (tree === "null" || tree === null){ return null;}
    return tree;
  }

  set newick(tree: string){
    this.storage.setItem('phylogeny_newick', tree);
  }

  get mrBayesScript(): string {
    const tree = this.storage.getItem('phylogeny_MrBayesScript');
    if (tree === "undefined" || tree === undefined){ return undefined;}
    if (tree === "null" || tree === null){ return null;}
    return tree;
  }

  set mrBayesScript(tree: string){
    this.storage.setItem('phylogeny_MrBayesScript', tree);
  }

  get nexusAlignment(): string {
    const tree = this.storage.getItem('phylogeny_nexusAlignment');
    if (tree === "undefined" || tree === undefined){ return undefined;}
    if (tree === "null" || tree === null){ return null;}
    return tree;
  }

  set nexusAlignment(tree: string){
    this.storage.setItem('phylogeny_nexusAlignment', tree);
  }

  get nexusConTre(): string {
    const tree = this.storage.getItem('phylogeny_nexusConTre');
    if (tree === "undefined" || tree === undefined){ return undefined;}
    if (tree === "null" || tree === null){ return null;}
    return tree;
  }

  set nexusConTre(tree: string){
    this.storage.setItem('phylogeny_nexusConTre', tree);
  }

  get alignmentForPhylogeny(): Alignment {
    const alignment = this.storage.getItem('phylogeny_alignmentForPhylogeny');
    if (alignment === null || alignment === undefined || alignment === "undefined") { return undefined; }
    return Alignment.fromJson(JSON.parse(alignment));
  }

  set alignmentForPhylogeny(alignment: Alignment){
    if (alignment === undefined || alignment === null) {
        this.storage.setItem('phylogeny_alignmentForPhylogeny', JSON.stringify(alignment));
      } else {
        this.storage.setItem('phylogeny_alignmentForPhylogeny', alignment.toJson());
      }
  }

  get sequenceNames(): string[] {
    const sequenceNames = this.storage.getItem('phylogeny_sequenceNames');
    if (sequenceNames === null || sequenceNames === undefined || sequenceNames === "undefined") { return undefined; }
    return JSON.parse(sequenceNames);
  }

  set sequenceNames(sequenceNames: string[]){
    this.storage.setItem('phylogeny_sequenceNames', JSON.stringify(sequenceNames));
  }
}
