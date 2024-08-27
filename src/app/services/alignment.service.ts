import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {IChant} from '../interfaces/chant.interface';
import { Alignment, AlignmentResponse } from '../models/alignment';

@Injectable({
  providedIn: 'root'
})
export class AlignmentService {

  constructor() { }

  private readonly _ids = new BehaviorSubject<number[]>(null);
  private _mode: string = null;
  private storage = window.localStorage;

  get idsToAlign(): number[] {
    const storedIds = this.storage.getItem('idsToAlign');
    if (null === storedIds) {
      return [];
    }
    else {
      return JSON.parse(storedIds);
    }
  }

  set idsToAlign(ids: number[]) {
    this.storage.setItem('idsToAlign', JSON.stringify(ids));
  }

  get chantsToAlign(): IChant[] {
    const storedChants = this.storage.getItem('chantsToAlign');
    if (storedChants === null) { return []; }
    return JSON.parse(storedChants);
  }

  set chantsToAlign(chants: IChant[]) {
    this.storage.setItem('chantsToAlign', JSON.stringify(chants));
  }


  get alignment(): Alignment {
    const alignment = this.storage.getItem('alignment');
    if (alignment === null || alignment === undefined || alignment === "undefined") { return undefined; }
    return Alignment.fromJson(JSON.parse(alignment));
  }

  set alignment(alignment: Alignment) {
    if (alignment === undefined || alignment === null) {
      this.storage.setItem('alignment', JSON.stringify(alignment));
    } else {
      this.storage.setItem('alignment', alignment.toJson());
    }
  }
  
  getMode(): string {
    const storedMode = this.storage.getItem('alignmentMode');
    if (null === storedMode) {
      return 'full';
    }
    else {
      return storedMode;
    }
  }

  setMode(mode: string): number {
    if (mode !== 'full' && mode !== 'syllables' && mode !== 'intervals') {
      return 1;
    }

    this.storage.setItem('alignmentMode', mode);
    this._mode = mode;
    return 0;
  }
}
