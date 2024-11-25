import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConservationProfileService {

  constructor() { }




  calculateConservationProfile(
    parsedChants: Array<Array<Array<{text: string, type: string, volpiano: Array<string>}>>>,
    alignmentPresent: boolean[]
  ): {
    conservationProfile: number[][][][],
    conservationOfSet: number
  } {
    if (parsedChants.length === 0) {
      return { conservationProfile: [], conservationOfSet: NaN};
    }

    const conservationProfile = [];
    let totalConservation = 0;
    let nonZeroConservations = 0;

    // create empty array for each chant
    for (let i = 0; i < parsedChants.length; i++) {
      conservationProfile.push([[[]]]);     // one word with one empty syllable
    }

    interface LookupTableEntry {
      wordIdx: number;
      sylIdx: number;
      localCharIdx: number;
    }
    
    const lookupTable: Record<string, LookupTableEntry> = {};
    
    parsedChants.forEach((chant, volpianoIdx) => {
      let charCounter = 0;
      chant.forEach((word, wordIdx) => {
        word.forEach((syllable, sylIdx) => {
          const syllableString = syllable.volpiano.join('');
          for (let localCharIdx = 0; localCharIdx < syllableString.length; localCharIdx++) {
            lookupTable[`${volpianoIdx},${charCounter}`] = {
              wordIdx,
              sylIdx,
              localCharIdx
            };
            charCounter++;
          }
        });
      });
    });


    const alpianos = parsedChants.map(chant =>
      chant.map(word =>
        word.map(syllable => {
          return syllable.volpiano.join('');
        }).join('')
      ).join('')
    );

    // loop over the volpianos and calculate the conservation value
    for (let pos = 0; pos < alpianos[0].length; pos++) {
      const charsInPosition = [];
      for (let volpianoIdx = 0; volpianoIdx < alpianos.length; volpianoIdx++) {
        if (alignmentPresent[volpianoIdx]) {
          charsInPosition.push(alpianos[volpianoIdx][pos]);
        }
      }
      const conservationInPosition = this.calculateConservationInPosition(charsInPosition);
      // append conservation value for current char
      // finish syllable if current char is '|'
      // finish word if current char is '~'
      for (let volpianoIdx = 0; volpianoIdx < alpianos.length; volpianoIdx++) {
        if (lookupTable[`${volpianoIdx},${pos}`].wordIdx >= conservationProfile[volpianoIdx].length) { 
          conservationProfile[volpianoIdx].push([[]]);
        }
        const lastWordIdx = conservationProfile[volpianoIdx].length - 1;
        
        if (lookupTable[`${volpianoIdx},${pos}`].sylIdx >= conservationProfile[volpianoIdx][lastWordIdx].length) { 
          conservationProfile[volpianoIdx][lastWordIdx].push([]);
        } 
        const lastSyllableIdx = conservationProfile[volpianoIdx][lastWordIdx].length - 1;

        conservationProfile[volpianoIdx][lastWordIdx][lastSyllableIdx].push(
          conservationInPosition[alpianos[volpianoIdx][pos]]
        );

        // if current symbol is a note, add it to total conservation
        const insignificantChars = ['-', '~', '|', '1', '3', '4', '7'];
        if (!insignificantChars.includes(alpianos[volpianoIdx][pos])) {
          totalConservation += conservationInPosition[alpianos[volpianoIdx][pos]];
          nonZeroConservations++;
        }
      }
    }

    const conservationOfSet = totalConservation / nonZeroConservations * alpianos.length;
    return {
      conservationProfile: conservationProfile,
      conservationOfSet: conservationOfSet
    };
  }

  private calculateConservationInPosition(chars: string[]): object {
    const charNumber = chars.length;
    const charCounts = {};

    // calculate the number of occurrences of each character
    chars.forEach(char => {
      if (char in charCounts) {
        charCounts[char] += 1;
      }
      else {
        charCounts[char] = 1;
      }
    });

    // calculate char value for each character
    const charLevels = {};
    const insignificantChars = ['-', '~', '|', '1', '3', '4', '7'];
    Object.keys(charCounts).forEach(key => {
      if (insignificantChars.includes(key)) {
        charLevels[key] = 0;
      }
      else {
        charLevels[key] = charCounts[key] / charNumber;
      }
    });

    return charLevels;
  }
}
