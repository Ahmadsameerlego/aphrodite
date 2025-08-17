// jsPDF و xlsx يجب إضافتهما في public/js
// تحميل jsPDF من https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js
// تحميل xlsx من https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js

function exportTableToPDF(tableId, title) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation: 'p', unit: 'pt', format: 'a4' });
  doc.text(title, 40, 40, { align: 'right' });
  doc.autoTable({
    html: `#${tableId}`,
    startY: 60,
    styles: { font: 'cairo', halign: 'right' },
    headStyles: { fillColor: [41, 128, 185] },
    margin: { right: 40, left: 40 }
  });
  doc.save(`${title}.pdf`);
}

function exportTableToExcel(tableId, title) {
  const table = document.getElementById(tableId);
  const wb = XLSX.utils.table_to_book(table, { sheet: title });
  XLSX.writeFile(wb, `${title}.xlsx`);
}
