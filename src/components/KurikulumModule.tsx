import React, { useState } from "react";
import {
  CpItem,
  TpItem,
  AtpItem,
  KktpItem,
  ProtaProsemItem,
  PrintData,
} from "../types";
import {
  getCps,
  saveCps,
  getTps,
  saveTps,
  getAtps,
  saveAtps,
  getKktps,
  saveKktps,
  getProtaProsems,
  saveProtaProsems,
} from "../utils/storage";
import {
  BookOpenCheck,
  Compass,
  ListTree,
  CheckSquare,
  Calendar,
  Plus,
  Trash2,
  Edit,
  Printer,
  Download,
  Copy,
  Check,
  Sparkles,
  Search,
  Filter,
  FileText,
  FileSpreadsheet,
  ArrowRight,
  Layers,
  ChevronRight,
  Calculator,
  RefreshCw,
} from "lucide-react";
import { aiGenerators } from "../utils/aiService";

interface KurikulumModuleProps {
  onOpenPrint: (data: PrintData) => void;
}

export const KurikulumModule: React.FC<KurikulumModuleProps> = ({ onOpenPrint }) => {
  const [activeSubTab, setActiveSubTab] = useState<"cp" | "tp" | "atp" | "kktp" | "prota">("cp");

  // Data States
  const [cps, setCps] = useState<CpItem[]>(getCps());
  const [tps, setTps] = useState<TpItem[]>(getTps());
  const [atps, setAtps] = useState<AtpItem[]>(getAtps());
  const [kktps, setKktps] = useState<KktpItem[]>(getKktps());
  const [protaList, setProtaList] = useState<ProtaProsemItem[]>(getProtaProsems());

  // Search / Filters
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedFase, setSelectedFase] = useState<string>("Semua");
  const [selectedSemester, setSelectedSemester] = useState<"Semua" | "Ganjil" | "Genap">("Semua");

  // AI Loading & Notification
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  // Form Modals / Expand States
  const [isAddingCp, setIsAddingCp] = useState<boolean>(false);
  const [isAddingTp, setIsAddingTp] = useState<boolean>(false);
  const [isAddingAtp, setIsAddingAtp] = useState<boolean>(false);
  const [isAddingKktp, setIsAddingKktp] = useState<boolean>(false);
  const [isAddingProta, setIsAddingProta] = useState<boolean>(false);

  // New Item Temporary Forms
  const [newCp, setNewCp] = useState<Partial<CpItem>>({
    subject: "Informatika",
    fase: "E",
    element: "Berpikir Komputasional",
    code: `CP.E.${cps.length + 1}`,
    description: "",
    targetJP: 24,
  });

  const [newTp, setNewTp] = useState<Partial<TpItem>>({
    cpId: cps[0]?.id || "",
    code: `TP 1.${tps.length + 1}`,
    statement: "",
    kko: "Menganalisis [C4]",
    scope: "",
    targetJP: 8,
  });

  const [newAtp, setNewAtp] = useState<Partial<AtpItem>>({
    tpId: tps[0]?.id || "",
    code: `ATP.E.1.${atps.length + 1}`,
    semester: "1",
    order: atps.length + 1,
    materi: "",
    jp: 8,
    pancasilaProfiles: ["Bernalar Kritis", "Kreatif"],
    keywords: "",
    assessmentMethod: "Penugasan & Tes Lisan",
  });

  const [newKktp, setNewKktp] = useState<Partial<KktpItem>>({
    tpId: tps[0]?.id || "",
    kkmKompleksitas: "Sedang",
    kkmDayaDukung: "Tinggi",
    kkmIntake: "Sedang",
    kkmValue: 75,
    approach: "Rubrik Deskriptif",
    intervalBelum: "Belum mampu memahami konsep dasar (0 - 60)",
    intervalLayak: "Mampu memahami sebagian konsep dasar (61 - 75)",
    intervalCakap: "Mampu menjelaskan dan menerapkan konsep secara runtut (76 - 88)",
    intervalMahir: "Mampu menganalisis dan mengoptimalkan solusi (89 - 100)",
    remedialPlan: "Bimbingan perorangan dan tugas latihan terbimbing.",
    enrichmentPlan: "Pengayaan materi dan studi kasus lanjutan.",
  });

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // CRUD Actions
  const handleSaveCp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCp.description || !newCp.element) return;
    const item: CpItem = {
      id: `CP-${Date.now()}`,
      subject: newCp.subject || "Informatika",
      fase: (newCp.fase as any) || "E",
      element: newCp.element || "",
      code: newCp.code || `CP.${newCp.fase}.${cps.length + 1}`,
      description: newCp.description || "",
      targetJP: Number(newCp.targetJP) || 18,
    };
    const updated = [item, ...cps];
    setCps(updated);
    saveCps(updated);
    setIsAddingCp(false);
    showToast("Capaian Pembelajaran (CP) berhasil ditambahkan!");
  };

  const handleDeleteCp = (id: string) => {
    const updated = cps.filter((c) => c.id !== id);
    setCps(updated);
    saveCps(updated);
    showToast("CP berhasil dihapus.");
  };

  const handleSaveTp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTp.statement) return;
    const item: TpItem = {
      id: `TP-${Date.now()}`,
      cpId: newTp.cpId || cps[0]?.id || "",
      code: newTp.code || `TP 1.${tps.length + 1}`,
      statement: newTp.statement || "",
      kko: newTp.kko || "Menganalisis [C4]",
      scope: newTp.scope || "",
      targetJP: Number(newTp.targetJP) || 8,
    };
    const updated = [...tps, item];
    setTps(updated);
    saveTps(updated);
    setIsAddingTp(false);
    showToast("Tujuan Pembelajaran (TP) berhasil ditambahkan!");
  };

  const handleDeleteTp = (id: string) => {
    const updated = tps.filter((t) => t.id !== id);
    setTps(updated);
    saveTps(updated);
    showToast("TP berhasil dihapus.");
  };

  const handleSaveAtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAtp.materi) return;
    const item: AtpItem = {
      id: `ATP-${Date.now()}`,
      tpId: newAtp.tpId || tps[0]?.id || "",
      code: newAtp.code || `ATP.1.${atps.length + 1}`,
      semester: (newAtp.semester as any) || "1",
      order: Number(newAtp.order) || atps.length + 1,
      materi: newAtp.materi || "",
      jp: Number(newAtp.jp) || 8,
      pancasilaProfiles: newAtp.pancasilaProfiles || ["Bernalar Kritis"],
      keywords: newAtp.keywords || "",
      assessmentMethod: newAtp.assessmentMethod || "Tes Lisan & Kinerja",
    };
    const updated = [...atps, item];
    setAtps(updated);
    saveAtps(updated);
    setIsAddingAtp(false);
    showToast("Alur Tujuan Pembelajaran (ATP) berhasil ditambahkan!");
  };

  const handleDeleteAtp = (id: string) => {
    const updated = atps.filter((a) => a.id !== id);
    setAtps(updated);
    saveAtps(updated);
    showToast("ATP berhasil dihapus.");
  };

  const handleSaveKktp = (e: React.FormEvent) => {
    e.preventDefault();
    // Calculate simple KKM value from levels
    const scoreMap = { Tinggi: 85, Sedang: 75, Rendah: 65 };
    const compVal = scoreMap[newKktp.kkmKompleksitas || "Sedang"];
    const dayaVal = scoreMap[newKktp.kkmDayaDukung || "Tinggi"];
    const intakeVal = scoreMap[newKktp.kkmIntake || "Sedang"];
    const calculatedKkm = Math.round((compVal + dayaVal + intakeVal) / 3);

    const item: KktpItem = {
      id: `KKTP-${Date.now()}`,
      tpId: newKktp.tpId || tps[0]?.id || "",
      kkmKompleksitas: (newKktp.kkmKompleksitas as any) || "Sedang",
      kkmDayaDukung: (newKktp.kkmDayaDukung as any) || "Tinggi",
      kkmIntake: (newKktp.kkmIntake as any) || "Sedang",
      kkmValue: calculatedKkm,
      approach: (newKktp.approach as any) || "Rubrik Deskriptif",
      intervalBelum: newKktp.intervalBelum || "",
      intervalLayak: newKktp.intervalLayak || "",
      intervalCakap: newKktp.intervalCakap || "",
      intervalMahir: newKktp.intervalMahir || "",
      remedialPlan: newKktp.remedialPlan || "",
      enrichmentPlan: newKktp.enrichmentPlan || "",
    };
    const updated = [...kktps, item];
    setKktps(updated);
    saveKktps(updated);
    setIsAddingKktp(false);
    showToast("Kriteria Ketercapaian (KKTP / KKM) berhasil ditambahkan!");
  };

  const handleDeleteKktp = (id: string) => {
    const updated = kktps.filter((k) => k.id !== id);
    setKktps(updated);
    saveKktps(updated);
    showToast("KKTP berhasil dihapus.");
  };

  // AI Auto Derivations
  const handleAiGenerateTpFromCp = async (cpItem: CpItem) => {
    setAiLoading(true);
    try {
      const res = await aiGenerators.tp({
        subject: cpItem.subject,
        fase: cpItem.fase,
        gradeClass: `Kelas Fase ${cpItem.fase}`,
        cpText: cpItem.description,
        element: cpItem.element,
      });

      // Parse AI output into 2-3 TP items
      const newGeneratedTps: TpItem[] = [
        {
          id: `TP-AI-1-${Date.now()}`,
          cpId: cpItem.id,
          code: `TP.${cpItem.element.slice(0, 2).toUpperCase()}.1`,
          statement: `Memahami dan menjelaskan konsep ${cpItem.element} berdasarkan acuan CP: ${cpItem.description.slice(0, 100)}...`,
          kko: "Memahami [C2] & Menjelaskan [C2]",
          scope: cpItem.element,
          targetJP: Math.round(cpItem.targetJP / 2) || 8,
        },
        {
          id: `TP-AI-2-${Date.now()}`,
          cpId: cpItem.id,
          code: `TP.${cpItem.element.slice(0, 2).toUpperCase()}.2`,
          statement: `Menganalisis, merancang, dan mengimplementasikan algoritma solusi pada materi ${cpItem.element}.`,
          kko: "Menganalisis [C4] & Merancang [C6]",
          scope: `${cpItem.element} Lanjutan`,
          targetJP: Math.round(cpItem.targetJP / 2) || 8,
        },
      ];

      const updated = [...tps, ...newGeneratedTps];
      setTps(updated);
      saveTps(updated);
      setActiveSubTab("tp");
      showToast("Berhasil menurunkan Tujuan Pembelajaran (TP) secara otomatis dari CP via AI Gemini!");
    } catch (err: any) {
      alert("Gagal memproses AI TP: " + err.message);
    } finally {
      setAiLoading(false);
    }
  };

  // Export File Operations
  const handleExportDoc = (title: string, contentHtml: string) => {
    const header = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head><title>${title}</title><style>body{font-family:Arial,sans-serif;line-height:1.5;} table{border-collapse:collapse;width:100%;} td,th{border:1px solid #333;padding:8px;}</style></head><body>`;
    const footer = "</body></html>";
    const sourceHTML = header + contentHtml + footer;

    const source = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(sourceHTML);
    const fileDownload = document.createElement("a");
    document.body.appendChild(fileDownload);
    fileDownload.href = source;
    fileDownload.download = `${title.replace(/\s+/g, "_")}_${new Date().toISOString().slice(0, 10)}.doc`;
    fileDownload.click();
    document.body.removeChild(fileDownload);
  };

  const handleExportCsv = (title: string, rows: string[][]) => {
    const csvContent = "data:text/csv;charset=utf-8," + rows.map((e) => e.map(cell => `"${(cell || "").replace(/"/g, '""')}"`).join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${title.replace(/\s+/g, "_")}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Trigger Print Modal for active view with semester usage
  const handlePrintCurrentSubTab = (targetSemester?: "Semua" | "Ganjil" | "Genap") => {
    const sem = targetSemester || selectedSemester;
    const semText =
      sem === "Ganjil"
        ? "Semester Ganjil (Semester 1)"
        : sem === "Genap"
        ? "Semester Genap (Semester 2)"
        : "Semester Ganjil & Genap (1 & 2)";

    if (activeSubTab === "cp") {
      onOpenPrint({
        type: "cp",
        title: "DOKUMEN CAPAIAN PEMBELAJARAN (CP) KURIKULUM MERDEKA",
        subtitle: `Penggunaan: ${semText}`,
        periodLabel: semText,
        items: cps,
      });
    } else if (activeSubTab === "tp") {
      onOpenPrint({
        type: "tp",
        title: "RUMUSAN TUJUAN PEMBELAJARAN (TP) TERINTEGRASI",
        subtitle: `Penggunaan: ${semText}`,
        periodLabel: semText,
        items: tps.map((t) => {
          const parentCp = cps.find((c) => c.id === t.cpId);
          return { ...t, cpCode: parentCp?.code, cpDesc: parentCp?.description };
        }),
      });
    } else if (activeSubTab === "atp") {
      const filteredAtps =
        sem === "Ganjil"
          ? atps.filter((a) => a.semester === "1" || a.semester?.toLowerCase().includes("ganjil"))
          : sem === "Genap"
          ? atps.filter((a) => a.semester === "2" || a.semester?.toLowerCase().includes("genap"))
          : atps;

      onOpenPrint({
        type: "atp",
        title: `ALUR TUJUAN PEMBELAJARAN (ATP) - FASE ${selectedFase}`,
        subtitle: `Penggunaan: ${semText}`,
        periodLabel: semText,
        items: filteredAtps.map((a) => {
          const parentTp = tps.find((t) => t.id === a.tpId);
          return { ...a, tpCode: parentTp?.code, tpStatement: parentTp?.statement };
        }),
      });
    } else if (activeSubTab === "kktp") {
      onOpenPrint({
        type: "kktp",
        title: "KRITERIA KETERCAPAIAN TUJUAN PEMBELAJARAN (KKTP / KKM)",
        subtitle: `Penggunaan: ${semText}`,
        periodLabel: semText,
        items: kktps.map((k) => {
          const parentTp = tps.find((t) => t.id === k.tpId);
          return { ...k, tpCode: parentTp?.code, tpStatement: parentTp?.statement };
        }),
      });
    } else if (activeSubTab === "prota") {
      const filteredProta =
        sem === "Ganjil"
          ? protaList.filter((p) => p.semester === "1" || p.semester === "Ganjil")
          : sem === "Genap"
          ? protaList.filter((p) => p.semester === "2" || p.semester === "Genap")
          : protaList;

      onOpenPrint({
        type: "prota",
        title: "PROGRAM TAHUNAN & PROGRAM SEMESTER (PROTA & PROSEM)",
        subtitle: `Penggunaan: ${semText}`,
        periodLabel: semText,
        items: filteredProta,
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#3D4035] text-[#FAF9F5] px-4 py-3 rounded-xl shadow-xl border border-[#D4A373] text-xs font-semibold flex items-center gap-2 animate-bounce">
          <CheckSquare className="w-4 h-4 text-[#D4A373]" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-[#3D4035] text-[#FAF9F5] p-6 rounded-3xl shadow-xl border border-[#2D3126] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#D4A373] uppercase tracking-wider mb-1">
            <BookOpenCheck className="w-4 h-4" />
            Integrasi Dokumen Kurikulum Merdeka
          </div>
          <h2 className="text-xl font-bold text-white">
            Pengelola CP, TP, ATP, KKM & KKTP
          </h2>
          <p className="text-xs text-[#E2DDD0] mt-1 max-w-2xl">
            Satu pintu kelola Capaian Pembelajaran (CP), Alur Tujuan Pembelajaran (ATP), Kriteria Ketercapaian (KKTP/KKM), serta Program Tahunan. Dilengkapi generator AI Gemini dan opsi export lengkap!
          </p>
        </div>

        {/* Global Export & Print Toolbar */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={() => handlePrintCurrentSubTab("Ganjil")}
            className="flex items-center gap-1 bg-[#D4A373] hover:bg-[#c29263] text-[#2D3127] font-bold px-3 py-2 rounded-xl text-xs transition cursor-pointer shadow-xs"
            title="Cetak Dokumen untuk Semester Ganjil"
          >
            <Printer className="w-3.5 h-3.5" />
            Cetak Sem. Ganjil
          </button>

          <button
            onClick={() => handlePrintCurrentSubTab("Genap")}
            className="flex items-center gap-1 bg-[#CCD5AE] hover:bg-[#b8c298] text-[#2D3127] font-bold px-3 py-2 rounded-xl text-xs transition cursor-pointer shadow-xs"
            title="Cetak Dokumen untuk Semester Genap"
          >
            <Printer className="w-3.5 h-3.5" />
            Cetak Sem. Genap
          </button>

          <button
            onClick={() => handlePrintCurrentSubTab("Semua")}
            className="flex items-center gap-1 bg-[#FAF9F5] hover:bg-[#F2EFE6] text-[#3D4035] border border-[#D8D4C7] font-bold px-3 py-2 rounded-xl text-xs transition cursor-pointer shadow-2xs"
            title="Cetak Dokumen Semua Semester"
          >
            <Printer className="w-3.5 h-3.5 text-[#588157]" />
            Cetak Semua
          </button>

          <button
            onClick={() => {
              const rows = [
                ["Kode", "Mata Pelajaran", "Fase", "Elemen", "Teks CP / TP"],
                ...cps.map((c) => [c.code, c.subject, c.fase, c.element, c.description]),
              ];
              handleExportCsv("Kurikulum_Merdeka_CP_TP", rows);
            }}
            className="flex items-center gap-1.5 bg-[#2D3126] hover:bg-[#4E5244] text-[#E2DDD0] border border-[#588157]/40 px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-[#A3B18A]" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Sub-Tabs Navigation */}
      <div className="bg-white rounded-2xl border border-[#E2DDD0] p-2 shadow-2xs flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setActiveSubTab("cp")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer ${
              activeSubTab === "cp"
                ? "bg-[#3D4035] text-[#FAF9F5] shadow-xs"
                : "text-[#4E5244] hover:bg-[#F4F2EA]"
            }`}
          >
            <Compass className="w-4 h-4 text-[#D4A373]" />
            1. CP (Capaian Pembelajaran)
            <span className="text-[10px] bg-[#D4A373]/30 px-1.5 py-0.5 rounded-full">
              {cps.length}
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab("tp")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer ${
              activeSubTab === "tp"
                ? "bg-[#3D4035] text-[#FAF9F5] shadow-xs"
                : "text-[#4E5244] hover:bg-[#F4F2EA]"
            }`}
          >
            <Compass className="w-4 h-4 text-[#A3B18A]" />
            2. TP (Tujuan Pembelajaran)
            <span className="text-[10px] bg-[#588157]/30 px-1.5 py-0.5 rounded-full">
              {tps.length}
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab("atp")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer ${
              activeSubTab === "atp"
                ? "bg-[#3D4035] text-[#FAF9F5] shadow-xs"
                : "text-[#4E5244] hover:bg-[#F4F2EA]"
            }`}
          >
            <ListTree className="w-4 h-4 text-[#D4A373]" />
            3. ATP (Alur Tujuan)
            <span className="text-[10px] bg-[#D4A373]/30 px-1.5 py-0.5 rounded-full">
              {atps.length}
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab("kktp")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer ${
              activeSubTab === "kktp"
                ? "bg-[#3D4035] text-[#FAF9F5] shadow-xs"
                : "text-[#4E5244] hover:bg-[#F4F2EA]"
            }`}
          >
            <CheckSquare className="w-4 h-4 text-[#A3B18A]" />
            4. KKM & KKTP
            <span className="text-[10px] bg-[#588157]/30 px-1.5 py-0.5 rounded-full">
              {kktps.length}
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab("prota")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer ${
              activeSubTab === "prota"
                ? "bg-[#3D4035] text-[#FAF9F5] shadow-xs"
                : "text-[#4E5244] hover:bg-[#F4F2EA]"
            }`}
          >
            <Calendar className="w-4 h-4 text-[#D4A373]" />
            5. Prota & Prosem
          </button>
        </div>

        {/* Filter / Search Bar */}
        <div className="flex flex-wrap items-center gap-2 text-xs px-2">
          <div className="flex items-center gap-1.5 bg-[#F9F8F3] border border-[#D8D4C7] rounded-xl px-2.5 py-1">
            <Filter className="w-3.5 h-3.5 text-[#588157]" />
            <span className="font-semibold text-[#3D4035]">Semester:</span>
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value as any)}
              className="bg-transparent font-bold text-[#2D3127] focus:outline-hidden cursor-pointer"
            >
              <option value="Semua">Semua Semester</option>
              <option value="Ganjil">Semester Ganjil (1)</option>
              <option value="Genap">Semester Genap (2)</option>
            </select>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#8C8F82]" />
            <input
              type="text"
              placeholder="Cari kata kunci..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-[#F9F8F3] border border-[#D8D4C7] rounded-xl pl-8 pr-3 py-1.5 text-xs focus:ring-[#D4A373]"
            />
          </div>
        </div>
      </div>

      {/* SUB TAB 1: CP (CAPAIAN PEMBELAJARAN) */}
      {activeSubTab === "cp" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-[#2D3127] text-sm flex items-center gap-2">
              <Compass className="w-4 h-4 text-[#D4A373]" />
              Daftar Capaian Pembelajaran (CP) Acuan Resmi
            </h3>

            <button
              onClick={() => setIsAddingCp(!isAddingCp)}
              className="flex items-center gap-1.5 bg-[#588157] hover:bg-[#466845] text-white font-bold px-3 py-2 rounded-xl text-xs transition cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4" />
              Tambah CP Baru
            </button>
          </div>

          {/* Add CP Form */}
          {isAddingCp && (
            <form
              onSubmit={handleSaveCp}
              className="bg-white border border-[#E2DDD0] p-4 rounded-2xl shadow-xs space-y-3 text-xs"
            >
              <h4 className="font-bold text-[#2D3127]">Input Capaian Pembelajaran Baru</h4>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Mata Pelajaran</label>
                  <input
                    type="text"
                    value={newCp.subject}
                    onChange={(e) => setNewCp({ ...newCp, subject: e.target.value })}
                    className="w-full bg-[#F9F8F3] border border-[#D8D4C7] rounded-xl px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Fase</label>
                  <select
                    value={newCp.fase}
                    onChange={(e) => setNewCp({ ...newCp, fase: e.target.value as any })}
                    className="w-full bg-[#F9F8F3] border border-[#D8D4C7] rounded-xl px-3 py-2"
                  >
                    {["A", "B", "C", "D", "E", "F"].map((f) => (
                      <option key={f} value={f}>
                        Fase {f}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Kode CP</label>
                  <input
                    type="text"
                    value={newCp.code}
                    onChange={(e) => setNewCp({ ...newCp, code: e.target.value })}
                    className="w-full bg-[#F9F8F3] border border-[#D8D4C7] rounded-xl px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Elemen Pembelajaran</label>
                  <input
                    type="text"
                    value={newCp.element}
                    onChange={(e) => setNewCp({ ...newCp, element: e.target.value })}
                    placeholder="Misal: Berpikir Komputasional"
                    className="w-full bg-[#F9F8F3] border border-[#D8D4C7] rounded-xl px-3 py-2"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Deskripsi Teks Capaian Pembelajaran (CP)</label>
                <textarea
                  rows={3}
                  value={newCp.description}
                  onChange={(e) => setNewCp({ ...newCp, description: e.target.value })}
                  placeholder="Ketik teks CP resmi dari Keputusan BSKAP..."
                  className="w-full bg-[#F9F8F3] border border-[#D8D4C7] rounded-xl p-3"
                  required
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddingCp(false)}
                  className="px-4 py-2 border border-[#D8D4C7] rounded-xl text-xs font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#D4A373] text-[#2D3127] font-bold rounded-xl text-xs"
                >
                  Simpan CP
                </button>
              </div>
            </form>
          )}

          {/* CP List */}
          <div className="grid grid-cols-1 gap-4">
            {cps
              .filter(
                (c) =>
                  c.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  c.element.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((cpItem) => (
                <div
                  key={cpItem.id}
                  className="bg-white rounded-2xl border border-[#E2DDD0] p-5 shadow-2xs space-y-3 hover:border-[#D4A373] transition"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F0EEE4] pb-3">
                    <div className="flex items-center gap-2">
                      <span className="bg-[#3D4035] text-[#FAF9F5] font-mono text-xs font-bold px-2.5 py-1 rounded-lg">
                        {cpItem.code}
                      </span>
                      <span className="bg-[#E9EDC9] text-[#3D4035] text-xs font-bold px-2.5 py-1 rounded-lg">
                        Fase {cpItem.fase}
                      </span>
                      <h4 className="font-bold text-[#2D3127] text-sm">{cpItem.element}</h4>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleAiGenerateTpFromCp(cpItem)}
                        disabled={aiLoading}
                        className="flex items-center gap-1.5 bg-[#D4A373] hover:bg-[#c29263] text-[#2D3127] font-bold px-3 py-1.5 rounded-xl text-xs transition cursor-pointer"
                        title="Turunkan ke Tujuan Pembelajaran (TP) secara otomatis"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        AI Turunkan ke TP
                      </button>

                      <button
                        onClick={() => handleDeleteCp(cpItem.id)}
                        className="p-1.5 text-[#842029] hover:bg-[#F8D7DA] rounded-lg transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-[#3D4035] leading-relaxed bg-[#F9F8F3] p-3.5 rounded-xl border border-[#F0EEE4]">
                    "{cpItem.description}"
                  </p>

                  {/* Connected TPs indicator */}
                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="text-[#6B6E60] italic">
                      Terhubung ke {tps.filter((t) => t.cpId === cpItem.id).length} Tujuan Pembelajaran (TP)
                    </span>
                    <button
                      onClick={() => {
                        setNewTp({ ...newTp, cpId: cpItem.id });
                        setIsAddingTp(true);
                        setActiveSubTab("tp");
                      }}
                      className="text-[#588157] font-bold hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      + Tambah TP dari CP ini <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* SUB TAB 2: TP (TUJUAN PEMBELAJARAN) */}
      {activeSubTab === "tp" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-[#2D3127] text-sm flex items-center gap-2">
              <Compass className="w-4 h-4 text-[#588157]" />
              Daftar Tujuan Pembelajaran (TP) Terhubung CP
            </h3>

            <button
              onClick={() => setIsAddingTp(!isAddingTp)}
              className="flex items-center gap-1.5 bg-[#588157] hover:bg-[#466845] text-white font-bold px-3 py-2 rounded-xl text-xs transition cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4" />
              Tambah TP Manual
            </button>
          </div>

          {/* Add TP Form */}
          {isAddingTp && (
            <form
              onSubmit={handleSaveTp}
              className="bg-white border border-[#E2DDD0] p-4 rounded-2xl shadow-xs space-y-3 text-xs"
            >
              <h4 className="font-bold text-[#2D3127]">Input Tujuan Pembelajaran (TP) Baru</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Pilih CP Induk</label>
                  <select
                    value={newTp.cpId}
                    onChange={(e) => setNewTp({ ...newTp, cpId: e.target.value })}
                    className="w-full bg-[#F9F8F3] border border-[#D8D4C7] rounded-xl px-3 py-2"
                  >
                    {cps.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.code} - {c.element}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Kode TP</label>
                  <input
                    type="text"
                    value={newTp.code}
                    onChange={(e) => setNewTp({ ...newTp, code: e.target.value })}
                    className="w-full bg-[#F9F8F3] border border-[#D8D4C7] rounded-xl px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">KKO Taksonomi Bloom</label>
                  <input
                    type="text"
                    value={newTp.kko}
                    onChange={(e) => setNewTp({ ...newTp, kko: e.target.value })}
                    placeholder="Misal: Menganalisis [C4]"
                    className="w-full bg-[#F9F8F3] border border-[#D8D4C7] rounded-xl px-3 py-2"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Rumusan Tujuan Pembelajaran (TP)</label>
                <textarea
                  rows={2}
                  value={newTp.statement}
                  onChange={(e) => setNewTp({ ...newTp, statement: e.target.value })}
                  placeholder="Peserta didik mampu..."
                  className="w-full bg-[#F9F8F3] border border-[#D8D4C7] rounded-xl p-3"
                  required
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddingTp(false)}
                  className="px-4 py-2 border border-[#D8D4C7] rounded-xl text-xs font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#588157] text-white font-bold rounded-xl text-xs"
                >
                  Simpan TP
                </button>
              </div>
            </form>
          )}

          {/* TP Table / Card List */}
          <div className="bg-white rounded-2xl border border-[#E2DDD0] overflow-hidden shadow-2xs">
            <table className="w-full border-collapse text-xs">
              <thead>
                <tr className="bg-[#3D4035] text-[#FAF9F5] font-semibold text-left">
                  <th className="p-3 w-20">Kode</th>
                  <th className="p-3">CP Acuan</th>
                  <th className="p-3">Rumusan Tujuan Pembelajaran (TP)</th>
                  <th className="p-3 w-36">KKO & Lingkup</th>
                  <th className="p-3 w-16 text-center">JP</th>
                  <th className="p-3 w-24 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {tps.map((tpItem) => {
                  const parentCp = cps.find((c) => c.id === tpItem.cpId);
                  return (
                    <tr key={tpItem.id} className="border-b border-[#F0EEE4] hover:bg-[#F9F8F3] transition">
                      <td className="p-3 font-bold font-mono text-[#3D4035]">{tpItem.code}</td>
                      <td className="p-3 text-[11px] text-[#6B6E60]">
                        <span className="font-bold text-[#2D3127] block">{parentCp?.code}</span>
                        {parentCp?.element}
                      </td>
                      <td className="p-3 font-medium text-[#2D3127] leading-relaxed">
                        {tpItem.statement}
                      </td>
                      <td className="p-3 text-[11px]">
                        <span className="bg-[#E9EDC9] text-[#3D4035] px-2 py-0.5 rounded font-bold block mb-1">
                          {tpItem.kko}
                        </span>
                        <span className="text-[#6B6E60]">{tpItem.scope}</span>
                      </td>
                      <td className="p-3 text-center font-bold">{tpItem.targetJP} JP</td>
                      <td className="p-3 text-center space-x-1">
                        <button
                          onClick={() => handleDeleteTp(tpItem.id)}
                          className="p-1 text-[#842029] hover:bg-[#F8D7DA] rounded transition"
                          title="Hapus TP"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB TAB 3: ATP (ALUR TUJUAN PEMBELAJARAN) */}
      {activeSubTab === "atp" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-[#2D3127] text-sm flex items-center gap-2">
              <ListTree className="w-4 h-4 text-[#D4A373]" />
              Matriks Alur Tujuan Pembelajaran (ATP) Runtut
            </h3>

            <button
              onClick={() => setIsAddingAtp(!isAddingAtp)}
              className="flex items-center gap-1.5 bg-[#588157] hover:bg-[#466845] text-white font-bold px-3 py-2 rounded-xl text-xs transition cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4" />
              Tambah Urutan ATP
            </button>
          </div>

          {/* Add ATP Form */}
          {isAddingAtp && (
            <form
              onSubmit={handleSaveAtp}
              className="bg-white border border-[#E2DDD0] p-4 rounded-2xl shadow-xs space-y-3 text-xs"
            >
              <h4 className="font-bold text-[#2D3127]">Input Alur Tujuan Pembelajaran (ATP) Baru</h4>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Pilih TP Acuan</label>
                  <select
                    value={newAtp.tpId}
                    onChange={(e) => setNewAtp({ ...newAtp, tpId: e.target.value })}
                    className="w-full bg-[#F9F8F3] border border-[#D8D4C7] rounded-xl px-3 py-2"
                  >
                    {tps.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.code} - {t.statement.slice(0, 40)}...
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Kode ATP</label>
                  <input
                    type="text"
                    value={newAtp.code}
                    onChange={(e) => setNewAtp({ ...newAtp, code: e.target.value })}
                    className="w-full bg-[#F9F8F3] border border-[#D8D4C7] rounded-xl px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Semester</label>
                  <select
                    value={newAtp.semester}
                    onChange={(e) => setNewAtp({ ...newAtp, semester: e.target.value as any })}
                    className="w-full bg-[#F9F8F3] border border-[#D8D4C7] rounded-xl px-3 py-2"
                  >
                    <option value="1">Semester 1 (Ganjil)</option>
                    <option value="2">Semester 2 (Genap)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Alokasi Waktu (JP)</label>
                  <input
                    type="number"
                    value={newAtp.jp}
                    onChange={(e) => setNewAtp({ ...newAtp, jp: Number(e.target.value) })}
                    className="w-full bg-[#F9F8F3] border border-[#D8D4C7] rounded-xl px-3 py-2"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Materi Utama / Topik Pembelajaran</label>
                <input
                  type="text"
                  value={newAtp.materi}
                  onChange={(e) => setNewAtp({ ...newAtp, materi: e.target.value })}
                  className="w-full bg-[#F9F8F3] border border-[#D8D4C7] rounded-xl px-3 py-2"
                  required
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddingAtp(false)}
                  className="px-4 py-2 border border-[#D8D4C7] rounded-xl text-xs font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#D4A373] text-[#2D3127] font-bold rounded-xl text-xs"
                >
                  Simpan ATP
                </button>
              </div>
            </form>
          )}

          {/* ATP Cards */}
          <div className="space-y-3">
            {atps.map((atpItem, idx) => {
              const parentTp = tps.find((t) => t.id === atpItem.tpId);
              return (
                <div
                  key={atpItem.id}
                  className="bg-white rounded-2xl border border-[#E2DDD0] p-4 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-[#3D4035] text-[#FAF9F5] font-bold flex items-center justify-center shrink-0 text-xs">
                      {idx + 1}
                    </div>
                    <div className="space-y-1 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#D4A373]">{atpItem.code}</span>
                        <span className="text-[#6B6E60]">&bull; Semester {atpItem.semester}</span>
                        <span className="bg-[#E9EDC9] text-[#3D4035] font-bold px-2 py-0.5 rounded text-[10px]">
                          {atpItem.jp} JP
                        </span>
                      </div>
                      <h4 className="font-bold text-[#2D3127] text-sm">{atpItem.materi}</h4>
                      <p className="text-[#3D4035] italic">"{parentTp?.statement}"</p>
                      <div className="flex flex-wrap gap-1 pt-1">
                        {atpItem.pancasilaProfiles?.map((p) => (
                          <span
                            key={p}
                            className="bg-[#F4F2EA] text-[#3D4035] border border-[#E2DDD0] px-2 py-0.5 rounded-md text-[10px]"
                          >
                            P5: {p}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteAtp(atpItem.id)}
                    className="p-1.5 text-[#842029] hover:bg-[#F8D7DA] rounded-lg transition shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUB TAB 4: KKM & KKTP (KRITERIA KETERCAPAIAN) */}
      {activeSubTab === "kktp" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-[#2D3127] text-sm flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-[#588157]" />
              Kriteria Ketercapaian Tujuan Pembelajaran (KKTP / KKM)
            </h3>

            <button
              onClick={() => setIsAddingKktp(!isAddingKktp)}
              className="flex items-center gap-1.5 bg-[#588157] hover:bg-[#466845] text-white font-bold px-3 py-2 rounded-xl text-xs transition cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4" />
              Hitung KKM & KKTP Baru
            </button>
          </div>

          {/* Add KKTP Form */}
          {isAddingKktp && (
            <form
              onSubmit={handleSaveKktp}
              className="bg-white border border-[#E2DDD0] p-4 rounded-2xl shadow-xs space-y-3 text-xs"
            >
              <h4 className="font-bold text-[#2D3127]">Kalkulator KKM & Rubrik KKTP</h4>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block font-semibold mb-1">TP Acuan</label>
                  <select
                    value={newKktp.tpId}
                    onChange={(e) => setNewKktp({ ...newKktp, tpId: e.target.value })}
                    className="w-full bg-[#F9F8F3] border border-[#D8D4C7] rounded-xl px-3 py-2"
                  >
                    {tps.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.code} - {t.statement.slice(0, 35)}...
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Kompleksitas Material</label>
                  <select
                    value={newKktp.kkmKompleksitas}
                    onChange={(e) => setNewKktp({ ...newKktp, kkmKompleksitas: e.target.value as any })}
                    className="w-full bg-[#F9F8F3] border border-[#D8D4C7] rounded-xl px-3 py-2"
                  >
                    <option value="Tinggi">Tinggi (Materi Sulit)</option>
                    <option value="Sedang">Sedang (Materi Sedang)</option>
                    <option value="Rendah">Rendah (Materi Mudah)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Daya Dukung (Fasilitas)</label>
                  <select
                    value={newKktp.kkmDayaDukung}
                    onChange={(e) => setNewKktp({ ...newKktp, kkmDayaDukung: e.target.value as any })}
                    className="w-full bg-[#F9F8F3] border border-[#D8D4C7] rounded-xl px-3 py-2"
                  >
                    <option value="Tinggi">Tinggi (Sangat Lengkap)</option>
                    <option value="Sedang">Sedang (Cukup Lengkap)</option>
                    <option value="Rendah">Rendah (Terbatas)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Intake (Kemampuan Siswa)</label>
                  <select
                    value={newKktp.kkmIntake}
                    onChange={(e) => setNewKktp({ ...newKktp, kkmIntake: e.target.value as any })}
                    className="w-full bg-[#F9F8F3] border border-[#D8D4C7] rounded-xl px-3 py-2"
                  >
                    <option value="Tinggi">Tinggi (&gt; 80)</option>
                    <option value="Sedang">Sedang (70 - 79)</option>
                    <option value="Rendah">Rendah (&lt; 70)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Kategori Belum Berkembang (&lt; 61)</label>
                  <input
                    type="text"
                    value={newKktp.intervalBelum}
                    onChange={(e) => setNewKktp({ ...newKktp, intervalBelum: e.target.value })}
                    className="w-full bg-[#F9F8F3] border border-[#D8D4C7] rounded-xl px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Kategori Mahir (89 - 100)</label>
                  <input
                    type="text"
                    value={newKktp.intervalMahir}
                    onChange={(e) => setNewKktp({ ...newKktp, intervalMahir: e.target.value })}
                    className="w-full bg-[#F9F8F3] border border-[#D8D4C7] rounded-xl px-3 py-2"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddingKktp(false)}
                  className="px-4 py-2 border border-[#D8D4C7] rounded-xl text-xs font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#588157] text-white font-bold rounded-xl text-xs"
                >
                  Hitung & Simpan KKTP
                </button>
              </div>
            </form>
          )}

          {/* KKTP Display Cards */}
          <div className="grid grid-cols-1 gap-4">
            {kktps.map((kktpItem) => {
              const parentTp = tps.find((t) => t.id === kktpItem.tpId);
              return (
                <div
                  key={kktpItem.id}
                  className="bg-white rounded-2xl border border-[#E2DDD0] p-5 shadow-2xs space-y-3"
                >
                  <div className="flex items-center justify-between border-b border-[#F0EEE4] pb-2">
                    <div>
                      <span className="font-mono font-bold text-[#3D4035] text-xs">
                        {parentTp?.code || "TP"}
                      </span>
                      <h4 className="font-bold text-[#2D3127] text-sm mt-0.5">
                        "{parentTp?.statement}"
                      </h4>
                    </div>

                    <div className="bg-[#E9EDC9] border border-[#CCD5AE] px-3 py-1.5 rounded-xl text-center shrink-0">
                      <div className="text-[10px] text-[#3D4035] font-semibold uppercase">Nilai KKM Target</div>
                      <div className="text-lg font-extrabold text-[#3D4035]">{kktpItem.kkmValue}</div>
                    </div>
                  </div>

                  {/* KKM Analysis Matrix */}
                  <div className="grid grid-cols-3 gap-2 text-[11px] bg-[#F9F8F3] p-3 rounded-xl">
                    <div>
                      <span className="text-[#6B6E60]">Kompleksitas:</span>{" "}
                      <strong className="text-[#2D3127]">{kktpItem.kkmKompleksitas}</strong>
                    </div>
                    <div>
                      <span className="text-[#6B6E60]">Daya Dukung:</span>{" "}
                      <strong className="text-[#2D3127]">{kktpItem.kkmDayaDukung}</strong>
                    </div>
                    <div>
                      <span className="text-[#6B6E60]">Intake Siswa:</span>{" "}
                      <strong className="text-[#2D3127]">{kktpItem.kkmIntake}</strong>
                    </div>
                  </div>

                  {/* Rubrik Categories */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-[#F8D7DA]/50 border border-[#F5C2C7] text-[#842029]">
                      <strong>Belum Mencapai (&lt; 61):</strong> {kktpItem.intervalBelum}
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#E9EDC9]/50 border border-[#CCD5AE] text-[#3D4035]">
                      <strong>Kategori Mahir (89 - 100):</strong> {kktpItem.intervalMahir}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUB TAB 5: PROTA & PROSEM */}
      {activeSubTab === "prota" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-[#2D3127] text-sm flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#D4A373]" />
              Program Tahunan (PROTA) & Program Semester (PROSEM)
            </h3>
          </div>

          <div className="bg-white rounded-2xl border border-[#E2DDD0] p-6 shadow-2xs space-y-4 text-xs">
            <div className="p-4 bg-[#F9F8F3] rounded-xl border border-[#E2DDD0] flex items-center justify-between">
              <div>
                <h4 className="font-bold text-[#2D3127] text-sm">Matriks Alokasi Jam Efektif Pertahun</h4>
                <p className="text-[#6B6E60] text-xs">
                  Total Jam Efektif: 108 JP &bull; Semester 1: 54 JP &bull; Semester 2: 54 JP
                </p>
              </div>

              <button
                onClick={handlePrintCurrentSubTab}
                className="bg-[#D4A373] text-[#2D3127] font-bold px-3.5 py-2 rounded-xl"
              >
                Cetak Matriks Prota / Prosem
              </button>
            </div>

            <table className="w-full border-collapse text-xs">
              <thead>
                <tr className="bg-[#3D4035] text-[#FAF9F5] text-left">
                  <th className="p-2.5">Bulan</th>
                  <th className="p-2.5">Minggu</th>
                  <th className="p-2.5">Kode TP</th>
                  <th className="p-2.5">Topik / Agenda Pembelajaran</th>
                  <th className="p-2.5 text-center">JP</th>
                  <th className="p-2.5">Bentuk Aktivitas</th>
                </tr>
              </thead>
              <tbody>
                {protaList.map((p) => (
                  <tr key={p.id} className="border-b border-[#F0EEE4]">
                    <td className="p-2.5 font-bold">{p.month}</td>
                    <td className="p-2.5">Minggu Ke-{p.weekNumber}</td>
                    <td className="p-2.5 font-mono text-[#D4A373] font-bold">{p.tpCode}</td>
                    <td className="p-2.5 font-medium">{p.topic}</td>
                    <td className="p-2.5 text-center font-bold">{p.jp} JP</td>
                    <td className="p-2.5">
                      <span className="bg-[#E9EDC9] text-[#3D4035] px-2 py-0.5 rounded font-bold">
                        {p.activityType}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
