import React from "react";
import { SchoolProfile, TabType } from "../types";
import { Sparkles, Settings, Calendar, Award, Building } from "lucide-react";

interface HeaderProps {
  profile: SchoolProfile;
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  profile,
  setActiveTab,
  onOpenSettings,
}) => {
  const todayFormatted = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <header className="bg-[#3D4035] border-b border-[#2D3126] text-[#FAF9F5] sticky top-0 z-30 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Brand & Teacher Info */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#D4A373] text-[#2F3327] flex items-center justify-center font-bold text-xl shadow-xs">
            A
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-base sm:text-lg tracking-tight text-[#FAF9F5] leading-tight">
                Super Guru <span className="text-[#D4A373] font-medium text-xs sm:text-sm px-2.5 py-0.5 rounded-full bg-[#D4A373]/15 border border-[#D4A373]/30">Kurikulum Merdeka</span>
              </h1>
            </div>
            <p className="text-xs text-[#C8C5B8] flex items-center gap-2 mt-0.5">
              <span className="truncate max-w-[200px] sm:max-w-xs">{profile.teacherName}</span>
              <span className="text-[#8B8D82]">&bull;</span>
              <span className="hidden sm:inline flex items-center gap-1 text-[#EAE7DC]">
                <Building className="w-3 h-3 text-[#D4A373] inline" /> {profile.schoolName}
              </span>
            </p>
          </div>
        </div>

        {/* Date & Meta Badge */}
        <div className="hidden lg:flex items-center gap-3 text-xs">
          <div className="flex items-center gap-2 bg-[#2D3126]/80 border border-[#4E5244] px-3 py-1.5 rounded-xl text-[#EAE7DC]">
            <Calendar className="w-3.5 h-3.5 text-[#D4A373]" />
            <span>{todayFormatted}</span>
          </div>
          <div className="flex items-center gap-2 bg-[#2D3126]/80 border border-[#4E5244] px-3 py-1.5 rounded-xl text-[#EAE7DC]">
            <Award className="w-3.5 h-3.5 text-[#CCD5AE]" />
            <span>TA {profile.academicYear} ({profile.semester})</span>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-2 ml-auto sm:ml-0">
          <button
            onClick={() => setActiveTab("ai_assistant")}
            className="flex items-center gap-2 bg-[#D4A373] hover:bg-[#c29263] text-[#2D3127] font-semibold px-3.5 py-2 rounded-xl text-xs sm:text-sm transition shadow-xs cursor-pointer active:scale-95"
          >
            <Sparkles className="w-4 h-4 fill-[#2D3127]" />
            <span className="hidden xs:inline">Asisten AI Guru</span>
          </button>

          <button
            onClick={onOpenSettings}
            className="p-2 text-[#EAE7DC] hover:text-white bg-[#2D3126] hover:bg-[#4E5244] border border-[#4E5244] rounded-xl transition cursor-pointer"
            title="Pengaturan Profil & API Key"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
