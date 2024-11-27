
export const GAP = '-';
export const CHANT_SEPARATOR = '#';
export const SYLLABLE_BOUNDARY = '|';
export const WORD_BOUNDARY = '~';
export const CLEF = '1';
export const BARLINE = '3';
export const DOUBLE_BARLINE = '4';
export const BREATH_MARK = '7';

export const ineffectiveChars = new Set([
  GAP, CLEF, BREATH_MARK, BARLINE, DOUBLE_BARLINE, CHANT_SEPARATOR
]);
export const nonNoteChars = new Set([
  GAP, SYLLABLE_BOUNDARY, WORD_BOUNDARY,
  CLEF, BARLINE, DOUBLE_BARLINE, BREATH_MARK, CHANT_SEPARATOR
]);


export function isEffectiveChar(char: string): boolean {
  return (!ineffectiveChars.has(char));
}

export function isNoteChar(char: string): boolean {
  return (!nonNoteChars.has(char));
}
