import jsPDF from 'jspdf';
import { toPng } from 'html-to-image';
import { Invoice } from '../types';

export interface GeneratePdfOptions {
  elementId: string;
  invoice: Invoice;
  onProgress?: (status: string) => void;
}

/**
 * Generate and download a high-resolution A4 PDF of the invoice
 */
export async function downloadInvoicePdf({ elementId, invoice, onProgress }: GeneratePdfOptions): Promise<void> {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error('Invoice preview element not found in DOM');
  }

  onProgress?.('Preparing document for high-resolution rendering...');

  // Store original element style and scroll
  const originalTransform = element.style.transform;
  const originalTransformOrigin = element.style.transformOrigin;
  const originalWidth = element.style.width;
  const originalMaxWidth = element.style.maxWidth;

  // Temporarily set clean width and reset scale transform for crisp rendering
  element.style.transform = 'none';
  element.style.transformOrigin = 'top left';
  element.style.width = '794px'; // 210mm at 96 DPI
  element.style.maxWidth = '794px';

  try {
    onProgress?.('Rendering invoice graphics & typography...');

    // Wait for fonts to be ready if supported
    if (document.fonts) {
      await document.fonts.ready;
    }

    // Capture using html-to-image (supports Tailwind v4 oklch colors natively)
    const dataUrl = await toPng(element, {
      pixelRatio: 2, // 2x resolution for crisp, retina vector-like text
      backgroundColor: '#ffffff',
      cacheBust: false,
      filter: (node) => {
        if (node instanceof HTMLElement && node.classList.contains('no-print')) {
          return false;
        }
        return true;
      },
    });

    onProgress?.('Generating PDF pages...');

    // Load image into an HTML image object to inspect rendered pixel dimensions
    const img = new Image();
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error('Failed to process image capture'));
      img.src = dataUrl;
    });

    // A4 dimensions in mm: 210mm x 297mm
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });

    const pageWidth = 210;
    const pageHeight = 297;

    const imgWidth = pageWidth;
    const imgHeight = (img.height * imgWidth) / img.width;

    let heightLeft = imgHeight;
    let position = 0;

    // First page
    pdf.addImage(dataUrl, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
    heightLeft -= pageHeight;

    // Subsequent pages if invoice has dozens of items and overflows A4
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(dataUrl, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pageHeight;
    }

    // Build clean filename
    const cleanNumber = (invoice.invoiceNumber || 'INV').replace(/[^a-zA-Z0-9-_]/g, '_');
    const cleanClient = (invoice.customer.companyName || invoice.customer.name || 'Client')
      .replace(/[^a-zA-Z0-9-_]/g, '_')
      .slice(0, 25);
    const fileName = `Invoice_${cleanNumber}_${cleanClient}.pdf`;

    onProgress?.('Downloading file...');
    pdf.save(fileName);
  } finally {
    // Restore original styles
    element.style.transform = originalTransform;
    element.style.transformOrigin = originalTransformOrigin;
    element.style.width = originalWidth;
    element.style.maxWidth = originalMaxWidth;
  }
}

/**
 * Trigger native browser print dialog
 */
export function triggerPrintInvoice(): void {
  window.print();
}

