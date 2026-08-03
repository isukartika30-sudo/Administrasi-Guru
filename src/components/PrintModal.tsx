import React from "react";
import { PrintData, SchoolProfile } from "../types";
import { Printer, X, FileText } from "lucide-react";

interface PrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  printData: PrintData | null;
  profile: SchoolProfile;
}

export const PrintModal: React.FC<PrintModalProps> = ({
  isOpen,
  onClose,
  printData,
  profile,
}) => {
  if (!isOpen || !printData) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#2D3126]/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-[#E2DDD0] overflow-hidden my-8 flex flex-col max-h-[90vh]">
        {/* Header toolbar (Hidden during actual print) */}
        <div className="bg-[#3D4035] text-[#FAF9F5] p-4 px-6 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#588157]/20 text-[#A3B18A] rounded-lg">
              <FileText className="w-5 h-5 text-[#D4A373]" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-[#FAF9F5]">{printData.title}</h3>
              <p className="text-xs text-[#E2DDD0]">
                Pratinjau Dokumen Cetak Administrasi Guru
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 bg-[#D4A373] hover:bg-[#c29263] text-[#2D3127] px-4 py-2 rounded-xl text-sm font-bold transition shadow-2xs cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              Cetak Dokumen
            </button>
            <button
              onClick={onClose}
              className="p-2 text-[#E2DDD0] hover:text-white rounded-lg hover:bg-[#2D3126] transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Area */}
        <div className="p-8 overflow-y-auto print:p-0 print:overflow-visible print:bg-white text-[#2D3127] text-sm">
          <style>{`
            @media print {
              body * {
                visibility: hidden;
              }
              .printable-content, .printable-content * {
                visibility: visible;
              }
              .printable-content {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                padding: 20px;
              }
              .print\\:hidden {
                display: none !important;
              }
            }
          `}</style>

          <div className="printable-content max-w-3xl mx-auto font-sans leading-relaxed">
            {/* Kop Surat Sekolah */}
            {profile.kopSuratUrl ? (
              <div className="mb-6 text-center">
                <img
                  src={profile.kopSuratUrl}
                  alt={`Kop Surat ${profile.schoolName}`}
                  className="w-full max-h-44 object-contain mx-auto"
                />
                <div className="border-b-2 border-[#2D3127] mt-2"></div>
              </div>
            ) : (
              <div className="border-b-4 border-double border-[#3D4035] pb-4 mb-6 text-center">
                <h1 className="text-xl font-bold uppercase tracking-wide text-[#2D3127]">
                  {profile.schoolName}
                </h1>
                <p className="text-xs font-semibold text-[#3D4035] uppercase">
                  Aplikasi Administrasi Guru & Asisten AI Kurikulum Merdeka
                </p>
                <p className="text-xs text-[#6B6E60] mt-1">
                  Tahun Ajaran {profile.academicYear} &bull; Semester{" "}
                  {profile.semester} &bull; {profile.city}
                </p>
              </div>
            )}

            {/* Document Meta Information */}
            <div className="mb-6 bg-[#F9F8F3] p-4 rounded-xl border border-[#E2DDD0] print:border-none print:p-0 print:bg-transparent text-center">
              <h2 className="text-lg font-bold text-[#2D3127] uppercase mb-1">
                {printData.title}
              </h2>
              {printData.subtitle && (
                <p className="text-xs font-semibold text-[#588157] mb-3 uppercase tracking-wide">
                  {printData.subtitle}
                </p>
              )}

              <div className="grid grid-cols-2 gap-2 text-xs text-[#3D4035] text-left mt-2">
                <div>
                  <span className="font-semibold text-[#2D3127]">Mata Pelajaran:</span>{" "}
                  {printData.subject || profile.subject}
                </div>
                <div>
                  <span className="font-semibold text-[#2D3127]">Kelas:</span>{" "}
                  {printData.className || "Semua Kelas"}
                </div>
                <div>
                  <span className="font-semibold text-[#2D3127]">Guru Pengampu:</span>{" "}
                  {profile.teacherName} (NIP. {profile.nip})
                </div>
                <div>
                  <span className="font-semibold text-[#2D3127]">Periode / Tanggal:</span>{" "}
                  {printData.periodLabel || new Date().toLocaleDateString("id-ID")}
                </div>
              </div>
            </div>

            {/* Content Table by Type */}
            {printData.type === "absensi" && (
              <table className="w-full border-collapse border border-[#D8D4C7] text-xs mb-8">
                <thead>
                  <tr className="bg-[#F4F2EA] text-[#2D3127] font-semibold">
                    <th className="border border-[#D8D4C7] p-2 text-center w-10">No</th>
                    <th className="border border-[#D8D4C7] p-2 text-left">NISN</th>
                    <th className="border border-[#D8D4C7] p-2 text-left">Nama Siswa</th>
                    <th className="border border-[#D8D4C7] p-2 text-center w-12">L/P</th>
                    <th className="border border-[#D8D4C7] p-2 text-center w-20">Status</th>
                    <th className="border border-[#D8D4C7] p-2 text-left">Keterangan</th>
                  </tr>
                </thead>
                <tbody>
                  {printData.items.map((item, idx) => (
                    <tr key={item.id || idx} className="hover:bg-[#F9F8F3]">
                      <td className="border border-[#D8D4C7] p-2 text-center">{idx + 1}</td>
                      <td className="border border-[#D8D4C7] p-2 font-mono">{item.nisn}</td>
                      <td className="border border-[#D8D4C7] p-2 font-medium">{item.name}</td>
                      <td className="border border-[#D8D4C7] p-2 text-center">{item.gender}</td>
                      <td className="border border-[#D8D4C7] p-2 text-center font-bold">
                        {item.status === "H" ? (
                          <span className="text-[#588157]">Hadir</span>
                        ) : item.status === "S" ? (
                          <span className="text-[#D4A373]">Sakit</span>
                        ) : item.status === "I" ? (
                          <span className="text-[#3D4035]">Izin</span>
                        ) : (
                          <span className="text-[#842029]">Alpa</span>
                        )}
                      </td>
                      <td className="border border-[#D8D4C7] p-2 text-[#6B6E60]">{item.notes || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {printData.type === "jurnal" && (
              <table className="w-full border-collapse border border-[#D8D4C7] text-xs mb-8">
                <thead>
                  <tr className="bg-[#F4F2EA] text-[#2D3127] font-semibold">
                    <th className="border border-[#D8D4C7] p-2 text-center w-10">No</th>
                    <th className="border border-[#D8D4C7] p-2 text-left w-24">Tanggal</th>
                    <th className="border border-[#D8D4C7] p-2 text-left w-20">Kelas</th>
                    <th className="border border-[#D8D4C7] p-2 text-left">Topik / Materi Pembelajaran</th>
                    <th className="border border-[#D8D4C7] p-2 text-left">Hambatan & Solusi</th>
                  </tr>
                </thead>
                <tbody>
                  {printData.items.map((item, idx) => (
                    <tr key={item.id || idx}>
                      <td className="border border-[#D8D4C7] p-2 text-center">{idx + 1}</td>
                      <td className="border border-[#D8D4C7] p-2">{item.date}</td>
                      <td className="border border-[#D8D4C7] p-2 font-semibold">{item.className}</td>
                      <td className="border border-[#D8D4C7] p-2 font-medium">{item.topic}</td>
                      <td className="border border-[#D8D4C7] p-2 text-[#3D4035]">
                        <div><strong className="text-[#2D3127]">Hambatan:</strong> {item.obstacle || "-"}</div>
                        <div><strong className="text-[#2D3127]">Solusi:</strong> {item.solution || "-"}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {printData.type === "rekap_nilai" && (
              <table className="w-full border-collapse border border-[#D8D4C7] text-xs mb-8">
                <thead>
                  <tr className="bg-[#F4F2EA] text-[#2D3127] font-semibold">
                    <th className="border border-[#D8D4C7] p-2 text-center w-8">No</th>
                    <th className="border border-[#D8D4C7] p-2 text-left">Nama Siswa</th>
                    <th className="border border-[#D8D4C7] p-2 text-center">Formatif</th>
                    <th className="border border-[#D8D4C7] p-2 text-center">Sumatif LM</th>
                    <th className="border border-[#D8D4C7] p-2 text-center">PTS</th>
                    <th className="border border-[#D8D4C7] p-2 text-center">PAS</th>
                    <th className="border border-[#D8D4C7] p-2 text-center font-bold">Nilai Akhir</th>
                    <th className="border border-[#D8D4C7] p-2 text-center font-bold">Predikat</th>
                    <th className="border border-[#D8D4C7] p-2 text-left">Deskripsi Capaian</th>
                  </tr>
                </thead>
                <tbody>
                  {printData.items.map((item, idx) => (
                    <tr key={item.id || idx}>
                      <td className="border border-[#D8D4C7] p-2 text-center">{idx + 1}</td>
                      <td className="border border-[#D8D4C7] p-2 font-medium">{item.studentName}</td>
                      <td className="border border-[#D8D4C7] p-2 text-center">
                        {Object.values(item.formatif || {}).join(", ") || "-"}
                      </td>
                      <td className="border border-[#D8D4C7] p-2 text-center">
                        {Object.values(item.sumatifLM || {}).join(", ") || "-"}
                      </td>
                      <td className="border border-[#D8D4C7] p-2 text-center">{item.pts}</td>
                      <td className="border border-[#D8D4C7] p-2 text-center">{item.pas}</td>
                      <td className="border border-[#D8D4C7] p-2 text-center font-bold bg-[#F9F8F3]">
                        {item.finalGrade}
                      </td>
                      <td className="border border-[#D8D4C7] p-2 text-center font-bold">
                        <span className="px-2 py-0.5 rounded bg-[#E2DDD0] text-[#2D3127]">
                          {item.predicate}
                        </span>
                      </td>
                      <td className="border border-[#D8D4C7] p-2 text-[#3D4035] text-[11px] leading-snug">
                        {item.narrative}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {printData.type === "agenda" && (
              <table className="w-full border-collapse border border-[#D8D4C7] text-xs mb-8">
                <thead>
                  <tr className="bg-[#F4F2EA] text-[#2D3127] font-semibold">
                    <th className="border border-[#D8D4C7] p-2 text-center w-8">No</th>
                    <th className="border border-[#D8D4C7] p-2 text-left w-16">Fase</th>
                    <th className="border border-[#D8D4C7] p-2 text-left">Elemen & Materi</th>
                    <th className="border border-[#D8D4C7] p-2 text-left">Tujuan Pembelajaran (TP)</th>
                    <th className="border border-[#D8D4C7] p-2 text-center w-12">JP</th>
                    <th className="border border-[#D8D4C7] p-2 text-center w-20">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {printData.items.map((item, idx) => (
                    <tr key={item.id || idx}>
                      <td className="border border-[#D8D4C7] p-2 text-center">{idx + 1}</td>
                      <td className="border border-[#D8D4C7] p-2 font-bold text-center">Fase {item.fase}</td>
                      <td className="border border-[#D8D4C7] p-2">
                        <div className="font-semibold text-[#2D3127]">{item.element}</div>
                        <div className="text-[#6B6E60] mt-0.5">{item.materi}</div>
                      </td>
                      <td className="border border-[#D8D4C7] p-2 text-[#3D4035]">{item.tp}</td>
                      <td className="border border-[#D8D4C7] p-2 text-center font-medium">{item.jp} JP</td>
                      <td className="border border-[#D8D4C7] p-2 text-center font-semibold">
                        {item.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {printData.type === "cp" && (
              <table className="w-full border-collapse border border-[#D8D4C7] text-xs mb-8">
                <thead>
                  <tr className="bg-[#F4F2EA] text-[#2D3127] font-semibold">
                    <th className="border border-[#D8D4C7] p-2 text-center w-8">No</th>
                    <th className="border border-[#D8D4C7] p-2 text-left w-16">Kode</th>
                    <th className="border border-[#D8D4C7] p-2 text-center w-12">Fase</th>
                    <th className="border border-[#D8D4C7] p-2 text-left w-36">Elemen</th>
                    <th className="border border-[#D8D4C7] p-2 text-left">Teks Capaian Pembelajaran (CP)</th>
                    <th className="border border-[#D8D4C7] p-2 text-center w-12">JP</th>
                  </tr>
                </thead>
                <tbody>
                  {printData.items.map((item, idx) => (
                    <tr key={item.id || idx}>
                      <td className="border border-[#D8D4C7] p-2 text-center">{idx + 1}</td>
                      <td className="border border-[#D8D4C7] p-2 font-mono font-bold">{item.code}</td>
                      <td className="border border-[#D8D4C7] p-2 text-center font-bold">Fase {item.fase}</td>
                      <td className="border border-[#D8D4C7] p-2 font-semibold">{item.element}</td>
                      <td className="border border-[#D8D4C7] p-2 text-[#3D4035] leading-relaxed">{item.description}</td>
                      <td className="border border-[#D8D4C7] p-2 text-center font-bold">{item.targetJP} JP</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {printData.type === "tp" && (
              <table className="w-full border-collapse border border-[#D8D4C7] text-xs mb-8">
                <thead>
                  <tr className="bg-[#F4F2EA] text-[#2D3127] font-semibold">
                    <th className="border border-[#D8D4C7] p-2 text-center w-8">No</th>
                    <th className="border border-[#D8D4C7] p-2 text-left w-16">Kode TP</th>
                    <th className="border border-[#D8D4C7] p-2 text-left">Rumusan Tujuan Pembelajaran (TP)</th>
                    <th className="border border-[#D8D4C7] p-2 text-left w-36">KKO Bloom</th>
                    <th className="border border-[#D8D4C7] p-2 text-left w-36">Lingkup Materi</th>
                  </tr>
                </thead>
                <tbody>
                  {printData.items.map((item, idx) => (
                    <tr key={item.id || idx}>
                      <td className="border border-[#D8D4C7] p-2 text-center">{idx + 1}</td>
                      <td className="border border-[#D8D4C7] p-2 font-mono font-bold">{item.code}</td>
                      <td className="border border-[#D8D4C7] p-2 font-medium text-[#2D3127]">{item.statement}</td>
                      <td className="border border-[#D8D4C7] p-2 font-bold text-[#3D4035]">{item.kko}</td>
                      <td className="border border-[#D8D4C7] p-2 text-[#6B6E60]">{item.scope}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {printData.type === "atp" && (
              <table className="w-full border-collapse border border-[#D8D4C7] text-xs mb-8">
                <thead>
                  <tr className="bg-[#F4F2EA] text-[#2D3127] font-semibold">
                    <th className="border border-[#D8D4C7] p-2 text-center w-8">Urutan</th>
                    <th className="border border-[#D8D4C7] p-2 text-left w-20">Kode ATP</th>
                    <th className="border border-[#D8D4C7] p-2 text-center w-16">Semester</th>
                    <th className="border border-[#D8D4C7] p-2 text-left">Materi Utama / Alur Pembelajaran</th>
                    <th className="border border-[#D8D4C7] p-2 text-center w-12">JP</th>
                    <th className="border border-[#D8D4C7] p-2 text-left">Metode Asesmen</th>
                  </tr>
                </thead>
                <tbody>
                  {printData.items.map((item, idx) => (
                    <tr key={item.id || idx}>
                      <td className="border border-[#D8D4C7] p-2 text-center font-bold">{item.order || idx + 1}</td>
                      <td className="border border-[#D8D4C7] p-2 font-mono font-bold text-[#3D4035]">{item.code}</td>
                      <td className="border border-[#D8D4C7] p-2 text-center">Semester {item.semester}</td>
                      <td className="border border-[#D8D4C7] p-2 font-semibold text-[#2D3127]">{item.materi}</td>
                      <td className="border border-[#D8D4C7] p-2 text-center font-bold">{item.jp} JP</td>
                      <td className="border border-[#D8D4C7] p-2 text-[#3D4035]">{item.assessmentMethod}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {(printData.type === "kktp" || printData.type === "kkm") && (
              <table className="w-full border-collapse border border-[#D8D4C7] text-xs mb-8">
                <thead>
                  <tr className="bg-[#F4F2EA] text-[#2D3127] font-semibold">
                    <th className="border border-[#D8D4C7] p-2 text-center w-8">No</th>
                    <th className="border border-[#D8D4C7] p-2 text-left">Tujuan Pembelajaran (TP)</th>
                    <th className="border border-[#D8D4C7] p-2 text-center w-16">KKM Target</th>
                    <th className="border border-[#D8D4C7] p-2 text-left">Kriteria Belum Berkembang (&lt; 61)</th>
                    <th className="border border-[#D8D4C7] p-2 text-left">Kriteria Mahir (89 - 100)</th>
                  </tr>
                </thead>
                <tbody>
                  {printData.items.map((item, idx) => (
                    <tr key={item.id || idx}>
                      <td className="border border-[#D8D4C7] p-2 text-center">{idx + 1}</td>
                      <td className="border border-[#D8D4C7] p-2 font-medium">{item.tpStatement || "Mencapai tujuan pembelajaran"}</td>
                      <td className="border border-[#D8D4C7] p-2 text-center font-extrabold text-[#3D4035] bg-[#F9F8F3]">{item.kkmValue}</td>
                      <td className="border border-[#D8D4C7] p-2 text-[#842029]">{item.intervalBelum}</td>
                      <td className="border border-[#D8D4C7] p-2 text-[#3D4035] font-medium">{item.intervalMahir}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {printData.type === "sikepo" && (
              <table className="w-full border-collapse border border-[#D8D4C7] text-xs mb-8">
                <thead>
                  <tr className="bg-[#F4F2EA] text-[#2D3127] font-semibold">
                    <th className="border border-[#D8D4C7] p-2 text-center w-8">No</th>
                    <th className="border border-[#D8D4C7] p-2 text-left w-28">Tanggal & Waktu</th>
                    <th className="border border-[#D8D4C7] p-2 text-left w-48">Kegiatan / RHK Kinerja</th>
                    <th className="border border-[#D8D4C7] p-2 text-left">Deskripsi & Narasi Bukti Dukung</th>
                    <th className="border border-[#D8D4C7] p-2 text-left w-36">File & Google Drive</th>
                  </tr>
                </thead>
                <tbody>
                  {printData.items.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="border border-[#D8D4C7] p-4 text-center text-[#8C8F82] italic">
                        Belum ada data bukti dukung kinerja untuk periode ini.
                      </td>
                    </tr>
                  ) : (
                    printData.items.map((item, idx) => (
                      <tr key={item.id || idx}>
                        <td className="border border-[#D8D4C7] p-2 text-center font-bold">{idx + 1}</td>
                        <td className="border border-[#D8D4C7] p-2">
                          <div className="font-semibold text-[#2D3127]">
                            {item.date ? new Date(item.date).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : "-"}
                          </div>
                          <div className="text-[10px] text-[#6B6E60]">{item.time || "-"}</div>
                        </td>
                        <td className="border border-[#D8D4C7] p-2 font-medium">
                          <div className="font-bold text-[#2D3127]">{item.title}</div>
                          <div className="text-[10px] text-[#588157] font-semibold">{item.category}</div>
                        </td>
                        <td className="border border-[#D8D4C7] p-2 text-[#3D4035] leading-relaxed whitespace-pre-line">
                          {item.description}
                        </td>
                        <td className="border border-[#D8D4C7] p-2">
                          <div className="font-mono text-[11px] text-[#2D3127] truncate font-semibold">
                            {item.fileName || "File Bukti Dukung"}
                          </div>
                          <div className="text-[10px] text-[#588157] font-bold mt-0.5">
                            {item.status || "Tersimpan di Google Drive"}
                          </div>
                          {item.driveFolder && (
                            <div className="text-[9px] text-[#8C8F82]">Folder: {item.driveFolder}</div>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}

            {/* Signature Area (Tanda Tangan) */}
            <div className="grid grid-cols-2 gap-8 mt-12 pt-6 text-xs text-[#3D4035] break-inside-avoid">
              <div className="text-center">
                <p>Mengetahui,</p>
                <p className="font-semibold mt-1">Kepala Sekolah</p>
                <div className="h-16"></div>
                <p className="font-bold underline text-[#2D3127]">{profile.principalName}</p>
                <p className="text-[#6B6E60]">NIP. {profile.principalNip}</p>
              </div>

              <div className="text-center">
                <p>{profile.city}, {new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</p>
                <p className="font-semibold mt-1">Guru Mata Pelajaran</p>
                <div className="h-16"></div>
                <p className="font-bold underline text-[#2D3127]">{profile.teacherName}</p>
                <p className="text-[#6B6E60]">NIP. {profile.nip}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
