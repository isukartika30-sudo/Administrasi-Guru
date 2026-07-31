export type AttendanceStatus = "H" | "I" | "S" | "A"; // Hadir, Izin, Sakit, Alpa

export interface ClassRoom {
  id: string;
  name: string;
  fase: "A" | "B" | "C" | "D" | "E" | "F";
  studentCount: number;
}

export interface Student {
  id: string;
  nisn: string;
  name: string;
  gender: "L" | "P";
  parentName: string;
  parentPhone: string;
  address: string;
  notes?: string;
  roleInClass?: "Ketua Kelas" | "Wakil Ketua" | "Sekretaris" | "Bendahara" | "Anggota";
  classId?: string;
  className?: string;
}

export interface AttendanceRecord {
  id: string;
  date: string; // YYYY-MM-DD
  classId: string;
  className: string;
  subject: string;
  meetingNumber: number;
  studentId: string;
  status: AttendanceStatus;
  notes?: string;
}

export interface ScheduleItem {
  id: string;
  day: "Senin" | "Selasa" | "Rabu" | "Kamis" | "Jumat";
  period: number; // Jam Ke 1 - 10
  timeSlot: string; // "07:00 - 07:45"
  classId: string;
  className: string;
  subject: string;
  room: string;
  color?: string;
}

export interface AgendaItem {
  id: string;
  classId: string;
  className: string;
  subject: string;
  fase: "A" | "B" | "C" | "D" | "E" | "F";
  element: string; // E.g., "Berpikir Komputasional", "Aljabar", etc.
  cp: string; // Capaian Pembelajaran
  tp: string; // Tujuan Pembelajaran
  atp: string; // Alur Tujuan Pembelajaran
  materi: string;
  jp: number; // Alokasi Jam Pelajaran
  semester: "1" | "2";
  status: "Belum" | "Proses" | "Selesai";
}

export interface JournalItem {
  id: string;
  date: string; // YYYY-MM-DD
  classId: string;
  className: string;
  subject: string;
  meetingNumber: number;
  topic: string;
  totalStudents: number;
  absentInfo: string; // E.g. "Hadir: 34, Sakit: 1 (Budi), Alpa: 0"
  obstacle: string; // Hambatan / Catatan
  solution: string; // Solusi / Tindak Lanjut
  reflection: string; // Refleksi Guru
}

export interface GuidanceNote {
  id: string;
  date: string;
  topic: string;
  description: string;
  followUp: string;
}

export interface HomeroomStudent extends Student {
  guidanceNotes: GuidanceNote[];
  achievements: string[];
}

export interface AssessmentItem {
  id: string;
  studentId: string;
  studentName: string;
  classId: string;
  subject: string;
  formatif: Record<string, number>; // e.g. { "TP1": 85, "TP2": 90, "TP3": 88 }
  sumatifLM: Record<string, number>; // e.g. { "LM1": 80, "LM2": 85 }
  pts: number; // Sumatif Tengah Semester
  pas: number; // Sumatif Akhir Semester
  finalGrade?: number;
  predicate?: "A" | "B" | "C" | "D";
  narrative?: string; // Deskripsi Capaian Rapor
}

export interface SchoolProfile {
  schoolName: string;
  teacherName: string;
  nip: string;
  subject: string;
  homeroomClass: string;
  academicYear: string;
  semester: "Ganjil" | "Genap";
  principalName: string;
  principalNip: string;
  city: string;
  kopSuratUrl?: string; // Data URL string for uploaded Kop Surat image (.jpg, .jpeg, .png)
}

export type TabType = 
  | "overview"
  | "kurikulum"
  | "absensi"
  | "jadwal"
  | "agenda"
  | "jurnal"
  | "perwalian"
  | "penilaian"
  | "google_workspace"
  | "ai_assistant";

export interface CpItem {
  id: string;
  subject: string;
  fase: "A" | "B" | "C" | "D" | "E" | "F";
  element: string; // E.g., "Berpikir Komputasional", "Algoritma & Pemrograman"
  code: string; // E.g., "CP.E.1"
  description: string;
  targetJP: number;
}

export interface TpItem {
  id: string;
  cpId: string; // Linked CP ID
  code: string; // E.g., "TP 1.1"
  statement: string; // Rumusan TP
  kko: string; // KKO Taksonomi Bloom (e.g. "Menganalisis [C4]")
  scope: string; // Lingkup Materi
  targetJP: number;
}

export interface AtpItem {
  id: string;
  tpId: string; // Linked TP ID
  code: string; // E.g., "ATP.E.1.1"
  semester: "1" | "2";
  order: number;
  materi: string;
  jp: number;
  pancasilaProfiles: string[];
  keywords: string;
  assessmentMethod: string;
}

export interface KktpItem {
  id: string;
  tpId: string; // Linked TP ID
  kkmKompleksitas: "Tinggi" | "Sedang" | "Rendah";
  kkmDayaDukung: "Tinggi" | "Sedang" | "Rendah";
  kkmIntake: "Tinggi" | "Sedang" | "Rendah";
  kkmValue: number; // e.g. 78
  approach: "Rubrik Deskriptif" | "Interval Nilai" | "Skala Deskripsi";
  intervalBelum: string; // 0-60
  intervalLayak: string; // 61-75
  intervalCakap: string; // 76-88
  intervalMahir: string; // 89-100
  remedialPlan: string;
  enrichmentPlan: string;
}

export interface ProtaProsemItem {
  id: string;
  subject: string;
  fase: string;
  semester: "1" | "2";
  month: string; // e.g. "Juli", "Agustus"
  weekNumber: number;
  tpCode: string;
  topic: string;
  jp: number;
  activityType: "Tatap Muka" | "Asesmen Sumatif" | "Projek P5" | "Cadangan";
}

export type AiToolType =
  | "input_cp"
  | "perangkat_ajar"
  | "modul_ajar"
  | "lkpd"
  | "atp"
  | "tp"
  | "kktp"
  | "prota_prosem"
  | "soal_quiz"
  | "asesmen_diagnostik"
  | "catatan_wali"
  | "chat_guru";

export interface PrintData {
  type: "absensi" | "jurnal" | "rekap_nilai" | "agenda" | "rapor_siswa" | "cp" | "tp" | "atp" | "kktp" | "kkm" | "prota" | "prosem" | "kurikulum";
  title: string;
  subtitle?: string;
  classId?: string;
  className?: string;
  subject?: string;
  periodLabel?: string;
  items: any[];
}
