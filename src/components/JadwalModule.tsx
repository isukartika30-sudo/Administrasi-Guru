import React, { useState } from "react";
import { ScheduleItem } from "../types";
import { getSchedules, saveSchedules, getClasses } from "../utils/storage";
import { CalendarDays, Plus, Trash2, Edit3, X, MapPin } from "lucide-react";

export const JadwalModule: React.FC = () => {
  const [schedules, setSchedules] = useState<ScheduleItem[]>(getSchedules());
  const classes = getClasses();

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [day, setDay] = useState<ScheduleItem["day"]>("Senin");
  const [period, setPeriod] = useState<number>(1);
  const [timeSlot, setTimeSlot] = useState<string>("07:00 - 08:30");
  const [classId, setClassId] = useState<string>(classes[0]?.id || "X-RPL-1");
  const [subject, setSubject] = useState<string>("Informatika");
  const [room, setRoom] = useState<string>("Lab Komputer 1");

  const days: ScheduleItem["day"][] = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat"];

  const handleOpenAdd = () => {
    setEditingId(null);
    setDay("Senin");
    setPeriod(1);
    setTimeSlot("07:00 - 08:30");
    setSubject("Informatika");
    setRoom("Lab Komputer 1");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: ScheduleItem) => {
    setEditingId(item.id);
    setDay(item.day);
    setPeriod(item.period);
    setTimeSlot(item.timeSlot);
    setClassId(item.classId);
    setSubject(item.subject);
    setRoom(item.room);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus jadwal ini?")) {
      const updated = schedules.filter((s) => s.id !== id);
      setSchedules(updated);
      saveSchedules(updated);
    }
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    const className = classes.find((c) => c.id === classId)?.name || classId;

    if (editingId) {
      const updated = schedules.map((s) =>
        s.id === editingId
          ? {
              ...s,
              day,
              period,
              timeSlot,
              classId,
              className,
              subject,
              room,
            }
          : s
      );
      setSchedules(updated);
      saveSchedules(updated);
    } else {
      const newItem: ScheduleItem = {
        id: `SCH-${Date.now()}`,
        day,
        period,
        timeSlot,
        classId,
        className,
        subject,
        room,
      };
      const updated = [...schedules, newItem];
      setSchedules(updated);
      saveSchedules(updated);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Module Title Bar */}
      <div className="bg-white rounded-2xl border border-[#E2DDD0] p-6 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#2D3127] flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-[#588157]" />
            Jadwal Mengajar Mingguan
          </h2>
          <p className="text-xs text-[#6B6E60] mt-0.5">
            Susun dan pantau jadwal tatap muka di lab maupun kelas per hari
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center justify-center gap-2 bg-[#3D4035] hover:bg-[#2D3126] text-[#FAF9F5] px-4 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer shadow-2xs"
        >
          <Plus className="w-4 h-4 text-[#D4A373]" />
          Tambah Jadwal Mengajar
        </button>
      </div>

      {/* Days Grid View */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {days.map((d) => {
          const dayItems = schedules
            .filter((s) => s.day === d)
            .sort((a, b) => a.period - b.period);

          return (
            <div
              key={d}
              className="bg-white rounded-2xl border border-[#E2DDD0] overflow-hidden shadow-2xs flex flex-col min-h-[320px]"
            >
              <div className="bg-[#3D4035] text-[#FAF9F5] p-3.5 text-center font-bold text-xs uppercase tracking-wider flex items-center justify-between">
                <span>{d}</span>
                <span className="text-[10px] text-[#D4A373] bg-[#D4A373]/20 px-2 py-0.5 rounded">
                  {dayItems.length} Jam
                </span>
              </div>

              <div className="p-3 space-y-3 flex-1 overflow-y-auto">
                {dayItems.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-center text-[#8C8F82] text-xs py-8">
                    Tidak ada jadwal
                  </div>
                ) : (
                  dayItems.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-xl border border-[#E2DDD0] bg-[#F7F5EE] hover:bg-[#F2EFE6] transition space-y-2 group relative"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wide bg-[#3D4035] text-[#D4A373] px-2 py-0.5 rounded-md">
                          Jam Ke-{item.period}
                        </span>
                        <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition">
                          <button
                            onClick={() => handleOpenEdit(item)}
                            className="p-1 text-[#6B6E60] hover:text-[#2D3127] rounded cursor-pointer"
                          >
                            <Edit3 className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="p-1 text-[#E07A5F] hover:text-rose-700 rounded cursor-pointer"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-bold text-xs text-[#2D3127] leading-tight">
                          {item.subject}
                        </h4>
                        <div className="text-[11px] font-semibold text-[#588157] mt-1">
                          Kelas {item.className}
                        </div>
                      </div>

                      <div className="text-[10px] text-[#6B6E60] space-y-0.5 border-t border-[#E2DDD0] pt-2">
                        <div>⏱️ {item.timeSlot}</div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-2.5 h-2.5 text-[#8C8F82]" /> {item.room}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Add/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#2D3126]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#E2DDD0] space-y-4">
            <div className="flex items-center justify-between border-b border-[#F0EEE4] pb-3">
              <h3 className="font-bold text-[#2D3127] text-base">
                {editingId ? "Edit Jadwal Mengajar" : "Tambah Jadwal Mengajar Baru"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-[#8C8F82] hover:text-[#2D3127] rounded cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-[#3D4035] mb-1">Hari</label>
                <select
                  value={day}
                  onChange={(e) => setDay(e.target.value as any)}
                  className="w-full bg-[#F9F8F3] border border-[#D8D4C7] rounded-xl px-3 py-2 text-[#2D3127]"
                >
                  {days.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#3D4035] mb-1">Jam Ke-</label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={period}
                    onChange={(e) => setPeriod(Number(e.target.value))}
                    className="w-full bg-[#F9F8F3] border border-[#D8D4C7] rounded-xl px-3 py-2 text-[#2D3127]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#3D4035] mb-1">Alokasi Waktu</label>
                  <input
                    type="text"
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    placeholder="07:00 - 08:30"
                    className="w-full bg-[#F9F8F3] border border-[#D8D4C7] rounded-xl px-3 py-2 text-[#2D3127]"
                  />
                </div>
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
                      {c.name} (Fase {c.fase})
                    </option>
                  ))}
                </select>
              </div>

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
                <label className="block font-semibold text-[#3D4035] mb-1">Ruang / Lab</label>
                <input
                  type="text"
                  value={room}
                  onChange={(e) => setRoom(e.target.value)}
                  placeholder="Lab Komputer 1"
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
                  Simpan Jadwal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
