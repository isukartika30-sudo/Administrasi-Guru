import React, { useState, useEffect } from "react";
import { User } from "firebase/auth";
import {
  initAuth,
  googleSignIn,
  googleLogout,
  getAccessToken,
} from "../utils/googleAuth";
import {
  listDriveFiles,
  uploadFileToDrive,
  deleteFileFromDrive,
  createGoogleSheet,
  createGoogleDoc,
  DriveFile,
} from "../utils/googleWorkspace";
import {
  getCps,
  getTps,
  getAtps,
  getKktps,
  getAttendanceRecords,
  getAssessments,
  getJournals,
  getProtaProsems,
  getClasses,
} from "../utils/storage";
import {
  FileSpreadsheet,
  FileText,
  FolderOpen,
  LogOut,
  RefreshCw,
  ExternalLink,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Search,
  UploadCloud,
  FileCode,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

export const GoogleWorkspaceModule: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"sheets" | "docs" | "drive">("sheets");

  // Drive state
  const [driveFiles, setDriveFiles] = useState<DriveFile[]>([]);
  const [driveFilter, setDriveFilter] = useState<"all" | "sheets" | "docs">("all");
  const [driveSearch, setDriveSearch] = useState<string>("");
  const [loadingDrive, setLoadingDrive] = useState<boolean>(false);

  // Status message
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Quick export state
  const [exporting, setExporting] = useState<string | null>(null);
  const [lastCreatedUrl, setLastCreatedUrl] = useState<{ title: string; url: string } | null>(null);

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    const unsubscribe = initAuth(
      (currentUser, token) => {
        setUser(currentUser);
        setAccessToken(token);
        fetchDriveFiles(token, driveFilter);
      },
      () => {
        setUser(null);
        setAccessToken(null);
      }
    );
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    setIsLoggingIn(true);
    try {
      const res = await googleSignIn();
      if (res) {
        setUser(res.user);
        setAccessToken(res.accessToken);
        showToast("success", `Berhasil masuk sebagai ${res.user.displayName || res.user.email}`);
        fetchDriveFiles(res.accessToken, driveFilter);
      }
    } catch (err: any) {
      showToast("error", err.message || "Gagal melakukan Login Google");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await googleLogout();
    setUser(null);
    setAccessToken(null);
    setDriveFiles([]);
    showToast("success", "Berhasil keluar dari akun Google");
  };

  const fetchDriveFiles = async (token: string | null, filter: "all" | "sheets" | "docs") => {
    if (!token) return;
    setLoadingDrive(true);
    try {
      const files = await listDriveFiles(token, filter);
      setDriveFiles(files);
    } catch (err: any) {
      console.error("Fetch drive files error:", err);
    } finally {
      setLoadingDrive(false);
    }
  };

  const handleDeleteDriveFile = async (fileId: string, fileName: string) => {
    if (!accessToken) return;
    const confirmed = window.confirm(
      `Apakah Anda yakin ingin menghapus file "${fileName}" dari Google Drive Anda? Tindakan ini tidak dapat dibatalkan.`
    );
    if (!confirmed) return;

    try {
      await deleteFileFromDrive(accessToken, fileId);
      showToast("success", `File "${fileName}" telah dihapus dari Google Drive.`);
      fetchDriveFiles(accessToken, driveFilter);
    } catch (err: any) {
      showToast("error", err.message || "Gagal menghapus file");
    }
  };

  // 1. Export CP, TP, ATP to Google Sheets
  const handleExportKurikulumSheets = async () => {
    if (!accessToken) {
      showToast("error", "Silakan login Google terlebih dahulu");
      return;
    }
    setExporting("kurikulum_sheets");
    try {
      const cps = getCps();
      const tps = getTps();
      const atps = getAtps();
      const kktps = getKktps();

      const res = await createGoogleSheet(
        accessToken,
        `Integrasi Kurikulum Merdeka - CP, TP, ATP (${new Date().toLocaleDateString("id-ID")})`,
        [
          {
            title: "1. CP (Capaian Pembelajaran)",
            headers: ["Kode", "Mata Pelajaran", "Fase", "Elemen", "Deskripsi CP", "Target JP"],
            rows: cps.map((c) => [c.code, c.subject, c.fase, c.element, c.description, c.targetJP]),
          },
          {
            title: "2. TP (Tujuan Pembelajaran)",
            headers: ["Kode TP", "ID CP Induk", "Rumusan TP", "KKO Bloom", "Lingkup Materi", "JP"],
            rows: tps.map((t) => [t.code, t.cpId, t.statement, t.kko, t.scope, t.targetJP]),
          },
          {
            title: "3. ATP (Alur Tujuan)",
            headers: ["Kode ATP", "Semester", "Materi / Topik Utama", "Alokasi JP", "Profil Pancasila", "Metode Asesmen"],
            rows: atps.map((a) => [a.code, a.semester, a.materi, a.jp, a.pancasilaProfiles?.join(", ") || "-", a.assessmentMethod]),
          },
          {
            title: "4. KKTP & KKM",
            headers: ["ID TP", "KKM Target", "Kompleksitas", "Daya Dukung", "Intake", "Rubrik Belum", "Rubrik Mahir"],
            rows: kktps.map((k) => [k.tpId, k.kkmValue, k.kkmKompleksitas, k.kkmDayaDukung, k.kkmIntake, k.intervalBelum, k.intervalMahir]),
          },
        ]
      );

      setLastCreatedUrl({
        title: "Dokumen Google Sheets CP, TP, ATP & KKTP",
        url: res.spreadsheetUrl,
      });
      showToast("success", "Berhasil membuat Google Sheets Kurikulum!");
      fetchDriveFiles(accessToken, driveFilter);
    } catch (err: any) {
      showToast("error", err.message || "Gagal membuat Google Spreadsheet");
    } finally {
      setExporting(null);
    }
  };

  // 2. Export Absensi & Rekap Nilai to Google Sheets
  const handleExportAbsensiNilaiSheets = async () => {
    if (!accessToken) {
      showToast("error", "Silakan login Google terlebih dahulu");
      return;
    }
    setExporting("absensi_sheets");
    try {
      const attendance = getAttendanceRecords();
      const assessments = getAssessments();
      const classes = getClasses();

      const res = await createGoogleSheet(
        accessToken,
        `Data Absensi & Rekap Nilai Siswa (${new Date().toLocaleDateString("id-ID")})`,
        [
          {
            title: "Daftar Absensi Harian",
            headers: ["Tanggal", "Kelas", "Mata Pelajaran", "Pertemuan Ke", "ID Siswa", "Status", "Keterangan"],
            rows: attendance.map((a) => [a.date, a.className, a.subject, a.meetingNumber, a.studentId, a.status, a.notes || "-"]),
          },
          {
            title: "Rekap Nilai Siswa",
            headers: ["ID Siswa", "Nama Siswa", "Kelas", "Mata Pelajaran", "Nilai PTS", "Nilai PAS", "Predikat", "Deskripsi Rapor"],
            rows: assessments.map((n) => [n.studentId, n.studentName, n.classId, n.subject, n.pts, n.pas, n.predicate || "-", n.narrative || "-"]),
          },
        ]
      );

      setLastCreatedUrl({
        title: "Dokumen Google Sheets Absensi & Rekap Nilai",
        url: res.spreadsheetUrl,
      });
      showToast("success", "Berhasil membuat Google Sheets Absensi & Nilai!");
      fetchDriveFiles(accessToken, driveFilter);
    } catch (err: any) {
      showToast("error", err.message || "Gagal export ke Google Sheets");
    } finally {
      setExporting(null);
    }
  };

  // 3. Export Perangkat Ajar to Google Docs
  const handleExportModulDoc = async () => {
    if (!accessToken) {
      showToast("error", "Silakan login Google terlebih dahulu");
      return;
    }
    setExporting("modul_doc");
    try {
      const cps = getCps();
      const tps = getTps();
      const atps = getAtps();

      let formattedText = `PERANGKAT AJAR KURIKULUM MERDEKA\nTanggal Dibuat: ${new Date().toLocaleDateString("id-ID")}\n\n`;
      formattedText += `A. CAPAIAN PEMBELAJARAN (CP)\n`;
      cps.forEach((c) => {
        formattedText += `\n[${c.code}] Elemen: ${c.element} (Fase ${c.fase})\nDeskripsi: ${c.description}\nTarget Alokasi Waktu: ${c.targetJP} JP\n`;
      });

      formattedText += `\n\nB. TUJUAN PEMBELAJARAN (TP)\n`;
      tps.forEach((t) => {
        formattedText += `\n[${t.code}] ${t.statement}\nKKO: ${t.kko} | Lingkup: ${t.scope} (${t.targetJP} JP)\n`;
      });

      formattedText += `\n\nC. ALUR TUJUAN PEMBELAJARAN (ATP)\n`;
      atps.forEach((a) => {
        formattedText += `\nSemester ${a.semester} - Urutan ${a.order}: ${a.materi}\nMetode Asesmen: ${a.assessmentMethod}\n`;
      });

      const res = await createGoogleDoc(
        accessToken,
        `Modul Ajar & Dokumen Kurikulum Merdeka (${new Date().toLocaleDateString("id-ID")})`,
        formattedText
      );

      setLastCreatedUrl({
        title: "Dokumen Google Docs Perangkat Ajar",
        url: res.documentUrl,
      });
      showToast("success", "Berhasil membuat dokumen Google Docs!");
      fetchDriveFiles(accessToken, driveFilter);
    } catch (err: any) {
      showToast("error", err.message || "Gagal membuat dokumen Google Docs");
    } finally {
      setExporting(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toast && (
        <div
          className={`fixed bottom-5 right-5 z-50 text-white px-4 py-3 rounded-xl shadow-xl text-xs font-semibold flex items-center gap-2 animate-bounce ${
            toast.type === "success"
              ? "bg-[#3D4035] border border-[#D4A373]"
              : "bg-[#842029] border border-[#F5C2C7]"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-[#D4A373]" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-300" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-[#3D4035] text-[#FAF9F5] p-6 rounded-3xl shadow-xl border border-[#2D3126] flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-[#D4A373] uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-[#D4A373]" />
            Integrasi Resmi Google Workspace
          </div>
          <h2 className="text-xl font-bold text-white">
            Google Sheets, Google Drive & Google Docs Integration
          </h2>
          <p className="text-xs text-[#E2DDD0] max-w-2xl leading-relaxed">
            Satu klik untuk membuat, mengekspor, dan mengelola dokumen CP/TP/ATP, Rekap Nilai, Absensi, dan Jurnal Mengajar langsung di akun Google Drive, Sheets, dan Docs Anda secara aman!
          </p>
        </div>

        {/* Auth Section */}
        <div className="bg-[#2D3126] p-4 rounded-2xl border border-[#4E5244] shrink-0 text-xs">
          {user ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || "Google Account"}
                    className="w-10 h-10 rounded-full border border-[#D4A373]"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-[#D4A373] text-[#2D3127] font-bold flex items-center justify-center text-sm">
                    {user.displayName?.charAt(0) || "G"}
                  </div>
                )}
                <div>
                  <div className="font-bold text-white truncate max-w-[180px]">
                    {user.displayName || "Google User"}
                  </div>
                  <div className="text-[10px] text-[#C8C5B8] truncate max-w-[180px]">
                    {user.email}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1 border-t border-[#4E5244]">
                <span className="inline-flex items-center gap-1 text-[10px] bg-[#588157]/30 text-[#A3B18A] px-2 py-0.5 rounded-full font-semibold">
                  <CheckCircle2 className="w-3 h-3 text-[#A3B18A]" />
                  OAuth Terhubung
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 text-[11px] text-[#F5C2C7] hover:underline ml-auto cursor-pointer"
                >
                  <LogOut className="w-3 h-3" />
                  Keluar
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3 text-center">
              <p className="text-[#E2DDD0] font-medium text-xs">
                Hubungkan dengan Google Account Anda:
              </p>

              <button
                onClick={handleLogin}
                disabled={isLoggingIn}
                className="gsi-material-button w-full flex items-center justify-center gap-2 bg-white text-gray-800 font-semibold px-4 py-2.5 rounded-xl hover:bg-gray-100 transition cursor-pointer shadow-md text-xs border border-gray-300"
              >
                <svg className="w-4 h-4" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                </svg>
                <span>{isLoggingIn ? "Menghubungkan..." : "Sign in with Google"}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Success Last Created Notification Banner */}
      {lastCreatedUrl && (
        <div className="bg-[#E9EDC9] border border-[#CCD5AE] p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#3D4035]">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#588157] shrink-0" />
            <div>
              <strong>Dokumen Berhasil Dibuat di Google Workspace!</strong>
              <p className="text-[11px] text-[#4E5244]">{lastCreatedUrl.title}</p>
            </div>
          </div>

          <a
            href={lastCreatedUrl.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 bg-[#3D4035] hover:bg-[#2F3327] text-white font-bold px-4 py-2 rounded-xl text-xs transition cursor-pointer shrink-0"
          >
            <span>Buka Dokumen</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      )}

      {/* Tab Selector */}
      <div className="bg-white rounded-2xl border border-[#E2DDD0] p-2 shadow-2xs flex flex-wrap items-center gap-2">
        <button
          onClick={() => setActiveTab("sheets")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer ${
            activeTab === "sheets"
              ? "bg-[#3D4035] text-[#FAF9F5]"
              : "text-[#4E5244] hover:bg-[#F4F2EA]"
          }`}
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
          1. Export Google Sheets
        </button>

        <button
          onClick={() => setActiveTab("docs")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer ${
            activeTab === "docs"
              ? "bg-[#3D4035] text-[#FAF9F5]"
              : "text-[#4E5244] hover:bg-[#F4F2EA]"
          }`}
        >
          <FileText className="w-4 h-4 text-blue-500" />
          2. Export Google Docs
        </button>

        <button
          onClick={() => setActiveTab("drive")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer ${
            activeTab === "drive"
              ? "bg-[#3D4035] text-[#FAF9F5]"
              : "text-[#4E5244] hover:bg-[#F4F2EA]"
          }`}
        >
          <FolderOpen className="w-4 h-4 text-amber-500" />
          3. Browser Google Drive
        </button>
      </div>

      {/* TAB 1: GOOGLE SHEETS */}
      {activeTab === "sheets" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl border border-[#E2DDD0] p-5 shadow-2xs space-y-4 hover:border-[#D4A373] transition">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-[#2D3127] text-sm">
                  Spreadsheet CP, TP, ATP & KKTP
                </h3>
                <p className="text-xs text-[#6B6E60]">
                  Ekspor seluruh matriks Capaian Pembelajaran, Rumusan Tujuan, Alur ATP, dan KKM ke dalam Google Sheets resmi.
                </p>
              </div>
            </div>

            <button
              onClick={handleExportKurikulumSheets}
              disabled={exporting === "kurikulum_sheets" || !user}
              className="w-full flex items-center justify-center gap-2 bg-[#588157] hover:bg-[#466845] disabled:bg-gray-300 text-white font-bold py-2.5 rounded-xl text-xs transition cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4" />
              {exporting === "kurikulum_sheets"
                ? "Memproses Export..."
                : "Buat Google Sheets Kurikulum"}
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-[#E2DDD0] p-5 shadow-2xs space-y-4 hover:border-[#D4A373] transition">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-[#2D3127] text-sm">
                  Spreadsheet Absensi & Rekap Nilai
                </h3>
                <p className="text-xs text-[#6B6E60]">
                  Ekspor jurnal hadir harian, catatan izin/sakit, serta rekapitulasi nilai formatif & sumatif rapor siswa.
                </p>
              </div>
            </div>

            <button
              onClick={handleExportAbsensiNilaiSheets}
              disabled={exporting === "absensi_sheets" || !user}
              className="w-full flex items-center justify-center gap-2 bg-[#D4A373] hover:bg-[#c29263] disabled:bg-gray-300 text-[#2D3127] font-bold py-2.5 rounded-xl text-xs transition cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4" />
              {exporting === "absensi_sheets"
                ? "Memproses Export..."
                : "Buat Google Sheets Absensi & Nilai"}
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: GOOGLE DOCS */}
      {activeTab === "docs" && (
        <div className="bg-white rounded-2xl border border-[#E2DDD0] p-6 shadow-2xs space-y-4">
          <div className="flex items-center gap-3 border-b border-[#F0EEE4] pb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-[#2D3127] text-sm">
                Dokumen Modul Ajar & Perangkat Guru (Google Docs)
              </h3>
              <p className="text-xs text-[#6B6E60]">
                Format Rencana Pembelajaran / Modul Ajar lengkap berdasar acuan CP, TP, dan ATP dalam format Google Docs yang siap diedit dan dicetak.
              </p>
            </div>
          </div>

          <div className="space-y-3 text-xs text-[#3D4035]">
            <p>
              Dokumen Google Docs yang dibuat akan mencakup bab utama berikut:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-[#6B6E60]">
              <li>Profil Capaian Pembelajaran (CP) acuan BSKAP</li>
              <li>Tujuan Pembelajaran (TP) & Indikator Ketercapaian</li>
              <li>Alur Tujuan Pembelajaran (ATP) per Semester</li>
              <li>Rencana Asesmen Formatif, Sumatif & Remedial</li>
            </ul>

            <div className="pt-2">
              <button
                onClick={handleExportModulDoc}
                disabled={exporting === "modul_doc" || !user}
                className="flex items-center gap-2 bg-[#3D4035] hover:bg-[#2F3327] disabled:bg-gray-300 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition cursor-pointer shadow-md"
              >
                <Plus className="w-4 h-4 text-[#D4A373]" />
                {exporting === "modul_doc"
                  ? "Membuat Google Docs..."
                  : "Buat Dokumen Google Docs Perangkat Ajar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: GOOGLE DRIVE FILE BROWSER */}
      {activeTab === "drive" && (
        <div className="bg-white rounded-2xl border border-[#E2DDD0] p-6 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F0EEE4] pb-4">
            <div className="flex items-center gap-2">
              <FolderOpen className="w-5 h-5 text-amber-500" />
              <h3 className="font-bold text-[#2D3127] text-sm">
                Manajer File Google Drive Anda
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => fetchDriveFiles(accessToken, driveFilter)}
                className="p-2 text-[#4E5244] hover:bg-[#F4F2EA] rounded-xl border border-[#D8D4C7] transition cursor-pointer"
                title="Muat ulang file Drive"
              >
                <RefreshCw className={`w-4 h-4 ${loadingDrive ? "animate-spin" : ""}`} />
              </button>
            </div>
          </div>

          {/* Drive File List */}
          {!user ? (
            <div className="text-center py-10 space-y-2">
              <FolderOpen className="w-10 h-10 text-gray-300 mx-auto" />
              <p className="text-xs text-gray-500">
                Silakan lakukan Login Google di atas untuk mengakses file Google Drive Anda.
              </p>
            </div>
          ) : loadingDrive ? (
            <div className="text-center py-10 text-xs text-gray-500">
              Memuat file dari Google Drive...
            </div>
          ) : driveFiles.length === 0 ? (
            <div className="text-center py-10 space-y-2">
              <p className="text-xs text-gray-500">
                Belum ada file di folder Google Drive Anda. Cobalah ekspor dokumen dengan tombol di atas!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-2 text-xs">
              {driveFiles.map((f) => (
                <div
                  key={f.id}
                  className="flex items-center justify-between p-3 rounded-xl border border-[#F0EEE4] hover:bg-[#F9F8F3] transition"
                >
                  <div className="flex items-center gap-3">
                    {f.mimeType.includes("spreadsheet") ? (
                      <FileSpreadsheet className="w-5 h-5 text-emerald-600 shrink-0" />
                    ) : f.mimeType.includes("document") ? (
                      <FileText className="w-5 h-5 text-blue-600 shrink-0" />
                    ) : (
                      <FileCode className="w-5 h-5 text-amber-600 shrink-0" />
                    )}

                    <div className="truncate max-w-xs sm:max-w-md">
                      <h4 className="font-bold text-[#2D3127] truncate">{f.name}</h4>
                      <span className="text-[10px] text-[#8C8F82]">
                        Diubah: {f.modifiedTime ? new Date(f.modifiedTime).toLocaleDateString("id-ID") : "-"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {f.webViewLink && (
                      <a
                        href={f.webViewLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 text-[#588157] hover:bg-[#E9EDC9] rounded-lg transition"
                        title="Buka file di Google Workspace"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}

                    <button
                      onClick={() => handleDeleteDriveFile(f.id, f.name)}
                      className="p-1.5 text-[#842029] hover:bg-[#F8D7DA] rounded-lg transition"
                      title="Hapus file"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
