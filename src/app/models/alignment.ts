/**
 * Data model for a set of aligned sequences.
 * Currently a Plain Old Data class, but will be gradually extended with
 * methods.
 */
import {IChant} from '../interfaces/chant.interface';

export class Alignment {

  // chants: Array<Array<{text: string, type: string, volpiano: Array<string>}>> = [];
  // Chants are a member of the Alignment at least for now, because they contain
  // "the" parse of the alpiano strings into syllables and words.

  // alpianos: Array<string> = [];

  constructor(
    public parsedChants: Array<Array<{text: string, type: string, volpiano: Array<string>}>>,
    public iChants: Array<IChant>,
    public alpianos: Array<string>,
    public ids: Array<number>,
    public urls: Array<string>,
    public sources: Array<string>
  ) {}

  static fromResponse(response: any): Alignment {
    return new Alignment(
      response.chants,
      response.iChants,
      response.success.volpianos,
      response.success.ids,
      response.success.urls,
      response.success.sources);
  }

  static fromJson(json: any): Alignment {
    return new Alignment(
      json.parsedChants,
      json.iChants,
      json.alpianos,
      json.ids,
      json.urls,
      json.sources
    );
  }

  get length(): number {
    return this.ids.length;
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

    return new Alignment(parsedChants, iChants, alpianos, ids, urls, sources);
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
    public alignment: Alignment
  ) {}
}
