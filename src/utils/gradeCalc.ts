import { AssessmentItem } from "../types";

export interface GradeCalculationResult {
  avgFormatif: number;
  avgSumatifLM: number;
  pts: number;
  pas: number;
  finalGrade: number;
  predicate: "A" | "B" | "C" | "D";
  narrative: string;
}

export const calculateGrade = (
  formatif: Record<string, number>,
  sumatifLM: Record<string, number>,
  pts: number,
  pas: number,
  subjectName: string = "Informatika"
): GradeCalculationResult => {
  const formatifValues = Object.values(formatif).filter((v) => typeof v === "number" && !isNaN(v));
  const sumatifLMValues = Object.values(sumatifLM).filter((v) => typeof v === "number" && !isNaN(v));

  const avgFormatif = formatifValues.length > 0 ? formatifValues.reduce((a, b) => a + b, 0) / formatifValues.length : 0;
  const avgSumatifLM = sumatifLMValues.length > 0 ? sumatifLMValues.reduce((a, b) => a + b, 0) / sumatifLMValues.length : 0;

  // Formula Kurikulum Merdeka standard weighting:
  // Formatif Process (30%) + Sumatif Lingkup Materi (30%) + PTS (20%) + PAS (20%)
  const finalGrade = Math.round(
    avgFormatif * 0.3 + avgSumatifLM * 0.3 + (pts || 0) * 0.2 + (pas || 0) * 0.2
  );

  let predicate: "A" | "B" | "C" | "D" = "B";
  if (finalGrade >= 88) predicate = "A";
  else if (finalGrade >= 78) predicate = "B";
  else if (finalGrade >= 68) predicate = "C";
  else predicate = "D";

  let narrative = "";
  if (predicate === "A") {
    narrative = `Sangat mahir dan konsisten menunjukkan penguasaan capaian pembelajaran mata pelajaran ${subjectName}, terampil dalam bernalar kritis dan menyelesaikan tugas tugas berbasis proyek Kurikulum Merdeka.`;
  } else if (predicate === "B") {
    narrative = `Menunjukkan penguasaan yang baik dalam capaian pembelajaran mata pelajaran ${subjectName}, mampu menerapkan konsep dasar dan menyelesaikan asesmen sumatif secara mandiri.`;
  } else if (predicate === "C") {
    narrative = `Cukup menguasai capaian pembelajaran mata pelajaran ${subjectName}, memerlukan bimbingan tambahan pada beberapa materi yang belum tuntas.`;
  } else {
    narrative = `Perlu bimbingan dan pendampingan remedial secara intensif untuk mencapai Kriteria Ketercapaian Tujuan Pembelajaran (KKTP) pada mata pelajaran ${subjectName}.`;
  }

  return {
    avgFormatif: Math.round(avgFormatif * 10) / 10,
    avgSumatifLM: Math.round(avgSumatifLM * 10) / 10,
    pts: pts || 0,
    pas: pas || 0,
    finalGrade,
    predicate,
    narrative,
  };
};

export const updateAssessmentGrades = (item: AssessmentItem, subjectName: string): AssessmentItem => {
  const result = calculateGrade(item.formatif, item.sumatifLM, item.pts, item.pas, subjectName);
  return {
    ...item,
    finalGrade: result.finalGrade,
    predicate: result.predicate,
    narrative: result.narrative,
  };
};
