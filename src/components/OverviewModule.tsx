import React from "react";
import { SchoolProfile, ScheduleItem, Student, JournalItem, TabType } from "../types";
import {
  Users,
  Calendar,
  Sparkles,
  BookOpen,
  ArrowRight,
  UserCheck,
  CheckCircle2,
  Clock,
  MapPin,
  Flame,
} from "lucide-react";

interface OverviewModuleProps {
  profile: SchoolProfile;
  students: Student[];
  schedules: ScheduleItem[];
  journals: JournalItem[];
  setActiveTab: (tab: TabType) => void;
  onOpenQuickPrint: () => void;
}

export const OverviewModule: React.FC<OverviewModuleProps> = ({
  profile,
  students,
  schedules,
  journals,
  setActiveTab,
}) => {
  const daysMap: Record<number, string> = {
    1: "Senin",
    2: "Selasa",
    3: "Rabu",
    4: "Kamis",
    5: "Jumat",
  };
  const todayDayName = daysMap[new Date().getDay()] || "Senin";
  const todaySchedules = schedules.filter((s) => s.day === todayDayName);

  return (
    <div className="space-y-6">
      {/* Welcome Hero Card */}
      <div className="relative overflow-hidden bg-[#3D4035] rounded-3xl p-6 sm:p-8 text-[#FAF9F5] shadow-md border border-[#2D3126]">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-[#D4A373]/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4A373]/20 text-[#EFE2D3] text-xs font-semibold border border-[#D4A373]/30">
              <Sparkles className="w-3.5 h-3.5 text-[#D4A373]" /> Asisten AI Kurikulum Merdeka Siap Digunakan
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Selamat Datang, {profile.teacherName}!
            </h2>
            <p className="text-[#C8C5B8] text-sm leading-relaxed">
              Kelola seluruh administrasi mengajar Anda secara efisien: Absensi, Jadwal, Agenda CP/ATP, Jurnal Mengajar, Wali Kelas, hingga Rekap Nilai Rapor Otomatis. Gunakan Gemini AI untuk merancang Modul Ajar dan Soal HOTS secara otomatis.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <button
              onClick={() => setActiveTab("absensi")}
              className="flex items-center justify-center gap-2 bg-[#D4A373] hover:bg-[#c29263] text-[#2D3127] font-semibold px-5 py-3 rounded-2xl text-sm transition shadow-sm cursor-pointer"
            >
              <UserCheck className="w-4 h-4" />
              Absensi Hari Ini
            </button>
            <button
              onClick={() => setActiveTab("ai_assistant")}
              className="flex items-center justify-center gap-2 bg-[#2D3126] hover:bg-[#4E5244] text-[#EAE7DC] border border-[#4E5244] font-semibold px-5 py-3 rounded-2xl text-sm transition cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#D4A373]" />
              Buat Modul Ajar AI
            </button>
          </div>
        </div>
      </div>

      {/* Quick Statistics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#E2DDD0] shadow-2xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#E9EDC9] text-[#3D4035] flex items-center justify-center font-bold">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-[#2D3127]">{students.length}</div>
            <div className="text-xs text-[#6B6E60] font-medium">Total Siswa Terdata</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E2DDD0] shadow-2xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#CCD5AE]/40 text-[#588157] flex items-center justify-center font-bold">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-[#2D3127]">{todaySchedules.length} Jam</div>
            <div className="text-xs text-[#6B6E60] font-medium">Mengajar Hari Ini ({todayDayName})</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E2DDD0] shadow-2xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#FAEDCD] text-[#D4A373] flex items-center justify-center font-bold">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-[#2D3127]">{journals.length} Entri</div>
            <div className="text-xs text-[#6B6E60] font-medium">Jurnal Mengajar Terisi</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E2DDD0] shadow-2xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#FEFAE0] text-[#8C5E32] flex items-center justify-center font-bold border border-[#FAEDCD]">
            <Flame className="w-6 h-6 text-[#D4A373]" />
          </div>
          <div>
            <div className="text-2xl font-bold text-[#2D3127]">{profile.homeroomClass}</div>
            <div className="text-xs text-[#6B6E60] font-medium">Kelas Perwalian Wali Kelas</div>
          </div>
        </div>
      </div>

      {/* Main Grid: Today's Schedule & Quick AI Features */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Schedule Timeline */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#E2DDD0] p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#F0EEE4]">
            <div>
              <h3 className="font-bold text-[#2D3127] text-lg flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#588157]" />
                Jadwal Mengajar Hari Ini ({todayDayName})
              </h3>
              <p className="text-xs text-[#6B6E60]">
                Akses cepat modul dan catatan mengajar sesuai jadwal
              </p>
            </div>
            <button
              onClick={() => setActiveTab("jadwal")}
              className="text-xs font-semibold text-[#588157] hover:text-[#3D4035] flex items-center gap-1 cursor-pointer"
            >
              Lihat Semua <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {todaySchedules.length === 0 ? (
            <div className="p-8 text-center bg-[#F7F5EE] rounded-xl text-[#6B6E60] space-y-2 border border-[#E2DDD0]">
              <CheckCircle2 className="w-8 h-8 text-[#588157] mx-auto" />
              <p className="text-sm font-medium">Tidak ada jadwal mengajar tatap muka hari ini ({todayDayName}).</p>
              <p className="text-xs">Gunakan waktu untuk menyusun Modul Ajar AI atau memeriksa Penilaian Siswa.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {todaySchedules.map((sch) => (
                <div
                  key={sch.id}
                  className="p-4 rounded-xl border border-[#E2DDD0] bg-[#F7F5EE] hover:bg-[#F2EFE6] flex items-center justify-between transition gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#3D4035] text-[#D4A373] font-bold flex flex-col items-center justify-center text-xs">
                      <span>Jam</span>
                      <span className="text-sm">{sch.period}</span>
                    </div>
                    <div>
                      <div className="font-bold text-[#2D3127] text-sm sm:text-base">
                        {sch.subject}
                      </div>
                      <div className="text-xs text-[#6B6E60] flex items-center gap-3 mt-1">
                        <span className="font-semibold text-[#3D4035] bg-[#E9EDC9] px-2 py-0.5 rounded-md">
                          {sch.className}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-[#8C8F82]" /> {sch.timeSlot}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[#8C8F82]" /> {sch.room}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveTab("jurnal")}
                    className="shrink-0 bg-white hover:bg-[#FAF9F5] text-[#3D4035] border border-[#D8D4C7] px-3 py-1.5 rounded-lg text-xs font-semibold shadow-2xs transition cursor-pointer"
                  >
                    Tulis Jurnal
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* AI Assistant Showcase */}
        <div className="bg-[#2D3126] rounded-2xl p-6 text-[#FAF9F5] shadow-md border border-[#4E5244] flex flex-col justify-between">
          <div className="space-y-4">
            <div className="w-10 h-10 rounded-xl bg-[#D4A373]/20 text-[#D4A373] flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-[#FAF9F5]">Asisten AI Guru</h3>
              <p className="text-xs text-[#C8C5B8] mt-1 leading-relaxed">
                Dioptimalkan untuk standar Kurikulum Merdeka Indonesia.
              </p>
            </div>

            <div className="space-y-2 text-xs">
              <div
                onClick={() => setActiveTab("ai_assistant")}
                className="p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 cursor-pointer transition flex items-center justify-between"
              >
                <span>📘 Generator Modul Ajar (RPP)</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#D4A373]" />
              </div>
              <div
                onClick={() => setActiveTab("ai_assistant")}
                className="p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 cursor-pointer transition flex items-center justify-between"
              >
                <span>📝 Generator Soal HOTS & Kunci</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#D4A373]" />
              </div>
              <div
                onClick={() => setActiveTab("ai_assistant")}
                className="p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 cursor-pointer transition flex items-center justify-between"
              >
                <span>🎯 Asesmen Diagnostik & Remedial</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#D4A373]" />
              </div>
              <div
                onClick={() => setActiveTab("ai_assistant")}
                className="p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 cursor-pointer transition flex items-center justify-between"
              >
                <span>✍️ Catatan Rapor Wali Kelas</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#D4A373]" />
              </div>
            </div>
          </div>

          <button
            onClick={() => setActiveTab("ai_assistant")}
            className="w-full mt-6 bg-[#D4A373] hover:bg-[#c29263] text-[#2D3127] font-bold py-2.5 rounded-xl text-xs transition cursor-pointer text-center"
          >
            Buka Asisten AI Gemini
          </button>
        </div>
      </div>
    </div>
  );
};
