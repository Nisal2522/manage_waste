import React from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const ExportPdfHtml2Canvas = ({ elementId = "report-content", fileName = "report.pdf" }) => {
  const handleExport = async () => {
    const input = document.getElementById(elementId);
    if (!input) return alert("Element not found: " + elementId);

    try {
      // capture element
      const canvas = await html2canvas(input, { 
        scale: 2, 
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false
      });
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("p", "mm", "a4");
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      // if content higher than one page, split
      if (pdfHeight <= pdf.internal.pageSize.getHeight()) {
        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      } else {
        let heightLeft = pdfHeight;
        let position = 0;
        const pageHeight = pdf.internal.pageSize.getHeight();

        // add first page slice
        pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
        heightLeft -= pageHeight;

        // add more pages
        while (heightLeft > 0) {
          position = heightLeft - pdfHeight;
          pdf.addPage();
          pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
          heightLeft -= pageHeight;
        }
      }

      pdf.save(fileName);
      return true;
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF: ' + error.message);
      return false;
    }
  };

  return (
    <button onClick={handleExport} className="btn-export">
      Export as PDF
    </button>
  );
};

export default ExportPdfHtml2Canvas;
