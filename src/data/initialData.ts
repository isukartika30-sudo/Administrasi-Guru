import {
  Student,
  ScheduleItem,
  AgendaItem,
  JournalItem,
  HomeroomStudent,
  AssessmentItem,
  SchoolProfile,
  AttendanceRecord,
  CpItem,
  TpItem,
  AtpItem,
  KktpItem,
  ProtaProsemItem,
} from "../types";

export const initialSchoolProfile: SchoolProfile = {
  schoolName: "SMK Negeri 1 Merdeka Nusantara",
  teacherName: "Isu Kartika, S.Pd., M.Kom.",
  nip: "19880512 201402 2 001",
  subject: "Informatika & Rekayasa Perangkat Lunak",
  homeroomClass: "X RPL 1",
  academicYear: "2025/2026",
  semester: "Ganjil",
  principalName: "Drs. H. Mulyadi, M.Pd.",
  principalNip: "19680315 199303 1 004",
  city: "Jakarta Pusat",
};

export const sampleClasses = [
  { id: "X-RPL-1", name: "X RPL 1", fase: "E" as const, studentCount: 12 },
  { id: "XI-RPL-2", name: "XI RPL 2", fase: "F" as const, studentCount: 10 },
  { id: "XII-RPL-1", name: "XII RPL 1", fase: "F" as const, studentCount: 10 },
];

export const sampleStudents: Student[] = [
  { id: "STD-001", nisn: "0081234561", name: "Ahmad Rizky Pratama", gender: "L", parentName: "Bambang Pratama", parentPhone: "081234567890", address: "Jl. Merdeka No. 12, Jakarta", roleInClass: "Ketua Kelas" },
  { id: "STD-002", nisn: "0081234562", name: "Anisa Rahmawati", gender: "P", parentName: "Suryono", parentPhone: "081234567891", address: "Jl. Melati No. 45, Jakarta", roleInClass: "Sekretaris" },
  { id: "STD-003", nisn: "0081234563", name: "Budi Santoso", gender: "L", parentName: "Hadi Santoso", parentPhone: "081234567892", address: "Jl. Mawar No. 8, Jakarta", roleInClass: "Wakil Ketua" },
  { id: "STD-004", nisn: "0081234564", name: "Citra Dewi Lestari", gender: "P", parentName: "Wawan Lestari", parentPhone: "081234567893", address: "Jl. Anggrek No. 19, Jakarta", roleInClass: "Bendahara" },
  { id: "STD-005", nisn: "0081234565", name: "Dewa Gede Putu", gender: "L", parentName: "I Wayan Suardana", parentPhone: "081234567894", address: "Jl. Garuda No. 3, Jakarta", roleInClass: "Anggota" },
  { id: "STD-006", nisn: "0081234566", name: "Fathir Muhammad", gender: "L", parentName: "Ahmad Hidayat", parentPhone: "081234567895", address: "Jl. Pemuda No. 77, Jakarta", roleInClass: "Anggota" },
  { id: "STD-007", nisn: "0081234567", name: "Gita Gutawa Putri", gender: "P", parentName: "Erwin Gutawa", parentPhone: "081234567896", address: "Jl. Cempaka No. 23, Jakarta", roleInClass: "Anggota" },
  { id: "STD-008", nisn: "0081234568", name: "Hasan Basri", gender: "L", parentName: "Samsul Basri", parentPhone: "081234567897", address: "Jl. Flamboyan No. 5, Jakarta", roleInClass: "Anggota" },
  { id: "STD-009", nisn: "0081234569", name: "Indah Permatasari", gender: "P", parentName: "Agus Setiawan", parentPhone: "081234567898", address: "Jl. Teratai No. 14, Jakarta", roleInClass: "Anggota" },
  { id: "STD-010", nisn: "0081234570", name: "Kevin Sanjaya", gender: "L", parentName: "Rudi Haryanto", parentPhone: "081234567899", address: "Jl. Kencana No. 88, Jakarta", roleInClass: "Anggota" },
  { id: "STD-011", nisn: "0081234571", name: "Lestari Putri Wibowo", gender: "P", parentName: "Joko Wibowo", parentPhone: "081234567800", address: "Jl. Dahlia No. 31, Jakarta", roleInClass: "Anggota" },
  { id: "STD-012", nisn: "0081234572", name: "Muhammad Farhan", gender: "L", parentName: "Umar Farhan", parentPhone: "081234567801", address: "Jl. Kenanga No. 62, Jakarta", roleInClass: "Anggota" },
];

export const sampleSchedules: ScheduleItem[] = [
  { id: "SCH-1", day: "Senin", period: 1, timeSlot: "07:00 - 08:30", classId: "X-RPL-1", className: "X RPL 1", subject: "Informatika (Fase E)", room: "Lab Komputer 1", color: "blue" },
  { id: "SCH-2", day: "Senin", period: 3, timeSlot: "08:45 - 10:15", classId: "XI-RPL-2", className: "XI RPL 2", subject: "Pemrograman Web", room: "Lab Komputer 2", color: "emerald" },
  { id: "SCH-3", day: "Selasa", period: 2, timeSlot: "07:45 - 09:15", classId: "XII-RPL-1", className: "XII RPL 1", subject: "Pemrograman Berbasis Objek", room: "Lab Komputer 1", color: "violet" },
  { id: "SCH-4", day: "Rabu", period: 1, timeSlot: "07:00 - 08:30", classId: "X-RPL-1", className: "X RPL 1", subject: "Informatika (Fase E)", room: "Lab Komputer 1", color: "blue" },
  { id: "SCH-5", day: "Kamis", period: 4, timeSlot: "09:30 - 11:00", classId: "XI-RPL-2", className: "XI RPL 2", subject: "Basis Data", room: "Lab Komputer 3", color: "amber" },
  { id: "SCH-6", day: "Jumat", period: 1, timeSlot: "07:30 - 09:00", classId: "XII-RPL-1", className: "XII RPL 1", subject: "Proyek Kreatif & Kewirausahaan", room: "Ruang Teori 4", color: "rose" },
];

export const sampleAgendas: AgendaItem[] = [
  {
    id: "AGN-1",
    classId: "X-RPL-1",
    className: "X RPL 1",
    subject: "Informatika",
    fase: "E",
    element: "Berpikir Komputasional",
    cp: "Pada akhir fase E, peserta didik mampu menerapkan strategi algoritmik standar untuk menghasilkan beberapa solusi persoalan.",
    tp: "1.1 Mengidentifikasi masalah dan dekomposisi data secara sistematis.",
    atp: "ATP.E.1.1 - Dasar Dekomposisi & Pengenalan Pola",
    materi: "Dekomposisi, Abstraksi, dan Algoritma Pencarian",
    jp: 4,
    semester: "1",
    status: "Selesai",
  },
  {
    id: "AGN-2",
    classId: "X-RPL-1",
    className: "X RPL 1",
    subject: "Informatika",
    fase: "E",
    element: "Teknologi Informasi dan Komunikasi",
    cp: "Peserta didik mampu memanfaatkan berbagai aplikasi secara bersamaan dan optimal untuk berkomunikasi dan menghasilkan dokumen terintegrasi.",
    tp: "2.1 Membuat integrasi konten antar aplikasi perkantoran (Word, Excel, PPT).",
    atp: "ATP.E.2.1 - Integrasi Dokumen & Mail Merge",
    materi: "Fitur Lanjut Perangkat Lunak Perkantoran",
    jp: 6,
    semester: "1",
    status: "Proses",
  },
  {
    id: "AGN-3",
    classId: "XI-RPL-2",
    className: "XI RPL 2",
    subject: "Pemrograman Web",
    fase: "F",
    element: "Frontend Development",
    cp: "Pada akhir fase F, peserta didik mampu merancang dan mengimplementasikan antarmuka web interaktif berbasis HTML, CSS, dan JavaScript.",
    tp: "3.1 Membangun layout web responsif menggunakan Tailwind CSS dan Flexbox/Grid.",
    atp: "ATP.F.3.1 - Responsive Web Styling",
    materi: "Tailwind CSS Utility Framework",
    jp: 8,
    semester: "1",
    status: "Proses",
  },
];

export const sampleJournals: JournalItem[] = [
  {
    id: "JRN-1",
    date: "2026-07-28",
    classId: "X-RPL-1",
    className: "X RPL 1",
    subject: "Informatika",
    meetingNumber: 1,
    topic: "Pengenalan Berpikir Komputasional & Dekomposisi Masalah",
    totalStudents: 12,
    absentInfo: "Hadir: 11, Sakit: 1 (Budi Santoso), Izin: 0, Alpa: 0",
    obstacle: "Beberapa siswa masih canggung menyusun diagram alir algoritma.",
    solution: "Memberikan latihan kelompok dengan studi kasus kehidupan sehari-hari.",
    reflection: "Siswa sangat antusias saat simulasi permainan logika di papan tulis.",
  },
  {
    id: "JRN-2",
    date: "2026-07-29",
    classId: "XI-RPL-2",
    className: "XI RPL 2",
    subject: "Pemrograman Web",
    meetingNumber: 2,
    topic: "Desain Layout Web Responsif dengan Tailwind CSS",
    totalStudents: 10,
    absentInfo: "Hadir: 10, Sakit: 0, Izin: 0, Alpa: 0",
    obstacle: "Koneksi internet sempat lambat saat unduh modul online.",
    solution: "Menggunakan modul lokal yang sudah di-cache di komputer lab.",
    reflection: "Seluruh siswa berhasil menyelesaikan tugas pembuatan kartu profil.",
  },
];

export const sampleHomeroomStudents: HomeroomStudent[] = sampleStudents.map((std, index) => ({
  ...std,
  achievements: index % 3 === 0 ? ["Juara 1 LKS Informatika", "Pengurus OSIS"] : index % 2 === 0 ? ["Anggota Pramuka Bantara"] : [],
  guidanceNotes:
    index === 2
      ? [
          {
            id: "GN-1",
            date: "2026-07-20",
            topic: "Kedisiplinan & Kesehatan",
            description: "Siswa absen sakit 2 hari berturut-turut, orang tua sudah memberikan surat dokter.",
            followUp: "Mengingatkan siswa untuk menjaga stamina dan meminjam catatan teman.",
          },
        ]
      : [],
}));

export const sampleAssessments: AssessmentItem[] = sampleStudents.map((s, idx) => {
  const f1 = 80 + (idx % 5) * 4;
  const f2 = 82 + ((idx + 2) % 5) * 3;
  const f3 = 85 + (idx % 4) * 3;
  const lm1 = 78 + (idx % 6) * 4;
  const lm2 = 84 + ((idx + 1) % 4) * 3;
  const pts = 82 + (idx % 5) * 3;
  const pas = 85 + ((idx + 3) % 4) * 3;

  const avgFormatif = (f1 + f2 + f3) / 3;
  const avgSumatifLM = (lm1 + lm2) / 2;
  const finalGrade = Math.round(avgFormatif * 0.3 + avgSumatifLM * 0.3 + pts * 0.2 + pas * 0.2);

  let predicate: "A" | "B" | "C" | "D" = "B";
  if (finalGrade >= 88) predicate = "A";
  else if (finalGrade >= 78) predicate = "B";
  else if (finalGrade >= 68) predicate = "C";
  else predicate = "D";

  let narrative = "";
  if (predicate === "A") {
    narrative = `Menunjukkan penguasaan yang sangat baik dalam memahami konsep Informatika Kurikulum Merdeka serta terampil memecahkan masalah logika.`;
  } else if (predicate === "B") {
    narrative = `Menunjukkan penguasaan yang baik dalam mengidentifikasi masalah dan menyusun algoritma dasar.`;
  } else if (predicate === "C") {
    narrative = `Menunjukkan penguasaan yang cukup dalam materi dasar, perlu bimbingan lebih lanjut dalam pengodean praktis.`;
  } else {
    narrative = `Memerlukan pendampingan dan latihan remedial berkelanjutan untuk mencapai Kriteria Ketercapaian Tujuan Pembelajaran (KKTP).`;
  }

  return {
    id: `ASS-${s.id}`,
    studentId: s.id,
    studentName: s.name,
    classId: "X-RPL-1",
    subject: "Informatika",
    formatif: { TP1: f1, TP2: f2, TP3: f3 },
    sumatifLM: { LM1: lm1, LM2: lm2 },
    pts,
    pas,
    finalGrade,
    predicate,
    narrative,
  };
});

export const sampleAttendanceRecords: AttendanceRecord[] = sampleStudents.map((s, idx) => ({
  id: `ATT-REC-${s.id}-1`,
  date: "2026-07-28",
  classId: "X-RPL-1",
  className: "X RPL 1",
  subject: "Informatika",
  meetingNumber: 1,
  studentId: s.id,
  status: idx === 2 ? "S" : idx === 8 ? "I" : "H",
  notes: idx === 2 ? "Surat Dokter" : idx === 8 ? "Izin Acara Keluarga" : "",
}));

// Sample CP (Capaian Pembelajaran)
export const sampleCps: CpItem[] = [
  {
    id: "CP-001",
    subject: "Informatika",
    fase: "E",
    element: "Berpikir Komputasional (BK)",
    code: "CP.E.1",
    description: "Pada akhir fase E, peserta didik mampu menerapkan strategi algoritmik standar untuk menghasilkan beberapa solusi persoalan dengan data diskrit bervolume besar, serta mengkritisi efisiensi dan kebenaran algoritma.",
    targetJP: 24,
  },
  {
    id: "CP-002",
    subject: "Informatika",
    fase: "E",
    element: "Algoritma & Pemrograman (AP)",
    code: "CP.E.2",
    description: "Pada akhir fase E, peserta didik mampu mengimplementasikan dan mengeksekusi program berbasis teks atau visual dengan struktur kontrol percabangan, perulangan, serta fungsi modular.",
    targetJP: 36,
  },
  {
    id: "CP-003",
    subject: "Informatika",
    fase: "E",
    element: "Analisis Data (AD)",
    code: "CP.E.3",
    description: "Pada akhir fase E, peserta didik mampu mengolah data bervolume besar dari berbagai sumber, melakukan visualisasi data, serta menggunakan alat bantu analisis untuk mengambil keputusan berbasis data.",
    targetJP: 18,
  },
];

// Sample TP (Tujuan Pembelajaran)
export const sampleTps: TpItem[] = [
  {
    id: "TP-001",
    cpId: "CP-001",
    code: "TP 1.1",
    statement: "Peserta didik mampu mengidentifikasi dan menerapkan konsep dekomposisi serta pengenalan pola dalam memecahkan masalah sehari-hari secara sistematis.",
    kko: "Menerapkan [C3] & Menganalisis [C4]",
    scope: "Dekomposisi, Abstraksi, Pengenalan Pola",
    targetJP: 8,
  },
  {
    id: "TP-002",
    cpId: "CP-001",
    code: "TP 1.2",
    statement: "Peserta didik mampu merancang algoritma pencarian (Search) dan pengurutan (Sort) untuk mengorganisasikan data diskrit secara efisien.",
    kko: "Merancang [C6]",
    scope: "Algoritma Pencarian & Pengurutan",
    targetJP: 16,
  },
  {
    id: "TP-003",
    cpId: "CP-002",
    code: "TP 2.1",
    statement: "Peserta didik mampu menuliskan kode program sederhana dengan variabel, tipe data, dan operator aritmatika/logika menggunakan bahasa Python / C++.",
    kko: "Mengimplementasikan [C3]",
    scope: "Variabel, Tipe Data, I/O Program",
    targetJP: 12,
  },
  {
    id: "TP-004",
    cpId: "CP-002",
    code: "TP 2.2",
    statement: "Peserta didik mampu menerapkan struktur kontrol percabangan (if-else) dan perulangan (for/while) dalam menyelesaikan studi kasus simulasi.",
    kko: "Menerapkan [C3] & Menguji [C5]",
    scope: "Percabangan & Perulangan Program",
    targetJP: 24,
  },
];

// Sample ATP (Alur Tujuan Pembelajaran)
export const sampleAtps: AtpItem[] = [
  {
    id: "ATP-001",
    tpId: "TP-001",
    code: "ATP.E.1.1",
    semester: "1",
    order: 1,
    materi: "Prinsip Dasar Berpikir Komputasional & Studi Kasus Masalah Kompleks",
    jp: 8,
    pancasilaProfiles: ["Bernalar Kritis", "Kreatif"],
    keywords: "Dekomposisi, Abstraksi, Algoritma",
    assessmentMethod: "Tes Formatif Lisan & Lembar Kerja Praktikum",
  },
  {
    id: "ATP-002",
    tpId: "TP-002",
    code: "ATP.E.1.2",
    semester: "1",
    order: 2,
    materi: "Simulasi Algoritma Search (Binary vs Linear) dan Sort (Bubble vs Quick)",
    jp: 16,
    pancasilaProfiles: ["Bernalar Kritis", "Gotong Royong"],
    keywords: "Linear Search, Binary Search, Bubble Sort",
    assessmentMethod: "Penugasan Kelompok & Demonstration Test",
  },
  {
    id: "ATP-003",
    tpId: "TP-003",
    code: "ATP.E.2.1",
    semester: "1",
    order: 3,
    materi: "Pengenalan Sintaks Dasar Python, Input/Output, dan Tipe Data Primitif",
    jp: 12,
    pancasilaProfiles: ["Mandiri", "Bernalar Kritis"],
    keywords: "Python, Variables, Data Types, Print",
    assessmentMethod: "Praktikum Coding Mandiri",
  },
  {
    id: "ATP-004",
    tpId: "TP-004",
    code: "ATP.E.2.2",
    semester: "2",
    order: 4,
    materi: "Logika Percabangan Kompleks (Nested If) & Perulangan Bersarang (Nested Loop)",
    jp: 24,
    pancasilaProfiles: ["Bernalar Kritis", "Kreatif"],
    keywords: "If-Else, For Loop, While, Control Flow",
    assessmentMethod: "Projek Mini Pemrograman & Sumatif Akhir",
  },
];

// Sample KKTP & KKM (Kriteria Ketuntasan Minimal & Kriteria Ketercapaian Tujuan Pembelajaran)
export const sampleKktps: KktpItem[] = [
  {
    id: "KKTP-001",
    tpId: "TP-001",
    kkmKompleksitas: "Sedang",
    kkmDayaDukung: "Tinggi",
    kkmIntake: "Sedang",
    kkmValue: 78,
    approach: "Rubrik Deskriptif",
    intervalBelum: "Siswa belum mampu mengidentifikasi masalah dan elemen dekomposisi data (Nilai < 61)",
    intervalLayak: "Siswa mampu menyebutkan elemen masalah namun belum runtut dalam analisis pola (Nilai 61 - 75)",
    intervalCakap: "Siswa mampu melakukan dekomposisi dan menemukan pola masalah dengan tepat (Nilai 76 - 88)",
    intervalMahir: "Siswa mampu merekomendasikan solusi optimasi sistematis secara mandiri (Nilai 89 - 100)",
    remedialPlan: "Bimbingan perorangan dan latihan mandiri modul dekomposisi sederhana.",
    enrichmentPlan: "Pemberian tantangan studi kasus Olimpiade Sains Informatika (OSN).",
  },
  {
    id: "KKTP-002",
    tpId: "TP-002",
    kkmKompleksitas: "Tinggi",
    kkmDayaDukung: "Tinggi",
    kkmIntake: "Sedang",
    kkmValue: 75,
    approach: "Interval Nilai",
    intervalBelum: "Kurang dari 61%: Memerlukan remedial menyeluruh dari teori dasar pencarian data.",
    intervalLayak: "61% - 75%: Memerlukan latihan tambahan pada implementasi Binary Search.",
    intervalCakap: "76% - 88%: Telah mencapai Kriteria Ketercapaian Tujuan Pembelajaran.",
    intervalMahir: "89% - 100%: Diberikan pengayaan analisis kompleksitas waktu Big-O.",
    remedialPlan: "Tutor sebaya oleh siswa kategori Mahir dan praktikum ulang.",
    enrichmentPlan: "Pembuatan klip penjelasan visual algoritma sorting untuk media kelas.",
  },
];

// Sample Prota & Prosem
export const sampleProtaProsems: ProtaProsemItem[] = [
  {
    id: "PP-001",
    subject: "Informatika",
    fase: "E",
    semester: "1",
    month: "Juli",
    weekNumber: 3,
    tpCode: "TP 1.1",
    topic: "Orientasi & Pengenalan Berpikir Komputasional",
    jp: 4,
    activityType: "Tatap Muka",
  },
  {
    id: "PP-002",
    subject: "Informatika",
    fase: "E",
    semester: "1",
    month: "Agustus",
    weekNumber: 1,
    tpCode: "TP 1.2",
    topic: "Algoritma Pencarian & Pengurutan Data",
    jp: 8,
    activityType: "Tatap Muka",
  },
  {
    id: "PP-003",
    subject: "Informatika",
    fase: "E",
    semester: "1",
    month: "September",
    weekNumber: 2,
    tpCode: "PTS",
    topic: "Asesmen Sumatif Tengah Semester Ganjil",
    jp: 4,
    activityType: "Asesmen Sumatif",
  },
];
