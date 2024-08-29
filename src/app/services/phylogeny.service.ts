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
    const tree = this.storage.getItem('phylogenyNewick');
    if (tree === "undefined" || tree === undefined){ return undefined;}
    if (tree === "null" || tree === null){ return null;}
    return tree;
  }

  set newick(tree: string){
    this.storage.setItem('phylogenyNewick', tree);
  }

  get mrBayesScript(): string {
    const tree = this.storage.getItem('phylogenyMrBayesScript');
    if (tree === "undefined" || tree === undefined){ return undefined;}
    if (tree === "null" || tree === null){ return null;}
    return tree;
  }

  set mrBayesScript(tree: string){
    this.storage.setItem('phylogenyMrBayesScript', tree);
  }

  get nexusAlignment(): string {
    const tree = this.storage.getItem('phylogenyNexusAlignment');
    if (tree === "undefined" || tree === undefined){ return undefined;}
    if (tree === "null" || tree === null){ return null;}
    return tree;
  }

  set nexusAlignment(tree: string){
    this.storage.setItem('phylogenyNexusAlignment', tree);
  }

  get nexusConTre(): string {
    const tree = this.storage.getItem('phylogenyNexusConTre');
    if (tree === "undefined" || tree === undefined){ return undefined;}
    if (tree === "null" || tree === null){ return null;}
    return tree;
  }

  set nexusConTre(tree: string){
    this.storage.setItem('phylogenyNexusConTre', tree);
  }

  get alignmentForPhylogeny(): Alignment {
    const alignment = this.storage.getItem('alignmentForPhylogeny');
    if (alignment === null || alignment === undefined || alignment === "undefined") { return undefined; }
    return Alignment.fromJson(JSON.parse(alignment));
  }

  set alignmentForPhylogeny(alignment: Alignment){
    if (alignment === undefined || alignment === null) {
        this.storage.setItem('alignmentForPhylogeny', JSON.stringify(alignment));
      } else {
        this.storage.setItem('alignmentForPhylogeny', alignment.toJson());
      }
  }
}
