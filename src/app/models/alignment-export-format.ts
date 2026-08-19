export type AlignmentExportFormat = 'pdf' | 'png' | 'jpeg';
export type AlignmentSnapshotFormat = AlignmentExportFormat;

export function normalizeAlignmentSnapshotFormat(value: unknown): AlignmentSnapshotFormat {
  if (value === 'pdf' || value === 'jpeg' || value === 'jpg') {
    return value === 'jpg' ? 'jpeg' : value;
  }
  return 'png';
}

export const ALIGNMENT_EXPORT_MIME: Record<AlignmentExportFormat, string> = {
  pdf: 'application/pdf',
  png: 'image/png',
  jpeg: 'image/jpeg',
};

export const ALIGNMENT_EXPORT_EXTENSION: Record<AlignmentExportFormat, string> = {
  pdf: 'pdf',
  png: 'png',
  jpeg: 'jpg',
};
