import React from "react";
import { SchoolProfile, TabType, AuthUser } from "../types";
import { Sparkles, Settings, Calendar, Award, Building, UserCheck, ShieldCheck, LogIn } from "lucide-react";

interface HeaderProps {
  profile: SchoolProfile;
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  onOpenSettings: () => void;
  currentUser?: AuthUser;
  onOpenLogin: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  profile,
  setActiveTab,
  onOpenSettings,
  currentUser,
  onOpenLogin,
}) => {
  const todayFormatted = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const isSuperAdmin = currentUser?.role === "superadmin";

  return (
    <header className="bg-[#3D4035] border-b border-[#2D3126] text-[#FAF9F5] sticky top-0 z-30 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-3">
        {/* Brand & Teacher Info */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#D4A373] text-[#2F3327] flex items-center justify-center font-bold text-xl shadow-xs shrink-0">
            A
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-base sm:text-lg tracking-tight text-[#FAF9F5] leading-tight">
                Super Guru <span className="text-[#D4A373] font-medium text-xs sm:text-sm px-2.5 py-0.5 rounded-full bg-[#D4A373]/15 border border-[#D4A373]/30">Kurikulum Merdeka</span>
              </h1>
            </div>
            <p className="text-xs text-[#C8C5B8] flex items-center gap-2 mt-0.5">
              <span className="truncate max-w-[180px] sm:max-w-xs font-semibold text-white">
                {currentUser?.name || profile.teacherName}
              </span>
              <span className="text-[#8B8D82]">&bull;</span>
              <span className="hidden sm:inline flex items-center gap-1 text-[#EAE7DC]">
                <Building className="w-3 h-3 text-[#D4A373] inline" /> {profile.schoolName}
              </span>
            </p>
          </div>
        </div>

        {/* Date & Meta Badge */}
        <div className="hidden lg:flex items-center gap-2.5 text-xs">
          <div className="flex items-center gap-2 bg-[#2D3126]/80 border border-[#4E5244] px-3 py-1.5 rounded-xl text-[#EAE7DC]">
            <Calendar className="w-3.5 h-3.5 text-[#D4A373]" />
            <span>{todayFormatted}</span>
          </div>
          <div className="flex items-center gap-2 bg-[#2D3126]/80 border border-[#4E5244] px-3 py-1.5 rounded-xl text-[#EAE7DC]">
            <Award className="w-3.5 h-3.5 text-[#CCD5AE]" />
            <span>TA {profile.academicYear} ({profile.semester})</span>
          </div>
        </div>

        {/* User Account & Quick Action Buttons */}
        <div className="flex items-center gap-2 ml-auto sm:ml-0">
          {/* User Account / Role Badge */}
          <button
            onClick={onOpenLogin}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition border cursor-pointer ${
              isSuperAdmin
                ? "bg-[#174EA6] text-white border-[#174EA6] hover:bg-[#1557B0]"
                : "bg-[#2D3126] text-[#EAE7DC] border-[#4E5244] hover:bg-[#4E5244]"
            }`}
            title="Ganti Akun / Portal Login"
          >
            {isSuperAdmin ? (
              <ShieldCheck className="w-4 h-4 text-[#D2E3FC]" />
            ) : (
              <UserCheck className="w-4 h-4 text-[#CCD5AE]" />
            )}
            <div className="text-left hidden sm:block">
              <div className="text-[11px] leading-none font-bold">
                {isSuperAdmin ? "Super Admin" : "User Guru"}
              </div>
              <div className="text-[9px] opacity-80 leading-none mt-0.5">Ganti Akun</div>
            </div>
            <LogIn className="w-3.5 h-3.5 opacity-70" />
          </button>

          <button
            onClick={() => setActiveTab("ai_assistant")}
            className="flex items-center gap-2 bg-[#D4A373] hover:bg-[#c29263] text-[#2D3127] font-semibold px-3 py-2 rounded-xl text-xs sm:text-sm transition shadow-xs cursor-pointer active:scale-95"
          >
            <Sparkles className="w-4 h-4 fill-[#2D3127]" />
            <span className="hidden xs:inline">Asisten AI</span>
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
