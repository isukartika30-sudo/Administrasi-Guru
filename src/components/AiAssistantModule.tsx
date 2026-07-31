import React, { useState } from "react";
import { AiToolType } from "../types";
import { aiGenerators } from "../utils/aiService";
import {
  Sparkles,
  BookOpen,
  FileQuestion,
  Target,
  FileText,
  MessageSquare,
  Copy,
  Check,
  Send,
  Loader2,
  Printer,
  FileCode,
  Layers,
  ListTree,
  Calendar,
  CheckSquare,
  Compass,
  Bookmark,
  CheckCircle2,
  BookmarkCheck,
} from "lucide-react";

export const AiAssistantModule: React.FC = () => {
  const [activeTool, setActiveTool] = useState<AiToolType>("input_cp");
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [cpSavedNotification, setCpSavedNotification] = useState<boolean>(false);

  // Results State
  const [generatedContent, setGeneratedContent] = useState<string>("");

  // Shared Master CP & Context State
  const [sharedSubject, setSharedSubject] = useState<string>("Informatika");
  const [sharedFase, setSharedFase] = useState<string>("E");
  const [sharedClass, setSharedClass] = useState<string>("X RPL 1");
  const [sharedCp, setSharedCp] = useState<string>(
    "Pada akhir fase E, peserta didik mampu memahami peran Sistem Komputer, Jaringan Komputer/Internet, Analisis Data, Algoritma dan Pemrograman, Berpikir Komputasional, serta Dampak Sosial Informatika dalam kehidupan bermasyarakat."
  );

  // Preset CPs for quick insertion
  const presetCps = [
    {
      subject: "Informatika",
      fase: "E",
      title: "Informatika Fase E (Kelas X)",
      text: "Pada akhir fase E, peserta didik mampu memahami peran Sistem Komputer, Jaringan Komputer/Internet, Analisis Data, Algoritma dan Pemrograman, Berpikir Komputasional, serta Dampak Sosial Informatika dalam kehidupan bermasyarakat.",
    },
    {
      subject: "Matematika",
      fase: "E",
      title: "Matematika Fase E (Kelas X)",
      text: "Pada akhir fase E, peserta didik dapat menggeneralisasi sifat-sifat operasi bilangan berpangkat (eksponen), barisan dan deret, fungsi kuadrat, trigonometri dasar, serta merepresentasikan data statistik sederhana.",
    },
    {
      subject: "Bahasa Indonesia",
      fase: "E",
      title: "Bahasa Indonesia Fase E (Kelas X)",
      text: "Pada akhir fase E, peserta didik memiliki kemampuan berbahasa untuk berkomunikasi dan bernalar sesuai dengan tujuan, konteks sosial, dan akademis. Peserta didik mampu memahami, mengolah, dan menginterpretasi informasi wacana teks Laporan Hasil Observasi, Anekdot, dan Negosiasi.",
    },
    {
      subject: "Bahasa Inggris",
      fase: "E",
      title: "Bahasa Inggris Fase E (Kelas X)",
      text: "At the end of Phase E, students use oral, written, and visual texts in English to communicate within social and academic contexts for different audiences and purposes, using simple, compound, and complex sentences.",
    },
    {
      subject: "IPAS / Sains",
      fase: "D",
      title: "IPAS / Sains Fase D (SMP)",
      text: "Pada akhir fase D, peserta didik memahami hakikat sains dan metode ilmiah, struktur sel, sistem organ tubuh manusia, zat dan perubahannya, serta keterkaitan ekosistem dan keanekaragaman hayati.",
    },
    {
      subject: "Dasar Pengembangan Perangkat Lunak (PPLG)",
      fase: "E",
      title: "Dasar PPLG SMK Fase E",
      text: "Pada akhir fase E, peserta didik mampu memahami proses bisnis di bidang industri pengembangan perangkat lunak dan gim, perkembangan teknologi, K3LH, serta konsep dasar pemrograman berorientasi objek.",
    },
  ];

  // Tool Specific States
  // Tool 0: Perangkat Ajar Lengkap
  const [paTopic, setPaTopic] = useState<string>("Algoritma Pemrograman & Flowchart");
  const [paDurationJP, setPaDurationJP] = useState<number>(6);
  const [paProfiles, setPaProfiles] = useState<string[]>([
    "Bernalar Kritis",
    "Gotong Royong",
    "Kreatif",
  ]);

  // Tool 1: Modul Ajar
  const [maTopic, setMaTopic] = useState<string>("Dekomposisi Masalah & Algoritma Pencarian");
  const [maProfiles, setMaProfiles] = useState<string[]>([
    "Bernalar Kritis",
    "Gotong Royong",
    "Kreatif",
  ]);
  const [maJp, setMaJp] = useState<number>(4);

  // Tool 2: LKPD
  const [lkpdTopic, setLkpdTopic] = useState<string>("Praktikum Analisis Data dengan Excel / Python");
  const [lkpdActivityType, setLkpdActivityType] = useState<string>("Eksperimen / Praktikum Kelompok");

  // Tool 3: ATP
  const [atpTotalJP, setAtpTotalJP] = useState<number>(72);

  // Tool 4: TP
  const [tpElement, setTpElement] = useState<string>("Berpikir Komputasional (BK) & Algoritma");

  // Tool 5: KKTP
  const [kktpTopic, setKktpTopic] = useState<string>("Membuat Program Sederhana Percabangan & Perulangan");
  const [kktpTpText, setKktpTpText] = useState<string>(
    "Peserta didik mampu menganalisis permasalahan logika, merancang algoritma pseudocode, dan mengimplementasikannya dalam bentuk kode program yang berfungsi tanpa error."
  );
  const [kktpApproach, setKktpApproach] = useState<
    "Rubrik Deskriptif" | "Interval Nilai" | "Skala Deskripsi" | "Campuran"
  >("Rubrik Deskriptif");

  // Tool 6: Prota & Prosem
  const [ppAcademicYear, setPpAcademicYear] = useState<string>("2025/2026");
  const [ppTotalJPEffective, setPpTotalJPEffective] = useState<number>(108);

  // Tool 7: Soal Quiz
  const [sqTopic, setSqTopic] = useState<string>("Konsep Dasar Berpikir Komputasional");
  const [sqCount, setSqCount] = useState<number>(5);
  const [sqType, setSqType] = useState<"pilihan_ganda" | "essay" | "campuran">("pilihan_ganda");
  const [sqDifficulty, setSqDifficulty] = useState<"LOTS" | "MTS" | "HOTS" | "campuran">("HOTS");

  // Tool 8: Asesmen Diagnostik
  const [adTopic, setAdTopic] = useState<string>("Layout Web Responsif dengan CSS Grid");
  const [adDifficulties, setAdDifficulties] = useState<string>(
    "Beberapa siswa kesulitan dalam menentukan perbandingan fr (fraction unit) dan posisi grid-template-areas"
  );

  // Tool 9: Catatan Wali
  const [cwName, setCwName] = useState<string>("Ahmad Rizky Pratama");
  const [cwPerf, setCwPerf] = useState<string>("Sangat unggul pada mata pelajaran vokasi, aktif berdiskusi");
  const [cwChar, setCwChar] = useState<string>("Disiplin, jujur, berjiwa pemimpin sebagai Ketua Kelas");
  const [cwAtt, setCwAtt] = useState<string>("Kehadiran 100% tanpa alpa");

  // Tool 10: Chat Guru
  const [chatInput, setChatInput] = useState<string>("");
  const [chatHistory, setChatHistory] = useState<Array<{ role: "user" | "model"; text: string }>>([
    {
      role: "model",
      text: "Halo Bapak/Ibu Guru! Saya Asisten AI Kurikulum Merdeka. Anda dapat memanfaatkan fitur Input CP untuk menyusun Perangkat Ajar, Modul Ajar, LKPD, TP, ATP, KKTP, Prota/Prosem, maupun berkonsultasi secara bebas di sini. Ada yang bisa saya bantu hari ini?",
    },
  ]);

  const handleCopy = () => {
    if (!generatedContent) return;
    navigator.clipboard.writeText(generatedContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrintOutput = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>Hasil Generator AI Administrasi Guru</title>
          <style>
            body { font-family: system-ui, sans-serif; padding: 30px; line-height: 1.6; color: #1e293b; }
            h1, h2, h3 { color: #0f172a; }
            pre { white-space: pre-wrap; font-family: inherit; font-size: 14px; }
          </style>
        </head>
        <body>
          <h1>Dokumen Hasil Generator Asisten AI Guru</h1>
          <hr/>
          <pre>${generatedContent}</pre>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  // Preset selection handler
  const handleSelectPresetCp = (item: (typeof presetCps)[0]) => {
    setSharedSubject(item.subject);
    setSharedFase(item.fase);
    setSharedCp(item.text);
    setCpSavedNotification(true);
    setTimeout(() => setCpSavedNotification(false), 3000);
  };

  const handleSaveMasterCp = (e: React.FormEvent) => {
    e.preventDefault();
    setCpSavedNotification(true);
    setGeneratedContent(
      `=== CAPAIAN PEMBELAJARAN (CP) TERHUBUNG ===\n\nMata Pelajaran : ${sharedSubject}\nFase / Kelas   : Fase ${sharedFase} (${sharedClass})\n\nIsi Capaian Pembelajaran (CP):\n"${sharedCp}"\n\nStatus: Berhasil disimpan dan terintegrasi otomatis ke seluruh Generator AI (Perangkat Ajar, Modul Ajar, LKPD, TP, ATP, KKTP, Prota & Prosem)!`
    );
    setTimeout(() => setCpSavedNotification(false), 3000);
  };

  // Submit Handlers
  const handleGeneratePerangkatLengkap = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await aiGenerators.perangkatAjar({
        subject: sharedSubject,
        fase: sharedFase,
        gradeClass: sharedClass,
        topic: paTopic,
        cpText: sharedCp,
        pancasilaProfiles: paProfiles,
        durationJP: paDurationJP,
      });
      setGeneratedContent(res);
    } catch (err: any) {
      setErrorMsg(err.message || "Gagal memproses Paket Perangkat Ajar Lengkap.");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateModulAjar = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await aiGenerators.modulAjar({
        subject: sharedSubject,
        fase: sharedFase,
        gradeClass: sharedClass,
        topic: maTopic,
        cpText: sharedCp,
        pancasilaProfiles: maProfiles,
        durationJP: maJp,
      });
      setGeneratedContent(res);
    } catch (err: any) {
      setErrorMsg(err.message || "Gagal memproses AI Modul Ajar.");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateLkpd = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await aiGenerators.lkpd({
        subject: sharedSubject,
        gradeClass: sharedClass,
        topic: lkpdTopic,
        cpText: sharedCp,
        activityType: lkpdActivityType,
      });
      setGeneratedContent(res);
    } catch (err: any) {
      setErrorMsg(err.message || "Gagal memproses Generator LKPD.");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateTp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await aiGenerators.tp({
        subject: sharedSubject,
        fase: sharedFase,
        gradeClass: sharedClass,
        cpText: sharedCp,
        element: tpElement,
      });
      setGeneratedContent(res);
    } catch (err: any) {
      setErrorMsg(err.message || "Gagal merumuskan Tujuan Pembelajaran (TP).");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateAtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await aiGenerators.atp({
        subject: sharedSubject,
        fase: sharedFase,
        gradeClass: sharedClass,
        cpText: sharedCp,
        totalJP: atpTotalJP,
      });
      setGeneratedContent(res);
    } catch (err: any) {
      setErrorMsg(err.message || "Gagal menyusun Alur Tujuan Pembelajaran (ATP).");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateKktp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await aiGenerators.kktp({
        subject: sharedSubject,
        gradeClass: sharedClass,
        topic: kktpTopic,
        tpText: kktpTpText,
        approachType: kktpApproach,
      });
      setGeneratedContent(res);
    } catch (err: any) {
      setErrorMsg(err.message || "Gagal memproses KKTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateProtaProsem = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await aiGenerators.protaProsem({
        subject: sharedSubject,
        fase: sharedFase,
        gradeClass: sharedClass,
        academicYear: ppAcademicYear,
        totalJPEffective: ppTotalJPEffective,
        cpText: sharedCp,
      });
      setGeneratedContent(res);
    } catch (err: any) {
      setErrorMsg(err.message || "Gagal memproses Prota & Prosem.");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateSoal = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await aiGenerators.soalQuiz({
        subject: sharedSubject,
        gradeClass: sharedClass,
        topic: sqTopic,
        questionCount: sqCount,
        questionType: sqType,
        difficulty: sqDifficulty,
      });
      setGeneratedContent(res);
    } catch (err: any) {
      setErrorMsg(err.message || "Gagal memproses AI Soal.");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateAsesmen = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await aiGenerators.asesmenDiagnostik({
        subject: sharedSubject,
        gradeClass: sharedClass,
        topic: adTopic,
        learningDifficulties: adDifficulties,
      });
      setGeneratedContent(res);
    } catch (err: any) {
      setErrorMsg(err.message || "Gagal memproses Asesmen Diagnostik.");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateCatatanWali = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await aiGenerators.catatanWali({
        studentName: cwName,
        academicPerformance: cwPerf,
        characterTrait: cwChar,
        attendanceSummary: cwAtt,
      });
      setGeneratedContent(res);
    } catch (err: any) {
      setErrorMsg(err.message || "Gagal memproses Catatan Wali.");
    } finally {
      setLoading(false);
    }
  };

  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || loading) return;

    const userText = chatInput;
    setChatInput("");
    const newHistory = [...chatHistory, { role: "user" as const, text: userText }];
    setChatHistory(newHistory);
    setLoading(true);

    try {
      const reply = await aiGenerators.chatGuru(userText, chatHistory);
      setChatHistory([...newHistory, { role: "model", text: reply }]);
    } catch (err: any) {
      setChatHistory([
        ...newHistory,
        { role: "model", text: "Maaf, terjadi masalah: " + err.message },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const pancasilaOptions = [
    "Beriman, Bertakwa kepada Tuhan YME & Berakhlak Mulia",
    "Berkebinekaan Global",
    "Gotong Royong",
    "Mandiri",
    "Bernalar Kritis",
    "Kreatif",
  ];

  const toggleProfile = (p: string, currentList: string[], setList: (l: string[]) => void) => {
    if (currentList.includes(p)) {
      setList(currentList.filter((item) => item !== p));
    } else {
      setList([...currentList, p]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Tool Selection Banner */}
      <div className="bg-[#3D4035] text-[#FAF9F5] rounded-3xl p-6 shadow-xl border border-[#2D3126] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#588157]/20 text-[#A3B18A] flex items-center justify-center font-bold shrink-0">
              <Sparkles className="w-5 h-5 text-[#D4A373]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#FAF9F5] flex items-center gap-2">
                Asisten AI Guru Nusantara &mdash; Gemini AI
              </h2>
              <p className="text-xs text-[#E2DDD0]">
                Pengembang Perangkat Ajar & Administrasi Guru Berbasis Kurikulum Merdeka
              </p>
            </div>
          </div>

          {/* Master CP Quick Indicator */}
          <div className="bg-[#2D3126] border border-[#588157]/40 rounded-xl px-3 py-2 text-xs flex items-center gap-2 max-w-sm">
            <BookmarkCheck className="w-4 h-4 text-[#D4A373] shrink-0" />
            <div className="truncate">
              <span className="font-semibold text-[#A3B18A]">CP Terhubung:</span>{" "}
              <span className="text-[#E2DDD0] italic truncate block">{sharedCp}</span>
            </div>
          </div>
        </div>

        {/* Tools Tabs Organized by Category */}
        <div className="pt-2 border-t border-[#588157]/30 space-y-2">
          <div className="text-[11px] font-bold text-[#A3B18A] uppercase tracking-wider">
            PILIH GENERATOR & MODUL ADMINISTRASI AI
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2">
            {/* 1. Input CP */}
            <button
              onClick={() => setActiveTool("input_cp")}
              className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl font-semibold text-xs transition cursor-pointer ${
                activeTool === "input_cp"
                  ? "bg-[#D4A373] text-[#2D3127] shadow-md font-bold"
                  : "bg-[#2D3126]/80 hover:bg-[#2D3126] text-[#E2DDD0]"
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              1. Input CP Master
            </button>

            {/* 2. Perangkat Ajar Lengkap */}
            <button
              onClick={() => setActiveTool("perangkat_ajar")}
              className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl font-semibold text-xs transition cursor-pointer ${
                activeTool === "perangkat_ajar"
                  ? "bg-[#D4A373] text-[#2D3127] shadow-md font-bold"
                  : "bg-[#2D3126]/80 hover:bg-[#2D3126] text-[#E2DDD0]"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              2. Perangkat Lengkap
            </button>

            {/* 3. Modul Ajar */}
            <button
              onClick={() => setActiveTool("modul_ajar")}
              className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl font-semibold text-xs transition cursor-pointer ${
                activeTool === "modul_ajar"
                  ? "bg-[#D4A373] text-[#2D3127] shadow-md font-bold"
                  : "bg-[#2D3126]/80 hover:bg-[#2D3126] text-[#E2DDD0]"
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              3. Modul Ajar (RPP)
            </button>

            {/* 4. LKPD */}
            <button
              onClick={() => setActiveTool("lkpd")}
              className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl font-semibold text-xs transition cursor-pointer ${
                activeTool === "lkpd"
                  ? "bg-[#D4A373] text-[#2D3127] shadow-md font-bold"
                  : "bg-[#2D3126]/80 hover:bg-[#2D3126] text-[#E2DDD0]"
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              4. Generator LKPD
            </button>

            {/* 5. TP */}
            <button
              onClick={() => setActiveTool("tp")}
              className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl font-semibold text-xs transition cursor-pointer ${
                activeTool === "tp"
                  ? "bg-[#D4A373] text-[#2D3127] shadow-md font-bold"
                  : "bg-[#2D3126]/80 hover:bg-[#2D3126] text-[#E2DDD0]"
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              5. Generator TP
            </button>

            {/* 6. ATP */}
            <button
              onClick={() => setActiveTool("atp")}
              className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl font-semibold text-xs transition cursor-pointer ${
                activeTool === "atp"
                  ? "bg-[#D4A373] text-[#2D3127] shadow-md font-bold"
                  : "bg-[#2D3126]/80 hover:bg-[#2D3126] text-[#E2DDD0]"
              }`}
            >
              <ListTree className="w-3.5 h-3.5" />
              6. Generator ATP
            </button>

            {/* 7. KKTP */}
            <button
              onClick={() => setActiveTool("kktp")}
              className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl font-semibold text-xs transition cursor-pointer ${
                activeTool === "kktp"
                  ? "bg-[#D4A373] text-[#2D3127] shadow-md font-bold"
                  : "bg-[#2D3126]/80 hover:bg-[#2D3126] text-[#E2DDD0]"
              }`}
            >
              <CheckSquare className="w-3.5 h-3.5" />
              7. Generator KKTP
            </button>

            {/* 8. Prota & Prosem */}
            <button
              onClick={() => setActiveTool("prota_prosem")}
              className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl font-semibold text-xs transition cursor-pointer ${
                activeTool === "prota_prosem"
                  ? "bg-[#D4A373] text-[#2D3127] shadow-md font-bold"
                  : "bg-[#2D3126]/80 hover:bg-[#2D3126] text-[#E2DDD0]"
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              8. Prota & Prosem
            </button>

            {/* 9. Soal HOTS */}
            <button
              onClick={() => setActiveTool("soal_quiz")}
              className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl font-semibold text-xs transition cursor-pointer ${
                activeTool === "soal_quiz"
                  ? "bg-[#D4A373] text-[#2D3127] shadow-md font-bold"
                  : "bg-[#2D3126]/80 hover:bg-[#2D3126] text-[#E2DDD0]"
              }`}
            >
              <FileQuestion className="w-3.5 h-3.5" />
              9. Soal & Kunci
            </button>

            {/* 10. Asesmen Diagnostik */}
            <button
              onClick={() => setActiveTool("asesmen_diagnostik")}
              className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl font-semibold text-xs transition cursor-pointer ${
                activeTool === "asesmen_diagnostik"
                  ? "bg-[#D4A373] text-[#2D3127] shadow-md font-bold"
                  : "bg-[#2D3126]/80 hover:bg-[#2D3126] text-[#E2DDD0]"
              }`}
            >
              <Target className="w-3.5 h-3.5" />
              10. Diagnostik
            </button>

            {/* 11. Catatan Wali */}
            <button
              onClick={() => setActiveTool("catatan_wali")}
              className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl font-semibold text-xs transition cursor-pointer ${
                activeTool === "catatan_wali"
                  ? "bg-[#D4A373] text-[#2D3127] shadow-md font-bold"
                  : "bg-[#2D3126]/80 hover:bg-[#2D3126] text-[#E2DDD0]"
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              11. Catatan Wali
            </button>

            {/* 12. Chatbot AI Guru */}
            <button
              onClick={() => setActiveTool("chat_guru")}
              className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl font-semibold text-xs transition cursor-pointer ${
                activeTool === "chat_guru"
                  ? "bg-[#D4A373] text-[#2D3127] shadow-md font-bold"
                  : "bg-[#2D3126]/80 hover:bg-[#2D3126] text-[#E2DDD0]"
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              12. Chatbot AI
            </button>
          </div>
        </div>
      </div>

      {/* Main Workspace Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form Panel */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-[#E2DDD0] p-6 shadow-2xs space-y-4">
          {/* Tool 0: Input CP Master */}
          {activeTool === "input_cp" && (
            <form onSubmit={handleSaveMasterCp} className="space-y-4 text-xs">
              <div className="border-b border-[#F0EEE4] pb-2">
                <h3 className="font-bold text-[#2D3127] text-sm flex items-center gap-2">
                  <Bookmark className="w-4 h-4 text-[#D4A373]" />
                  Kelola Capaian Pembelajaran (CP) Master
                </h3>
                <p className="text-[11px] text-[#6B6E60] mt-0.5">
                  Input atau pilih preset CP untuk terintegrasi secara otomatis dengan Modul Ajar, LKPD, TP, ATP, KKTP, & Prota/Prosem.
                </p>
              </div>

              {cpSavedNotification && (
                <div className="bg-[#E9EDC9] border border-[#A3B18A] text-[#3D4035] p-3 rounded-xl text-xs font-semibold flex items-center gap-2 animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4 text-[#588157]" />
                  <span>CP Master berhasil diperbarui & terhubung ke seluruh Generator AI!</span>
                </div>
              )}

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-semibold text-[#3D4035] mb-1">Mata Pelajaran</label>
                  <input
                    type="text"
                    value={sharedSubject}
                    onChange={(e) => setSharedSubject(e.target.value)}
                    className="w-full bg-[#F9F8F3] border border-[#D8D4C7] rounded-xl px-3 py-2 text-[#2D3127]"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#3D4035] mb-1">Fase</label>
                  <select
                    value={sharedFase}
                    onChange={(e) => setSharedFase(e.target.value)}
                    className="w-full bg-[#F9F8F3] border border-[#D8D4C7] rounded-xl px-3 py-2 text-[#2D3127]"
                  >
                    {["A", "B", "C", "D", "E", "F"].map((f) => (
                      <option key={f} value={f}>
                        Fase {f}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-[#3D4035] mb-1">Kelas</label>
                  <input
                    type="text"
                    value={sharedClass}
                    onChange={(e) => setSharedClass(e.target.value)}
                    className="w-full bg-[#F9F8F3] border border-[#D8D4C7] rounded-xl px-3 py-2 text-[#2D3127]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#3D4035] mb-1">
                  Teks Capaian Pembelajaran (CP)
                </label>
                <textarea
                  rows={5}
                  value={sharedCp}
                  onChange={(e) => setSharedCp(e.target.value)}
                  placeholder="Ketik atau tempelkan Capaian Pembelajaran (CP) resmi dari Kemendikbud..."
                  className="w-full bg-[#F9F8F3] border border-[#D8D4C7] rounded-xl p-3 text-[#2D3127] leading-relaxed"
                  required
                />
              </div>

              {/* Preset CP Examples */}
              <div className="space-y-2 pt-1 border-t border-[#F0EEE4]">
                <label className="block font-semibold text-[#3D4035]">
                  Pilih Preset CP Contoh Resmi (1-Klik Auto Fill):
                </label>
                <div className="grid grid-cols-1 gap-1.5 max-h-40 overflow-y-auto pr-1">
                  {presetCps.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectPresetCp(p)}
                      className="text-left bg-[#F4F2EA] hover:bg-[#EFECE1] border border-[#E2DDD0] p-2.5 rounded-xl transition cursor-pointer text-[11px]"
                    >
                      <div className="font-bold text-[#2D3127] flex items-center justify-between">
                        <span>{p.title}</span>
                        <span className="text-[10px] bg-[#D4A373] text-[#2D3127] px-1.5 py-0.5 rounded font-bold">
                          Fase {p.fase}
                        </span>
                      </div>
                      <p className="text-[#6B6E60] line-clamp-1 mt-0.5">{p.text}</p>
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#D4A373] hover:bg-[#c29263] text-[#2D3127] font-bold py-3 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <CheckCircle2 className="w-4 h-4" />
                Simpan & Sambungkan CP ke Seluruh Generator
              </button>
            </form>
          )}

          {/* Tool 1: Perangkat Ajar Lengkap */}
          {activeTool === "perangkat_ajar" && (
            <form onSubmit={handleGeneratePerangkatLengkap} className="space-y-3 text-xs">
              <h3 className="font-bold text-[#2D3127] text-sm border-b border-[#F0EEE4] pb-2 flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#D4A373]" />
                Generator Perangkat Ajar Lengkap
              </h3>

              <div className="bg-[#F9F8F3] border border-[#E2DDD0] p-2.5 rounded-xl text-[11px] text-[#3D4035] space-y-1">
                <div><strong className="text-[#2D3127]">Mapel / Kelas:</strong> {sharedSubject} ({sharedClass} / Fase {sharedFase})</div>
                <div><strong className="text-[#2D3127]">CP Acuan:</strong> "{sharedCp.slice(0, 80)}..."</div>
              </div>

              <div>
                <label className="block font-semibold text-[#3D4035] mb-1">Topik Utama Pembelajaran</label>
                <input
                  type="text"
                  value={paTopic}
                  onChange={(e) => setPaTopic(e.target.value)}
                  className="w-full bg-[#F9F8F3] border border-[#D8D4C7] rounded-xl px-3 py-2 text-[#2D3127]"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-[#3D4035] mb-1">Alokasi Waktu (JP)</label>
                <input
                  type="number"
                  min={1}
                  value={paDurationJP}
                  onChange={(e) => setPaDurationJP(Number(e.target.value))}
                  className="w-full bg-[#F9F8F3] border border-[#D8D4C7] rounded-xl px-3 py-2 text-[#2D3127]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#3D4035] mb-1">Dimensi Profil Pelajar Pancasila (P5)</label>
                <div className="space-y-1 pt-1">
                  {pancasilaOptions.map((opt) => (
                    <label key={opt} className="flex items-center gap-2 cursor-pointer text-[11px] text-[#3D4035]">
                      <input
                        type="checkbox"
                        checked={paProfiles.includes(opt)}
                        onChange={() => toggleProfile(opt, paProfiles, setPaProfiles)}
                        className="rounded text-[#588157] focus:ring-[#D4A373]"
                      />
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-4 bg-[#D4A373] hover:bg-[#c29263] text-[#2D3127] font-bold py-3 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-md"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Menyusun Paket Perangkat Lengkap AI...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Buat Perangkat Ajar Lengkap (TP+ATP+Modul+LKPD+KKTP)
                  </>
                )}
              </button>
            </form>
          )}

          {/* Tool 2: Modul Ajar Form */}
          {activeTool === "modul_ajar" && (
            <form onSubmit={handleGenerateModulAjar} className="space-y-3 text-xs">
              <h3 className="font-bold text-[#2D3127] text-sm border-b border-[#F0EEE4] pb-2 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#D4A373]" />
                Generator Modul Ajar (RPP Kurikulum Merdeka)
              </h3>

              <div className="bg-[#F9F8F3] border border-[#E2DDD0] p-2.5 rounded-xl text-[11px] text-[#3D4035]">
                <strong className="text-[#2D3127]">CP Acuan:</strong> "{sharedCp.slice(0, 90)}..."
              </div>

              <div>
                <label className="block font-semibold text-[#3D4035] mb-1">Topik / Materi Pembelajaran</label>
                <textarea
                  rows={2}
                  value={maTopic}
                  onChange={(e) => setMaTopic(e.target.value)}
                  className="w-full bg-[#F9F8F3] border border-[#D8D4C7] rounded-xl px-3 py-2 text-[#2D3127]"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-[#3D4035] mb-1">Alokasi Waktu (JP)</label>
                <input
                  type="number"
                  min={1}
                  value={maJp}
                  onChange={(e) => setMaJp(Number(e.target.value))}
                  className="w-full bg-[#F9F8F3] border border-[#D8D4C7] rounded-xl px-3 py-2 text-[#2D3127]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#3D4035] mb-1">
                  Dimensi Profil Pelajar Pancasila (P5)
                </label>
                <div className="space-y-1.5 pt-1">
                  {pancasilaOptions.map((opt) => (
                    <label key={opt} className="flex items-center gap-2 cursor-pointer text-[11px] text-[#3D4035]">
                      <input
                        type="checkbox"
                        checked={maProfiles.includes(opt)}
                        onChange={() => toggleProfile(opt, maProfiles, setMaProfiles)}
                        className="rounded text-[#588157] focus:ring-[#D4A373]"
                      />
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-4 bg-[#D4A373] hover:bg-[#c29263] text-[#2D3127] font-bold py-3 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-md"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Menyusun Modul Ajar AI...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Buat Modul Ajar RPP
                  </>
                )}
              </button>
            </form>
          )}

          {/* Tool 3: Generator LKPD */}
          {activeTool === "lkpd" && (
            <form onSubmit={handleGenerateLkpd} className="space-y-3 text-xs">
              <h3 className="font-bold text-[#2D3127] text-sm border-b border-[#F0EEE4] pb-2 flex items-center gap-2">
                <FileCode className="w-4 h-4 text-[#D4A373]" />
                Generator LKPD (Lembar Kerja Peserta Didik)
              </h3>

              <div className="bg-[#F9F8F3] border border-[#E2DDD0] p-2.5 rounded-xl text-[11px] text-[#3D4035]">
                <strong className="text-[#2D3127]">Mapel / Kelas:</strong> {sharedSubject} ({sharedClass})
              </div>

              <div>
                <label className="block font-semibold text-[#3D4035] mb-1">Topik Aktivitas Siswa</label>
                <input
                  type="text"
                  value={lkpdTopic}
                  onChange={(e) => setLkpdTopic(e.target.value)}
                  className="w-full bg-[#F9F8F3] border border-[#D8D4C7] rounded-xl px-3 py-2 text-[#2D3127]"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-[#3D4035] mb-1">Bentuk Aktivitas LKPD</label>
                <select
                  value={lkpdActivityType}
                  onChange={(e) => setLkpdActivityType(e.target.value)}
                  className="w-full bg-[#F9F8F3] border border-[#D8D4C7] rounded-xl px-3 py-2 text-[#2D3127]"
                >
                  <option value="Eksperimen / Praktikum Kelompok">Eksperimen / Praktikum Kelompok</option>
                  <option value="Diskusi Studi Kasus & Pemecahan Masalah">Diskusi Studi Kasus & Pemecahan Masalah</option>
                  <option value="Proyek Sederhana / Mini Project">Proyek Sederhana / Mini Project</option>
                  <option value="Latihan Soal Keterampilan & Analisis">Latihan Soal Keterampilan & Analisis</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-4 bg-[#D4A373] hover:bg-[#c29263] text-[#2D3127] font-bold py-3 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-md"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Menyusun Draf LKPD AI...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Buat Lembar Kerja Peserta Didik (LKPD)
                  </>
                )}
              </button>
            </form>
          )}

          {/* Tool 4: Generator TP */}
          {activeTool === "tp" && (
            <form onSubmit={handleGenerateTp} className="space-y-3 text-xs">
              <h3 className="font-bold text-[#2D3127] text-sm border-b border-[#F0EEE4] pb-2 flex items-center gap-2">
                <Compass className="w-4 h-4 text-[#D4A373]" />
                Generator Tujuan Pembelajaran (TP)
              </h3>

              <div className="bg-[#F9F8F3] border border-[#E2DDD0] p-2.5 rounded-xl text-[11px] text-[#3D4035]">
                <strong className="text-[#2D3127]">CP Acuan:</strong> "{sharedCp}"
              </div>

              <div>
                <label className="block font-semibold text-[#3D4035] mb-1">Elemen Pembelajaran (Opsional)</label>
                <input
                  type="text"
                  value={tpElement}
                  onChange={(e) => setTpElement(e.target.value)}
                  placeholder="Misal: Berpikir Komputasional, Pemahaman Konsep, dsb..."
                  className="w-full bg-[#F9F8F3] border border-[#D8D4C7] rounded-xl px-3 py-2 text-[#2D3127]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-4 bg-[#D4A373] hover:bg-[#c29263] text-[#2D3127] font-bold py-3 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-md"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Menganalisis KKO & Menyusun TP...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Rumuskan Tujuan Pembelajaran (TP)
                  </>
                )}
              </button>
            </form>
          )}

          {/* Tool 5: Generator ATP */}
          {activeTool === "atp" && (
            <form onSubmit={handleGenerateAtp} className="space-y-3 text-xs">
              <h3 className="font-bold text-[#2D3127] text-sm border-b border-[#F0EEE4] pb-2 flex items-center gap-2">
                <ListTree className="w-4 h-4 text-[#D4A373]" />
                Generator Alur Tujuan Pembelajaran (ATP)
              </h3>

              <div className="bg-[#F9F8F3] border border-[#E2DDD0] p-2.5 rounded-xl text-[11px] text-[#3D4035]">
                <strong className="text-[#2D3127]">Fase / Class:</strong> Fase {sharedFase} ({sharedClass})
              </div>

              <div>
                <label className="block font-semibold text-[#3D4035] mb-1">Target Total Jam Pelajaran (JP)</label>
                <input
                  type="number"
                  min={10}
                  max={200}
                  value={atpTotalJP}
                  onChange={(e) => setAtpTotalJP(Number(e.target.value))}
                  className="w-full bg-[#F9F8F3] border border-[#D8D4C7] rounded-xl px-3 py-2 text-[#2D3127]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-4 bg-[#D4A373] hover:bg-[#c29263] text-[#2D3127] font-bold py-3 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-md"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Menyusun Alur Pembelajaran...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Buat Alur Tujuan Pembelajaran (ATP)
                  </>
                )}
              </button>
            </form>
          )}

          {/* Tool 6: Generator KKTP */}
          {activeTool === "kktp" && (
            <form onSubmit={handleGenerateKktp} className="space-y-3 text-xs">
              <h3 className="font-bold text-[#2D3127] text-sm border-b border-[#F0EEE4] pb-2 flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-[#D4A373]" />
                Generator KKTP (Kriteria Ketercapaian TP)
              </h3>

              <div>
                <label className="block font-semibold text-[#3D4035] mb-1">Topik / Materi Pembelajaran</label>
                <input
                  type="text"
                  value={kktpTopic}
                  onChange={(e) => setKktpTopic(e.target.value)}
                  className="w-full bg-[#F9F8F3] border border-[#D8D4C7] rounded-xl px-3 py-2 text-[#2D3127]"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-[#3D4035] mb-1">Rumusan Tujuan Pembelajaran (TP)</label>
                <textarea
                  rows={2}
                  value={kktpTpText}
                  onChange={(e) => setKktpTpText(e.target.value)}
                  className="w-full bg-[#F9F8F3] border border-[#D8D4C7] rounded-xl px-3 py-2 text-[#2D3127]"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-[#3D4035] mb-1">Pendekatan KKTP</label>
                <select
                  value={kktpApproach}
                  onChange={(e) => setKktpApproach(e.target.value as any)}
                  className="w-full bg-[#F9F8F3] border border-[#D8D4C7] rounded-xl px-3 py-2 text-[#2D3127]"
                >
                  <option value="Rubrik Deskriptif">Rubrik Deskriptif (4 Kategori Ketercapaian)</option>
                  <option value="Interval Nilai">Interval Nilai (0-60, 61-75, 76-88, 89-100)</option>
                  <option value="Skala Deskripsi">Skala Deskripsi Kriteria</option>
                  <option value="Campuran">Campuran (Rubrik & Interval)</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-4 bg-[#D4A373] hover:bg-[#c29263] text-[#2D3127] font-bold py-3 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-md"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Menyusun Rubrik KKTP AI...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Buat Kriteria Ketercapaian (KKTP)
                  </>
                )}
              </button>
            </form>
          )}

          {/* Tool 7: Generator Prota & Prosem */}
          {activeTool === "prota_prosem" && (
            <form onSubmit={handleGenerateProtaProsem} className="space-y-3 text-xs">
              <h3 className="font-bold text-[#2D3127] text-sm border-b border-[#F0EEE4] pb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#D4A373]" />
                Generator Prota & Prosem (Program Tahunan / Semester)
              </h3>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#3D4035] mb-1">Tahun Ajaran</label>
                  <input
                    type="text"
                    value={ppAcademicYear}
                    onChange={(e) => setPpAcademicYear(e.target.value)}
                    className="w-full bg-[#F9F8F3] border border-[#D8D4C7] rounded-xl px-3 py-2 text-[#2D3127]"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#3D4035] mb-1">Jam Efektif Pertahun (JP)</label>
                  <input
                    type="number"
                    value={ppTotalJPEffective}
                    onChange={(e) => setPpTotalJPEffective(Number(e.target.value))}
                    className="w-full bg-[#F9F8F3] border border-[#D8D4C7] rounded-xl px-3 py-2 text-[#2D3127]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-4 bg-[#D4A373] hover:bg-[#c29263] text-[#2D3127] font-bold py-3 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-md"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Menyusun Prota & Prosem...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Buat Program Tahunan & Semester
                  </>
                )}
              </button>
            </form>
          )}

          {/* Tool 8: Soal Quiz Form */}
          {activeTool === "soal_quiz" && (
            <form onSubmit={handleGenerateSoal} className="space-y-3 text-xs">
              <h3 className="font-bold text-[#2D3127] text-sm border-b border-[#F0EEE4] pb-2 flex items-center gap-2">
                <FileQuestion className="w-4 h-4 text-[#D4A373]" />
                Generator Soal HOTS & Kunci Jawaban
              </h3>

              <div>
                <label className="block font-semibold text-[#3D4035] mb-1">Materi / Indikator Soal</label>
                <textarea
                  rows={2}
                  value={sqTopic}
                  onChange={(e) => setSqTopic(e.target.value)}
                  className="w-full bg-[#F9F8F3] border border-[#D8D4C7] rounded-xl px-3 py-2 text-[#2D3127]"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-[#3D4035] mb-1">Jumlah Soal</label>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={sqCount}
                    onChange={(e) => setSqCount(Number(e.target.value))}
                    className="w-full bg-[#F9F8F3] border border-[#D8D4C7] rounded-xl px-3 py-2 text-[#2D3127]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#3D4035] mb-1">Bentuk Soal</label>
                  <select
                    value={sqType}
                    onChange={(e) => setSqType(e.target.value as any)}
                    className="w-full bg-[#F9F8F3] border border-[#D8D4C7] rounded-xl px-3 py-2 text-[#2D3127]"
                  >
                    <option value="pilihan_ganda">Pilihan Ganda</option>
                    <option value="essay">Essay / Uraian</option>
                    <option value="campuran">Campuran</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-[#3D4035] mb-1">Level Kognitif</label>
                  <select
                    value={sqDifficulty}
                    onChange={(e) => setSqDifficulty(e.target.value as any)}
                    className="w-full bg-[#F9F8F3] border border-[#D8D4C7] rounded-xl px-3 py-2 text-[#2D3127]"
                  >
                    <option value="HOTS">HOTS (C4-C6)</option>
                    <option value="MTS">Sedang (C3)</option>
                    <option value="LOTS">Dasar (C1-C2)</option>
                    <option value="campuran">Variatif</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-4 bg-[#D4A373] hover:bg-[#c29263] text-[#2D3127] font-bold py-3 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-md"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Menyusun Soal AI...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Buat Soal & Kunci Jawaban
                  </>
                )}
              </button>
            </form>
          )}

          {/* Tool 9: Asesmen Diagnostik Form */}
          {activeTool === "asesmen_diagnostik" && (
            <form onSubmit={handleGenerateAsesmen} className="space-y-3 text-xs">
              <h3 className="font-bold text-[#2D3127] text-sm border-b border-[#F0EEE4] pb-2 flex items-center gap-2">
                <Target className="w-4 h-4 text-[#D4A373]" />
                Generator Asesmen Diagnostik & Remedial
              </h3>

              <div>
                <label className="block font-semibold text-[#3D4035] mb-1">Materi / Capaian Pembelajaran</label>
                <input
                  type="text"
                  value={adTopic}
                  onChange={(e) => setAdTopic(e.target.value)}
                  className="w-full bg-[#F9F8F3] border border-[#D8D4C7] rounded-xl px-3 py-2 text-[#2D3127]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#3D4035] mb-1">Identifikasi Kendala Siswa</label>
                <textarea
                  rows={3}
                  value={adDifficulties}
                  onChange={(e) => setAdDifficulties(e.target.value)}
                  placeholder="Ceritakan gambaran pemahaman siswa saat ini..."
                  className="w-full bg-[#F9F8F3] border border-[#D8D4C7] rounded-xl px-3 py-2 text-[#2D3127]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-4 bg-[#D4A373] hover:bg-[#c29263] text-[#2D3127] font-bold py-3 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-md"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Menyusun Asesmen AI...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Rancang Asesmen Diagnostik
                  </>
                )}
              </button>
            </form>
          )}

          {/* Tool 10: Catatan Wali Form */}
          {activeTool === "catatan_wali" && (
            <form onSubmit={handleGenerateCatatanWali} className="space-y-3 text-xs">
              <h3 className="font-bold text-[#2D3127] text-sm border-b border-[#F0EEE4] pb-2 flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#D4A373]" />
                Generator Catatan Rapor Wali Kelas
              </h3>

              <div>
                <label className="block font-semibold text-[#3D4035] mb-1">Nama Siswa</label>
                <input
                  type="text"
                  value={cwName}
                  onChange={(e) => setCwName(e.target.value)}
                  className="w-full bg-[#F9F8F3] border border-[#D8D4C7] rounded-xl px-3 py-2 text-[#2D3127]"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-[#3D4035] mb-1">Capaian Akademik Siswa</label>
                <textarea
                  rows={2}
                  value={cwPerf}
                  onChange={(e) => setCwPerf(e.target.value)}
                  placeholder="Prestasi akademik / kekuatan utama..."
                  className="w-full bg-[#F9F8F3] border border-[#D8D4C7] rounded-xl px-3 py-2 text-[#2D3127]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#3D4035] mb-1">Karakter & Kedisiplinan</label>
                <textarea
                  rows={2}
                  value={cwChar}
                  onChange={(e) => setCwChar(e.target.value)}
                  placeholder="Sikap, pergaulan, atau hal yang perlu ditingkatkan..."
                  className="w-full bg-[#F9F8F3] border border-[#D8D4C7] rounded-xl px-3 py-2 text-[#2D3127]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#3D4035] mb-1">Gambaran Absensi Presensi</label>
                <input
                  type="text"
                  value={cwAtt}
                  onChange={(e) => setCwAtt(e.target.value)}
                  className="w-full bg-[#F9F8F3] border border-[#D8D4C7] rounded-xl px-3 py-2 text-[#2D3127]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-4 bg-[#D4A373] hover:bg-[#c29263] text-[#2D3127] font-bold py-3 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-md"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Menyusun Catatan Rapor AI...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Buat Draf Catatan Rapor
                  </>
                )}
              </button>
            </form>
          )}

          {/* Tool 11: Chatbot Kustom Bebas / Konsultasi AI Guru */}
          {activeTool === "chat_guru" && (
            <div className="space-y-3 text-xs flex flex-col h-[520px]">
              <div className="border-b border-[#F0EEE4] pb-2 shrink-0">
                <h3 className="font-bold text-[#2D3127] text-sm flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-[#D4A373]" />
                  Chatbot AI Kustom Bebas Guru
                </h3>
                <p className="text-[11px] text-[#6B6E60]">
                  Konsultasikan topik bebas, strategi P5, ide media ajar interaktif, atau administrasi sekolah.
                </p>
              </div>

              <div className="flex-1 overflow-y-auto space-y-2 p-3 bg-[#F9F8F3] rounded-xl border border-[#E2DDD0]">
                {chatHistory.map((msg, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-xl text-xs ${
                      msg.role === "user"
                        ? "bg-[#3D4035] text-[#FAF9F5] ml-6"
                        : "bg-white text-[#2D3127] border border-[#E2DDD0] mr-6 shadow-2xs"
                    }`}
                  >
                    <div className="font-bold text-[10px] opacity-75 mb-1">
                      {msg.role === "user" ? "Anda (Guru)" : "Asisten AI Guru"}
                    </div>
                    <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendChat} className="flex gap-2 shrink-0">
                <input
                  type="text"
                  placeholder="Ketik pertanyaan atau instruksi kustom bebas..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  className="flex-1 bg-[#F9F8F3] border border-[#D8D4C7] rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-[#D4A373] focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={loading || !chatInput.trim()}
                  className="bg-[#D4A373] hover:bg-[#c29263] text-[#2D3127] p-2.5 rounded-xl transition cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Right Preview Output Panel */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-[#E2DDD0] p-6 shadow-2xs flex flex-col min-h-[520px]">
          <div className="flex items-center justify-between border-b border-[#F0EEE4] pb-3 mb-4">
            <h3 className="font-bold text-[#2D3127] text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#588157]" />
              Dokumen / Hasil Generasi AI
            </h3>

            {generatedContent && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 bg-[#F4F2EA] hover:bg-[#EFECE1] text-[#3D4035] px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#588157]" /> Tersalin!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-[#6B6E60]" /> Salin Teks
                    </>
                  )}
                </button>

                <button
                  onClick={handlePrintOutput}
                  className="flex items-center gap-1 bg-[#3D4035] hover:bg-[#2D3126] text-[#FAF9F5] px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5 text-[#D4A373]" /> Cetak / Export
                </button>
              </div>
            )}
          </div>

          {errorMsg && (
            <div className="bg-[#F8D7DA] border border-[#F5C2C7] text-[#842029] p-4 rounded-xl text-xs font-semibold mb-4">
              {errorMsg}
            </div>
          )}

          <div className="flex-1 bg-[#F9F8F3] rounded-xl p-5 border border-[#E2DDD0] font-mono text-xs text-[#2D3127] leading-relaxed overflow-y-auto max-h-[640px] whitespace-pre-wrap">
            {loading ? (
              <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-[#8C8F82] space-y-3">
                <Loader2 className="w-8 h-8 text-[#588157] animate-spin" />
                <p className="font-sans font-semibold text-xs text-[#3D4035]">
                  Sedang merancang dokumen Kurikulum Merdeka menggunakan Gemini AI...
                </p>
              </div>
            ) : generatedContent ? (
              generatedContent
            ) : (
              <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-[#8C8F82] text-center font-sans space-y-2">
                <Sparkles className="w-8 h-8 text-[#8C8F82]" />
                <p className="font-medium text-xs text-[#6B6E60]">
                  Pilih generator di sebelah kiri dan klik tombol untuk menghasilkan dokumen Kurikulum Merdeka.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
