import React, { useState, useEffect } from "react";
import { Student, AttendanceRecord, AttendanceStatus, PrintData } from "../types";
import {
  getStudents,
  getAttendanceRecords,
  saveAttendanceRecords,
  getClasses,
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
} from "lucide-react";

interface AbsensiModuleProps {
  onOpenPrint: (data: PrintData) => void;
}

export const AbsensiModule: React.FC<AbsensiModuleProps> = ({ onOpenPrint }) => {
  const classes = getClasses();
  const allStudents = getStudents();

  const [selectedClass, setSelectedClass] = useState<string>(classes[0]?.id || "X-RPL-1");
  const [selectedSubject, setSelectedSubject] = useState<string>("Informatika");
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().slice(0, 10)
  );
  const [meetingNumber, setMeetingNumber] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Attendance state map: { [studentId]: status }
  const [attendanceMap, setAttendanceMap] = useState<Record<string, AttendanceStatus>>({});
  const [notesMap, setNotesMap] = useState<Record<string, string>>({});
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  // Load existing attendance records for the selected class, date, meeting
  useEffect(() => {
    const existing = getAttendanceRecords();
    const map: Record<string, AttendanceStatus> = {};
    const nMap: Record<string, string> = {};

    const classStudents = allStudents; // Or filtered by class if NISN / class structure exists

    classStudents.forEach((std) => {
      const match = existing.find(
        (r) =>
          r.studentId === std.id &&
          r.date === selectedDate &&
          r.classId === selectedClass &&
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
  }, [selectedClass, selectedDate, meetingNumber]);

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setAttendanceMap((prev) => ({ ...prev, [studentId]: status }));
  };

  const handleNoteChange = (studentId: string, note: string) => {
    setNotesMap((prev) => ({ ...prev, [studentId]: note }));
  };

  const markAllHadir = () => {
    const newMap: Record<string, AttendanceStatus> = {};
    allStudents.forEach((s) => {
      newMap[s.id] = "H";
    });
    setAttendanceMap(newMap);
  };

  const handleSave = () => {
    const existing = getAttendanceRecords();

    // Filter out previous records for this specific class/date/meeting
    const filtered = existing.filter(
      (r) =>
        !(
          r.classId === selectedClass &&
          r.date === selectedDate &&
          r.meetingNumber === meetingNumber
        )
    );

    const className = classes.find((c) => c.id === selectedClass)?.name || selectedClass;

    // Create new records
    const newRecords: AttendanceRecord[] = allStudents.map((std) => ({
      id: `ATT-${std.id}-${selectedDate}-${meetingNumber}`,
      date: selectedDate,
      classId: selectedClass,
      className,
      subject: selectedSubject,
      meetingNumber,
      studentId: std.id,
      status: attendanceMap[std.id] || "H",
      notes: notesMap[std.id] || "",
    }));

    saveAttendanceRecords([...filtered, ...newRecords]);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  // Filtered student list for rendering
  const filteredStudents = allStudents.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.nisn.includes(searchQuery)
  );

  // Statistics
  const total = allStudents.length;
  const countH = Object.values(attendanceMap).filter((v) => v === "H").length;
  const countS = Object.values(attendanceMap).filter((v) => v === "S").length;
  const countI = Object.values(attendanceMap).filter((v) => v === "I").length;
  const countA = Object.values(attendanceMap).filter((v) => v === "A").length;
  const percentHadir = total > 0 ? Math.round((countH / total) * 100) : 0;

  const currentClassName = classes.find((c) => c.id === selectedClass)?.name || selectedClass;

  const triggerPrint = () => {
    const printItems = allStudents.map((std) => ({
      ...std,
      status: attendanceMap[std.id] || "H",
      notes: notesMap[std.id] || "",
    }));

    onOpenPrint({
      type: "absensi",
      title: `Laporan Rekap Absensi Siswa Kelas ${currentClassName}`,
      className: currentClassName,
      subject: selectedSubject,
      periodLabel: `Tanggal ${selectedDate} (Pertemuan ke-${meetingNumber})`,
      items: printItems,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls Card */}
      <div className="bg-white rounded-2xl border border-[#E2DDD0] p-6 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F0EEE4] pb-4">
          <div>
            <h2 className="text-xl font-bold text-[#2D3127] flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-[#588157]" />
              Absensi Presensi Siswa
            </h2>
            <p className="text-xs text-[#6B6E60] mt-0.5">
              Kelola kehadiran harian siswa per mata pelajaran dan pertemuan
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={triggerPrint}
              className="flex items-center gap-2 bg-[#F4F2EA] hover:bg-[#EFECE1] text-[#3D4035] border border-[#D8D4C7] px-3.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer"
            >
              <Printer className="w-4 h-4 text-[#588157]" />
              Cetak Absensi
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 bg-[#D4A373] hover:bg-[#c29263] text-[#2D3127] px-4 py-2 rounded-xl text-xs font-semibold transition shadow-2xs cursor-pointer"
            >
              <Save className="w-4 h-4" />
              Simpan Presensi
            </button>
          </div>
        </div>

        {/* Filter Inputs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#3D4035] mb-1 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-[#8C8F82]" /> Kelas
            </label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full bg-[#F9F8F3] border border-[#D8D4C7] rounded-xl px-3 py-2 text-xs font-semibold text-[#2D3127] focus:outline-none focus:ring-2 focus:ring-[#D4A373]"
            >
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} (Fase {c.fase})
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

      {/* Save Success Alert */}
      {savedSuccess && (
        <div className="bg-[#E9EDC9] border border-[#CCD5AE] text-[#3D4035] p-4 rounded-xl text-xs font-semibold flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#588157]" />
            <span>
              Data absensi presensi siswa kelas {currentClassName} tanggal {selectedDate} berhasil disimpan!
            </span>
          </div>
        </div>
      )}

      {/* Summary Badges & Quick Action */}
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
            className="w-full sm:w-auto bg-[#E9EDC9] hover:bg-[#CCD5AE] text-[#3D4035] border border-[#CCD5AE] px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer"
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
                <th className="p-3 w-16 text-center">L/P</th>
                <th className="p-3 w-64 text-center">Status Kehadiran</th>
                <th className="p-3">Keterangan / Catatan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0EEE4] text-xs text-[#2D3127]">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-[#6B6E60]">
                    <AlertCircle className="w-6 h-6 text-[#8C8F82] mx-auto mb-2" />
                    Tidak ada siswa ditemukan.
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
    </div>
  );
};
