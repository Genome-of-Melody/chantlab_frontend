/**
 * Data model for a set of aligned sequences.
 * Currently a Plain Old Data class, but will be gradually extended with
 * methods.
 */
import {IChant} from '../interfaces/chant.interface';
import {GAP} from './alpiano';

export class Alignment {

  // chants: Array<Array<{text: string, type: string, volpiano: Array<string>}>> = [];
  // Chants are a member of the Alignment at least for now, because they contain
  // "the" parse of the alpiano strings into syllables and words.

  // alpianos: Array<string> = [];

  // newickNamesDict is the mapping of names in the Newick tree to IChant IDs.
  // The phylo tree in Newick format does not allow whitespace in node names,
  // but at the same time, it must contain meaningful names for display, and these
  // names can only be substituted into the Newick string on the server side.
  // Hence, a separate mapping must arrive from the server that then enables
  // matching tree nodes to actual ICHant objects, in order to make the view
  // more informative.
  constructor(
    public parsedChants: Array<Array<{text: string, type: string, volpiano: Array<string>}>>,
    public iChants: Array<IChant>,
    public alpianos: Array<string>,
    public ids: Array<number>,
    public urls: Array<string>,
    public sources: Array<string>,
    public guideTree: string,
    public newickNamesDict: Map<string, string>,
    public alignmentMode: string
  ) {}


  static fromResponse(response: any): Alignment {
    return new Alignment(
      response.chants,
      response.iChants,
      response.success.volpianos,
      response.success.ids,
      response.success.urls,
      response.success.sources,
      response.guideTree,
      response.newickNamesDict,
      response.alignmentMode);
  }

  static fromJson(json: any): Alignment {
    return new Alignment(
      json.parsedChants,
      json.iChants,
      json.alpianos,
      json.ids,
      json.urls,
      json.sources,
      json.guideTree,
      json.newickNamesDict,
      json.alignmentMode
    );
  }

  toJson(): string {
    return JSON.stringify({
      "parsedChants": this.parsedChants,
      "iChants": this.iChants,
      "alpianos": this.alpianos,
      "ids": this.ids,
      "urls": this.urls,
      "sources": this.sources,
      "guideTree": this.guideTree,
      "newickNamesDict": this.newickNamesDict,
      "alignmentMode": this.alignmentMode
    });
  }

  get length(): number {
    return this.alpianos.length;
  }

  get nPositions(): number {
    return this.alpianos[0].length;
  }

  isEmpty(): boolean {
    return (this.alpianos.length > 0);
  }

  /**
   * Check that all alpianos have the same length. This is a basic requirement
   * for a set of alpianos to be a valid alignment.
   * @private
   */
  private _areConsistentNPositions(): boolean {
    if (this.isEmpty()) { return true; }
    if (this.length === 1) { return true; }
    const n = this.alpianos[0].length;
    for (const a of this.alpianos) {
      if (a.length !== n) { return false; }
    }
    return true;
  }

  clone(): Alignment {
    return Alignment.fromJson(JSON.stringify(this));
  }

  removeItem(idx: number): void {
    if (idx > this.nPositions) {
      console.warn('Alignment: trying to remove item ' + idx + ', but alignment has only ' + this.nPositions + ' positions.');
      return;
    }
    this.parsedChants = this.parsedChants.splice(idx, 1);
    this.iChants = this.iChants.splice(idx, 1);
    this.alpianos = this.alpianos.splice(idx, 0);
    this.ids = this.ids.splice(idx, 0);
    this.urls = this.urls.splice(idx, 0);
    this.sources = this.sources.splice(idx, 0);
  }

  selectSubset(idxs: number[]): Alignment {
    const parsedChants: Array<Array<{text: string, type: string, volpiano: Array<string>}>> = [];
    const iChants: Array<IChant> = [];
    const alpianos: Array<string> = [];
    const ids: Array<number> = [];
    const urls: Array<string> = [];
    const sources: Array<string> = [];

    for (const idx of idxs) {
      parsedChants.push(this.parsedChants[idx]);
      iChants.push(this.iChants[idx]);
      alpianos.push(this.alpianos[idx]);
      ids.push(this.ids[idx]);
      urls.push(this.urls[idx]);
      sources.push(this.sources[idx]);
    }

    // The guide tree is not valid after selecting a subset, so it does not get passed.
    return new Alignment(parsedChants, iChants, alpianos, ids, urls, sources, null, this.newickNamesDict, this.alignmentMode);
  }

  /**
   * Processes the alpiano strings and removes all positions where there is a gap in
   * all alpianos. This would typically be done after creating an alignment as a subset
   * of another.
   *
   * Note that this is a one-way process -- no record is kept of the deleted positions.
   */
  reduceGaps(): void {
    const gapPositions: number[] = [];
    if (!this._areConsistentNPositions()) {
      console.warn('Trying to reduce gaps in an Alignment that ' +
        'does not have a consistent number of positions.');
      return;
    }

    // Find positions where all alpianos have a gap.
    let isGap = true;
    for (let position = 0; position < this.nPositions; position++) {
      for (const al of this.alpianos) {
        // If one alpiano has no gap in that position, we don't have to check the others.
        if (al[position] !== GAP) {
          isGap = false;
          break;
        }
      }
      if (isGap) {
        gapPositions.push(position);
      }
    }

    if (gapPositions.length === 0) { return; }

    // Reformat data into splices: starts of gap intervals and their lengths.

    // Initialize with first gap start, so that first gap start is not a special case in the loop.
    const gapIntervalStarts: number[] = [gapPositions[0]];
    const gapIntervalLengths: number[] = [];

    let prevGapPosition = gapPositions[0];
    let currentGapLength = 1; // we are now in the "gap interval open" state, with the first gap position inserted.
    for (const currentGapPosition of gapPositions.slice(1)) { // Loop starts at 1, not 0, since first gap is certainly gap start.
      // If the current gap position is a skip:
      if (currentGapPosition !== prevGapPosition + 1) {
        // Finish previous gap interval. Its start has already been pushed, only the length needs to be pushed.
        gapIntervalLengths.push(currentGapLength);
        // Start a new gap interval at this position
        gapIntervalStarts.push(currentGapPosition);
        currentGapLength = 0;
      }
      currentGapLength++;
      prevGapPosition = currentGapPosition;
    }
    gapIntervalLengths.push(currentGapLength); // last gap interval needs to be finished.

    // Apply the splices.
    for (let gapIntervalIdx = 0; gapIntervalIdx < gapIntervalStarts.length; gapIntervalIdx++) {
      const gapIntervalStart = gapIntervalStarts[gapIntervalIdx];
      const gapIntervalEnd = gapIntervalStart + gapIntervalLengths[gapIntervalIdx];

      for (let aIdx = 0; aIdx < this.length; aIdx++) {
        const currentAlpiano = this.alpianos[aIdx];
        if (gapIntervalStart === 0) {
          const slicedAlpiano = currentAlpiano.slice(Math.min(gapIntervalEnd, currentAlpiano.length));
          this.alpianos[aIdx] = slicedAlpiano;
        }
        if (gapIntervalEnd >= currentAlpiano.length) {
          const slicedAlpiano = currentAlpiano.slice(0, Math.max(0, gapIntervalStart - 1));
          this.alpianos[aIdx] = slicedAlpiano;
        } else {
          const slicedAlpiano = currentAlpiano.slice(0, Math.max(0, gapIntervalStart - 1)) +
            currentAlpiano.slice(Math.min(gapIntervalEnd, currentAlpiano.length));
          this.alpianos[aIdx] = slicedAlpiano;
        }
      }
    }
  }
}

/**
 * Used in AlignedComponent to process the result of the alignment
 * API call.
 */
export class AlignmentResponse {
  constructor(
    public chants: Array<Array<{text: string, type: string, volpiano: Array<string>}>>,
    public errorShortNames: Array<string>,
    public errorIds: Array<number>,
    public alignment: Alignment
  ) {}
}
