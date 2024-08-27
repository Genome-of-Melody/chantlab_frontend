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

  get phylogeneticTree(): string {
    const tree = this.storage.getItem('phylogeneticTree');
    if (tree === "undefined" || tree === undefined){ return undefined;}
    if (tree === "null" || tree === null){ return null;}
    return tree;
  }

  set phylogeneticTree(tree: string){
    this.storage.setItem('phylogeneticTree', tree);
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
