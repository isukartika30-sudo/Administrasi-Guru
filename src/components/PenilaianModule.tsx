import React, { useState } from "react";
import { AssessmentItem, PrintData } from "../types";
import { getAssessments, saveAssessments, getClasses, getStudents } from "../utils/storage";
import { calculateGrade, updateAssessmentGrades } from "../utils/gradeCalc";
import { GraduationCap, Save, Printer, Plus, Search, CheckCircle2 } from "lucide-react";

interface PenilaianModuleProps {
  onOpenPrint: (data: PrintData) => void;
}

export const PenilaianModule: React.FC<PenilaianModuleProps> = ({ onOpenPrint }) => {
  const classes = getClasses();
  const allStudents = getStudents();

  const [selectedClass, setSelectedClass] = useState<string>(classes[0]?.id || "X-RPL-1");
  const [selectedSubject, setSelectedSubject] = useState<string>("Informatika");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [assessments, setAssessments] = useState<AssessmentItem[]>(() => {
    const raw = getAssessments();
    // Ensure grade calculations are up to date
    return raw.map((item) => updateAssessmentGrades(item, "Informatika"));
  });

  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const currentClassName = classes.find((c) => c.id === selectedClass)?.name || selectedClass;

  // Formatif TP keys present in selected class items
  const formatifKeys = ["TP1", "TP2", "TP3"];
  const sumatifLMKeys = ["LM1", "LM2"];

  const handleScoreChange = (
    studentId: string,
    type: "formatif" | "sumatifLM" | "pts" | "pas",
    key: string | null,
    val: number
  ) => {
    const value = Math.max(0, Math.min(100, isNaN(val) ? 0 : val));

    const updated = assessments.map((item) => {
      if (item.studentId === studentId && item.classId === selectedClass) {
        let newItem = { ...item };
        if (type === "formatif" && key) {
          newItem.formatif = { ...newItem.formatif, [key]: value };
        } else if (type === "sumatifLM" && key) {
          newItem.sumatifLM = { ...newItem.sumatifLM, [key]: value };
        } else if (type === "pts") {
          newItem.pts = value;
        } else if (type === "pas") {
          newItem.pas = value;
        }
        return updateAssessmentGrades(newItem, selectedSubject);
      }
      return item;
    });

    setAssessments(updated);
  };

  const handleSave = () => {
    saveAssessments(assessments);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  // Filtered assessment list
  const filteredItems = assessments
    .filter((a) => a.classId === selectedClass)
    .filter((a) => a.studentName.toLowerCase().includes(searchQuery.toLowerCase()));

  const triggerPrint = () => {
    onOpenPrint({
      type: "rekap_nilai",
      title: `Laporan Rekapitulasi Nilai Rapor Kelas ${currentClassName}`,
      className: currentClassName,
      subject: selectedSubject,
      items: filteredItems,
    });
  };

  return (
    <div className="space-y-6">
      {/* Title & Controls Bar */}
      <div className="bg-white rounded-2xl border border-[#E2DDD0] p-6 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#2D3127] flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-[#588157]" />
            Matriks Penilaian & Rekap Nilai Otomatis
          </h2>
          <p className="text-xs text-[#6B6E60] mt-0.5">
            Formatif (TP), Sumatif Lingkup Materi (LM), PTS, PAS, Predikat, dan Deskripsi Capaian Rapor Kurikulum Merdeka
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={triggerPrint}
            className="flex items-center gap-2 bg-[#F4F2EA] hover:bg-[#EFECE1] text-[#3D4035] border border-[#D8D4C7] px-3.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer"
          >
            <Printer className="w-4 h-4 text-[#588157]" />
            Cetak Rekap Rapor
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 bg-[#D4A373] hover:bg-[#c29263] text-[#2D3127] px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer shadow-2xs"
          >
            <Save className="w-4 h-4" />
            Simpan Nilai
          </button>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="bg-white rounded-2xl border border-[#E2DDD0] p-4 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-[#3D4035]">Kelas:</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="bg-[#F9F8F3] border border-[#D8D4C7] rounded-xl px-3 py-1.5 text-xs font-semibold text-[#2D3127] focus:outline-none focus:ring-2 focus:ring-[#D4A373]"
            >
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} (Fase {c.fase})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-[#3D4035]">Mapel:</label>
            <input
              type="text"
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="bg-[#F9F8F3] border border-[#D8D4C7] rounded-xl px-3 py-1.5 text-xs font-semibold text-[#2D3127] w-36 focus:outline-none focus:ring-2 focus:ring-[#D4A373]"
            />
          </div>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-[#8C8F82] absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Cari siswa..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#F9F8F3] border border-[#D8D4C7] rounded-xl pl-9 pr-3 py-1.5 text-xs text-[#2D3127] focus:outline-none focus:ring-2 focus:ring-[#D4A373]"
          />
        </div>
      </div>

      {/* Save Success Alert */}
      {savedSuccess && (
        <div className="bg-[#E9EDC9] border border-[#A3B18A] text-[#3D4035] p-4 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-2xs">
          <CheckCircle2 className="w-4 h-4 text-[#588157]" />
          <span>
            Seluruh komponen nilai dan rekapitulasi Rapor Kurikulum Merdeka berhasil disimpan!
          </span>
        </div>
      )}

      {/* Assessment Matrix Table */}
      <div className="bg-white rounded-2xl border border-[#E2DDD0] overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#3D4035] text-[#FAF9F5] font-bold uppercase tracking-wider text-[11px]">
                <th className="p-3 pl-4 w-10 text-center border-r border-[#2D3126]">No</th>
                <th className="p-3 w-48 border-r border-[#2D3126]">Nama Siswa</th>
                <th colSpan={formatifKeys.length} className="p-2 text-center border-r border-[#2D3126] bg-[#2D3126] text-[#D4A373]">
                  Formatif Process (30%)
                </th>
                <th colSpan={sumatifLMKeys.length} className="p-2 text-center border-r border-[#2D3126] bg-[#34382D] text-[#A3B18A]">
                  Sumatif LM (30%)
                </th>
                <th className="p-2 text-center w-16 border-r border-[#2D3126] bg-[#3D4035] text-[#FAF9F5]">PTS (20%)</th>
                <th className="p-2 text-center w-16 border-r border-[#2D3126] bg-[#3D4035] text-[#FAF9F5]">PAS (20%)</th>
                <th className="p-3 text-center w-20 border-r border-[#2D3126] bg-[#2D3126] text-[#D4A373] font-extrabold">Nilai Akhir</th>
                <th className="p-3 text-center w-16 border-r border-[#2D3126]">Predikat</th>
                <th className="p-3 min-w-[200px]">Deskripsi Capaian Rapor</th>
              </tr>
              <tr className="bg-[#F4F2EA] text-[#3D4035] text-[10px] font-bold border-b border-[#E2DDD0]">
                <th className="p-2 border-r border-[#E2DDD0]"></th>
                <th className="p-2 border-r border-[#E2DDD0]"></th>
                {formatifKeys.map((fk) => (
                  <th key={fk} className="p-2 text-center w-14 border-r border-[#E2DDD0] bg-[#FAEDCD]/50">{fk}</th>
                ))}
                {sumatifLMKeys.map((lm) => (
                  <th key={lm} className="p-2 text-center w-14 border-r border-[#E2DDD0] bg-[#E9EDC9]/50">{lm}</th>
                ))}
                <th className="p-2 text-center border-r border-[#E2DDD0] bg-[#F4F2EA]">PTS</th>
                <th className="p-2 text-center border-r border-[#E2DDD0] bg-[#F4F2EA]">PAS</th>
                <th className="p-2 text-center border-r border-[#E2DDD0] bg-[#E2DDD0] font-extrabold">NA</th>
                <th className="p-2 text-center border-r border-[#E2DDD0]">Pred.</th>
                <th className="p-2">Deskripsi Otomatis</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#F0EEE4] text-[#2D3127]">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={10} className="p-8 text-center text-[#6B6E60]">
                    Tidak ada siswa terdaftar untuk kelas ini.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-[#F7F5EE] transition">
                    <td className="p-2.5 pl-4 text-center text-[#6B6E60] font-mono border-r border-[#E2DDD0]">{idx + 1}</td>
                    <td className="p-2.5 font-bold text-[#2D3127] border-r border-[#E2DDD0]">{item.studentName}</td>

                    {/* Formatif Inputs */}
                    {formatifKeys.map((fk) => (
                      <td key={fk} className="p-1.5 text-center border-r border-[#E2DDD0] bg-[#FAEDCD]/20">
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={item.formatif[fk] ?? 0}
                          onChange={(e) =>
                            handleScoreChange(
                              item.studentId,
                              "formatif",
                              fk,
                              Number(e.target.value)
                            )
                          }
                          className="w-12 text-center bg-white border border-[#D8D4C7] rounded px-1 py-1 font-mono font-semibold text-[#2D3127] focus:ring-1 focus:ring-[#D4A373]"
                        />
                      </td>
                    ))}

                    {/* Sumatif LM Inputs */}
                    {sumatifLMKeys.map((lm) => (
                      <td key={lm} className="p-1.5 text-center border-r border-[#E2DDD0] bg-[#E9EDC9]/20">
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={item.sumatifLM[lm] ?? 0}
                          onChange={(e) =>
                            handleScoreChange(
                              item.studentId,
                              "sumatifLM",
                              lm,
                              Number(e.target.value)
                            )
                          }
                          className="w-12 text-center bg-white border border-[#D8D4C7] rounded px-1 py-1 font-mono font-semibold text-[#2D3127] focus:ring-1 focus:ring-[#588157]"
                        />
                      </td>
                    ))}

                    {/* PTS Input */}
                    <td className="p-1.5 text-center border-r border-[#E2DDD0] bg-[#F4F2EA]">
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={item.pts ?? 0}
                        onChange={(e) =>
                          handleScoreChange(item.studentId, "pts", null, Number(e.target.value))
                        }
                        className="w-12 text-center bg-white border border-[#D8D4C7] rounded px-1 py-1 font-mono font-semibold text-[#2D3127] focus:ring-1 focus:ring-[#D4A373]"
                      />
                    </td>

                    {/* PAS Input */}
                    <td className="p-1.5 text-center border-r border-[#E2DDD0] bg-[#F4F2EA]">
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={item.pas ?? 0}
                        onChange={(e) =>
                          handleScoreChange(item.studentId, "pas", null, Number(e.target.value))
                        }
                        className="w-12 text-center bg-white border border-[#D8D4C7] rounded px-1 py-1 font-mono font-semibold text-[#2D3127] focus:ring-1 focus:ring-[#D4A373]"
                      />
                    </td>

                    {/* Final Grade Calculation */}
                    <td className="p-2.5 text-center font-extrabold text-sm text-[#2D3127] bg-[#F4F2EA] border-r border-[#E2DDD0]">
                      {item.finalGrade}
                    </td>

                    {/* Predicate Badge */}
                    <td className="p-2.5 text-center font-extrabold border-r border-[#E2DDD0]">
                      <span
                        className={`px-2.5 py-1 rounded-md text-xs ${
                          item.predicate === "A"
                            ? "bg-[#E9EDC9] text-[#3D4035]"
                            : item.predicate === "B"
                            ? "bg-[#FAEDCD] text-[#8C5E32]"
                            : item.predicate === "C"
                            ? "bg-[#F4F2EA] text-[#6B6E60]"
                            : "bg-[#F8D7DA] text-[#842029]"
                        }`}
                      >
                        {item.predicate}
                      </span>
                    </td>

                    {/* Auto Generated Narrative */}
                    <td className="p-2.5 text-[11px] text-[#6B6E60] leading-snug">
                      {item.narrative}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
