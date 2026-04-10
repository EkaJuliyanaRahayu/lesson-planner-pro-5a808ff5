import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { DocumentRecord, STAGE_LABELS, STAGES } from "./types";

export function generateStagePDF(
  doc: DocumentRecord,
  stage: string
) {
  const pdf = new jsPDF();
  const label = STAGE_LABELS[stage];

  pdf.setFontSize(16);
  pdf.text(label.title, 14, 20);

  pdf.setFontSize(11);
  pdf.text(`Kelas: ${doc.kelas}`, 14, 30);
  pdf.text(`Mata Pelajaran: ${doc.mataPelajaran}`, 14, 37);
  pdf.text(`Tanggal: ${new Date().toLocaleDateString("id-ID")}`, 14, 44);

  const stageData = doc[stage as keyof Pick<DocumentRecord, "cp" | "tp" | "atp" | "rpp">];

  autoTable(pdf, {
    startY: 52,
    head: [[label.col1, label.col2]],
    body: stageData.rows.map((r) => [r.col1, r.col2]),
    styles: { fontSize: 10, cellPadding: 4 },
    headStyles: { fillColor: [37, 99, 170] },
    columnStyles: { 0: { cellWidth: 50 }, 1: { cellWidth: "auto" } },
  });

  pdf.save(`${stage.toUpperCase()}_${doc.mataPelajaran}_Kelas${doc.kelas}.pdf`);
}

export function generateFullPDF(doc: DocumentRecord) {
  const pdf = new jsPDF();

  pdf.setFontSize(18);
  pdf.text("Laporan Pembelajaran", 14, 20);
  pdf.setFontSize(11);
  pdf.text(`Kelas: ${doc.kelas}`, 14, 30);
  pdf.text(`Mata Pelajaran: ${doc.mataPelajaran}`, 14, 37);
  pdf.text(`Tanggal: ${new Date().toLocaleDateString("id-ID")}`, 14, 44);

  let startY = 55;

  for (const stage of STAGES) {
    const label = STAGE_LABELS[stage];
    const stageData = doc[stage as keyof Pick<DocumentRecord, "cp" | "tp" | "atp" | "rpp">];

    if (stageData.rows.length === 0) continue;

    if (startY > 240) {
      pdf.addPage();
      startY = 20;
    }

    pdf.setFontSize(13);
    pdf.text(label.title, 14, startY);

    autoTable(pdf, {
      startY: startY + 5,
      head: [[label.col1, label.col2]],
      body: stageData.rows.map((r) => [r.col1, r.col2]),
      styles: { fontSize: 9, cellPadding: 3 },
      headStyles: { fillColor: [37, 99, 170] },
      columnStyles: { 0: { cellWidth: 50 }, 1: { cellWidth: "auto" } },
    });

    startY = (pdf as any).lastAutoTable.finalY + 15;
  }

  pdf.save(`Laporan_${doc.mataPelajaran}_Kelas${doc.kelas}.pdf`);
}
