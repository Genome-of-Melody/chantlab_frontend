import { Injectable } from '@angular/core';
import { PDFDocument } from 'pdf-lib';
import {
  AlignmentExportFormat,
  ALIGNMENT_EXPORT_MIME,
} from '../models/alignment-export-format';

interface MeasuredExportElement {
  kind: 'neume' | 'lyric' | 'title';
  x: number;
  y: number;
  width: number;
  height: number;
  text: string;
  backgroundColor: string | null;
  color: string;
  fontSize: string;
  fontFamily: string;
  fontWeight: string;
  fontStyle: string;
}

interface MeasuredExportFrame {
  width: number;
  height: number;
  borderColor: string;
  borderWidth: number;
  elements: MeasuredExportElement[];
}

@Injectable({
  providedIn: 'root'
})
export class AlignmentSnapshotService {

  async exportFrame(element: HTMLElement, format: AlignmentExportFormat): Promise<Blob> {
    await this.ensureExportFontsReady();
    await this.waitForNextPaint();

    const measured = this.measureExportFrame(element);

    if (format === 'pdf') {
      const pdfBytes = await this.buildPdfFromRasterizedFrame(measured);
      return new Blob([new Uint8Array(pdfBytes)], { type: ALIGNMENT_EXPORT_MIME.pdf });
    }

    return this.buildImageFromMeasurements(
      measured,
      format === 'jpeg' ? ALIGNMENT_EXPORT_MIME.jpeg : ALIGNMENT_EXPORT_MIME.png,
    );
  }

  private async ensureExportFontsReady(): Promise<void> {
    await document.fonts.ready;
    await Promise.all([
      document.fonts.load('35px volpiano'),
      document.fonts.load('14px "Courier New"'),
      document.fonts.load('14px Roboto'),
      document.fonts.load('10px serif'),
    ]);
  }

  private measureExportFrame(container: HTMLElement): MeasuredExportFrame {
    const bounds = container.getBoundingClientRect();
    const containerStyle = getComputedStyle(container);
    const borderWidth = Number.parseFloat(containerStyle.borderTopWidth) || 0;
    const borderColor = containerStyle.borderTopColor || '#3F51B5';
    const elements: MeasuredExportElement[] = [];

    container.querySelectorAll<HTMLElement>('.snapshot-neume, .snapshot-lyric, .snapshot-title').forEach((element) => {
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      const backgroundColor = style.backgroundColor;
      const hasBackground = backgroundColor !== 'rgba(0, 0, 0, 0)' && backgroundColor !== 'transparent';
      const kind = element.classList.contains('snapshot-lyric')
        ? 'lyric'
        : element.classList.contains('snapshot-title')
          ? 'title'
          : 'neume';

      elements.push({
        kind,
        x: rect.left - bounds.left,
        y: rect.top - bounds.top,
        width: rect.width,
        height: rect.height,
        text: element.textContent ?? '',
        backgroundColor: hasBackground ? backgroundColor : null,
        color: style.color,
        fontSize: style.fontSize,
        fontFamily: style.fontFamily,
        fontWeight: style.fontWeight,
        fontStyle: style.fontStyle,
      });
    });

    return {
      width: Math.max(1, Math.ceil(bounds.width)),
      height: Math.max(1, Math.ceil(bounds.height)),
      borderColor,
      borderWidth,
      elements,
    };
  }

  private async buildPdfFromRasterizedFrame(measured: MeasuredExportFrame): Promise<Uint8Array> {
    const pngBlob = await this.buildImageFromMeasurements(measured, 'image/png');
    const pngBytes = new Uint8Array(await pngBlob.arrayBuffer());
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([measured.width, measured.height]);
    const image = await pdfDoc.embedPng(pngBytes);

    page.drawImage(image, {
      x: 0,
      y: 0,
      width: measured.width,
      height: measured.height,
    });

    return pdfDoc.save();
  }

  private async buildImageFromMeasurements(measured: MeasuredExportFrame, mimeType: string): Promise<Blob> {
    const scale = 2;
    const canvas = document.createElement('canvas');
    canvas.width = measured.width * scale;
    canvas.height = measured.height * scale;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Could not create canvas context for alignment export.');
    }

    ctx.scale(scale, scale);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, measured.width, measured.height);

    if (measured.borderWidth > 0) {
      ctx.strokeStyle = measured.borderColor;
      ctx.lineWidth = measured.borderWidth;
      ctx.strokeRect(
        measured.borderWidth / 2,
        measured.borderWidth / 2,
        measured.width - measured.borderWidth,
        measured.height - measured.borderWidth,
      );
    }

    for (const element of measured.elements) {
      if (element.backgroundColor) {
        ctx.fillStyle = element.backgroundColor;
        ctx.fillRect(element.x, element.y, element.width, element.height);
      }

      if (!element.text) {
        continue;
      }

      ctx.fillStyle = element.color || '#000000';
      ctx.font = this.toCanvasFont(element);
      ctx.textBaseline = 'top';
      ctx.fillText(element.text, element.x, element.y);
    }

    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Could not create image from alignment export.'));
        }
      }, mimeType);
    });
  }

  private toCanvasFont(element: MeasuredExportElement): string {
    const family = element.fontFamily.toLowerCase();

    if (family.includes('volpiano')) {
      return `${element.fontStyle} ${element.fontWeight} ${element.fontSize} volpiano, serif`;
    }

    return `${element.fontStyle} ${element.fontWeight} ${element.fontSize} ${element.fontFamily}`;
  }

  private waitForNextPaint(): Promise<void> {
    return new Promise((resolve) => {
      requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
    });
  }
}
