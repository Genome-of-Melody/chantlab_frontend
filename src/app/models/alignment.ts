/**
 * Data model for a set of aligned sequences.
 * Currently a Plain Old Data class, but will be gradually extended with
 * methods.
 */
export class Alignment {

  // chants: Array<Array<{text: string, type: string, volpiano: Array<string>}>> = [];
  // Chants are a member of the Alignment at least for now, because they contain
  // "the" parse of the alpiano strings into syllables and words.

  // alpianos: Array<string> = [];

  constructor(
    public chants: Array<Array<{text: string, type: string, volpiano: Array<string>}>>,
    public alpianos: Array<string>,
    public ids: Array<number>,
    public urls: Array<string>,
    public sources: Array<string>
  ) {}

  static fromResponse(response: any): Alignment {
    return new Alignment(
      response.chants,
      response.success.volpianos,
      response.success.ids,
      response.success.urls,
      response.success.sources);
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
