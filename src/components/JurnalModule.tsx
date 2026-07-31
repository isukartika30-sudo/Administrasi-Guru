import React, { useState } from "react";
import { JournalItem, PrintData } from "../types";
import { getJournals, saveJournals, getClasses } from "../utils/storage";
import { FileText, Plus, Trash2, Edit3, X, Printer, Calendar } from "lucide-react";

interface JurnalModuleProps {
  onOpenPrint: (data: PrintData) => void;
}

export const JurnalModule: React.FC<JurnalModuleProps> = ({ onOpenPrint }) => {
  const [journals, setJournals] = useState<JournalItem[]>(getJournals());
  const classes = getClasses();

  const [selectedClass, setSelectedClass] = useState<string>("all");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [date, setDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [classId, setClassId] = useState<string>(classes[0]?.id || "X-RPL-1");
  const [subject, setSubject] = useState<string>("Informatika");
  const [meetingNumber, setMeetingNumber] = useState<number>(1);
  const [topic, setTopic] = useState<string>("");
  const [obstacle, setObstacle] = useState<string>("");
  const [solution, setSolution] = useState<string>("");
  const [reflection, setReflection] = useState<string>("");

  const handleOpenAdd = () => {
    setEditingId(null);
    setDate(new Date().toISOString().slice(0, 10));
    setMeetingNumber(journals.length + 1);
    setTopic("");
    setObstacle("");
    setSolution("");
    setReflection("");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: JournalItem) => {
    setEditingId(item.id);
    setDate(item.date);
    setClassId(item.classId);
    setSubject(item.subject);
    setMeetingNumber(item.meetingNumber);
    setTopic(item.topic);
    setObstacle(item.obstacle);
    setSolution(item.solution);
    setReflection(item.reflection);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Hapus entri jurnal mengajar ini?")) {
      const updated = journals.filter((j) => j.id !== id);
      setJournals(updated);
      saveJournals(updated);
    }
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    const className = classes.find((c) => c.id === classId)?.name || classId;

    if (editingId) {
      const updated = journals.map((j) =>
        j.id === editingId
          ? {
              ...j,
              date,
              classId,
              className,
              subject,
              meetingNumber,
              topic,
              obstacle,
              solution,
              reflection,
            }
          : j
      );
      setJournals(updated);
      saveJournals(updated);
    } else {
      const newItem: JournalItem = {
        id: `JRN-${Date.now()}`,
        date,
        classId,
        className,
        subject,
        meetingNumber,
        topic,
        totalStudents: 12,
        absentInfo: "Hadir lengkap",
        obstacle,
        solution,
        reflection,
      };
      const updated = [newItem, ...journals];
      setJournals(updated);
      saveJournals(updated);
    }
    setIsModalOpen(false);
  };

  const filteredJournals = journals.filter(
    (j) => selectedClass === "all" || j.classId === selectedClass
  );

  const triggerPrint = () => {
    onOpenPrint({
      type: "jurnal",
      title: "Laporan Jurnal Mengajar Harian Guru",
      className: selectedClass === "all" ? "Semua Kelas" : classes.find((c) => c.id === selectedClass)?.name,
      items: filteredJournals,
    });
  };

  return (
    <div className="space-y-6">
      {/* Title & Controls */}
      <div className="bg-white rounded-2xl border border-[#E2DDD0] p-6 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#2D3127] flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#588157]" />
            Jurnal Mengajar Harian
          </h2>
          <p className="text-xs text-[#6B6E60] mt-0.5">
            Catat perkembangan kelas, kejadian khusus, hambatan, solusi, dan refleksi mengajar harian
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={triggerPrint}
            className="flex items-center gap-2 bg-[#F4F2EA] hover:bg-[#EFECE1] text-[#3D4035] border border-[#D8D4C7] px-3.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer"
          >
            <Printer className="w-4 h-4 text-[#588157]" />
            Cetak Jurnal
          </button>
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 bg-[#D4A373] hover:bg-[#c29263] text-[#2D3127] px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer shadow-2xs"
          >
            <Plus className="w-4 h-4" />
            Tulis Jurnal Baru
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl border border-[#E2DDD0] p-4 shadow-2xs flex items-center gap-3">
        <label className="text-xs font-semibold text-[#3D4035]">Filter Kelas:</label>
        <select
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          className="bg-[#F9F8F3] border border-[#D8D4C7] rounded-xl px-3 py-1.5 text-xs font-semibold text-[#2D3127] focus:outline-none focus:ring-2 focus:ring-[#D4A373]"
        >
          <option value="all">Semua Kelas</option>
          {classes.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name} (Fase {c.fase})
            </option>
          ))}
        </select>
      </div>

      {/* Journal Cards */}
      <div className="space-y-4">
        {filteredJournals.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#E2DDD0] p-12 text-center text-[#6B6E60]">
            Belum ada catatan jurnal mengajar. Klik "Tulis Jurnal Baru" untuk menambahkan.
          </div>
        ) : (
          filteredJournals.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-[#E2DDD0] p-6 shadow-2xs space-y-4 hover:border-[#D8D4C7] transition"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#F0EEE4] pb-3">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1.5 text-xs font-bold text-[#2D3127] bg-[#F4F2EA] px-3 py-1 rounded-lg">
                    <Calendar className="w-3.5 h-3.5 text-[#588157]" />
                    {item.date}
                  </span>
                  <span className="font-bold text-xs bg-[#3D4035] text-[#D4A373] px-2.5 py-1 rounded-lg">
                    Kelas {item.className}
                  </span>
                  <span className="text-xs font-semibold text-[#6B6E60]">
                    Pertemuan Ke-{item.meetingNumber} &bull; {item.subject}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEdit(item)}
                    className="p-1.5 text-[#6B6E60] hover:text-[#2D3127] rounded cursor-pointer"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 text-[#E07A5F] hover:text-rose-700 rounded cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-[#2D3127] text-base leading-snug">
                  Materi / Topik: {item.topic}
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="p-3 rounded-xl bg-[#FAEDCD]/50 border border-[#D4A373]/40 space-y-1">
                  <strong className="text-[#8C5E32] block font-bold">Hambatan & Kendala:</strong>
                  <p className="text-[#3D4035] leading-relaxed">{item.obstacle || "Tidak ada kendala berarti."}</p>
                </div>

                <div className="p-3 rounded-xl bg-[#E9EDC9]/50 border border-[#A3B18A]/40 space-y-1">
                  <strong className="text-[#3D4035] block font-bold">Solusi / Tindak Lanjut:</strong>
                  <p className="text-[#2D3127] leading-relaxed">{item.solution || "Pembelajaran berjalan lancar."}</p>
                </div>

                <div className="p-3 rounded-xl bg-[#F4F2EA] border border-[#D8D4C7] space-y-1">
                  <strong className="text-[#3D4035] block font-bold">Refleksi Guru:</strong>
                  <p className="text-[#2D3127] leading-relaxed">{item.reflection || "Siswa merespons baik."}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#2D3126]/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#E2DDD0] space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-[#F0EEE4] pb-3">
              <h3 className="font-bold text-[#2D3127] text-base">
                {editingId ? "Edit Jurnal Mengajar" : "Tulis Jurnal Mengajar Baru"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-[#8C8F82] hover:text-[#2D3127] rounded cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#3D4035] mb-1">Tanggal</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-[#F9F8F3] border border-[#D8D4C7] rounded-xl px-3 py-2 text-[#2D3127]"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#3D4035] mb-1">Kelas Target</label>
                  <select
                    value={classId}
                    onChange={(e) => setClassId(e.target.value)}
                    className="w-full bg-[#F9F8F3] border border-[#D8D4C7] rounded-xl px-3 py-2 text-[#2D3127]"
                  >
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#3D4035] mb-1">Mata Pelajaran</label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full bg-[#F9F8F3] border border-[#D8D4C7] rounded-xl px-3 py-2 text-[#2D3127]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#3D4035] mb-1">Pertemuan Ke-</label>
                  <input
                    type="number"
                    min={1}
                    value={meetingNumber}
                    onChange={(e) => setMeetingNumber(Number(e.target.value))}
                    className="w-full bg-[#F9F8F3] border border-[#D8D4C7] rounded-xl px-3 py-2 text-[#2D3127]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#3D4035] mb-1">Materi / Topik Pembelajaran</label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Misal: Latihan Algoritma Dekomposisi"
                  className="w-full bg-[#F9F8F3] border border-[#D8D4C7] rounded-xl px-3 py-2 text-[#2D3127]"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-[#3D4035] mb-1">Hambatan / Kendala Siswa</label>
                <textarea
                  rows={2}
                  value={obstacle}
                  onChange={(e) => setObstacle(e.target.value)}
                  placeholder="Catat jika ada kesulitan siswa saat KBM..."
                  className="w-full bg-[#F9F8F3] border border-[#D8D4C7] rounded-xl px-3 py-2 text-[#2D3127]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#3D4035] mb-1">Solusi & Tindak Lanjut Guru</label>
                <textarea
                  rows={2}
                  value={solution}
                  onChange={(e) => setSolution(e.target.value)}
                  placeholder="Solusi yang diterapkan..."
                  className="w-full bg-[#F9F8F3] border border-[#D8D4C7] rounded-xl px-3 py-2 text-[#2D3127]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#3D4035] mb-1">Refleksi Guru</label>
                <textarea
                  rows={2}
                  value={reflection}
                  onChange={(e) => setReflection(e.target.value)}
                  placeholder="Refleksi efektivitas metode..."
                  className="w-full bg-[#F9F8F3] border border-[#D8D4C7] rounded-xl px-3 py-2 text-[#2D3127]"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-[#F0EEE4]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-[#F4F2EA] text-[#3D4035] rounded-xl font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#D4A373] hover:bg-[#c29263] text-[#2D3127] rounded-xl font-semibold cursor-pointer"
                >
                  Simpan Jurnal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
