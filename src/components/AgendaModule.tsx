import React, { useState } from "react";
import { AgendaItem, PrintData } from "../types";
import { getAgendas, saveAgendas, getClasses } from "../utils/storage";
import { BookOpen, Plus, Trash2, Edit3, X, Printer, Search } from "lucide-react";

interface AgendaModuleProps {
  onOpenPrint: (data: PrintData) => void;
}

export const AgendaModule: React.FC<AgendaModuleProps> = ({ onOpenPrint }) => {
  const [agendas, setAgendas] = useState<AgendaItem[]>(getAgendas());
  const classes = getClasses();

  const [selectedClass, setSelectedClass] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [classId, setClassId] = useState<string>(classes[0]?.id || "X-RPL-1");
  const [subject, setSubject] = useState<string>("Informatika");
  const [fase, setFase] = useState<"A" | "B" | "C" | "D" | "E" | "F">("E");
  const [element, setElement] = useState<string>("Berpikir Komputasional");
  const [cp, setCp] = useState<string>("");
  const [tp, setTp] = useState<string>("");
  const [atp, setAtp] = useState<string>("");
  const [materi, setMateri] = useState<string>("");
  const [jp, setJp] = useState<number>(4);
  const [semester, setSemester] = useState<"1" | "2">("1");
  const [status, setStatus] = useState<"Belum" | "Proses" | "Selesai">("Proses");

  const handleOpenAdd = () => {
    setEditingId(null);
    setSubject("Informatika");
    setFase("E");
    setElement("Berpikir Komputasional");
    setCp("");
    setTp("");
    setAtp("");
    setMateri("");
    setJp(4);
    setSemester("1");
    setStatus("Proses");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: AgendaItem) => {
    setEditingId(item.id);
    setClassId(item.classId);
    setSubject(item.subject);
    setFase(item.fase);
    setElement(item.element);
    setCp(item.cp);
    setTp(item.tp);
    setAtp(item.atp);
    setMateri(item.materi);
    setJp(item.jp);
    setSemester(item.semester);
    setStatus(item.status);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Hapus agenda pembelajaran ini?")) {
      const updated = agendas.filter((a) => a.id !== id);
      setAgendas(updated);
      saveAgendas(updated);
    }
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    const className = classes.find((c) => c.id === classId)?.name || classId;

    if (editingId) {
      const updated = agendas.map((a) =>
        a.id === editingId
          ? {
              ...a,
              classId,
              className,
              subject,
              fase,
              element,
              cp,
              tp,
              atp,
              materi,
              jp,
              semester,
              status,
            }
          : a
      );
      setAgendas(updated);
      saveAgendas(updated);
    } else {
      const newItem: AgendaItem = {
        id: `AGN-${Date.now()}`,
        classId,
        className,
        subject,
        fase,
        element,
        cp,
        tp,
        atp,
        materi,
        jp,
        semester,
        status,
      };
      const updated = [...agendas, newItem];
      setAgendas(updated);
      saveAgendas(updated);
    }
    setIsModalOpen(false);
  };

  const filteredAgendas = agendas.filter((a) => {
    const matchesClass = selectedClass === "all" || a.classId === selectedClass;
    const matchesSearch =
      a.materi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.tp.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.element.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesClass && matchesSearch;
  });

  const triggerPrint = () => {
    onOpenPrint({
      type: "agenda",
      title: "Laporan Agenda, CP, & ATP Kurikulum Merdeka",
      className: selectedClass === "all" ? "Semua Kelas" : classes.find((c) => c.id === selectedClass)?.name,
      items: filteredAgendas,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-white rounded-2xl border border-[#E2DDD0] p-6 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#2D3127] flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#588157]" />
            Agenda Mengajar (CP, TP, & ATP)
          </h2>
          <p className="text-xs text-[#6B6E60] mt-0.5">
            Peta Capaian Pembelajaran, Tujuan Pembelajaran, dan Alur Tujuan Pembelajaran Kurikulum Merdeka
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={triggerPrint}
            className="flex items-center gap-2 bg-[#F4F2EA] hover:bg-[#EFECE1] text-[#3D4035] border border-[#D8D4C7] px-3.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer"
          >
            <Printer className="w-4 h-4 text-[#588157]" />
            Cetak Agenda
          </button>
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 bg-[#D4A373] hover:bg-[#c29263] text-[#2D3127] px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer shadow-2xs"
          >
            <Plus className="w-4 h-4" />
            Tambah Agenda
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-2xl border border-[#E2DDD0] p-4 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <label className="text-xs font-semibold text-[#3D4035] whitespace-nowrap">Filter Kelas:</label>
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

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-[#8C8F82] absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Cari materi, TP, elemen..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#F9F8F3] border border-[#D8D4C7] rounded-xl pl-9 pr-3 py-1.5 text-xs text-[#2D3127] focus:outline-none focus:ring-2 focus:ring-[#D4A373]"
          />
        </div>
      </div>

      {/* Agendas List */}
      <div className="space-y-4">
        {filteredAgendas.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#E2DDD0] p-12 text-center text-[#6B6E60]">
            Belum ada agenda mengajar. Klik tombol "Tambah Agenda" untuk membuat baru.
          </div>
        ) : (
          filteredAgendas.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-[#E2DDD0] p-5 shadow-2xs space-y-3 hover:border-[#D8D4C7] transition"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#F0EEE4] pb-3">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs bg-[#3D4035] text-[#D4A373] px-2.5 py-1 rounded-lg">
                    Fase {item.fase}
                  </span>
                  <span className="font-semibold text-xs text-[#3D4035] bg-[#E9EDC9] px-2.5 py-1 rounded-lg">
                    Kelas {item.className}
                  </span>
                  <span className="text-xs font-semibold text-[#6B6E60]">
                    {item.subject} &bull; Semester {item.semester}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                      item.status === "Selesai"
                        ? "bg-[#E9EDC9] text-[#3D4035]"
                        : item.status === "Proses"
                        ? "bg-[#FAEDCD] text-[#8C5E32]"
                        : "bg-[#F4F2EA] text-[#6B6E60]"
                    }`}
                  >
                    {item.status}
                  </span>
                  <span className="text-xs font-semibold text-[#6B6E60]">{item.jp} JP</span>

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
                <h3 className="font-bold text-[#2D3127] text-base">
                  Elemen: {item.element} &mdash; Topik: {item.materi}
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-[#3D4035] bg-[#F7F5EE] p-3.5 rounded-xl border border-[#E2DDD0]">
                <div>
                  <strong className="text-[#2D3127] block mb-1">Capaian Pembelajaran (CP):</strong>
                  <p className="leading-relaxed text-[#6B6E60]">{item.cp || "-"}</p>
                </div>
                <div>
                  <strong className="text-[#2D3127] block mb-1">Tujuan Pembelajaran (TP & ATP):</strong>
                  <p className="leading-relaxed text-[#6B6E60]">{item.tp || "-"}</p>
                  <p className="text-[#8C8F82] mt-1 italic">{item.atp}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Add/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#2D3126]/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-[#E2DDD0] space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-[#F0EEE4] pb-3">
              <h3 className="font-bold text-[#2D3127] text-base">
                {editingId ? "Edit Agenda Kurikulum Merdeka" : "Tambah Agenda Kurikulum Merdeka"}
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
                  <label className="block font-semibold text-[#3D4035] mb-1">Kelas Target</label>
                  <select
                    value={classId}
                    onChange={(e) => setClassId(e.target.value)}
                    className="w-full bg-[#F9F8F3] border border-[#D8D4C7] rounded-xl px-3 py-2 text-[#2D3127]"
                  >
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} (Fase {c.fase})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[#3D4035] mb-1">Fase Kurikulum</label>
                  <select
                    value={fase}
                    onChange={(e) => setFase(e.target.value as any)}
                    className="w-full bg-[#F9F8F3] border border-[#D8D4C7] rounded-xl px-3 py-2 text-[#2D3127]"
                  >
                    {["A", "B", "C", "D", "E", "F"].map((f) => (
                      <option key={f} value={f}>
                        Fase {f}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#3D4035] mb-1">Elemen Pembelajaran</label>
                <input
                  type="text"
                  value={element}
                  onChange={(e) => setElement(e.target.value)}
                  placeholder="E.g., Berpikir Komputasional / Algoritma"
                  className="w-full bg-[#F9F8F3] border border-[#D8D4C7] rounded-xl px-3 py-2 text-[#2D3127]"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-[#3D4035] mb-1">Topik / Materi utama</label>
                <input
                  type="text"
                  value={materi}
                  onChange={(e) => setMateri(e.target.value)}
                  placeholder="E.g., Dekomposisi & Algoritma Pencarian"
                  className="w-full bg-[#F9F8F3] border border-[#D8D4C7] rounded-xl px-3 py-2 text-[#2D3127]"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-[#3D4035] mb-1">Capaian Pembelajaran (CP)</label>
                <textarea
                  rows={2}
                  value={cp}
                  onChange={(e) => setCp(e.target.value)}
                  placeholder="Deskripsi CP dari BSKAP..."
                  className="w-full bg-[#F9F8F3] border border-[#D8D4C7] rounded-xl px-3 py-2 text-[#2D3127]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#3D4035] mb-1">Tujuan Pembelajaran (TP)</label>
                <textarea
                  rows={2}
                  value={tp}
                  onChange={(e) => setTp(e.target.value)}
                  placeholder="Rumusan Tujuan Pembelajaran (TP)..."
                  className="w-full bg-[#F9F8F3] border border-[#D8D4C7] rounded-xl px-3 py-2 text-[#2D3127]"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-[#3D4035] mb-1">Alokasi JP</label>
                  <input
                    type="number"
                    min={1}
                    value={jp}
                    onChange={(e) => setJp(Number(e.target.value))}
                    className="w-full bg-[#F9F8F3] border border-[#D8D4C7] rounded-xl px-3 py-2 text-[#2D3127]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#3D4035] mb-1">Semester</label>
                  <select
                    value={semester}
                    onChange={(e) => setSemester(e.target.value as any)}
                    className="w-full bg-[#F9F8F3] border border-[#D8D4C7] rounded-xl px-3 py-2 text-[#2D3127]"
                  >
                    <option value="1">Semester 1 (Ganjil)</option>
                    <option value="2">Semester 2 (Genap)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-[#3D4035] mb-1">Status Ketercapaian</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full bg-[#F9F8F3] border border-[#D8D4C7] rounded-xl px-3 py-2 text-[#2D3127]"
                  >
                    <option value="Belum">Belum Mulai</option>
                    <option value="Proses">Dalam Proses</option>
                    <option value="Selesai">Tuntas / Selesai</option>
                  </select>
                </div>
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
                  Simpan Agenda
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
