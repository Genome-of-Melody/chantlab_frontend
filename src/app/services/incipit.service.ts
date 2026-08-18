import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IncipitService {

  private _incipit = new BehaviorSubject<string>("");

  constructor() { }

  getIncipit(): BehaviorSubject<string> {
    return this._incipit;
  }

  setIncipit(value: string | undefined): void {
    const next = value ?? '';
    if (this._incipit.value === next) {
      return;
    }
    this._incipit.next(next);
  }
}
