export type AlignmentExportFormat = 'pdf' | 'png' | 'jpeg';

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
