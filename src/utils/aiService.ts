import { getUserApiKey } from "./storage";

export interface AiRequestOptions {
  prompt: string;
  systemInstruction?: string;
  jsonOutput?: boolean;
  responseSchema?: any;
}

export const callGeminiAi = async (options: AiRequestOptions): Promise<string> => {
  const userApiKey = getUserApiKey();

  try {
    const response = await fetch("/api/ai/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: options.prompt,
        systemInstruction: options.systemInstruction,
        userApiKey: userApiKey || undefined,
        jsonOutput: options.jsonOutput,
        responseSchema: options.responseSchema,
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.error || "Gagal menghasilkan konten AI.");
    }

    return data.text || "";
  } catch (error: any) {
    console.error("AI Generation Error:", error);
    throw new Error(
      error?.message || "Tidak dapat terhubung ke Asisten AI. Pastikan server aktif dan API Key valid."
    );
  }
};

// Preset Kurikulum Merdeka Generators
export const aiGenerators = {
  // 0. Generator Perangkat Ajar Lengkap (CP, TP, ATP, KKTP, Modul Ajar, LKPD)
  perangkatAjar: async (params: {
    subject: string;
    fase: string;
    gradeClass: string;
    topic: string;
    cpText: string;
    pancasilaProfiles: string[];
    durationJP: number;
  }) => {
    const systemInstruction = `Kamu adalah Pakar Utama Pengembang Perangkat Ajar Kurikulum Merdeka Kementerian Pendidikan Indonesia. Tugasmu adalah menyusun Paket Lengkap Perangkat Ajar yang terintegrasi secara runtut, logis, dan profesional.`;

    const prompt = `Buatkan Paket Lengkap Perangkat Ajar Kurikulum Merdeka dengan spesifikasi berikut:
- Mata Pelajaran: ${params.subject}
- Kelas / Fase: ${params.gradeClass} / Fase ${params.fase}
- Topik / Materi Utama: ${params.topic}
- Capaian Pembelajaran (CP) Acuan: "${params.cpText}"
- Dimensi Profil Pelajar Pancasila: ${params.pancasilaProfiles.join(", ")}
- Alokasi Waktu: ${params.durationJP} JP

Format Keluaran Dokumen Lengkap:
=== BAGIAN 1: RUMUSAN TUJUAN PEMBELAJARAN (TP) ===
- Lingkup Materi & Kompetensi Utama
- Daftar Rumusan TP (TP 1, TP 2, dst) terukur dengan Taksonomi Bloom.

=== BAGIAN 2: ALUR TUJUAN PEMBELAJARAN (ATP) ===
- Tabel Alur Pembelajaran (No, Kode TP, Materi, JP, Kata Kunci, Profil Pancasila, Glosarium).

=== BAGIAN 3: KRITERIA KETERCAPAIAN TUJUAN PEMBELAJARAN (KKTP) ===
- Pendekatan Rubrik / Interval Ketercapaian (Belum Berkembang, Layak, Cakap, Mahir).

=== BAGIAN 4: MODUL AJAR (RPP) DENGAN SINTAKS LENGKAP ===
- Informasi Umum, Pertanyaan Pemantik, Langkah Kegiatan (Pendahuluan, Inti, Penutup), Asesmen.

=== BAGIAN 5: DRAF LEMBAR KERJA PESERTA DIDIK (LKPD) ===
- Lembar Kegiatan Siswa, Tugas Diskusi / Praktikum, dan Panduan Penskoran.`;

    return callGeminiAi({ prompt, systemInstruction });
  },

  // 1. Modul Ajar Generator (RPP Kurikulum Merdeka)
  modulAjar: async (params: {
    subject: string;
    fase: string;
    topic: string;
    cpText?: string;
    pancasilaProfiles: string[];
    durationJP: number;
    gradeClass: string;
  }) => {
    const systemInstruction = `Kamu adalah Asisten AI Spesialis Pengembang Kurikulum Merdeka Kementerian Pendidikan Indonesia. Tugasmu adalah menyusun Modul Ajar RPP Kurikulum Merdeka yang sangat detail, profesional, terstruktur, dan siap pakai. Gunakan Bahasa Indonesia formal dan ramah pedagogis.`;

    const prompt = `Buatkan Modul Ajar (RPP) Kurikulum Merdeka yang komprehensif dengan rincian berikut:
- Mata Pelajaran: ${params.subject}
- Kelas / Fase: ${params.gradeClass} / Fase ${params.fase}
- Topik / Materi Utama: ${params.topic}
${params.cpText ? `- Acuan Capaian Pembelajaran (CP): "${params.cpText}"` : ""}
- Dimensi Profil Pelajar Pancasila: ${params.pancasilaProfiles.join(", ")}
- Alokasi Waktu: ${params.durationJP} Jam Pelajaran (JP)

Struktur Modul Ajar yang WAJIB dimuat:
1. INFORMASI UMUM (Identitas Modul, Kompetensi Awal, Profil Pelajar Pancasila, Sarana & Prasarana, Target Peserta Didik, Model Pembelajaran)
2. KOMPONEN INTI:
   - Capaian Pembelajaran (CP) & Tujuan Pembelajaran (TP)
   - Pemahaman Bermakna
   - Pertanyaan Pemantik (3-4 pertanyaan penggugah kognitif)
   - Kegiatan Pembelajaran Detail (Pendahuluan, Kegiatan Inti dengan sintaks model pembelajaran, Penutup & Refleksi)
   - Asesmen Pembelajaran (Asesmen Diagnostik, Formatif, dan Sumatif)
3. LAMPIRAN:
   - Lembar Kerja Peserta Didik (LKPD) Singkat
   - Bahan Bacaan Guru & Peserta Didik
   - Glosarium & Daftar Pustaka`;

    return callGeminiAi({ prompt, systemInstruction });
  },

  // 2. Generator Tujuan Pembelajaran (TP)
  tp: async (params: {
    subject: string;
    fase: string;
    gradeClass: string;
    cpText: string;
    element?: string;
  }) => {
    const systemInstruction = `Kamu adalah Ahli Pengembang Kurikulum Merdeka. Tugasmu adalah menganalisis Capaian Pembelajaran (CP) dan menurunkannya menjadi Tujuan Pembelajaran (TP) yang logis, sistematis, operasional, dan terukur berdasarkan Taksonomi Bloom terkini.`;

    const prompt = `Rumuskan Tujuan Pembelajaran (TP) Kurikulum Merdeka berdasarkan acuan CP berikut:
- Mata Pelajaran: ${params.subject}
- Kelas / Fase: ${params.gradeClass} / Fase ${params.fase}
${params.element ? `- Elemen Pembelajaran: ${params.element}` : ""}
- Capaian Pembelajaran (CP): "${params.cpText}"

Struktur Dokumen Hasil Rumusan TP:
1. ANALISIS CP:
   - Kompetensi Utama (Kata Kerja Operasional / KKO)
   - Lingkup Materi Esensial
2. DAFTAR RUMUSAN TUJUAN PEMBELAJARAN (TP):
   - TP 1.1, TP 1.2, TP 1.3, dst. (Disertai KKO & Alasan Pemilihan Tingkat Kognitif)
3. PEMETAAN ALOKASI WAKTU (JP) DENGAN TINGKAT KESULITAN MATERI`;

    return callGeminiAi({ prompt, systemInstruction });
  },

  // 3. Generator Alur Tujuan Pembelajaran (ATP)
  atp: async (params: {
    subject: string;
    fase: string;
    gradeClass: string;
    cpText: string;
    totalJP: number;
  }) => {
    const systemInstruction = `Kamu adalah Spesialis Perencana Kurikulum Merdeka. Buatlah Alur Tujuan Pembelajaran (ATP) dalam bentuk susunan alur logis dari awal hingga akhir fase.`;

    const prompt = `Susun Alur Tujuan Pembelajaran (ATP) Kurikulum Merdeka untuk 1 Tahun Ajaran:
- Mata Pelajaran: ${params.subject}
- Kelas / Fase: ${params.gradeClass} / Fase ${params.fase}
- Capaian Pembelajaran (CP) Utama: "${params.cpText}"
- Target Total Alokasi Waktu: ${params.totalJP} JP

Format Keluaran ATP:
1. RATIONAL DAN CAPAIAN PEMBELAJARAN FASE
2. TABEL STRUKTUR ATP (Lengkap dengan kolom: No, Kode TP, Rumusan Tujuan Pembelajaran, Materi Utama, Alokasi JP, Profil Pelajar Pancasila, Glosarium / Kata Kunci)
3. ALUR URUTAN PEMBELAJARAN SEMESTER 1 & SEMESTER 2`;

    return callGeminiAi({ prompt, systemInstruction });
  },

  // 4. Generator Lembar Kerja Peserta Didik (LKPD)
  lkpd: async (params: {
    subject: string;
    gradeClass: string;
    topic: string;
    cpText?: string;
    activityType: string; // e.g. "Diskusi Kelompok", "Eksperimen / Praktikum", "Studi Kasus", "Proyek"
  }) => {
    const systemInstruction = `Kamu adalah Pengembang Media & Bahan Ajar Kreatif Kurikulum Merdeka. Susun Lembar Kerja Peserta Didik (LKPD) yang menarik, interaktif, memicu cara berpikir kritis, dan siap dicetak.`;

    const prompt = `Buatkan Lembar Kerja Peserta Didik (LKPD) Kurikulum Merdeka yang siap pakai dan dicetak:
- Mata Pelajaran: ${params.subject}
- Kelas: ${params.gradeClass}
- Topik / Judul Aktivitas: ${params.topic}
${params.cpText ? `- Capaian Pembelajaran (CP): "${params.cpText}"` : ""}
- Bentuk Aktivitas: ${params.activityType}

Struktur LKPD yang WAJIB ada:
1. IDENTITAS (Nama Kelompok, Anggota, Kelas, Hari/Tanggal)
2. PETUNJUK PENGGUNAAN LKPD
3. TUJUAN AKTIVITAS PEMBELAJARAN
4. ALAT, BAHAN, ATAU STIMULUS (Wacana / Gambar / Kasus)
5. LANGKAH-LANGKAH KERJA / INTRUKSI TUGAS (Sistematis & Jelas)
6. LEMBAR PENGAMATAN & DISKUSI (Pertanyaan Pemantik & Kolom Jawaban)
7. KESIMPULAN & REFLEKSI MANDIRI
8. RUBRIK PENSKORAN & EVALUASI GURU`;

    return callGeminiAi({ prompt, systemInstruction });
  },

  // 5. Generator KKTP (Kriteria Ketercapaian Tujuan Pembelajaran)
  kktp: async (params: {
    subject: string;
    gradeClass: string;
    topic: string;
    tpText: string;
    approachType: "Rubrik Deskriptif" | "Interval Nilai" | "Skala Deskripsi" | "Campuran";
  }) => {
    const systemInstruction = `Kamu adalah Evaluator Pendidikan Kurikulum Merdeka. Susun Kriteria Ketercapaian Tujuan Pembelajaran (KKTP) yang objektif, transparan, dan membantu guru memberikan umpan balik bermakna.`;

    const prompt = `Buatkan rancangan KKTP (Kriteria Ketercapaian Tujuan Pembelajaran) Kurikulum Merdeka:
- Mata Pelajaran: ${params.subject}
- Kelas: ${params.gradeClass}
- Topik / Materi: ${params.topic}
- Tujuan Pembelajaran (TP): "${params.tpText}"
- Pendekatan KKTP: ${params.approachType}

Format Hasil KKTP:
1. DESKRIPSI KRITERIA KETERCAPAIAN
2. TABEL RUBRIK KETERCAPAIAN (Kategori: Belum Berkembang [0-60], Layak [61-75], Cakap [76-88], Mahir [89-100])
3. PANDUAN INTERVENSI DAN TINDAK LANJUT (Aksi Remedial untuk yang belum mencapai kriteria & Pengayaan untuk kategori Mahir)
4. LEMBAR CATATAN UMPAN BALIK GURU (Form Refleksi Singkat)`;

    return callGeminiAi({ prompt, systemInstruction });
  },

  // 6. Generator Prota & Prosem (Program Tahunan & Program Semester)
  protaProsem: async (params: {
    subject: string;
    fase: string;
    gradeClass: string;
    academicYear: string;
    totalJPEffective: number;
    cpText: string;
  }) => {
    const systemInstruction = `Kamu adalah Perencana Kurikulum Sekolah. Susun Program Tahunan (PROTA) dan Program Semester (PROSEM) Kurikulum Merdeka secara akurat, terstruktur, dan realistis sesuai kalender pendidikan.`;

    const prompt = `Susun Dokumen Program Tahunan (PROTA) & Program Semester (PROSEM) Kurikulum Merdeka:
- Mata Pelajaran: ${params.subject}
- Kelas / Fase: ${params.gradeClass} / Fase ${params.fase}
- Tahun Ajaran: ${params.academicYear}
- Total Jam Efektif Pertahun: ${params.totalJPEffective} JP
- Acuan Capaian Pembelajaran (CP): "${params.cpText}"

Rincian Keluaran:
=== BAGIAN 1: PROGRAM TAHUNAN (PROTA) ===
- Matriks Distribusi Elemen, CP, TP, dan Alokasi Waktu (JP) untuk Semester 1 (Ganjil) & Semester 2 (Genap).

=== BAGIAN 2: PROGRAM SEMESTER (PROSEM) ===
- Pemetaan Distribusi JP per Bulan (Semester 1: Juli-Desember & Semester 2: Januari-Juni).
- Penjadwalan Asesmen Sumatif Lingkup Materi, PTS/PAS, serta Cadangan Jam Efektif.`;

    return callGeminiAi({ prompt, systemInstruction });
  },

  // 2. Soal & Kunci Jawaban Generator (HOTS/LOTS)
  soalQuiz: async (params: {
    subject: string;
    gradeClass: string;
    topic: string;
    questionCount: number;
    questionType: "pilihan_ganda" | "essay" | "campuran";
    difficulty: "LOTS" | "MTS" | "HOTS" | "campuran";
  }) => {
    const systemInstruction = `Kamu adalah Pakar Pembuat Soal Evaluasi Pembelajaran EdTech Kurikulum Merdeka. Buat soal-soal berkualitas tinggi lengkap dengan kisi-kisi, kunci jawaban, dan pembahasan mendalam.`;

    const prompt = `Buatkan paket soal evaluasi pembelajaran Kurikulum Merdeka dengan spesifikasi:
- Mata Pelajaran: ${params.subject}
- Kelas: ${params.gradeClass}
- Topik: ${params.topic}
- Jumlah Soal: ${params.questionCount} soal
- Bentuk Soal: ${params.questionType}
- Tingkat Kesulitan: ${params.difficulty} (Higher Order Thinking Skills)

Format keluaran:
1. KISI-KISI SINGKAT (Indikator Soal & Level Kognitif C1-C6)
2. DAFTAR SOAL (Rapi, bernomor, dan opsi A,B,C,D,E jika Pilihan Ganda)
3. KUNCI JAWABAN DAN PEMBAHASAN DETAIL`;

    return callGeminiAi({ prompt, systemInstruction });
  },

  // 3. Asesmen Diagnostik & Remedial Strategy Generator
  asesmenDiagnostik: async (params: {
    subject: string;
    gradeClass: string;
    topic: string;
    learningDifficulties?: string;
  }) => {
    const systemInstruction = `Kamu adalah Konsultan Psikologi Pendidikan dan Spesialis Pembelajaran Berdiferensiasi Kurikulum Merdeka.`;

    const prompt = `Buatkan rancangan Asesmen Diagnostik Non-Kognitif & Kognitif serta Strategi Pembelajaran Berdiferensiasi / Remedial:
- Mata Pelajaran: ${params.subject}
- Kelas: ${params.gradeClass}
- Topik / Capaian: ${params.topic}
${params.learningDifficulties ? `- Kendala Belajar Siswa: ${params.learningDifficulties}` : ""}

Rancangan harus memuat:
1. Instrumen Asesmen Diagnostik Kognitif Awal (5 pertanyaan singkat untuk mengukur kesiapan belajar)
2. Pemetaan Kelompok Belajar (Kelompok Perlu Bimbingan, Cukup, dan Mahir)
3. Strategi Pembelajaran Berdiferensiasi (Diferensiasi Konten, Proses, dan Produk)
4. Panduan Kegiatan Remedial & Pengayaan`;

    return callGeminiAi({ prompt, systemInstruction });
  },

  // 4. Catatan Wali Kelas Generator
  catatanWali: async (params: {
    studentName: string;
    academicPerformance: string; // e.g. "Sangat Baik di Logika, perlu tingkatkan kedisiplinan"
    characterTrait: string;
    attendanceSummary: string;
  }) => {
    const systemInstruction = `Kamu adalah Wali Kelas Senior yang ahli menyusun Catatan Rapor Kurikulum Merdeka yang santun, membangun motivasi, dan objektif.`;

    const prompt = `Buatkan 3 alternatif opsi Catatan Wali Kelas untuk Rapor Siswa Kurikulum Merdeka:
- Nama Siswa: ${params.studentName}
- Capaian Akademik: ${params.academicPerformance}
- Karakter & Kehadiran: ${params.characterTrait} (Rincian Absensi: ${params.attendanceSummary})

Buatkan 3 pilihan gaya narasi:
Opsi A: Formal & Penuh Apresiasi (Sangat cocok untuk siswa berprestasi)
Opsi B: Konstruktif & Penuh Motivasi (Sangat cocok untuk siswa rata-rata / berkembang)
Opsi C: Empatis & Fokus Perbaikan (Sangat cocok untuk siswa yang butuh dorongan ekstra)`;

    return callGeminiAi({ prompt, systemInstruction });
  },

  // 5. Konsultasi AI Guru
  chatGuru: async (userMessage: string, history: Array<{ role: "user" | "model"; text: string }> = []) => {
    const systemInstruction = `Kamu adalah "Asisten AI Guru NUsantara", rekan diskusi guru profesional Kurikulum Merdeka. Kamu siap membantu menjawab pertanyaan seputar Kurikulum Merdeka, administrasi guru, strategi pengajaran kreatif, P5 (Projek Penguatan Profil Pelajar Pancasila), penanganan siswa, dan teknologi pembelajaran.`;

    const formattedHistory = history
      .map((h) => `${h.role === "user" ? "Guru" : "Asisten AI"}: ${h.text}`)
      .join("\n");

    const prompt = formattedHistory
      ? `${formattedHistory}\nGuru: ${userMessage}\nAsisten AI:`
      : `Guru: ${userMessage}\nAsisten AI:`;

    return callGeminiAi({ prompt, systemInstruction });
  },
};
