import React, { useState } from "react";
import { HomeroomStudent, SchoolProfile, GuidanceNote, TabType, ClassRoom, Student } from "../types";
import {
  getHomeroomStudents,
  saveHomeroomStudents,
  getClasses,
  saveClasses,
  getStudents,
  saveStudents,
} from "../utils/storage";
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
  Trash2,
  Building2,
  Users,
  AlertCircle,
  Edit2,
} from "lucide-react";

interface WaliKelasModuleProps {
  profile: SchoolProfile;
  setActiveTab: (tab: TabType) => void;
}

export const WaliKelasModule: React.FC<WaliKelasModuleProps> = ({ profile }) => {
  const [classes, setClassesState] = useState<ClassRoom[]>(getClasses());
  const [students, setStudents] = useState<HomeroomStudent[]>(getHomeroomStudents());
  const [allStudents, setAllStudents] = useState<Student[]>(getStudents());

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedClassFilter, setSelectedClassFilter] = useState<string>("all");
  const [selectedStudent, setSelectedStudent] = useState<HomeroomStudent | null>(null);

  // Modals state
  const [isAddClassModalOpen, setIsAddClassModalOpen] = useState<boolean>(false);
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState<boolean>(false);
  const [isGuidanceModalOpen, setIsGuidanceModalOpen] = useState<boolean>(false);

  // Add Class Form State
  const [newClassName, setNewClassName] = useState<string>("");
  const [newClassFase, setNewClassFase] = useState<"A" | "B" | "C" | "D" | "E" | "F">("E");

  // Add Student Form State
  const [stdName, setStdName] = useState<string>("");
  const [stdNisn, setStdNisn] = useState<string>("");
  const [stdGender, setStdGender] = useState<"L" | "P">("L");
  const [stdClassId, setStdClassId] = useState<string>(classes[0]?.id || profile.homeroomClass);
  const [stdParentName, setStdParentName] = useState<string>("");
  const [stdParentPhone, setStdParentPhone] = useState<string>("");
  const [stdAddress, setStdAddress] = useState<string>("");
  const [stdRole, setStdRole] = useState<"Ketua Kelas" | "Wakil Ketua" | "Sekretaris" | "Bendahara" | "Anggota">("Anggota");

  // New Guidance Note State
  const [gnTopic, setGnTopic] = useState<string>("");
  const [gnDesc, setGnDesc] = useState<string>("");
  const [gnFollowUp, setGnFollowUp] = useState<string>("");

  // AI Generator state for student report note
  const [isAiGenerating, setIsAiGenerating] = useState<boolean>(false);
  const [aiNoteResult, setAiNoteResult] = useState<string>("");

  // Toast alert
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  // Filter students by class and search query
  const displayedStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.nisn.includes(searchQuery) ||
      s.parentName.toLowerCase().includes(searchQuery.toLowerCase());

    if (selectedClassFilter === "all") return matchesSearch;
    return matchesSearch && (s.classId === selectedClassFilter || s.className === selectedClassFilter);
  });

  const keyOfficers = students.filter(
    (s) => s.roleInClass && s.roleInClass !== "Anggota"
  );

  // 1. ADD NEW CLASS
  const handleAddClassSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassName.trim()) return;

    const classId = newClassName.trim().replace(/\s+/g, "-");
    const existing = classes.find((c) => c.name.toLowerCase() === newClassName.trim().toLowerCase());
    if (existing) {
      showToast("error", `Kelas dengan nama "${newClassName}" sudah ada!`);
      return;
    }

    const newClassObj: ClassRoom = {
      id: classId,
      name: newClassName.trim(),
      fase: newClassFase,
      studentCount: 0,
    };

    const updatedClasses = [...classes, newClassObj];
    setClassesState(updatedClasses);
    saveClasses(updatedClasses);

    setNewClassName("");
    setIsAddClassModalOpen(false);
    showToast("success", `Kelas "${newClassObj.name}" (Fase ${newClassObj.fase}) berhasil ditambahkan!`);
  };

  // 2. DELETE CLASS
  const handleDeleteClass = (classId: string, className: string) => {
    if (classes.length <= 1) {
      showToast("error", "Minimal harus menyisakan 1 kelas!");
      return;
    }

    const confirmDel = window.confirm(
      `Apakah Anda yakin ingin menghapus kelas "${className}"? Data siswa di kelas ini tidak akan langsung terhapus, tetapi kelas akan dihilangkan dari opsi.`
    );
    if (!confirmDel) return;

    const updatedClasses = classes.filter((c) => c.id !== classId && c.name !== className);
    setClassesState(updatedClasses);
    saveClasses(updatedClasses);
    showToast("success", `Kelas "${className}" telah dihapus.`);
  };

  // 3. ADD NEW STUDENT
  const handleAddStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!stdName.trim()) {
      showToast("error", "Nama siswa wajib diisi!");
      return;
    }

    const newId = `STD-${Date.now()}`;
    const targetClass = classes.find((c) => c.id === stdClassId || c.name === stdClassId);

    const newStudentObj: HomeroomStudent = {
      id: newId,
      nisn: stdNisn.trim() || `00${Math.floor(100000000 + Math.random() * 900000000)}`,
      name: stdName.trim(),
      gender: stdGender,
      parentName: stdParentName.trim() || "-",
      parentPhone: stdParentPhone.trim() || "-",
      address: stdAddress.trim() || "-",
      roleInClass: stdRole,
      classId: stdClassId,
      className: targetClass?.name || stdClassId,
      guidanceNotes: [],
      achievements: [],
    };

    // Save to Homeroom Students
    const updatedHomeroom = [newStudentObj, ...students];
    setStudents(updatedHomeroom);
    saveHomeroomStudents(updatedHomeroom);

    // Save to global Students list
    const updatedGlobalStudents: Student[] = [newStudentObj, ...allStudents];
    setAllStudents(updatedGlobalStudents);
    saveStudents(updatedGlobalStudents);

    // Update class student count
    const updatedClasses = classes.map((c) => {
      if (c.id === stdClassId || c.name === stdClassId) {
        return { ...c, studentCount: c.studentCount + 1 };
      }
      return c;
    });
    setClassesState(updatedClasses);
    saveClasses(updatedClasses);

    // Reset Form
    setStdName("");
    setStdNisn("");
    setStdParentName("");
    setStdParentPhone("");
    setStdAddress("");
    setStdRole("Anggota");
    setIsAddStudentModalOpen(false);

    showToast("success", `Siswa "${newStudentObj.name}" berhasil ditambahkan!`);
  };

  // 4. DELETE STUDENT
  const handleDeleteStudent = (studentId: string, studentName: string) => {
    const confirmDel = window.confirm(
      `Apakah Anda yakin ingin menghapus data siswa "${studentName}"?`
    );
    if (!confirmDel) return;

    const updatedHomeroom = students.filter((s) => s.id !== studentId);
    setStudents(updatedHomeroom);
    saveHomeroomStudents(updatedHomeroom);

    const updatedGlobal = allStudents.filter((s) => s.id !== studentId);
    setAllStudents(updatedGlobal);
    saveStudents(updatedGlobal);

    showToast("success", `Siswa "${studentName}" berhasil dihapus.`);
  };

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
    showToast("success", "Catatan Bimbingan berhasil disimpan.");
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

      {/* Header Bar & Quick Actions */}
      <div className="bg-white rounded-2xl border border-[#E2DDD0] p-6 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-[#2D3127] flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-[#588157]" />
              Manajemen Kelas & Data Siswa ({profile.homeroomClass})
            </h2>
          </div>
          <p className="text-xs text-[#6B6E60] mt-0.5">
            Wali Kelas: {profile.teacherName} &bull; Kelola Rombel Kelas, Tambah Siswa Baru, Kontak Wali, & Catatan Bimbingan
          </p>
        </div>

        {/* Action Buttons: Tambah Kelas & Tambah Siswa */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsAddClassModalOpen(true)}
            className="flex items-center gap-2 bg-[#3D4035] hover:bg-[#2D3126] text-white font-bold px-4 py-2.5 rounded-xl text-xs transition cursor-pointer shadow-2xs"
          >
            <Building2 className="w-4 h-4 text-[#D4A373]" />
            <span>+ Tambah Kelas Baru</span>
          </button>

          <button
            onClick={() => setIsAddStudentModalOpen(true)}
            className="flex items-center gap-2 bg-[#D4A373] hover:bg-[#c29263] text-[#2D3127] font-bold px-4 py-2.5 rounded-xl text-xs transition cursor-pointer shadow-2xs"
          >
            <Plus className="w-4 h-4" />
            <span>+ Tambah Siswa Baru</span>
          </button>
        </div>
      </div>

      {/* Daftar Kelas Cards Bar */}
      <div className="bg-[#FAF9F5] border border-[#E2DDD0] rounded-2xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-[#3D4035] uppercase tracking-wider flex items-center gap-2">
            <Building2 className="w-4 h-4 text-[#588157]" />
            Daftar Rombongan Belajar / Kelas Aktif ({classes.length} Kelas)
          </h3>

          <span className="text-[11px] text-[#6B6E60]">
            Total Siswa Terdaftar: <strong>{students.length} Siswa</strong>
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          {classes.map((cls) => {
            const count = students.filter(
              (s) => s.classId === cls.id || s.className === cls.name
            ).length;

            return (
              <div
                key={cls.id}
                className="bg-white border border-[#E2DDD0] hover:border-[#D4A373] p-3 rounded-xl shadow-2xs space-y-1.5 transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-[#2D3127]">{cls.name}</span>
                    <span className="text-[10px] bg-[#E9EDC9] text-[#3D4035] px-1.5 py-0.5 rounded font-semibold">
                      Fase {cls.fase}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#6B6E60] font-medium mt-1">
                    {count} Siswa
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#F0EEE4]">
                  <button
                    onClick={() => setSelectedClassFilter(cls.id)}
                    className="text-[10px] text-[#588157] font-bold hover:underline cursor-pointer"
                  >
                    Filter Siswa
                  </button>

                  {classes.length > 1 && (
                    <button
                      onClick={() => handleDeleteClass(cls.id, cls.name)}
                      className="text-[#842029] hover:text-red-700 p-1 cursor-pointer"
                      title="Hapus Kelas"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Organizational Structure Cards */}
      <div className="bg-[#3D4035] text-[#FAF9F5] rounded-2xl p-6 shadow-md border border-[#2D3126] space-y-4">
        <div className="flex items-center justify-between border-b border-[#2D3126] pb-3">
          <h3 className="font-bold text-sm text-[#D4A373] uppercase tracking-wider flex items-center gap-2">
            <Award className="w-4 h-4" /> Struktur Pengurus Kelas Perwalian
          </h3>
          <span className="text-xs text-[#A3B18A]">Total {students.length} Siswa</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {keyOfficers.length === 0 ? (
            <div className="col-span-4 text-xs text-center py-2 text-[#C8C5B8]">
              Belum ada pengurus kelas yang ditentukan. Edit siswa untuk memberikan jabatan pengurus.
            </div>
          ) : (
            keyOfficers.map((off) => (
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
            ))
          )}
        </div>
      </div>

      {/* Student Roster Table */}
      <div className="bg-white rounded-2xl border border-[#E2DDD0] overflow-hidden shadow-2xs space-y-4 p-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-3 border-b border-[#F0EEE4]">
          <div className="flex items-center gap-3">
            <h3 className="font-bold text-[#2D3127] text-base">
              Daftar Siswa ({displayedStudents.length} Siswa)
            </h3>

            {/* Class Filter Selector */}
            <select
              value={selectedClassFilter}
              onChange={(e) => setSelectedClassFilter(e.target.value)}
              className="bg-[#F9F8F3] border border-[#D8D4C7] rounded-xl px-3 py-1.5 text-xs text-[#2D3127] font-semibold focus:outline-none"
            >
              <option value="all">Semua Kelas</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  Kelas {c.name} (Fase {c.fase})
                </option>
              ))}
            </select>
          </div>

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
                <th className="p-3 w-28">Kelas</th>
                <th className="p-3">Orang Tua / Wali</th>
                <th className="p-3">Kontak Orang Tua</th>
                <th className="p-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0EEE4] text-xs text-[#2D3127]">
              {displayedStudents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-gray-500 text-xs">
                    Belum ada siswa di kelas ini. Klik tombol <strong>+ Tambah Siswa Baru</strong> untuk menambahkan siswa.
                  </td>
                </tr>
              ) : (
                displayedStudents.map((std, idx) => (
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
                    <td className="p-3 font-bold text-[#588157]">{std.className || std.classId || profile.homeroomClass}</td>
                    <td className="p-3 font-medium text-[#3D4035]">{std.parentName}</td>
                    <td className="p-3 text-[#6B6E60] flex items-center gap-1.5">
                      <Phone className="w-3 h-3 text-[#8C8F82]" />
                      <span>{std.parentPhone}</span>
                    </td>
                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => handleOpenStudentDetail(std)}
                          className="bg-[#3D4035] hover:bg-[#2D3126] text-[#FAF9F5] px-2.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer"
                          title="Buka Profil & BK"
                        >
                          Profil & BK
                        </button>
                        <button
                          onClick={() => handleDeleteStudent(std.id, std.name)}
                          className="bg-[#F8D7DA] text-[#842029] hover:bg-red-200 p-1.5 rounded-lg transition cursor-pointer"
                          title="Hapus Siswa"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL 1: TAMBAH KELAS BARU */}
      {isAddClassModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#2D3126]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#E2DDD0] space-y-4">
            <div className="flex items-center justify-between border-b border-[#F0EEE4] pb-3">
              <h3 className="font-bold text-[#2D3127] text-base flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#588157]" />
                Tambah Kelas / Rombel Baru
              </h3>
              <button
                onClick={() => setIsAddClassModalOpen(false)}
                className="p-1 text-[#8C8F82] hover:text-[#2D3127] rounded cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddClassSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-[#3D4035] mb-1">Nama Kelas / Rombel</label>
                <input
                  type="text"
                  placeholder="Contoh: X TKJ 1, XI AKL 2, XII RPL 3"
                  value={newClassName}
                  onChange={(e) => setNewClassName(e.target.value)}
                  className="w-full bg-[#F9F8F3] border border-[#D8D4C7] rounded-xl px-3 py-2 text-[#2D3127] focus:outline-none focus:ring-2 focus:ring-[#D4A373]"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-[#3D4035] mb-1">Fase Kurikulum Merdeka</label>
                <select
                  value={newClassFase}
                  onChange={(e) => setNewClassFase(e.target.value as any)}
                  className="w-full bg-[#F9F8F3] border border-[#D8D4C7] rounded-xl px-3 py-2 text-[#2D3127] focus:outline-none"
                >
                  <option value="E">Fase E (Kelas X SMA/SMK)</option>
                  <option value="F">Fase F (Kelas XI - XII SMA/SMK)</option>
                  <option value="D">Fase D (Kelas VII - IX SMP)</option>
                  <option value="C">Fase C (Kelas V - VI SD)</option>
                  <option value="B">Fase B (Kelas III - IV SD)</option>
                  <option value="A">Fase A (Kelas I - II SD)</option>
                </select>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-[#F0EEE4]">
                <button
                  type="button"
                  onClick={() => setIsAddClassModalOpen(false)}
                  className="px-4 py-2 bg-[#F4F2EA] text-[#3D4035] rounded-xl font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#3D4035] hover:bg-[#2D3126] text-white rounded-xl font-semibold cursor-pointer"
                >
                  Simpan Kelas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: TAMBAH SISWA BARU */}
      {isAddStudentModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#2D3126]/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#E2DDD0] space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-[#F0EEE4] pb-3">
              <h3 className="font-bold text-[#2D3127] text-base flex items-center gap-2">
                <Users className="w-5 h-5 text-[#D4A373]" />
                Tambah Data Siswa Baru
              </h3>
              <button
                onClick={() => setIsAddStudentModalOpen(false)}
                className="p-1 text-[#8C8F82] hover:text-[#2D3127] rounded cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddStudentSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-[#3D4035] mb-1">Nama Lengkap Siswa *</label>
                <input
                  type="text"
                  placeholder="Contoh: Ahmad Fauzi Pratama"
                  value={stdName}
                  onChange={(e) => setStdName(e.target.value)}
                  className="w-full bg-[#F9F8F3] border border-[#D8D4C7] rounded-xl px-3 py-2 text-[#2D3127]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#3D4035] mb-1">NISN Siswa *</label>
                  <input
                    type="text"
                    placeholder="Contoh: 0081234567"
                    value={stdNisn}
                    onChange={(e) => setStdNisn(e.target.value)}
                    className="w-full bg-[#F9F8F3] border border-[#D8D4C7] rounded-xl px-3 py-2 text-[#2D3127] font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#3D4035] mb-1">Jenis Kelamin</label>
                  <select
                    value={stdGender}
                    onChange={(e) => setStdGender(e.target.value as "L" | "P")}
                    className="w-full bg-[#F9F8F3] border border-[#D8D4C7] rounded-xl px-3 py-2 text-[#2D3127]"
                  >
                    <option value="L">Laki-laki (L)</option>
                    <option value="P">Perempuan (P)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#3D4035] mb-1">Pilih Kelas</label>
                  <select
                    value={stdClassId}
                    onChange={(e) => setStdClassId(e.target.value)}
                    className="w-full bg-[#F9F8F3] border border-[#D8D4C7] rounded-xl px-3 py-2 text-[#2D3127] font-semibold"
                  >
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} (Fase {c.fase})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[#3D4035] mb-1">Jabatan di Kelas</label>
                  <select
                    value={stdRole}
                    onChange={(e) => setStdRole(e.target.value as any)}
                    className="w-full bg-[#F9F8F3] border border-[#D8D4C7] rounded-xl px-3 py-2 text-[#2D3127]"
                  >
                    <option value="Anggota">Anggota Siswa</option>
                    <option value="Ketua Kelas">Ketua Kelas</option>
                    <option value="Wakil Ketua">Wakil Ketua</option>
                    <option value="Sekretaris">Sekretaris</option>
                    <option value="Bendahara">Bendahara</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#3D4035] mb-1">Nama Orang Tua / Wali</label>
                  <input
                    type="text"
                    placeholder="Contoh: Bambang S."
                    value={stdParentName}
                    onChange={(e) => setStdParentName(e.target.value)}
                    className="w-full bg-[#F9F8F3] border border-[#D8D4C7] rounded-xl px-3 py-2 text-[#2D3127]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#3D4035] mb-1">No. Kontak Orang Tua</label>
                  <input
                    type="text"
                    placeholder="Contoh: 081234567890"
                    value={stdParentPhone}
                    onChange={(e) => setStdParentPhone(e.target.value)}
                    className="w-full bg-[#F9F8F3] border border-[#D8D4C7] rounded-xl px-3 py-2 text-[#2D3127]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#3D4035] mb-1">Alamat Tempat Tinggal</label>
                <input
                  type="text"
                  placeholder="Contoh: Jl. Merdeka No. 45, Jakarta"
                  value={stdAddress}
                  onChange={(e) => setStdAddress(e.target.value)}
                  className="w-full bg-[#F9F8F3] border border-[#D8D4C7] rounded-xl px-3 py-2 text-[#2D3127]"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-[#F0EEE4]">
                <button
                  type="button"
                  onClick={() => setIsAddStudentModalOpen(false)}
                  className="px-4 py-2 bg-[#F4F2EA] text-[#3D4035] rounded-xl font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#D4A373] hover:bg-[#c29263] text-[#2D3127] rounded-xl font-bold cursor-pointer"
                >
                  Simpan Siswa Baru
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: DETAIL PROFIL & CATATAN BK SISWA */}
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
                    NISN: {selectedStudent.nisn} &bull; Jabatan: {selectedStudent.roleInClass || "Siswa"} &bull; Kelas: {selectedStudent.className || selectedStudent.classId}
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

              {selectedStudent.guidanceNotes?.length === 0 ? (
                <p className="text-xs text-[#8C8F82] py-4 text-center">
                  Belum ada catatan bimbingan khusus untuk siswa ini.
                </p>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {selectedStudent.guidanceNotes?.map((gn) => (
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
