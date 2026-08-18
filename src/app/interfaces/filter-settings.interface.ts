export interface IFilterSettings {
  // null means "do not filter this dimension" (all options selected).
  // An empty array means "match nothing".
  genres: string[] | null;
  offices: string[] | null;
  fontes: string[] | null;
  hideIncomplete: boolean;
  hideChantsWithoutVolpiano: boolean;
}
