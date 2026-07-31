import React, { useState, useEffect } from "react";
import { Student, AttendanceRecord, AttendanceStatus, PrintData, ClassRoom } from "../types";
import {
  getStudents,
  saveStudents,
  getAttendanceRecords,
  saveAttendanceRecords,
  getClasses,
  saveClasses,
} from "../utils/storage";
import {
  UserCheck,
  CheckCircle2,
  Search,
  Save,
  Printer,
  Calendar,
  Layers,
  AlertCircle,
  Plus,
  Upload,
  Download,
  X,
  Building2,
  UserPlus,
  FileSpreadsheet,
  Trash2,
} from "lucide-react";

interface AbsensiModuleProps {
  onOpenPrint: (data: PrintData) => void;
}

export const AbsensiModule: React.FC<AbsensiModuleProps> = ({ onOpenPrint }) => {
  const [classesState, setClassesState] = useState<ClassRoom[]>(getClasses());
  const [studentsState, setStudentsState] = useState<Student[]>(getStudents());

  const [selectedClass, setSelectedClass] = useState<string>(classesState[0]?.id || "all");
  const [selectedSubject, setSelectedSubject] = useState<string>("Informatika");
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().slice(0, 10)
  );
  const [meetingNumber, setMeetingNumber] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Attendance state map: { [studentId]: status }
  const [attendanceMap, setAttendanceMap] = useState<Record<string, AttendanceStatus>>({});
  const [notesMap, setNotesMap] = useState<Record<string, string>>({});
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Modals state
  const [isAddClassModalOpen, setIsAddClassModalOpen] = useState<boolean>(false);
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState<boolean>(false);
  const [isCsvModalOpen, setIsCsvModalOpen] = useState<boolean>(false);

  // Add Class Form State
  const [newClassName, setNewClassName] = useState<string>("");
  const [newClassFase, setNewClassFase] = useState<"A" | "B" | "C" | "D" | "E" | "F">("E");

  // Add Student Form State
  const [stdName, setStdName] = useState<string>("");
  const [stdNisn, setStdNisn] = useState<string>("");
  const [stdGender, setStdGender] = useState<"L" | "P">("L");
  const [stdClassId, setStdClassId] = useState<string>(classesState[0]?.id || "");
  const [stdParentName, setStdParentName] = useState<string>("");
  const [stdParentPhone, setStdParentPhone] = useState<string>("");

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  // Get current active class object
  const currentClassObj = classesState.find(
    (c) => c.id === selectedClass || c.name === selectedClass
  );

  // Filter students by selected class
  const classStudents = studentsState.filter((s) => {
    if (!selectedClass || selectedClass === "all") return true;
    return (
      s.classId === selectedClass ||
      s.className === selectedClass ||
      (currentClassObj && (s.className === currentClassObj.name || s.classId === currentClassObj.id))
    );
  });

  // Load existing attendance records for the selected class, date, meeting
  useEffect(() => {
    const existing = getAttendanceRecords();
    const map: Record<string, AttendanceStatus> = {};
    const nMap: Record<string, string> = {};

    classStudents.forEach((std) => {
      const match = existing.find(
        (r) =>
          r.studentId === std.id &&
          r.date === selectedDate &&
          (r.classId === selectedClass || r.className === selectedClass || selectedClass === "all") &&
          r.meetingNumber === meetingNumber
      );
      if (match) {
        map[std.id] = match.status;
        nMap[std.id] = match.notes || "";
      } else {
        map[std.id] = "H"; // Default Hadir
        nMap[std.id] = "";
      }
    });

    setAttendanceMap(map);
    setNotesMap(nMap);
  }, [selectedClass, selectedDate, meetingNumber, studentsState]);

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setAttendanceMap((prev) => ({ ...prev, [studentId]: status }));
  };

  const handleNoteChange = (studentId: string, note: string) => {
    setNotesMap((prev) => ({ ...prev, [studentId]: note }));
  };

  const markAllHadir = () => {
    const newMap: Record<string, AttendanceStatus> = {};
    classStudents.forEach((s) => {
      newMap[s.id] = "H";
    });
    setAttendanceMap(newMap);
    showToast("success", "Semua siswa ditandai Hadir (H)");
  };

  const handleSave = () => {
    const existing = getAttendanceRecords();

    // Filter out previous records for this specific class/date/meeting
    const filtered = existing.filter(
      (r) =>
        !(
          (r.classId === selectedClass || r.className === selectedClass || selectedClass === "all") &&
          r.date === selectedDate &&
          r.meetingNumber === meetingNumber
        )
    );

    const className = currentClassObj?.name || selectedClass;

    // Create new records
    const newRecords: AttendanceRecord[] = classStudents.map((std) => ({
      id: `ATT-${std.id}-${selectedDate}-${meetingNumber}`,
      date: selectedDate,
      classId: std.classId || selectedClass,
      className: std.className || className,
      subject: selectedSubject,
      meetingNumber,
      studentId: std.id,
      status: attendanceMap[std.id] || "H",
      notes: notesMap[std.id] || "",
    }));

    saveAttendanceRecords([...filtered, ...newRecords]);
    showToast("success", `Data presensi siswa ${className} tanggal ${selectedDate} berhasil disimpan!`);
  };

  // 1. ADD NEW CLASS HANDLER
  const handleAddClassSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassName.trim()) return;

    const classId = newClassName.trim().replace(/\s+/g, "-");
    const existing = classesState.find(
      (c) => c.name.toLowerCase() === newClassName.trim().toLowerCase()
    );
    if (existing) {
      showToast("error", `Kelas "${newClassName}" sudah ada!`);
      return;
    }

    const newClassObj: ClassRoom = {
      id: classId,
      name: newClassName.trim(),
      fase: newClassFase,
      studentCount: 0,
    };

    const updated = [...classesState, newClassObj];
    setClassesState(updated);
    saveClasses(updated);
    setSelectedClass(classId);

    setNewClassName("");
    setIsAddClassModalOpen(false);
    showToast("success", `Kelas "${newClassObj.name}" berhasil ditambahkan!`);
  };

  // 2. ADD NEW STUDENT HANDLER
  const handleAddStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!stdName.trim()) {
      showToast("error", "Nama siswa wajib diisi!");
      return;
    }

    const newId = `STD-${Date.now()}`;
    const targetClassObj = classesState.find(
      (c) => c.id === stdClassId || c.name === stdClassId
    );

    const newStudent: Student = {
      id: newId,
      nisn: stdNisn.trim() || `00${Math.floor(100000000 + Math.random() * 900000000)}`,
      name: stdName.trim(),
      gender: stdGender,
      classId: stdClassId || targetClassObj?.id || "X-TKJ-1",
      className: targetClassObj?.name || stdClassId || "X TKJ 1",
      parentName: stdParentName.trim() || "-",
      parentPhone: stdParentPhone.trim() || "-",
      address: "-",
      roleInClass: "Anggota",
    };

    const updatedStudents = [newStudent, ...studentsState];
    setStudentsState(updatedStudents);
    saveStudents(updatedStudents);

    // Update class student count
    const updatedClasses = classesState.map((c) => {
      if (c.id === newStudent.classId || c.name === newStudent.className) {
        return { ...c, studentCount: c.studentCount + 1 };
      }
      return c;
    });
    setClassesState(updatedClasses);
    saveClasses(updatedClasses);

    setStdName("");
    setStdNisn("");
    setStdParentName("");
    setStdParentPhone("");
    setIsAddStudentModalOpen(false);

    showToast("success", `Siswa "${newStudent.name}" berhasil ditambahkan!`);
  };

  // 3. CSV IMPORT HANDLER
  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target?.result as string;
      if (!text) return;

      const lines = text.split(/\r?\n/).filter((line) => line.trim().length > 0);
      if (lines.length < 2) {
        showToast("error", "File CSV kosong atau tidak memiliki format header!");
        return;
      }

      const delimiter = lines[0].includes(";") ? ";" : ",";
      const newStudents: Student[] = [];
      let addedClassCount = 0;
      const updatedClasses = [...classesState];

      for (let i = 1; i < lines.length; i++) {
        const cols = lines[i]
          .split(delimiter)
          .map((c) => c.trim().replace(/^["']|["']$/g, ""));

        if (cols.length < 2 || !cols[1]) continue; // Name required

        const nisn = cols[0] || `00${Math.floor(100000000 + Math.random() * 900000000)}`;
        const name = cols[1];
        const gender = (cols[2]?.toUpperCase() === "P" ? "P" : "L") as "L" | "P";
        const className = cols[3] || currentClassObj?.name || "X TKJ 1";
        const parentName = cols[4] || "-";
        const parentPhone = cols[5] || "-";
        const address = cols[6] || "-";

        let targetClass = updatedClasses.find(
          (c) => c.name.toLowerCase() === className.toLowerCase() || c.id === className
        );

        if (!targetClass) {
          targetClass = {
            id: className.replace(/\s+/g, "-"),
            name: className,
            fase: "E",
            studentCount: 0,
          };
          updatedClasses.push(targetClass);
          addedClassCount++;
        }
        targetClass.studentCount++;

        newStudents.push({
          id: `STD-${Date.now()}-${i}`,
          nisn,
          name,
          gender,
          classId: targetClass.id,
          className: targetClass.name,
          parentName,
          parentPhone,
          address,
          roleInClass: "Anggota",
        });
      }

      if (newStudents.length > 0) {
        const mergedStudents = [...newStudents, ...studentsState];
        setStudentsState(mergedStudents);
        saveStudents(mergedStudents);

        setClassesState(updatedClasses);
        saveClasses(updatedClasses);

        showToast(
          "success",
          `Impor Sukses! ${newStudents.length} siswa baru${
            addedClassCount > 0 ? ` dan ${addedClassCount} kelas baru` : ""
          } telah dimasukkan ke database.`
        );
        setIsCsvModalOpen(false);
      } else {
        showToast("error", "Tidak ada data siswa valid yang ditemukan di file CSV.");
      }
    };

    reader.readAsText(file);
  };

  const downloadSampleCsv = () => {
    const csvContent =
      "NISN,Nama,Gender,Kelas,Nama_OrangTua,No_HP,Alamat\n" +
      "0081234567,Ahmad Fauzi Pratama,L,X TKJ 1,Bambang Pratama,081234567890,Jl. Merdeka No. 12\n" +
      "0087654321,Siti Aminah,P,X TKJ 1,Hadi M.,081987654321,Jl. Sudirman No. 45\n" +
      "0091122334,Rizky Ramadhan,L,XI RPL 2,Rahmat,085211223344,Jl. Gatot Subroto No. 8\n";

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "template_impor_siswa.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered student list for table rendering
  const filteredStudents = classStudents.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.nisn.includes(searchQuery)
  );

  // Attendance Statistics
  const total = classStudents.length;
  const countH = Object.values(attendanceMap).filter((v) => v === "H").length;
  const countS = Object.values(attendanceMap).filter((v) => v === "S").length;
  const countI = Object.values(attendanceMap).filter((v) => v === "I").length;
  const countA = Object.values(attendanceMap).filter((v) => v === "A").length;
  const percentHadir = total > 0 ? Math.round((countH / total) * 100) : 0;

  const currentClassName = currentClassObj?.name || (selectedClass === "all" ? "Semua Kelas" : selectedClass);

  const triggerPrint = () => {
    const printItems = classStudents.map((std) => ({
      ...std,
      status: attendanceMap[std.id] || "H",
      notes: notesMap[std.id] || "",
    }));

    onOpenPrint({
      title: `REKAPITULASI PRESENSI KEHADIRAN SISWA`,
      subtitle: `Kelas: ${currentClassName} | Mata Pelajaran: ${selectedSubject} | Pertemuan Ke-${meetingNumber} (${selectedDate})`,
      type: "absensi",
      items: printItems,
      date: selectedDate,
    });
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

      {/* Header & Main Controls Card */}
      <div className="bg-white rounded-2xl border border-[#E2DDD0] p-6 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#F0EEE4] pb-4">
          <div>
            <h2 className="text-xl font-bold text-[#2D3127] flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-[#588157]" />
              Absensi Presensi Siswa ({currentClassName})
            </h2>
            <p className="text-xs text-[#6B6E60] mt-0.5">
              Kelola daftar hadir siswa per mata pelajaran, cetak rekap absensi, serta tambah kelas & siswa via CSV.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsAddClassModalOpen(true)}
              className="flex items-center gap-1.5 bg-[#F4F2EA] hover:bg-[#EFECE1] text-[#3D4035] border border-[#D8D4C7] px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer"
            >
              <Building2 className="w-4 h-4 text-[#588157]" />
              + Kelas
            </button>

            <button
              onClick={() => setIsAddStudentModalOpen(true)}
              className="flex items-center gap-1.5 bg-[#F4F2EA] hover:bg-[#EFECE1] text-[#3D4035] border border-[#D8D4C7] px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer"
            >
              <UserPlus className="w-4 h-4 text-[#D4A373]" />
              + Siswa
            </button>

            <button
              onClick={() => setIsCsvModalOpen(true)}
              className="flex items-center gap-1.5 bg-[#588157] hover:bg-[#466845] text-white px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer shadow-2xs"
            >
              <Upload className="w-4 h-4" />
              Upload CSV
            </button>

            <button
              onClick={triggerPrint}
              className="flex items-center gap-1.5 bg-[#F4F2EA] hover:bg-[#EFECE1] text-[#3D4035] border border-[#D8D4C7] px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer"
            >
              <Printer className="w-4 h-4 text-[#588157]" />
              Cetak
            </button>

            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 bg-[#D4A373] hover:bg-[#c29263] text-[#2D3127] px-4 py-2 rounded-xl text-xs font-bold transition shadow-2xs cursor-pointer"
            >
              <Save className="w-4 h-4" />
              Simpan Presensi
            </button>
          </div>
        </div>

        {/* Filter Inputs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#3D4035] mb-1 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-[#8C8F82]" /> Pilih Kelas
              </span>
              <span className="text-[10px] text-[#588157] font-bold">
                ({classesState.length} Kelas)
              </span>
            </label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full bg-[#F9F8F3] border border-[#D8D4C7] rounded-xl px-3 py-2 text-xs font-bold text-[#2D3127] focus:outline-none focus:ring-2 focus:ring-[#D4A373]"
            >
              <option value="all">Semua Kelas ({studentsState.length} Siswa)</option>
              {classesState.map((c) => (
                <option key={c.id} value={c.id}>
                  Kelas {c.name} (Fase {c.fase})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#3D4035] mb-1">
              Mata Pelajaran
            </label>
            <input
              type="text"
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full bg-[#F9F8F3] border border-[#D8D4C7] rounded-xl px-3 py-2 text-xs font-semibold text-[#2D3127] focus:outline-none focus:ring-2 focus:ring-[#D4A373]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#3D4035] mb-1 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-[#8C8F82]" /> Tanggal Presensi
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full bg-[#F9F8F3] border border-[#D8D4C7] rounded-xl px-3 py-2 text-xs font-semibold text-[#2D3127] focus:outline-none focus:ring-2 focus:ring-[#D4A373]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#3D4035] mb-1">
              Pertemuan Ke-
            </label>
            <input
              type="number"
              min={1}
              max={36}
              value={meetingNumber}
              onChange={(e) => setMeetingNumber(Number(e.target.value))}
              className="w-full bg-[#F9F8F3] border border-[#D8D4C7] rounded-xl px-3 py-2 text-xs font-semibold text-[#2D3127] focus:outline-none focus:ring-2 focus:ring-[#D4A373]"
            />
          </div>
        </div>
      </div>

      {/* Summary Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-[#E9EDC9]/60 border border-[#CCD5AE] p-3.5 rounded-xl text-center">
          <div className="text-xl font-bold text-[#3D4035]">{countH}</div>
          <div className="text-[11px] font-semibold text-[#588157] uppercase mt-0.5">Hadir (H)</div>
        </div>
        <div className="bg-[#FAEDCD]/80 border border-[#D4A373]/40 p-3.5 rounded-xl text-center">
          <div className="text-xl font-bold text-[#8C5E32]">{countS}</div>
          <div className="text-[11px] font-semibold text-[#D4A373] uppercase mt-0.5">Sakit (S)</div>
        </div>
        <div className="bg-blue-50 border border-blue-200 p-3.5 rounded-xl text-center">
          <div className="text-xl font-bold text-blue-800">{countI}</div>
          <div className="text-[11px] font-semibold text-blue-600 uppercase mt-0.5">Izin (I)</div>
        </div>
        <div className="bg-rose-50 border border-rose-200 p-3.5 rounded-xl text-center">
          <div className="text-xl font-bold text-rose-800">{countA}</div>
          <div className="text-[11px] font-semibold text-rose-600 uppercase mt-0.5">Alpa (A)</div>
        </div>
        <div className="col-span-2 sm:col-span-1 bg-[#3D4035] text-white p-3.5 rounded-xl text-center flex flex-col items-center justify-center">
          <div className="text-xl font-bold text-[#D4A373]">{percentHadir}%</div>
          <div className="text-[10px] font-medium text-[#C8C5B8] uppercase">Tingkat Kehadiran</div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl border border-[#E2DDD0] overflow-hidden shadow-2xs">
        {/* Table Search & Batch Action Bar */}
        <div className="p-4 bg-[#F7F5EE] border-b border-[#E2DDD0] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-[#8C8F82] absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Cari siswa atau NISN..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-[#D8D4C7] rounded-xl pl-9 pr-3 py-1.5 text-xs text-[#2D3127] focus:outline-none focus:ring-2 focus:ring-[#D4A373]"
            />
          </div>

          <button
            onClick={markAllHadir}
            className="w-full sm:w-auto bg-[#E9EDC9] hover:bg-[#CCD5AE] text-[#3D4035] border border-[#CCD5AE] px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer"
          >
            Tandai Semua Hadir (H)
          </button>
        </div>

        {/* Student Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F4F2EA] text-[#3D4035] text-xs font-bold uppercase tracking-wider border-b border-[#E2DDD0]">
                <th className="p-3 pl-4 w-12 text-center">No</th>
                <th className="p-3 w-32">NISN</th>
                <th className="p-3">Nama Siswa</th>
                <th className="p-3 w-28">Kelas</th>
                <th className="p-3 w-16 text-center">L/P</th>
                <th className="p-3 w-64 text-center">Status Kehadiran</th>
                <th className="p-3">Keterangan / Catatan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0EEE4] text-xs text-[#2D3127]">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-[#6B6E60]">
                    <AlertCircle className="w-6 h-6 text-[#8C8F82] mx-auto mb-2" />
                    Tidak ada siswa ditemukan di kelas {currentClassName}. Silakan tambahkan siswa atau gunakan tombol <strong>Upload CSV</strong>.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((std, idx) => {
                  const currentStatus = attendanceMap[std.id] || "H";
                  return (
                    <tr key={std.id} className="hover:bg-[#FAF9F5] transition">
                      <td className="p-3 pl-4 text-center text-[#6B6E60] font-medium">{idx + 1}</td>
                      <td className="p-3 font-mono text-[#6B6E60]">{std.nisn}</td>
                      <td className="p-3 font-semibold text-[#2D3127]">{std.name}</td>
                      <td className="p-3 font-bold text-[#588157]">{std.className || std.classId}</td>
                      <td className="p-3 text-center font-medium text-[#6B6E60]">{std.gender}</td>
                      <td className="p-3">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleStatusChange(std.id, "H")}
                            className={`px-3 py-1.5 rounded-lg font-bold text-xs transition cursor-pointer ${
                              currentStatus === "H"
                                ? "bg-[#588157] text-white shadow-2xs"
                                : "bg-[#F4F2EA] text-[#4E5244] hover:bg-[#EFECE1]"
                            }`}
                          >
                            H
                          </button>
                          <button
                            type="button"
                            onClick={() => handleStatusChange(std.id, "S")}
                            className={`px-3 py-1.5 rounded-lg font-bold text-xs transition cursor-pointer ${
                              currentStatus === "S"
                                ? "bg-[#D4A373] text-[#2D3127] shadow-2xs"
                                : "bg-[#F4F2EA] text-[#4E5244] hover:bg-[#EFECE1]"
                            }`}
                          >
                            S
                          </button>
                          <button
                            type="button"
                            onClick={() => handleStatusChange(std.id, "I")}
                            className={`px-3 py-1.5 rounded-lg font-bold text-xs transition cursor-pointer ${
                              currentStatus === "I"
                                ? "bg-blue-600 text-white shadow-2xs"
                                : "bg-[#F4F2EA] text-[#4E5244] hover:bg-[#EFECE1]"
                            }`}
                          >
                            I
                          </button>
                          <button
                            type="button"
                            onClick={() => handleStatusChange(std.id, "A")}
                            className={`px-3 py-1.5 rounded-lg font-bold text-xs transition cursor-pointer ${
                              currentStatus === "A"
                                ? "bg-[#E07A5F] text-white shadow-2xs"
                                : "bg-[#F4F2EA] text-[#4E5244] hover:bg-[#EFECE1]"
                            }`}
                          >
                            A
                          </button>
                        </div>
                      </td>
                      <td className="p-3 pr-4">
                        <input
                          type="text"
                          placeholder="Tambahkan alasan/catatan (opsional)..."
                          value={notesMap[std.id] || ""}
                          onChange={(e) => handleNoteChange(std.id, e.target.value)}
                          className="w-full bg-[#F9F8F3] border border-[#D8D4C7] rounded-lg px-2.5 py-1 text-xs text-[#2D3127] focus:outline-none focus:ring-1 focus:ring-[#D4A373]"
                        />
                      </td>
                    </tr>
                  );
                })
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
        <div className="fixed inset-0 z-50 bg-[#2D3126]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#E2DDD0] space-y-4">
            <div className="flex items-center justify-between border-b border-[#F0EEE4] pb-3">
              <h3 className="font-bold text-[#2D3127] text-base flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-[#D4A373]" />
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

              <div>
                <label className="block font-semibold text-[#3D4035] mb-1">Pilih Kelas</label>
                <select
                  value={stdClassId}
                  onChange={(e) => setStdClassId(e.target.value)}
                  className="w-full bg-[#F9F8F3] border border-[#D8D4C7] rounded-xl px-3 py-2 text-[#2D3127] font-semibold"
                >
                  {classesState.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} (Fase {c.fase})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#3D4035] mb-1">Nama Orang Tua</label>
                  <input
                    type="text"
                    placeholder="Contoh: Bambang"
                    value={stdParentName}
                    onChange={(e) => setStdParentName(e.target.value)}
                    className="w-full bg-[#F9F8F3] border border-[#D8D4C7] rounded-xl px-3 py-2 text-[#2D3127]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#3D4035] mb-1">No. Kontak HP</label>
                  <input
                    type="text"
                    placeholder="Contoh: 0812345678"
                    value={stdParentPhone}
                    onChange={(e) => setStdParentPhone(e.target.value)}
                    className="w-full bg-[#F9F8F3] border border-[#D8D4C7] rounded-xl px-3 py-2 text-[#2D3127]"
                  />
                </div>
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
                  Simpan Siswa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: UPLOAD CSV IMPORT FILE */}
      {isCsvModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#2D3126]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#E2DDD0] space-y-4">
            <div className="flex items-center justify-between border-b border-[#F0EEE4] pb-3">
              <h3 className="font-bold text-[#2D3127] text-base flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-[#588157]" />
                Impor Data Siswa & Kelas via CSV
              </h3>
              <button
                onClick={() => setIsCsvModalOpen(false)}
                className="p-1 text-[#8C8F82] hover:text-[#2D3127] rounded cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs text-[#3D4035]">
              <p className="leading-relaxed">
                Anda dapat mengunggah file spreadsheet berformat <strong>.CSV</strong> untuk memasukkan secara massal puluhan data siswa dan kelas secara otomatis.
              </p>

              <div className="bg-[#FAF9F5] p-3 rounded-xl border border-[#E2DDD0] space-y-2">
                <div className="flex items-center justify-between font-bold text-[#2D3127]">
                  <span>Format Kolom File CSV:</span>
                  <button
                    onClick={downloadSampleCsv}
                    className="flex items-center gap-1 text-[#588157] hover:underline text-[11px] font-bold cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" /> Unduh Template CSV Contoh
                  </button>
                </div>
                <div className="font-mono text-[11px] bg-white p-2 rounded border border-[#D8D4C7] text-[#6B6E60] overflow-x-auto">
                  NISN, Nama, Gender, Kelas, Nama_OrangTua, No_HP, Alamat
                </div>
              </div>

              {/* Upload Drop Zone */}
              <div className="border-2 border-dashed border-[#D4A373] hover:border-[#588157] bg-[#F7F5EE] p-6 rounded-2xl text-center space-y-2 transition cursor-pointer relative">
                <Upload className="w-8 h-8 text-[#588157] mx-auto" />
                <div>
                  <span className="font-bold text-[#2D3127]">Klik untuk Memilih File CSV</span>
                  <p className="text-[11px] text-[#8C8F82]">Atau drag and drop file .csv ke area ini</p>
                </div>
                <input
                  type="file"
                  accept=".csv,text/csv"
                  onChange={handleCsvUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>

              <div className="pt-2 flex justify-end border-t border-[#F0EEE4]">
                <button
                  type="button"
                  onClick={() => setIsCsvModalOpen(false)}
                  className="px-4 py-2 bg-[#F4F2EA] text-[#3D4035] rounded-xl font-semibold cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
