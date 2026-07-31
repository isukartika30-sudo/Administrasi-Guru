import React, { useState } from "react";
import { SchoolProfile } from "../types";
import {
  saveProfile,
  getUserApiKey,
  saveUserApiKey,
  exportBackupJSON,
  importBackupJSON,
  resetAllData,
} from "../utils/storage";
import { Settings, X, Key, Save, Download, Upload, RotateCcw, CheckCircle2 } from "lucide-react";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: SchoolProfile;
  onProfileUpdate: (updated: SchoolProfile) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  profile,
  onProfileUpdate,
}) => {
  if (!isOpen) return null;

  const [teacherName, setTeacherName] = useState<string>(profile.teacherName);
  const [nip, setNip] = useState<string>(profile.nip);
  const [schoolName, setSchoolName] = useState<string>(profile.schoolName);
  const [subject, setSubject] = useState<string>(profile.subject);
  const [homeroomClass, setHomeroomClass] = useState<string>(profile.homeroomClass);
  const [academicYear, setAcademicYear] = useState<string>(profile.academicYear);
  const [principalName, setPrincipalName] = useState<string>(profile.principalName);
  const [principalNip, setPrincipalNip] = useState<string>(profile.principalNip);
  const [city, setCity] = useState<string>(profile.city);

  const [apiKey, setApiKey] = useState<string>(getUserApiKey());
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: SchoolProfile = {
      ...profile,
      teacherName,
      nip,
      schoolName,
      subject,
      homeroomClass,
      academicYear,
      principalName,
      principalNip,
      city,
    };

    saveProfile(updated);
    saveUserApiKey(apiKey);
    onProfileUpdate(updated);

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1500);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const ok = importBackupJSON(content);
        if (ok) {
          alert("Backup data berhasil diimpor! Halaman akan dimuat ulang.");
          window.location.reload();
        } else {
          alert("Gagal mengimpor file backup. Format tidak valid.");
        }
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#2D3126]/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-[#E2DDD0] space-y-6 my-8">
        <div className="flex items-center justify-between border-b border-[#F0EEE4] pb-3">
          <h3 className="font-bold text-[#2D3127] text-lg flex items-center gap-2">
            <Settings className="w-5 h-5 text-[#588157]" />
            Pengaturan Profil Guru & Integrasi AI
          </h3>
          <button
            onClick={onClose}
            className="p-1 text-[#8C8F82] hover:text-[#2D3127] rounded cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {savedSuccess && (
          <div className="bg-[#E9EDC9] border border-[#A3B18A] text-[#3D4035] p-3 rounded-xl text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#588157]" />
            <span>Pengaturan berhasil disimpan!</span>
          </div>
        )}

        <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
          {/* Profile Section */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-[#D4A373] border-b border-[#F0EEE4] pb-1">
              Data Profil Guru & Sekolah
            </h4>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-[#3D4035] mb-1">Nama Lengkap Guru</label>
                <input
                  type="text"
                  value={teacherName}
                  onChange={(e) => setTeacherName(e.target.value)}
                  className="w-full bg-[#F9F8F3] border border-[#D8D4C7] rounded-xl px-3 py-2 text-[#2D3127]"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold text-[#3D4035] mb-1">NIP Guru</label>
                <input
                  type="text"
                  value={nip}
                  onChange={(e) => setNip(e.target.value)}
                  className="w-full bg-[#F9F8F3] border border-[#D8D4C7] rounded-xl px-3 py-2 text-[#2D3127]"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-[#3D4035] mb-1">Nama Satuan Pendidikan / Sekolah</label>
                <input
                  type="text"
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  className="w-full bg-[#F9F8F3] border border-[#D8D4C7] rounded-xl px-3 py-2 text-[#2D3127]"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold text-[#3D4035] mb-1">Mata Pelajaran Utama</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-[#F9F8F3] border border-[#D8D4C7] rounded-xl px-3 py-2 text-[#2D3127]"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold text-[#3D4035] mb-1">Kelas Perwalian</label>
                <input
                  type="text"
                  value={homeroomClass}
                  onChange={(e) => setHomeroomClass(e.target.value)}
                  className="w-full bg-[#F9F8F3] border border-[#D8D4C7] rounded-xl px-3 py-2 text-[#2D3127]"
                />
              </div>
              <div>
                <label className="block font-semibold text-[#3D4035] mb-1">Tahun Ajaran</label>
                <input
                  type="text"
                  value={academicYear}
                  onChange={(e) => setAcademicYear(e.target.value)}
                  className="w-full bg-[#F9F8F3] border border-[#D8D4C7] rounded-xl px-3 py-2 text-[#2D3127]"
                />
              </div>
              <div>
                <label className="block font-semibold text-[#3D4035] mb-1">Kota / Kabupaten</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-[#F9F8F3] border border-[#D8D4C7] rounded-xl px-3 py-2 text-[#2D3127]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block font-semibold text-[#3D4035] mb-1">Nama Kepala Sekolah</label>
                <input
                  type="text"
                  value={principalName}
                  onChange={(e) => setPrincipalName(e.target.value)}
                  className="w-full bg-[#F9F8F3] border border-[#D8D4C7] rounded-xl px-3 py-2 text-[#2D3127]"
                />
              </div>
              <div>
                <label className="block font-semibold text-[#3D4035] mb-1">NIP Kepala Sekolah</label>
                <input
                  type="text"
                  value={principalNip}
                  onChange={(e) => setPrincipalNip(e.target.value)}
                  className="w-full bg-[#F9F8F3] border border-[#D8D4C7] rounded-xl px-3 py-2 text-[#2D3127]"
                />
              </div>
            </div>
          </div>

          {/* Gemini API Key Section */}
          <div className="space-y-2 pt-2 border-t border-[#F0EEE4]">
            <h4 className="font-bold text-xs uppercase tracking-wider text-[#D4A373] flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5" /> Konfigurasi API Key Gemini
            </h4>
            <p className="text-[11px] text-[#6B6E60]">
              Secara bawaan server AI Studio mengunci kredensial teraman di lingkungan server. Jika Anda ingin menyertakan API Key khusus:
            </p>

            <input
              type="password"
              placeholder="Masukkan Kunci API Gemini pengguna (opsional)..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full bg-[#F9F8F3] border border-[#D8D4C7] rounded-xl px-3 py-2 text-[#2D3127] font-mono text-xs focus:ring-2 focus:ring-[#D4A373]"
            />
          </div>

          {/* Backup & Restore Data */}
          <div className="space-y-3 pt-2 border-t border-[#F0EEE4]">
            <h4 className="font-bold text-xs uppercase tracking-wider text-[#3D4035]">
              Penyimpanan Backup & Pemulihan Data
            </h4>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={exportBackupJSON}
                className="flex items-center gap-2 bg-[#F4F2EA] hover:bg-[#EFECE1] text-[#3D4035] px-3.5 py-2 rounded-xl font-semibold transition cursor-pointer"
              >
                <Download className="w-4 h-4 text-[#588157]" />
                Unduh Backup Data (.JSON)
              </button>

              <label className="flex items-center gap-2 bg-[#F4F2EA] hover:bg-[#EFECE1] text-[#3D4035] px-3.5 py-2 rounded-xl font-semibold transition cursor-pointer">
                <Upload className="w-4 h-4 text-[#588157]" />
                Pulihkan Data dari File JSON
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportFile}
                  className="hidden"
                />
              </label>

              <button
                type="button"
                onClick={() => {
                  if (confirm("Reset ulang seluruh data administrasi ke pengaturan awal pabrik?")) {
                    resetAllData();
                  }
                }}
                className="flex items-center gap-2 bg-[#F8D7DA] hover:bg-[#f3c1c6] text-[#842029] border border-[#F5C2C7] px-3.5 py-2 rounded-xl font-semibold transition cursor-pointer ml-auto"
              >
                <RotateCcw className="w-4 h-4" />
                Reset Data Awal
              </button>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-2 border-t border-[#F0EEE4]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-[#F4F2EA] text-[#3D4035] rounded-xl font-semibold cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2 bg-[#D4A373] hover:bg-[#c29263] text-[#2D3127] font-bold rounded-xl cursor-pointer shadow-2xs"
            >
              <Save className="w-4 h-4" />
              Simpan Pengaturan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
