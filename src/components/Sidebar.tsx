import React from "react";
import { TabType } from "../types";
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  BookOpen,
  FileText,
  UserCheck,
  GraduationCap,
  Sparkles,
  Printer,
  FileSpreadsheet,
  BookOpenCheck,
} from "lucide-react";

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  onOpenQuickPrint: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  onOpenQuickPrint,
}) => {
  const menuItems = [
    { id: "overview" as TabType, label: "Beranda", icon: LayoutDashboard, badge: undefined },
    { id: "kurikulum" as TabType, label: "CP, TP, ATP & KKTP", icon: BookOpenCheck, badge: "Integrasi" },
    { id: "absensi" as TabType, label: "Absensi Siswa", icon: Users, badge: undefined },
    { id: "jadwal" as TabType, label: "Jadwal Mengajar", icon: CalendarDays, badge: undefined },
    { id: "agenda" as TabType, label: "Agenda & ATP", icon: BookOpen, badge: undefined },
    { id: "jurnal" as TabType, label: "Jurnal Mengajar", icon: FileText, badge: undefined },
    { id: "perwalian" as TabType, label: "Guru Wali / BK", icon: UserCheck, badge: undefined },
    { id: "penilaian" as TabType, label: "Penilaian & Rekap", icon: GraduationCap, badge: "Kurikulum Merdeka" },
    { id: "google_workspace" as TabType, label: "Google Drive & Sheets", icon: FileSpreadsheet, badge: "Google Cloud" },
    { id: "ai_assistant" as TabType, label: "Asisten AI Gemini", icon: Sparkles, badge: "AI Ready" },
  ];

  return (
    <aside className="w-full lg:w-64 bg-[#FAF9F5] border-r border-[#E2DDD0] shrink-0 flex flex-col justify-between">
      <div className="p-4 space-y-1">
        <div className="text-[11px] font-bold text-[#8C8F82] uppercase tracking-wider px-3 mb-2">
          Menu Administrasi
        </div>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition cursor-pointer ${
                isActive
                  ? "bg-[#3D4035] text-[#FAF9F5] shadow-xs"
                  : "text-[#4E5244] hover:text-[#2D3126] hover:bg-[#F2EFE6]"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 ${
                    isActive
                      ? "text-[#D4A373]"
                      : item.id === "ai_assistant"
                      ? "text-[#588157]"
                      : "text-[#7C7F72]"
                  }`}
                />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                    isActive
                      ? "bg-[#D4A373]/25 text-[#EFE2D3]"
                      : "bg-[#E9EDC9] text-[#3D4035] border border-[#CCD5AE]"
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Quick Print / Export Box */}
      <div className="p-4 m-4 bg-[#F4F2EA] rounded-2xl border border-[#E2DDD0] space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-[#3D4035]">
          <Printer className="w-4 h-4 text-[#588157]" />
          <span>Cetak Dokumen Guru</span>
        </div>
        <p className="text-xs text-[#6B6E60] leading-snug">
          Cetak langsung Laporan Absensi, Jurnal, Agenda, dan Rekap Nilai Rapor.
        </p>
        <button
          onClick={onOpenQuickPrint}
          className="w-full mt-2 flex items-center justify-center gap-2 bg-white hover:bg-[#EFECE1] text-[#3D4035] border border-[#D8D4C7] px-3 py-1.5 rounded-xl text-xs font-semibold shadow-2xs transition cursor-pointer"
        >
          <FileSpreadsheet className="w-3.5 h-3.5 text-[#588157]" />
          Cetak / Export PDF
        </button>
      </div>
    </aside>
  );
};
