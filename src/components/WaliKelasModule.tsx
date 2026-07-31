import React, { useState } from "react";
import { HomeroomStudent, SchoolProfile, GuidanceNote, TabType } from "../types";
import { getHomeroomStudents, saveHomeroomStudents } from "../utils/storage";
import { aiGenerators } from "../utils/aiService";
import {
  UserCheck,
  Search,
  Plus,
  Phone,
  Sparkles,
  Award,
  BookOpen,
  X,
  FileText,
  User,
  CheckCircle2,
} from "lucide-react";

interface WaliKelasModuleProps {
  profile: SchoolProfile;
  setActiveTab: (tab: TabType) => void;
}

export const WaliKelasModule: React.FC<WaliKelasModuleProps> = ({ profile }) => {
  const [students, setStudents] = useState<HomeroomStudent[]>(getHomeroomStudents());
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedStudent, setSelectedStudent] = useState<HomeroomStudent | null>(null);

  // New Guidance Note State
  const [isGuidanceModalOpen, setIsGuidanceModalOpen] = useState<boolean>(false);
  const [gnTopic, setGnTopic] = useState<string>("");
  const [gnDesc, setGnDesc] = useState<string>("");
  const [gnFollowUp, setGnFollowUp] = useState<string>("");

  // AI Generator state for student report note
  const [isAiGenerating, setIsAiGenerating] = useState<boolean>(false);
  const [aiNoteResult, setAiNoteResult] = useState<string>("");

  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.nisn.includes(searchQuery) ||
      s.parentName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const keyOfficers = students.filter(
    (s) => s.roleInClass && s.roleInClass !== "Anggota"
  );

  const handleOpenStudentDetail = (student: HomeroomStudent) => {
    setSelectedStudent(student);
    setAiNoteResult("");
  };

  const handleAddGuidanceNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) return;

    const newNote: GuidanceNote = {
      id: `GN-${Date.now()}`,
      date: new Date().toISOString().slice(0, 10),
      topic: gnTopic,
      description: gnDesc,
      followUp: gnFollowUp,
    };

    const updatedStudents = students.map((s) => {
      if (s.id === selectedStudent.id) {
        return {
          ...s,
          guidanceNotes: [newNote, ...(s.guidanceNotes || [])],
        };
      }
      return s;
    });

    setStudents(updatedStudents);
    saveHomeroomStudents(updatedStudents);
    setSelectedStudent({
      ...selectedStudent,
      guidanceNotes: [newNote, ...(selectedStudent.guidanceNotes || [])],
    });

    setGnTopic("");
    setGnDesc("");
    setGnFollowUp("");
    setIsGuidanceModalOpen(false);
  };

  const handleGenerateAiNote = async () => {
    if (!selectedStudent) return;
    setIsAiGenerating(true);
    try {
      const res = await aiGenerators.catatanWali({
        studentName: selectedStudent.name,
        academicPerformance: "Sangat antusias saat tugas mandiri, memahami konsep dengan baik",
        characterTrait: `Saling menghormati sesama teman, berperan sebagai ${selectedStudent.roleInClass || "Siswa"}`,
        attendanceSummary: "Kehadiran 100% disiplin",
      });
      setAiNoteResult(res);
    } catch (err: any) {
      alert("Gagal memproses AI: " + err.message);
    } finally {
      setIsAiGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title Bar */}
      <div className="bg-white rounded-2xl border border-[#E2DDD0] p-6 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-[#2D3127] flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-[#588157]" />
              Manajemen Kelas Perwalian ({profile.homeroomClass})
            </h2>
          </div>
          <p className="text-xs text-[#6B6E60] mt-0.5">
            Wali Kelas: {profile.teacherName} &bull; Data Siswa, Pengurus Kelas, Kontak Orang Tua, & Bimbingan Perwalian
          </p>
        </div>
      </div>

      {/* Organizational Structure Cards */}
      <div className="bg-[#3D4035] text-[#FAF9F5] rounded-2xl p-6 shadow-md border border-[#2D3126] space-y-4">
        <div className="flex items-center justify-between border-b border-[#2D3126] pb-3">
          <h3 className="font-bold text-sm text-[#D4A373] uppercase tracking-wider flex items-center gap-2">
            <Award className="w-4 h-4" /> Structure Organisasi Kelas Perwalian
          </h3>
          <span className="text-xs text-[#A3B18A]">Total {students.length} Siswa</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {keyOfficers.map((off) => (
            <div
              key={off.id}
              onClick={() => handleOpenStudentDetail(off)}
              className="bg-[#2D3126]/60 hover:bg-[#2D3126] border border-[#588157]/40 p-3.5 rounded-xl cursor-pointer transition space-y-1"
            >
              <div className="text-[10px] font-bold text-[#D4A373] uppercase tracking-wide">
                {off.roleInClass}
              </div>
              <div className="font-bold text-xs text-[#FAF9F5] truncate">{off.name}</div>
              <div className="text-[11px] text-[#A3B18A] font-mono">NISN: {off.nisn}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Student Roster Table */}
      <div className="bg-white rounded-2xl border border-[#E2DDD0] overflow-hidden shadow-2xs space-y-4 p-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-3 border-b border-[#F0EEE4]">
          <h3 className="font-bold text-[#2D3127] text-base">
            Daftar Siswa Perwalian
          </h3>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-[#8C8F82] absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Cari nama, NISN, orang tua..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#F9F8F3] border border-[#D8D4C7] rounded-xl pl-9 pr-3 py-1.5 text-xs text-[#2D3127] focus:outline-none focus:ring-2 focus:ring-[#D4A373]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F4F2EA] text-[#3D4035] text-xs font-bold uppercase tracking-wider border-b border-[#E2DDD0]">
                <th className="p-3 pl-4 w-12 text-center">No</th>
                <th className="p-3 w-32">NISN</th>
                <th className="p-3">Nama Siswa</th>
                <th className="p-3 w-16 text-center">L/P</th>
                <th className="p-3">Orang Tua / Wali</th>
                <th className="p-3">Kontak Orang Tua</th>
                <th className="p-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0EEE4] text-xs text-[#2D3127]">
              {filteredStudents.map((std, idx) => (
                <tr key={std.id} className="hover:bg-[#F7F5EE] transition">
                  <td className="p-3 pl-4 text-center text-[#6B6E60] font-medium">{idx + 1}</td>
                  <td className="p-3 font-mono text-[#6B6E60]">{std.nisn}</td>
                  <td className="p-3 font-bold text-[#2D3127]">
                    {std.name}
                    {std.roleInClass && std.roleInClass !== "Anggota" && (
                      <span className="ml-2 text-[10px] bg-[#E9EDC9] text-[#3D4035] px-2 py-0.5 rounded font-semibold">
                        {std.roleInClass}
                      </span>
                    )}
                  </td>
                  <td className="p-3 text-center font-medium text-[#6B6E60]">{std.gender}</td>
                  <td className="p-3 font-medium text-[#3D4035]">{std.parentName}</td>
                  <td className="p-3 text-[#6B6E60] flex items-center gap-1.5">
                    <Phone className="w-3 h-3 text-[#8C8F82]" />
                    <span>{std.parentPhone}</span>
                  </td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => handleOpenStudentDetail(std)}
                      className="bg-[#3D4035] hover:bg-[#2D3126] text-[#FAF9F5] px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer"
                    >
                      Buka Profil & BK
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Student Profile & Guidance Log Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 bg-[#2D3126]/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-[#E2DDD0] space-y-6 my-8">
            <div className="flex items-start justify-between border-b border-[#F0EEE4] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#E9EDC9] text-[#3D4035] flex items-center justify-center font-bold text-lg">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-[#2D3127] text-lg">{selectedStudent.name}</h3>
                  <p className="text-xs text-[#6B6E60] font-mono">
                    NISN: {selectedStudent.nisn} &bull; Jabatan: {selectedStudent.roleInClass || "Siswa"}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedStudent(null)}
                className="p-1 text-[#8C8F82] hover:text-[#2D3127] rounded cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* General Info */}
            <div className="grid grid-cols-2 gap-3 bg-[#F7F5EE] p-4 rounded-xl text-xs text-[#3D4035] border border-[#E2DDD0]">
              <div>
                <strong className="text-[#2D3127]">Orang Tua / Wali:</strong> {selectedStudent.parentName}
              </div>
              <div>
                <strong className="text-[#2D3127]">No. Kontak:</strong> {selectedStudent.parentPhone}
              </div>
              <div className="col-span-2">
                <strong className="text-[#2D3127]">Alamat Tempat Tinggal:</strong> {selectedStudent.address}
              </div>
            </div>

            {/* AI Generator Button for Student Note */}
            <div className="p-4 bg-[#3D4035] text-[#FAF9F5] rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-[#D4A373]">
                  <Sparkles className="w-4 h-4" /> Generator Catatan Rapor Wali Kelas (AI)
                </div>
                <button
                  onClick={handleGenerateAiNote}
                  disabled={isAiGenerating}
                  className="bg-[#D4A373] hover:bg-[#c29263] text-[#2D3127] font-bold px-3 py-1.5 rounded-lg text-xs transition cursor-pointer disabled:opacity-50"
                >
                  {isAiGenerating ? "Memproses AI..." : "Buat Draf Catatan Rapor"}
                </button>
              </div>

              {aiNoteResult && (
                <div className="p-3 bg-[#2D3126] rounded-lg text-xs text-[#E2DDD0] leading-relaxed max-h-48 overflow-y-auto whitespace-pre-wrap border border-[#588157]/40">
                  {aiNoteResult}
                </div>
              )}
            </div>

            {/* Guidance & Counseling Logs */}
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-[#F0EEE4] pb-2">
                <h4 className="font-bold text-[#2D3127] text-sm flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[#588157]" />
                  Log Catatan Bimbingan & Konseling Wali Kelas
                </h4>
                <button
                  onClick={() => setIsGuidanceModalOpen(true)}
                  className="flex items-center gap-1.5 bg-[#D4A373] hover:bg-[#c29263] text-[#2D3127] px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Tambah Catatan BK
                </button>
              </div>

              {selectedStudent.guidanceNotes.length === 0 ? (
                <p className="text-xs text-[#8C8F82] py-4 text-center">
                  Belum ada catatan bimbingan khusus untuk siswa ini.
                </p>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {selectedStudent.guidanceNotes.map((gn) => (
                    <div
                      key={gn.id}
                      className="p-3 rounded-xl border border-[#E2DDD0] bg-[#F7F5EE] text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between font-bold text-[#2D3127]">
                        <span>{gn.topic}</span>
                        <span className="text-[10px] text-[#6B6E60]">{gn.date}</span>
                      </div>
                      <p className="text-[#3D4035]">{gn.description}</p>
                      <div className="text-[#588157] font-semibold mt-1">
                        Tindak Lanjut: {gn.followUp}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Guidance Note Modal */}
      {isGuidanceModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#2D3126]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#E2DDD0] space-y-4">
            <div className="flex items-center justify-between border-b border-[#F0EEE4] pb-3">
              <h3 className="font-bold text-[#2D3127] text-base">
                Tambah Catatan Bimbingan Perwalian
              </h3>
              <button
                onClick={() => setIsGuidanceModalOpen(false)}
                className="p-1 text-[#8C8F82] hover:text-[#2D3127] rounded cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddGuidanceNote} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-[#3D4035] mb-1">Topik Bimbingan</label>
                <input
                  type="text"
                  value={gnTopic}
                  onChange={(e) => setGnTopic(e.target.value)}
                  placeholder="E.g., Kedisiplinan / Motivasi Belajar"
                  className="w-full bg-[#F9F8F3] border border-[#D8D4C7] rounded-xl px-3 py-2 text-[#2D3127]"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-[#3D4035] mb-1">Deskripsi Permasalahan / Kasus</label>
                <textarea
                  rows={3}
                  value={gnDesc}
                  onChange={(e) => setGnDesc(e.target.value)}
                  placeholder="Deskripsi detail..."
                  className="w-full bg-[#F9F8F3] border border-[#D8D4C7] rounded-xl px-3 py-2 text-[#2D3127]"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-[#3D4035] mb-1">Tindak Lanjut & Kesepakatan</label>
                <textarea
                  rows={2}
                  value={gnFollowUp}
                  onChange={(e) => setGnFollowUp(e.target.value)}
                  placeholder="Rencana solusi..."
                  className="w-full bg-[#F9F8F3] border border-[#D8D4C7] rounded-xl px-3 py-2 text-[#2D3127]"
                  required
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-[#F0EEE4]">
                <button
                  type="button"
                  onClick={() => setIsGuidanceModalOpen(false)}
                  className="px-4 py-2 bg-[#F4F2EA] text-[#3D4035] rounded-xl font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#D4A373] hover:bg-[#c29263] text-[#2D3127] rounded-xl font-semibold cursor-pointer"
                >
                  Simpan Catatan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
