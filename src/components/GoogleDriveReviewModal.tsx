import React, { useState } from "react";
import { SikepoItem, SchoolProfile, AuthUser } from "../types";
import { generateRhkPdf } from "../utils/pdfGenerator";
import {
  FolderOpen,
  FileText,
  Download,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  X,
  Sparkles,
  Info,
  Image as ImageIcon,
  Check,
  Eye,
  RefreshCw,
  Link as LinkIcon,
  Save,
  UserCheck
} from "lucide-react";

interface GoogleDriveReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: SikepoItem[];
  profile: SchoolProfile;
  driveFolder: string;
  currentUser?: AuthUser;
  onUpdateUserDriveUrl?: (url: string) => void;
}

export const GoogleDriveReviewModal: React.FC<GoogleDriveReviewModalProps> = ({
  isOpen,
  onClose,
  items,
  profile,
  driveFolder,
  currentUser,
  onUpdateUserDriveUrl,
}) => {
  const [selectedFolderFilter, setSelectedFolderFilter] = useState<string>(driveFolder || "Semua");
  const [previewItem, setPreviewItem] = useState<SikepoItem | null>(null);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // User's custom Google Drive URL state
  const userDriveUrl = currentUser?.driveFolderUrl || "https://drive.google.com/drive/u/0/my-drive";
  const [customDriveInput, setCustomDriveInput] = useState<string>(userDriveUrl);
  const [isEditingUrl, setIsEditingUrl] = useState<boolean>(false);
  const [urlSavedNotice, setUrlSavedNotice] = useState<boolean>(false);

  if (!isOpen) return null;

  // Group items by drive folder
  const folders = Array.from(new Set(items.map((i) => i.driveFolder || "SIKEPO_2026/Agustus")));

  const filteredItems =
    selectedFolderFilter === "Semua"
      ? items
      : items.filter((i) => (i.driveFolder || "SIKEPO_2026/Agustus") === selectedFolderFilter);

  const handleDownloadPdf = (item: SikepoItem) => {
    generateRhkPdf(item, profile);
  };

  const handleDownloadAllPdf = () => {
    filteredItems.forEach((item, idx) => {
      setTimeout(() => {
        generateRhkPdf(item, profile);
      }, idx * 400);
    });
  };

  const handleSaveDriveUrl = () => {
    if (onUpdateUserDriveUrl && customDriveInput.trim()) {
      onUpdateUserDriveUrl(customDriveInput.trim());
      setUrlSavedNotice(true);
      setIsEditingUrl(false);
      setTimeout(() => setUrlSavedNotice(false), 3000);
    }
  };

  const handleCopyGuide = () => {
    const text = `Panduan Upload File Ke Google Drive Akun (${currentUser?.name || profile.teacherName}):\n1. Buka Google Drive Akun Anda (${customDriveInput})\n2. Buat / Buka Folder "${selectedFolderFilter}"\n3. Seret (Drag & Drop) berkas PDF yang telah diunduh dari SIKEPO ke dalam folder tersebut.`;
    navigator.clipboard.writeText(text);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#FAF9F5] border border-[#E2DDD0] rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto relative">
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-[#E2DDD0] pb-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8F0FE] text-[#174EA6] font-bold text-xs border border-[#D2E3FC]">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Sistem Review & Validasi Berkas Drive
            </div>
            <h2 className="text-xl font-bold text-[#2D3127] flex items-center gap-2">
              <FolderOpen className="w-5 h-5 text-[#1A73E8]" />
              Pengecekan Folder & Konversi PDF Google Drive
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#E2DDD0] text-[#8C8F82] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Informational Alert Box */}
        <div className="bg-[#E8F0FE] border border-[#D2E3FC] p-4 rounded-2xl text-xs space-y-2 text-[#174EA6]">
          <div className="font-bold flex items-center gap-2 text-sm">
            <Info className="w-4 h-4 shrink-0" />
            Mengapa Berkas Perlu Dikonversi & Disinkronkan Manual ke Google Drive?
          </div>
          <p className="leading-relaxed">
            Keamanan browser membatasi pengunggahan otomatis ke akun Google Drive pribadi tanpa otorisasi langsung OAuth. 
            Aplikasi ini **secara otomatis mengonversi data RHK & foto bukti dukung Anda menjadi PDF resmi** siap unggah. Anda dapat mengunduh berkas PDF ini dan menempatkannya di folder Google Drive yang sesuai.
          </p>
        </div>

        {/* Folder Filter Selector */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-[#3D4035]">Pilih Folder Google Drive Untuk Direview:</label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedFolderFilter("Semua")}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer border ${
                selectedFolderFilter === "Semua"
                  ? "bg-[#3D4035] text-white border-[#3D4035]"
                  : "bg-white text-[#3D4035] border-[#D8D4C7] hover:bg-[#F2EFE6]"
              }`}
            >
              Semua Folder ({items.length})
            </button>

            {folders.map((f) => {
              const count = items.filter((i) => (i.driveFolder || "SIKEPO_2026/Agustus") === f).length;
              return (
                <button
                  key={f}
                  onClick={() => setSelectedFolderFilter(f)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer border flex items-center gap-1.5 ${
                    selectedFolderFilter === f
                      ? "bg-[#1A73E8] text-white border-[#1A73E8]"
                      : "bg-white text-[#174EA6] border-[#D2E3FC] hover:bg-[#E8F0FE]"
                  }`}
                >
                  <FolderOpen className="w-3.5 h-3.5" />
                  {f} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* User Personal Google Drive Configuration Card */}
        <div className="bg-white p-4 rounded-2xl border border-[#D2E3FC] shadow-2xs space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-[#174EA6]" />
              <span className="font-bold text-xs text-[#2D3127]">
                Google Drive Akun Guru: <span className="text-[#174EA6] font-extrabold">{currentUser?.name || profile.teacherName}</span>
              </span>
            </div>

            <button
              onClick={() => setIsEditingUrl(!isEditingUrl)}
              className="text-xs text-[#174EA6] hover:underline font-bold self-start sm:self-auto cursor-pointer"
            >
              {isEditingUrl ? "Tutup Pengaturan Link" : "Ubah Link Folder Drive Masing-Masing"}
            </button>
          </div>

          {isEditingUrl ? (
            <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
              <div className="relative flex-1 w-full">
                <LinkIcon className="w-3.5 h-3.5 text-[#8C8F82] absolute left-3 top-3" />
                <input
                  type="url"
                  value={customDriveInput}
                  onChange={(e) => setCustomDriveInput(e.target.value)}
                  placeholder="misal: https://drive.google.com/drive/folders/1abc... atau https://drive.google.com"
                  className="w-full bg-[#FAF9F5] border border-[#D8D4C7] pl-8 pr-3 py-2 rounded-xl text-xs text-[#2D3127]"
                />
              </div>
              <button
                onClick={handleSaveDriveUrl}
                className="px-4 py-2 bg-[#174EA6] hover:bg-[#1557B0] text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shrink-0 cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" /> Simpan Link Akun
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between text-xs bg-[#FAF9F5] p-2.5 rounded-xl border border-[#E2DDD0]">
              <div className="truncate text-[#6B6E60] max-w-md">
                Tersambung ke: <span className="font-mono text-[#2D3127] font-semibold">{userDriveUrl}</span>
              </div>
              {urlSavedNotice && (
                <span className="text-emerald-600 font-bold text-[11px] flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Tersimpan ke Akun Anda!
                </span>
              )}
            </div>
          )}
        </div>

        {/* Action Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-[#F2EFE6] p-3.5 rounded-2xl border border-[#E2DDD0]">
          <div className="text-xs font-bold text-[#2D3127] flex items-center gap-2">
            <span>Menampilkan {filteredItems.length} berkas di {selectedFolderFilter}</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleCopyGuide}
              className="px-3.5 py-2 bg-white border border-[#D8D4C7] text-[#3D4035] rounded-xl font-bold text-xs hover:bg-[#FAF9F5] transition flex items-center gap-1.5 cursor-pointer"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Info className="w-3.5 h-3.5 text-[#1A73E8]" />}
              {copiedLink ? "Panduan Disalin!" : "Panduan Upload"}
            </button>

            <button
              onClick={handleDownloadAllPdf}
              className="px-4 py-2 bg-[#1A73E8] hover:bg-[#1557B0] text-white rounded-xl font-bold text-xs transition flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Download className="w-4 h-4" />
              Unduh Semua PDF ({filteredItems.length})
            </button>

            <a
              href={userDriveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-[#174EA6] hover:bg-[#1557B0] text-white rounded-xl font-bold text-xs transition flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <ExternalLink className="w-4 h-4" /> Buka Google Drive Akun Saya
            </a>
          </div>
        </div>

        {/* Item Validation Table / Cards */}
        <div className="space-y-3">
          {filteredItems.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#8C8F82] border-2 border-dashed border-[#E2DDD0] rounded-2xl bg-white">
              Belum ada berkas RHK pada folder ini.
            </div>
          ) : (
            filteredItems.map((item) => {
              const hasPhoto = Boolean(item.fileDataUrl && item.fileDataUrl.startsWith("data:image/"));
              return (
                <div
                  key={item.id}
                  className="bg-white p-4 rounded-2xl border border-[#E2DDD0] shadow-2xs hover:border-[#1A73E8] transition space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F2EFE6] pb-2.5">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-[#E8F0FE] text-[#174EA6] font-bold text-[10px]">
                          {item.category}
                        </span>
                        <span className="text-[11px] text-[#8C8F82]">{item.date} • {item.time}</span>
                      </div>
                      <h3 className="font-bold text-sm text-[#2D3127] mt-1">{item.title}</h3>
                      <p className="text-xs text-[#6B6E60] line-clamp-1">{item.description}</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleDownloadPdf(item)}
                        className="px-3 py-1.5 bg-[#E8F0FE] hover:bg-[#D2E3FC] text-[#174EA6] border border-[#D2E3FC] rounded-xl font-bold text-xs flex items-center gap-1 cursor-pointer transition"
                      >
                        <Download className="w-3.5 h-3.5" /> Unduh PDF
                      </button>

                      {hasPhoto && (
                        <button
                          onClick={() => setPreviewItem(item)}
                          className="px-3 py-1.5 bg-[#FAF9F5] hover:bg-[#F2EFE6] text-[#3D4035] border border-[#D8D4C7] rounded-xl font-bold text-xs flex items-center gap-1 cursor-pointer transition"
                        >
                          <Eye className="w-3.5 h-3.5 text-[#588157]" /> Lihat Foto
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Validation Indicators */}
                  <div className="flex flex-wrap items-center gap-3 text-[11px]">
                    <div className="flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Konversi PDF Siap
                    </div>

                    {hasPhoto ? (
                      <div className="flex items-center gap-1 text-blue-700 font-semibold bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
                        <ImageIcon className="w-3.5 h-3.5" /> Terlampir Foto Bukti ({item.fileName || "Foto.jpg"})
                      </div>
                    ) : item.fileName ? (
                      <div className="flex items-center gap-1 text-slate-700 font-semibold bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
                        <FileText className="w-3.5 h-3.5" /> Berkas Terlampir ({item.fileName})
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-amber-700 font-semibold bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                        <AlertTriangle className="w-3.5 h-3.5" /> Tanpa Lampiran Foto
                      </div>
                    )}

                    <div className="text-[#6B6E60]">
                      Folder: <span className="font-bold text-[#2D3127]">{item.driveFolder || "SIKEPO_2026/Agustus"}</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Image Preview Sub-Modal */}
        {previewItem && (
          <div className="fixed inset-0 z-60 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between border-b pb-2">
                <div className="font-bold text-sm text-[#2D3127]">Pratinjau Foto Bukti Dukung</div>
                <button onClick={() => setPreviewItem(null)} className="p-1 hover:bg-gray-100 rounded-full">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="rounded-2xl overflow-hidden border border-gray-200 bg-gray-50 max-h-80 flex items-center justify-center">
                <img
                  src={previewItem.fileDataUrl}
                  alt={previewItem.title}
                  className="max-h-80 w-auto object-contain"
                />
              </div>

              <div className="space-y-1 text-xs">
                <div className="font-bold text-[#2D3127]">{previewItem.title}</div>
                <div className="text-gray-500">{previewItem.category} • {previewItem.date}</div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => handleDownloadPdf(previewItem)}
                  className="px-4 py-2 bg-[#1A73E8] text-white rounded-xl font-bold text-xs flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" /> Unduh PDF Lengkap
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end pt-2 border-t border-[#E2DDD0]">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 bg-[#3D4035] text-white rounded-xl font-bold text-xs hover:bg-[#2D3127] cursor-pointer"
          >
            Selesai Review & Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
