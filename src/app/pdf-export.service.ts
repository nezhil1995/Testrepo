import { Injectable } from '@angular/core';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

@Injectable({
  providedIn: 'root'
})
export class PdfExportService {

  constructor() { }

  exportToPDF(chartContainer: HTMLElement, customTitle: string, customSentence: string) {
    html2canvas(chartContainer).then(canvas => {
        const imageData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        const imgProps = pdf.getImageProperties(imageData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        
        // Calculate position to center the image horizontally
        const xPos = (pdf.internal.pageSize.getWidth() - pdfWidth) / 2;
        
        // Add image
        pdf.addImage(imageData, 'PNG', xPos, 10, pdfWidth, pdfHeight);

        // Add custom title
        pdf.setFontSize(18);
        pdf.setTextColor(0, 0, 255); // Set color to blue
        pdf.text(customTitle, 10, pdfHeight + 30);

        // Add custom sentence
        pdf.setFontSize(12);
        pdf.setTextColor(0, 0, 0); // Set color back to black
        pdf.text(customSentence, 10, pdfHeight + 50);

        pdf.save('chart_export.pdf');
    });
}


}
