import { Injectable } from '@angular/core';
import {Alignment} from '../models/alignment';

@Injectable({
  providedIn: 'root'
})
export class AlignmentManagementService {
  private storage = window.localStorage;
  private alignmentStorageKey = '__alignment_storage__';

  public availableAlignments: Set<string>;

  private overwriteOnNameCollision = false;

  constructor() {
    this.availableAlignments = new Set<string>();
  }

  /**
   * Check whether an alignment under a given name is in the storage.
   * @param name Name of the alignment.
   */
  hasAlignment(name: string): boolean {
    return this.availableAlignments.has(name);
  }

  /**
   * Add the given Alignment to the storage, to be retrieved via
   * the given name. In case the name already exists, checks against
   * `overwriteNameOnCollision` property: if true, overwrites the
   * stored alignment, if false, does nothing.
   *
   * @param name        The name under which the given alignment should be accessible.
   * @param alignment   An Alignment object that should be stored.
   */
  storeAlignment(name: string, alignment: Alignment): void {
    if (this.availableAlignments.has(name)) {
      if (!this.overwriteOnNameCollision) {
        return;
      }
    }

    const internalAlignmentName = this.createInternalName(name);
    this.storage.setItem(internalAlignmentName, JSON.stringify(alignment));
    this.availableAlignments.add(name);
  }

  /**
   * Retrieves the alignment available under the given `name` from storage.
   * If no such alignment exists, returns `undefined`.
   *
   * @param name Name of an alignment.
   */
  retrieveAlignment(name: string): Alignment {
    if (!this.availableAlignments.has(name)) {
      return undefined;
    }

    const internalAlignmentName = this.createInternalName(name);
    const alignmentJson = this.storage.get(internalAlignmentName);
    const alignment = JSON.parse(alignmentJson);
    return alignment;
  }

  /**
   * Remove the alignment available under the given `name` from storage.
   * If no such alignment exists, does nothing.
   *
   * @param name Name of an alignment.
   */
  deleteAlignment(name: string): void {
    if (!this.availableAlignments.has(name)) {
      return;
    }
    const internalAlignmentName = this.createInternalName(name);
    this.storage.removeItem(internalAlignmentName);
    this.availableAlignments.delete(name);
  }

  /**
   * Builds the key used to access the storage in order to manipulate
   * an alignment that is exposed under the given `name`.
   *
   * @param name Name of an alignment. Does not have to exist yet.
   * @private
   */
  private createInternalName(name: string): string {
    return this.alignmentStorageKey + name;
  }

  /**
   * Returns how many alignments are currently available.
   */
  get nAlignmentsAvailable(): number {
    return this.availableAlignments.size;
  }
}
