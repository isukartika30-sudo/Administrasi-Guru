import React, { useState, useEffect } from "react";
import { SikepoItem, SchoolProfile, PrintData, AuthUser } from "../types";
import { getSikepoItems, saveSikepoItems } from "../utils/storage";
import { generateRhkPdf } from "../utils/pdfGenerator";
import { GoogleDriveReviewModal } from "./GoogleDriveReviewModal";
import { getAllUsers, updateUserDriveUrl } from "../utils/auth";
import {
  FolderCheck,
  Plus,
  Printer,
  Upload,
  Calendar,
  Clock,
  FileText,
  Trash2,
  ExternalLink,
  CheckCircle2,
  Search,
  Filter,
  FileImage,
  FolderOpen,
  CloudCheck,
  X,
  Eye,
  Info,
  Download,
  ShieldCheck,
  User,
} from "lucide-react";

interface SikepoModuleProps {
  profile: SchoolProfile;
  onOpenPrint: (data: PrintData) => void;
  currentUser?: AuthUser;
  onUpdateUserDriveUrl?: (url: string) => void;
}

const CATEGORIES = [
  "Perencanaan Pembelajaran",
  "Pelaksanaan Pembelajaran",
  "Evaluasi Pembelajaran",
  "Direktif Atasan",
  "Pembina Ekstrakulikuler",
  "Pengembangan Diri",
  "Guru Piket",
  "Guru Wali",
];

const MONTHS = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

export const SikepoModule: React.FC<SikepoModuleProps> = ({
  profile,
  onOpenPrint,
  currentUser,
  onUpdateUserDriveUrl,
}) => {
  const isSuperAdmin = currentUser?.role === "superadmin";
  const [allRegisteredUsers, setAllRegisteredUsers] = useState<AuthUser[]>([]);
  const [selectedTeacherFilter, setSelectedTeacherFilter] = useState<string>("all");

  const activeUserId = isSuperAdmin ? selectedTeacherFilter : (currentUser?.id || "usr_guru1");
  const [items, setItems] = useState<SikepoItem[]>(getSikepoItems(activeUserId));

  // Sync user's custom drive folder URL when user changes
  useEffect(() => {
    if (currentUser?.driveFolderUrl) {
      setDriveUrl(currentUser.driveFolderUrl);
    }
  }, [currentUser]);

  // Reload items whenever active user selection or prop changes
  useEffect(() => {
    setAllRegisteredUsers(getAllUsers());
  }, []);

  useEffect(() => {
    setItems(getSikepoItems(activeUserId));
  }, [activeUserId]);

  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterMonth, setFilterMonth] = useState<string>("Agustus");
  const [filterYear, setFilterYear] = useState<string>("2026");
  const [filterCategory, setFilterCategory] = useState<string>("Semua");

  // Form State
  const [title, setTitle] = useState<string>("");
  const [category, setCategory] = useState<string>(CATEGORIES[0]);
  const [description, setDescription] = useState<string>("");
  const [date, setDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [time, setTime] = useState<string>("08:00 - 11:30 WIB");
  const [fileName, setFileName] = useState<string>("");
  const [fileType, setFileType] = useState<string>("");
  const [fileSize, setFileSize] = useState<string>("");
  const [fileDataUrl, setFileDataUrl] = useState<string>("");
  const [driveFolder, setDriveFolder] = useState<string>("SIKEPO_2026/Agustus");
  const [driveUrl, setDriveUrl] = useState<string>("https://drive.google.com/drive/u/0/my-drive");
  const [previewItem, setPreviewItem] = useState<SikepoItem | null>(null);

  // Folder Picker State
  const [isFolderPickerOpen, setIsFolderPickerOpen] = useState<boolean>(false);
  const [customFolderInput, setCustomFolderInput] = useState<string>("");

  const FOLDER_PRESETS = [
    { name: "SIKEPO_2026/Agustus", desc: "Berkas Kinerja Bulan Agustus 2026" },
    { name: "SIKEPO_2026/September", desc: "Berkas Kinerja Bulan September 2026" },
    { name: "SIKEPO_2026/Semester_Ganjil", desc: "Arsip Kinerja Semester 1 (Ganjil)" },
    { name: "SIKEPO_2026/Semester_Genap", desc: "Arsip Kinerja Semester 2 (Genap)" },
    { name: "Perangkat_Ajar_Informatika", desc: "Modul Ajar, Bahan Ajar & CP/TP" },
    { name: "Sertifikat_Pelatihan_Guru", desc: "Sertifikat Webinar & Diklat PKB" },
    { name: "Laporan_Wali_Kelas_&_Ekstra", desc: "Administrasi Pembimbingan & Ekstrakurikuler" },
  ];

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setFileType(file.type || file.name.split(".").pop() || "file");
    
    // Format File Size
    const kb = file.size / 1024;
    if (kb > 1024) {
      setFileSize(`${(kb / 1024).toFixed(2)} MB`);
    } else {
      setFileSize(`${kb.toFixed(0)} KB`);
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setFileDataUrl((event.target?.result as string) || "");
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      alert("Mohon isi Judul Bukti Dukung!");
      return;
    }

    // Determine Month from selected date
    const d = new Date(date);
    const monthName = !isNaN(d.getTime()) ? MONTHS[d.getMonth()] : "Agustus";
    const yearStr = !isNaN(d.getTime()) ? d.getFullYear().toString() : "2026";

    const ownerId = currentUser?.id || "usr_guru1";
    const ownerName = currentUser?.name || profile.teacherName;

    const newItem: SikepoItem = {
      id: `SKP-${Date.now().toString().slice(-6)}`,
      userId: ownerId,
      userName: ownerName,
      title,
      category,
      description,
      date,
      time,
      fileName: fileName || "Bukti_Dukung_Kinerja.pdf",
      fileType: fileType || "application/pdf",
      fileSize: fileSize || "500 KB",
      fileDataUrl: fileDataUrl || undefined,
      driveUrl: driveUrl || "https://drive.google.com/drive/u/0/my-drive",
      driveFolder: driveFolder || `SIKEPO_${yearStr}/${monthName}`,
      status: "Tersimpan di Google Drive",
      createdAt: new Date().toISOString(),
    };

    const updated = [newItem, ...items];
    setItems(updated);
    saveSikepoItems(updated, ownerId);

    // Reset Form
    setTitle("");
    setDescription("");
    setFileName("");
    setFileDataUrl("");
    setFileSize("");
    setIsFormOpen(false);
    showToast("Bukti dukung berhasil disimpan & terkonversi PDF!");
  };

  const handleDelete = (id: string, itemTitle: string) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus bukti dukung "${itemTitle}"?`)) {
      const updated = items.filter((it) => it.id !== id);
      setItems(updated);
      saveSikepoItems(updated);
      showToast("Bukti dukung berhasil dihapus.");
    }
  };

  // Filter Items
  const filteredItems = items.filter((item) => {
    const itemDate = new Date(item.date);
    const itemMonth = !isNaN(itemDate.getTime()) ? MONTHS[itemDate.getMonth()] : "";
    const itemYear = !isNaN(itemDate.getTime()) ? itemDate.getFullYear().toString() : "";

    const matchMonth = filterMonth === "Semua" || itemMonth === filterMonth;
    const matchYear = filterYear === "Semua" || itemYear === filterYear;
    const matchCategory = filterCategory === "Semua" || item.category === filterCategory;
    const matchSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.fileName && item.fileName.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchMonth && matchYear && matchCategory && matchSearch;
  });

  const handlePrintMonthlyReport = () => {
    const periodStr =
      filterMonth === "Semua" ? `Tahun ${filterYear}` : `Bulan ${filterMonth} ${filterYear}`;

    onOpenPrint({
      type: "sikepo",
      title: `LAPORAN BUKTI DUKUNG KINERJA PEGAWAI (SIKEPO)`,
      subtitle: `Laporan Kinerja Bulanan Terintegrasi Google Drive`,
      periodLabel: periodStr,
      items: filteredItems,
    });
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-[#3D4035] text-[#FAF9F5] px-4 py-3 rounded-xl shadow-lg border border-[#D4A373] flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-[#E9EDC9]" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-[#FAF9F5] rounded-2xl border border-[#E2DDD0] p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="bg-[#E9EDC9] text-[#3D4035] text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-[#CCD5AE]">
              SKP & Kinerja Pegawai
            </span>
            <span className="bg-[#E8F0FE] text-[#1A73E8] text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-[#D2E3FC]">
              <CloudCheck className="w-3.5 h-3.5" /> Google Drive Sync
            </span>
          </div>
          <h1 className="text-2xl font-bold text-[#2D3127] flex items-center gap-2">
            <FolderCheck className="w-7 h-7 text-[#588157]" />
            SIKEPO — Bukti Dukung Kinerja Guru
          </h1>
          <p className="text-xs text-[#6B6E60]">
            Unggah dan dokumentasikan bukti fisik kinerja, surat tugas, modul, dan sertifikat yang dapat disesuaikan waktunya serta otomatis terarsip di Google Drive.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={() => setIsReviewModalOpen(true)}
            className="flex items-center gap-2 bg-[#E8F0FE] hover:bg-[#D2E3FC] text-[#174EA6] border border-[#D2E3FC] px-4 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer shadow-2xs"
          >
            <CheckCircle2 className="w-4 h-4 text-[#1A73E8]" />
            Review & Validasi Drive
          </button>

          <button
            onClick={() => setIsFolderPickerOpen(true)}
            className="flex items-center gap-2 bg-white hover:bg-[#F2EFE6] text-[#3D4035] border border-[#D8D4C7] px-3.5 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer shadow-2xs"
          >
            <FolderOpen className="w-4 h-4 text-[#1A73E8]" />
            Folder: {driveFolder}
          </button>

          <button
            onClick={() => setIsFormOpen(true)}
            className="flex items-center gap-2 bg-[#3D4035] hover:bg-[#2D3127] text-white px-4 py-2.5 rounded-xl font-semibold text-xs transition cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4 text-[#D4A373]" />
            Unggah Bukti Dukung
          </button>

          <button
            onClick={handlePrintMonthlyReport}
            className="flex items-center gap-2 bg-white hover:bg-[#F2EFE6] text-[#3D4035] border border-[#D8D4C7] px-4 py-2.5 rounded-xl font-semibold text-xs transition cursor-pointer shadow-2xs"
          >
            <Printer className="w-4 h-4 text-[#588157]" />
            Cetak Bulanan ({filterMonth})
          </button>
        </div>
      </div>

      {/* Super Admin Teacher Data Filter Bar */}
      {isSuperAdmin && (
        <div className="bg-[#174EA6] text-white p-4 rounded-2xl shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-[#D2E3FC]">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-[#D2E3FC]" />
            <div>
              <div className="font-bold text-xs">Panel Penjelajah Data Super Admin SKP</div>
              <p className="text-[11px] text-[#D2E3FC]">
                Sebagai Super Admin, Anda dapat memeriksa dan memvalidasi berkas RHK milik seluruh guru terdaftar.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <label className="text-xs font-bold text-[#D2E3FC]">Pilih Guru / Pegawai:</label>
            <select
              value={selectedTeacherFilter}
              onChange={(e) => setSelectedTeacherFilter(e.target.value)}
              className="bg-white text-[#174EA6] font-bold text-xs px-3 py-1.5 rounded-xl border border-[#D2E3FC] cursor-pointer"
            >
              <option value="all">Semua Guru (Kombinasi Rekapitulasi)</option>
              {allRegisteredUsers
                .filter((u) => u.role === "guru")
                .map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.nip || u.email})
                  </option>
                ))}
            </select>
          </div>
        </div>
      )}

      {/* Statistics Quick View */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#FAF9F5] p-4 rounded-xl border border-[#E2DDD0] flex items-center gap-3">
          <div className="p-3 bg-[#E9EDC9] text-[#3D4035] rounded-xl">
            <FolderOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-[#8C8F82]">Total Bukti Dukung</div>
            <div className="text-xl font-extrabold text-[#2D3127]">{items.length} Berkas</div>
          </div>
        </div>

        <div className="bg-[#FAF9F5] p-4 rounded-xl border border-[#E2DDD0] flex items-center gap-3">
          <div className="p-3 bg-[#E8F0FE] text-[#1A73E8] rounded-xl">
            <CloudCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-[#8C8F82]">Tersinkron Google Drive</div>
            <div className="text-xl font-extrabold text-[#1A73E8]">
              {items.filter((i) => i.status.includes("Drive")).length} File
            </div>
          </div>
        </div>

        <div className="bg-[#FAF9F5] p-4 rounded-xl border border-[#E2DDD0] flex items-center gap-3">
          <div className="p-3 bg-[#FEF3C7] text-[#D97706] rounded-xl">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-[#8C8F82]">Bulan Filter Aktif</div>
            <div className="text-xl font-extrabold text-[#D97706]">
              {filterMonth} {filterYear}
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-[#FAF9F5] p-4 rounded-xl border border-[#E2DDD0] space-y-3">
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-[#8C8F82] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari judul kegiatan, narasi, atau nama file..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-[#D8D4C7] pl-9 pr-3 py-2 rounded-xl text-xs text-[#2D3127] focus:outline-hidden focus:ring-1 focus:ring-[#3D4035]"
            />
          </div>

          {/* Filter Bulan */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Filter className="w-4 h-4 text-[#8C8F82] shrink-0" />
            <select
              value={filterMonth}
              onChange={(e) => setFilterMonth(e.target.value)}
              className="bg-white border border-[#D8D4C7] px-3 py-2 rounded-xl text-xs font-semibold text-[#3D4035] focus:outline-hidden"
            >
              <option value="Semua">Semua Bulan</option>
              {MONTHS.map((m) => (
                <option key={m} value={m}>
                  Bulan {m}
                </option>
              ))}
            </select>

            <select
              value={filterYear}
              onChange={(e) => setFilterYear(e.target.value)}
              className="bg-white border border-[#D8D4C7] px-3 py-2 rounded-xl text-xs font-semibold text-[#3D4035] focus:outline-hidden"
            >
              <option value="2026">2026</option>
              <option value="2025">2025</option>
            </select>

            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="bg-white border border-[#D8D4C7] px-3 py-2 rounded-xl text-xs font-semibold text-[#3D4035] focus:outline-hidden max-w-[180px] truncate"
            >
              <option value="Semua">Semua Kategori</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Table / Data View */}
      <div className="bg-[#FAF9F5] rounded-2xl border border-[#E2DDD0] overflow-hidden">
        <div className="p-4 border-b border-[#E2DDD0] flex items-center justify-between">
          <div className="font-bold text-sm text-[#2D3127] flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#588157]" />
            Daftar Bukti Dukung Kinerja ({filteredItems.length} Data)
          </div>

          <a
            href="https://drive.google.com/drive/u/0/my-drive"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-[#1A73E8] hover:underline font-semibold"
          >
            <ExternalLink className="w-3.5 h-3.5" /> Buka Google Drive
          </a>
        </div>

        {filteredItems.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <FolderCheck className="w-12 h-12 text-[#8C8F82] mx-auto opacity-50" />
            <p className="text-sm font-semibold text-[#3D4035]">Belum ada bukti dukung untuk filter ini</p>
            <p className="text-xs text-[#6B6E60]">
              Klik tombol &quot;Unggah Bukti Dukung&quot; di atas untuk menambahkan berkas kinerja Anda.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F2EFE6] text-[#2D3127] font-semibold border-b border-[#E2DDD0]">
                <tr>
                  <th className="p-3 text-center w-10">No</th>
                  <th className="p-3 w-36">Waktu & Tanggal</th>
                  <th className="p-3">Judul Kegiatan & Kategori RHK</th>
                  <th className="p-3 max-w-xs">Deskripsi Bukti Dukung</th>
                  <th className="p-3 w-48">Berkas & Google Drive</th>
                  <th className="p-3 text-center w-24">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2DDD0] bg-white">
                {filteredItems.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-[#FAF9F5] transition">
                    <td className="p-3 text-center font-bold text-[#8C8F82]">{idx + 1}</td>
                    <td className="p-3">
                      <div className="font-bold text-[#2D3127] flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-[#588157]" />
                        {new Date(item.date).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </div>
                      <div className="text-[11px] text-[#6B6E60] flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3 text-[#D4A373]" />
                        {item.time}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="font-bold text-[#2D3127] text-sm">{item.title}</div>
                      <span className="inline-block mt-1 text-[10px] font-semibold bg-[#E9EDC9] text-[#3D4035] px-2 py-0.5 rounded-md border border-[#CCD5AE]">
                        {item.category}
                      </span>
                    </td>
                    <td className="p-3 text-[#6B6E60] leading-snug line-clamp-2 max-w-xs">
                      {item.description || "-"}
                    </td>
                    <td className="p-3">
                      <div className="bg-[#F9F8F3] p-2 rounded-lg border border-[#E2DDD0] space-y-1">
                        <div className="font-mono text-[11px] font-bold text-[#2D3127] truncate flex items-center gap-1">
                          <FileImage className="w-3.5 h-3.5 text-[#588157] shrink-0" />
                          <span className="truncate">{item.fileName}</span>
                        </div>
                        <div className="text-[10px] text-[#1A73E8] font-bold flex items-center gap-1">
                          <CloudCheck className="w-3 h-3" />
                          {item.status}
                        </div>
                        {item.driveFolder && (
                          <div className="text-[9.5px] text-[#8C8F82]">Folder: {item.driveFolder}</div>
                        )}
                      </div>
                    </td>
                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => generateRhkPdf(item, profile)}
                          className="p-1.5 bg-[#E8F0FE] hover:bg-[#D2E3FC] text-[#174EA6] rounded-lg transition"
                          title="Unduh PDF Resi Bukti Dukung"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setPreviewItem(item)}
                          className="p-1.5 bg-[#F2EFE6] hover:bg-[#E5E1D5] text-[#3D4035] rounded-lg transition"
                          title="Lihat Detail & Pratinjau"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id, item.title)}
                          className="p-1.5 bg-[#F8D7DA] hover:bg-[#f3c1c6] text-[#842029] rounded-lg transition"
                          title="Hapus Bukti Dukung"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Form Modal Unggah Bukti Dukung */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF9F5] border border-[#E2DDD0] rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#E2DDD0] pb-3">
              <div className="flex items-center gap-2 font-bold text-base text-[#2D3127]">
                <FolderCheck className="w-5 h-5 text-[#588157]" />
                Unggah Bukti Dukung Kinerja (SIKEPO)
              </div>
              <button
                onClick={() => setIsFormOpen(false)}
                className="text-[#8C8F82] hover:text-[#2D3127] p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {/* Judul Kegiatan */}
              <div>
                <label className="block font-bold text-[#3D4035] mb-1">
                  Judul Bukti Dukung / Sub-Kegiatan Kinerja <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Misal: Modul Ajar Bab 1 / Sertifikat Seminar AI / Laporan Wali Kelas"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-white border border-[#D8D4C7] p-2.5 rounded-xl text-xs text-[#2D3127] focus:ring-1 focus:ring-[#3D4035] focus:outline-hidden"
                />
              </div>

              {/* Kategori RHK */}
              <div>
                <label className="block font-bold text-[#3D4035] mb-1">Kategori / Rencana Hasil Kerja (RHK)</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-white border border-[#D8D4C7] p-2.5 rounded-xl text-xs font-semibold text-[#3D4035] focus:outline-hidden"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Waktu & Tanggal Pelaksanaan (Dapat Disesuaikan) */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#3D4035] mb-1 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#588157]" /> Tanggal Pelaksanaan
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-white border border-[#D8D4C7] p-2.5 rounded-xl text-xs text-[#2D3127] focus:outline-hidden font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#3D4035] mb-1 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#D4A373]" /> Jam / Waktu
                  </label>
                  <input
                    type="text"
                    placeholder="Misal: 08:00 - 11:30 WIB"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full bg-white border border-[#D8D4C7] p-2.5 rounded-xl text-xs text-[#2D3127] focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Deskripsi & Narasi Detail */}
              <div>
                <label className="block font-bold text-[#3D4035] mb-1">
                  Deskripsi & Narasi Ringkas Bukti Dukung
                </label>
                <textarea
                  rows={3}
                  placeholder="Jelaskan ringkasan isi berkas, tujuan, hasil pencapaian, atau keterangan pendukung lainnya..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-white border border-[#D8D4C7] p-2.5 rounded-xl text-xs text-[#2D3127] focus:ring-1 focus:ring-[#3D4035] focus:outline-hidden"
                />
              </div>

              {/* Unggah Berkas Physical / Image / Document */}
              <div>
                <label className="block font-bold text-[#3D4035] mb-1 flex items-center gap-1">
                  <Upload className="w-3.5 h-3.5 text-[#588157]" /> File Bukti Dukung (.jpg, .png, .pdf, .docx, .xlsx)
                </label>
                
                <div className="border-2 border-dashed border-[#D8D4C7] bg-white rounded-xl p-4 text-center cursor-pointer hover:bg-[#FAF9F5] transition">
                  <input
                    type="file"
                    accept="image/*,application/pdf,.doc,.docx,.xls,.xlsx"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="sikepo-file-input"
                  />
                  <label htmlFor="sikepo-file-input" className="cursor-pointer space-y-1 block">
                    <Upload className="w-6 h-6 text-[#8C8F82] mx-auto" />
                    <div className="font-semibold text-[#3D4035]">
                      {fileName ? fileName : "Klik di sini untuk memilih file bukti dukung"}
                    </div>
                    {fileSize && (
                      <div className="text-[10px] text-[#588157] font-bold">
                        Ukuran: {fileSize} &bull; Tipe: {fileType}
                      </div>
                    )}
                  </label>
                </div>
              </div>

              {/* Google Drive Folder Settings */}
              <div className="bg-[#E8F0FE] p-3 rounded-xl border border-[#D2E3FC] space-y-2">
                <div className="font-bold text-[#174EA6] flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <CloudCheck className="w-4 h-4" /> Penyimpanan Google Drive
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsFolderPickerOpen(true)}
                    className="text-[11px] font-bold text-[#1A73E8] hover:underline flex items-center gap-1 cursor-pointer bg-white px-2 py-0.5 rounded-md border border-[#D2E3FC]"
                  >
                    <FolderOpen className="w-3.5 h-3.5" /> Pilih Folder
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <label className="block font-semibold text-[#3C4043] mb-0.5">Target Folder Drive</label>
                    <input
                      type="text"
                      value={driveFolder}
                      onChange={(e) => setDriveFolder(e.target.value)}
                      className="w-full bg-white border border-[#BDC1C6] px-2.5 py-1.5 rounded-lg text-[#202124]"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[#3C4043] mb-0.5">Link Google Drive</label>
                    <input
                      type="text"
                      value={driveUrl}
                      onChange={(e) => setDriveUrl(e.target.value)}
                      className="w-full bg-white border border-[#BDC1C6] px-2.5 py-1.5 rounded-lg text-[#202124] truncate"
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E2DDD0]">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#D8D4C7] bg-white text-[#3D4035] hover:bg-[#F2EFE6] font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#3D4035] text-white hover:bg-[#2D3127] font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <CloudCheck className="w-4 h-4 text-[#D4A373]" /> Simpan & Sync Google Drive
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Preview Detail */}
      {previewItem && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF9F5] border border-[#E2DDD0] rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#E2DDD0] pb-3">
              <div className="font-bold text-base text-[#2D3127]">Detail Bukti Dukung Kinerja</div>
              <button
                onClick={() => setPreviewItem(null)}
                className="text-[#8C8F82] hover:text-[#2D3127] p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-[#8C8F82] font-semibold block">Judul Kegiatan:</span>
                <h3 className="font-bold text-sm text-[#2D3127]">{previewItem.title}</h3>
              </div>

              <div className="grid grid-cols-2 gap-2 bg-[#F2EFE6] p-3 rounded-xl border border-[#E2DDD0]">
                <div>
                  <span className="text-[#8C8F82] font-semibold block">Kategori RHK:</span>
                  <span className="font-bold text-[#3D4035]">{previewItem.category}</span>
                </div>
                <div>
                  <span className="text-[#8C8F82] font-semibold block">Tanggal & Jam:</span>
                  <span className="font-bold text-[#2D3127]">
                    {previewItem.date} ({previewItem.time})
                  </span>
                </div>
              </div>

              <div>
                <span className="text-[#8C8F82] font-semibold block">Deskripsi:</span>
                <p className="bg-white p-3 rounded-xl border border-[#E2DDD0] text-[#3D4035] leading-relaxed">
                  {previewItem.description || "Tidak ada deskripsi tambahan."}
                </p>
              </div>

              {previewItem.fileDataUrl && previewItem.fileType?.startsWith("image/") && (
                <div>
                  <span className="text-[#8C8F82] font-semibold block mb-1">Pratinjau Gambar File:</span>
                  <div className="bg-white p-2 rounded-xl border border-[#E2DDD0] max-h-48 overflow-hidden flex items-center justify-center">
                    <img
                      src={previewItem.fileDataUrl}
                      alt="Pratinjau Bukti"
                      className="max-h-44 object-contain rounded-lg"
                    />
                  </div>
                </div>
              )}

              <div className="bg-[#E8F0FE] p-3 rounded-xl border border-[#D2E3FC] flex items-center justify-between">
                <div>
                  <div className="font-bold text-[#174EA6]">{previewItem.fileName}</div>
                  <div className="text-[10px] text-[#5F6368]">{previewItem.status}</div>
                </div>
                <a
                  href={previewItem.driveUrl || "https://drive.google.com/drive/u/0/my-drive"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-[#1A73E8] text-white rounded-lg font-bold flex items-center gap-1 hover:bg-[#1557B0]"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> Google Drive
                </a>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-[#E2DDD0]">
              <button
                onClick={() => setPreviewItem(null)}
                className="px-4 py-2 bg-[#3D4035] text-white rounded-xl font-bold cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Folder Picker Google Drive */}
      {isFolderPickerOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF9F5] border border-[#E2DDD0] rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#E2DDD0] pb-3">
              <div className="font-bold text-base text-[#2D3127] flex items-center gap-2">
                <FolderOpen className="w-5 h-5 text-[#1A73E8]" />
                Pilih Folder Penyimpanan Google Drive
              </div>
              <button
                onClick={() => setIsFolderPickerOpen(false)}
                className="text-[#8C8F82] hover:text-[#2D3127] p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-[#6B6E60]">
              Pilih salah satu direktori folder Google Drive di bawah ini untuk mengelompokkan bukti dukung SKP & Kinerja Pegawai Anda:
            </p>

            {/* Folder Presets Grid */}
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {FOLDER_PRESETS.map((preset) => {
                const isSelected = driveFolder === preset.name;
                return (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => {
                      setDriveFolder(preset.name);
                      showToast(`Folder aktif diubah ke: ${preset.name}`);
                      setIsFolderPickerOpen(false);
                    }}
                    className={`w-full text-left p-3 rounded-xl border transition flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? "bg-[#E8F0FE] border-[#1A73E8] text-[#174EA6]"
                        : "bg-white border-[#E2DDD0] hover:bg-[#F2EFE6] text-[#2D3127]"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <FolderOpen className={`w-5 h-5 ${isSelected ? "text-[#1A73E8]" : "text-[#588157]"}`} />
                      <div>
                        <div className="font-bold text-xs">{preset.name}</div>
                        <div className="text-[10px] text-[#6B6E60]">{preset.desc}</div>
                      </div>
                    </div>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-[#1A73E8] shrink-0" />}
                  </button>
                );
              })}
            </div>

            {/* Custom Folder Input */}
            <div className="pt-2 border-t border-[#E2DDD0] space-y-2">
              <label className="block text-xs font-bold text-[#3D4035]">Atau Buat / Ketik Folder Baru Custom:</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Misal: SIKEPO_2026/Laporan_Khusus"
                  value={customFolderInput}
                  onChange={(e) => setCustomFolderInput(e.target.value)}
                  className="flex-1 bg-white border border-[#D8D4C7] p-2 rounded-xl text-xs text-[#2D3127]"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (customFolderInput.trim()) {
                      setDriveFolder(customFolderInput.trim());
                      showToast(`Folder diubah ke: ${customFolderInput.trim()}`);
                      setCustomFolderInput("");
                      setIsFolderPickerOpen(false);
                    }
                  }}
                  className="px-3 py-2 bg-[#3D4035] text-white rounded-xl font-bold text-xs hover:bg-[#2D3127] cursor-pointer"
                >
                  Terapkan
                </button>
              </div>
            </div>

            {/* Direct Google Drive Link */}
            <div className="bg-[#F2EFE6] p-3 rounded-xl border border-[#E2DDD0] flex items-center justify-between">
              <div className="text-xs text-[#3D4035] font-semibold">
                Akses langsung akun Google Drive Anda:
              </div>
              <a
                href={driveUrl || "https://drive.google.com/drive/u/0/my-drive"}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 bg-[#1A73E8] text-white rounded-lg font-bold text-xs flex items-center gap-1 hover:bg-[#1557B0]"
              >
                <ExternalLink className="w-3.5 h-3.5" /> Buka Google Drive
              </a>
            </div>

            <div className="flex justify-end pt-2 border-t border-[#E2DDD0]">
              <button
                type="button"
                onClick={() => setIsFolderPickerOpen(false)}
                className="px-4 py-2 bg-white border border-[#D8D4C7] text-[#3D4035] rounded-xl font-bold text-xs hover:bg-[#F2EFE6] cursor-pointer"
              >
                Selesai
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Google Drive Review & Validation Modal */}
      <GoogleDriveReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        items={items}
        profile={profile}
        driveFolder={driveFolder}
        currentUser={currentUser}
        onUpdateUserDriveUrl={onUpdateUserDriveUrl}
      />
    </div>
  );
};
