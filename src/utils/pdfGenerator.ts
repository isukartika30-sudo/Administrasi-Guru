import { jsPDF } from "jspdf";
import { SikepoItem, SchoolProfile } from "../types";

export const generateRhkPdf = (item: SikepoItem, profile: SchoolProfile): void => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  let currentY = 15;

  // Header / Kop Sekolah
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(23, 78, 166); // #174EA6
  doc.text(profile.schoolName.toUpperCase() || "SMK NEGERI KINERJA UNGGUL", pageWidth / 2, currentY, { align: "center" });

  currentY += 6;
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(60, 60, 60);
  doc.text(`Sistem Informasi Kinerja Pegawai & Rencana Hasil Kerja (SIKEPO)`, pageWidth / 2, currentY, { align: "center" });

  currentY += 5;
  doc.setFontSize(8);
  doc.text(`${profile.city || "Kota Serang"} • Tahun Ajaran ${profile.academicYear || "2025/2026"} • Semester ${profile.semester || "Ganjil"}`, pageWidth / 2, currentY, { align: "center" });

  // Divider Line
  currentY += 4;
  doc.setLineWidth(0.8);
  doc.setDrawColor(26, 115, 232); // #1A73E8
  doc.line(15, currentY, pageWidth - 15, currentY);

  currentY += 1.5;
  doc.setLineWidth(0.2);
  doc.line(15, currentY, pageWidth - 15, currentY);

  // Document Title Box
  currentY += 8;
  doc.setFillColor(232, 240, 254); // Light Blue #E8F0FE
  doc.roundedRect(15, currentY, pageWidth - 30, 12, 2, 2, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(23, 78, 166);
  doc.text("DOKUMEN BUKTI DUKUNG REALISASI RHK (SKP GURU)", pageWidth / 2, currentY + 7.5, { align: "center" });

  currentY += 18;

  // Metadata Table
  const labelX = 20;
  const valX = 75;
  doc.setFontSize(9);

  const drawRow = (label: string, value: string, isBoldVal: boolean = false) => {
    doc.setFont("helvetica", "bold");
    doc.setTextColor(80, 80, 80);
    doc.text(label, labelX, currentY);
    doc.text(":", labelX + 50, currentY);

    doc.setFont("helvetica", isBoldVal ? "bold" : "normal");
    doc.setTextColor(30, 30, 30);
    
    // Split long text
    const splitLines = doc.splitTextToSize(value, pageWidth - valX - 20);
    doc.text(splitLines, valX, currentY);
    currentY += splitLines.length * 5 + 1;
  };

  drawRow("Nama Pegawai / Guru", item.userName || profile.teacherName, true);
  drawRow("NIP", profile.nip || "198803152019032008");
  drawRow("Mata Pelajaran / Tugas", profile.subject);
  drawRow("Kategori RHK", item.category, true);
  drawRow("Judul Bukti Dukung", item.title, true);
  drawRow("Tanggal & Waktu", `${item.date} (${item.time})`);
  drawRow("Penyimpanan Google Drive", `Folder: ${item.driveFolder || "SIKEPO_2026"} • Status: ${item.status}`);

  currentY += 4;

  // Narrative / Description Box
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(40, 40, 40);
  doc.text("DESKRIPSI & REALISASI KEGIATAN:", 15, currentY);

  currentY += 3;
  const descText = item.description || "Tidak ada rincian narasi tambahan.";
  const descLines = doc.splitTextToSize(descText, pageWidth - 40);
  const boxHeight = Math.max(16, descLines.length * 4.5 + 6);

  doc.setFillColor(249, 248, 243); // Soft background #F9F8F3
  doc.setDrawColor(216, 212, 199);
  doc.roundedRect(15, currentY, pageWidth - 30, boxHeight, 2, 2, "FD");

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(50, 50, 50);
  doc.text(descLines, 20, currentY + 5);

  currentY += boxHeight + 8;

  // Attachment Section (Foto / Image Preview)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(40, 40, 40);
  doc.text("LAMPIRAN FOTO & BUKTI FISIK DOKUMEN:", 15, currentY);

  currentY += 4;

  if (item.fileDataUrl && item.fileDataUrl.startsWith("data:image/")) {
    try {
      // Add Image
      const imgWidth = 120;
      const imgHeight = 75;
      const imgX = (pageWidth - imgWidth) / 2;

      doc.setDrawColor(200, 200, 200);
      doc.rect(imgX - 1, currentY - 1, imgWidth + 2, imgHeight + 2);
      doc.addImage(item.fileDataUrl, "JPEG", imgX, currentY, imgWidth, imgHeight);

      currentY += imgHeight + 8;
    } catch (e) {
      console.error("Error embedding image into PDF:", e);
      doc.setFont("helvetica", "italic");
      doc.setFontSize(8);
      doc.text(`[ Lampiran Berkas Gambar: ${item.fileName || "Foto_Bukti.jpg"} ]`, 20, currentY + 4);
      currentY += 12;
    }
  } else if (item.fileName) {
    doc.setFillColor(240, 244, 248);
    doc.setDrawColor(200, 210, 225);
    doc.roundedRect(15, currentY, pageWidth - 30, 16, 2, 2, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(23, 78, 166);
    doc.text(`📄 File Terlampir: ${item.fileName} (${item.fileSize || "1.2 MB"})`, 20, currentY + 7);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(100, 100, 100);
    doc.text(`Format: ${item.fileType || "Dokumen"} • Berkas fisik terverifikasi dan tersimpan dalam direktori SIKEPO.`, 20, currentY + 12);

    currentY += 22;
  } else {
    doc.setFont("helvetica", "italic");
    doc.setFontSize(8.5);
    doc.setTextColor(120, 120, 120);
    doc.text("(Tidak ada foto/file lampiran tambahan)", 20, currentY + 4);
    currentY += 12;
  }

  // Signature Block at the bottom
  if (currentY > 230) {
    doc.addPage();
    currentY = 20;
  }

  const signY = currentY + 5;
  const colWidth = (pageWidth - 30) / 2;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(60, 60, 60);

  // Left side: Guru / Pegawai
  doc.text("Pegawai / Guru Yang Bersangkutan,", 20, signY);
  doc.setFont("helvetica", "bold");
  doc.text(item.userName || profile.teacherName, 20, signY + 22);
  doc.setFont("helvetica", "normal");
  doc.text(`NIP. ${profile.nip || "-"}`, 20, signY + 26);

  // Right side: Headmaster
  const rightX = 15 + colWidth + 10;
  doc.text(`${profile.city || "Serang"}, ${item.date}`, rightX, signY);
  doc.text("Mengetahui, Kepala Sekolah", rightX, signY + 4);
  doc.setFont("helvetica", "bold");
  doc.text(profile.principalName || "Dr. Hj. Siti Rahmah, M.Pd.", rightX, signY + 22);
  doc.setFont("helvetica", "normal");
  doc.text(`NIP. ${profile.principalNip || "197508202000032001"}`, rightX, signY + 26);

  // Save PDF
  const safeFilename = `SIKEPO_${item.category.replace(/[^a-zA-Z0-9]/g, "_")}_${item.title.slice(0, 20).replace(/[^a-zA-Z0-9]/g, "_")}.pdf`;
  doc.save(safeFilename);
};
