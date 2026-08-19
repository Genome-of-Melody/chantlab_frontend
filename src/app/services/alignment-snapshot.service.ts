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
  // Use Chrome's usual hard caps. rasterizeFrame() retries at half scale if
  // the GPU rejects the canvas or toBlob() returns null.
  private readonly preferredScale = 2;
  private readonly minScale = 0.05;
  private readonly maxCanvasDimension = 32767;
  private readonly maxCanvasArea = 268_435_456;
  private readonly maxPdfPageUnits = 14400;

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
    const image = await pdfDoc.embedPng(pngBytes);
    const pageScale = Math.min(
      1,
      this.maxPdfPageUnits / measured.width,
      this.maxPdfPageUnits / measured.height,
    );
    const pageWidth = measured.width * pageScale;
    const pageHeight = measured.height * pageScale;
    const page = pdfDoc.addPage([pageWidth, pageHeight]);

    page.drawImage(image, {
      x: 0,
      y: 0,
      width: pageWidth,
      height: pageHeight,
    });

    return pdfDoc.save();
  }

  private async buildImageFromMeasurements(measured: MeasuredExportFrame, mimeType: string): Promise<Blob> {
    let scale = this.computeExportScale(measured.width, measured.height);
    let lastError: Error | null = null;

    while (scale >= this.minScale) {
      try {
        return await this.rasterizeFrame(measured, mimeType, scale);
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        scale *= 0.5;
      }
    }

    throw lastError ?? new Error('Could not create image from alignment export.');
  }

  private computeExportScale(width: number, height: number): number {
    const maxScaleByWidth = this.maxCanvasDimension / width;
    const maxScaleByHeight = this.maxCanvasDimension / height;
    const maxScaleByArea = Math.sqrt(this.maxCanvasArea / (width * height));
    const scale = Math.min(this.preferredScale, maxScaleByWidth, maxScaleByHeight, maxScaleByArea);

    if (!Number.isFinite(scale) || scale <= 0) {
      throw new Error('Alignment snapshot is too large to export in this browser.');
    }

    return scale;
  }

  private rasterizeFrame(
    measured: MeasuredExportFrame,
    mimeType: string,
    scale: number,
  ): Promise<Blob> {
    const width = Math.max(1, Math.ceil(measured.width * scale));
    const height = Math.max(1, Math.ceil(measured.height * scale));
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    if (canvas.width !== width || canvas.height !== height) {
      throw new Error('Alignment snapshot is too large to export in this browser.');
    }

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

    const quality = mimeType === 'image/jpeg' ? 0.92 : undefined;

    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        canvas.width = 0;
        canvas.height = 0;

        if (blob && blob.size > 0) {
          resolve(blob);
        } else {
          reject(new Error('Could not create image from alignment export.'));
        }
      }, mimeType, quality);
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
