import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DownloadService {

  constructor() { }

  download(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    anchor.rel = 'noopener';
    anchor.style.display = 'none';
    document.body.appendChild(anchor);
    anchor.click();

    // Keep the blob URL alive until the browser has started the download.
    window.setTimeout(() => {
      if (anchor.parentNode) {
        document.body.removeChild(anchor);
      }
      window.URL.revokeObjectURL(url);
    }, 60_000);
  }
}
