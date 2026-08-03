import React, { useState } from "react";
import { AuthUser } from "../types";
import { DEFAULT_USERS, getAllUsers, registerNewUser } from "../utils/auth";
import {
  ShieldCheck,
  User,
  Lock,
  ArrowRight,
  UserPlus,
  Sparkles,
  CheckCircle2,
  KeyRound,
  GraduationCap,
  FolderSync,
  FileCheck2,
  BookOpen,
  Bot
} from "lucide-react";

interface LoginPageProps {
  onLoginSuccess: (user: AuthUser) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [selectedRole, setSelectedRole] = useState<"guru" | "superadmin">("guru");

  // Form states
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  // Register states
  const [regName, setRegName] = useState<string>("");
  const [regEmail, setRegEmail] = useState<string>("");
  const [regNip, setRegNip] = useState<string>("");
  const [regSubject, setRegSubject] = useState<string>("");
  const [regRole, setRegRole] = useState<"guru" | "superadmin">("guru");

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const allRegisteredUsers = getAllUsers();

  const handleQuickLogin = (user: AuthUser) => {
    onLoginSuccess(user);
  };

  const handleSubmitLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const allUsers = getAllUsers();
    const found = allUsers.find(
      (u) =>
        u.email.toLowerCase() === email.trim().toLowerCase() ||
        u.username.toLowerCase() === email.trim().toLowerCase()
    );

    if (found) {
      onLoginSuccess(found);
    } else {
      if (email.trim()) {
        const newUser: AuthUser = {
          id: `usr_${Date.now()}`,
          username: email.trim(),
          name: email.split("@")[0].toUpperCase().replace(".", " "),
          email: email.trim(),
          role: selectedRole,
          subject: selectedRole === "superadmin" ? "Super Admin" : "Guru Mata Pelajaran",
          driveFolderUrl: "https://drive.google.com/drive/u/0/my-drive",
        };
        onLoginSuccess(newUser);
      } else {
        setErrorMsg("Masukkan email / username terdaftar atau gunakan tombol Akses Cepat.");
      }
    }
  };

  const handleSubmitRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim()) {
      setErrorMsg("Nama Lengkap dan Email wajib diisi.");
      return;
    }

    const newUser = registerNewUser({
      username: regEmail.trim(),
      name: regName.trim(),
      email: regEmail.trim(),
      role: regRole,
      nip: regNip.trim() || "199001012022031001",
      subject: regSubject.trim() || "Guru Mata Pelajaran",
      driveFolderUrl: "https://drive.google.com/drive/u/0/my-drive",
    });

    onLoginSuccess(newUser);
  };

  return (
    <div className="min-h-screen bg-[#F7F5F0] text-[#2D3127] flex flex-col justify-between selection:bg-[#E8F0FE]">
      {/* Top Header Banner */}
      <header className="bg-white border-b border-[#E2DDD0] py-4 px-6 shadow-2xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#174EA6] text-white flex items-center justify-center font-black text-lg shadow-md">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-extrabold text-base sm:text-lg text-[#2D3127] tracking-tight leading-tight">
                Portal EduAdmin & SIKEPO SKP
              </h1>
              <p className="text-xs text-[#6B6E60]">
                Sistem Administrasi Guru & Sinkronisasi Bukti Dukung Google Drive
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F0FE] text-[#174EA6] font-bold text-xs border border-[#D2E3FC]">
              <ShieldCheck className="w-3.5 h-3.5" />
              Ver. 2.4 Multi-Account & Drive Sync
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Login Hero Grid */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-12 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Hero Overview */}
        <div className="lg:col-span-6 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E8F0FE] border border-[#D2E3FC] text-[#174EA6] text-xs font-bold shadow-2xs">
            <Sparkles className="w-4 h-4 text-[#174EA6]" />
            Selamat Datang di Portal Resmi Guru & Tenaga Pendidik
          </div>

          <div className="space-y-3">
            <h2 className="text-3xl sm:text-4xl font-black text-[#2D3127] tracking-tight leading-snug">
              Kelola Administrasi Mengajar & SKP Terintegrasi Google Drive
            </h2>
            <p className="text-sm text-[#525548] leading-relaxed">
              Masuk ke akun masing-masing guru untuk menyimpan bukti dukung RHK SKP, menyusun perangkat ajar, serta menyinkronkan berkas PDF resi bukti dukung ke folder Google Drive pribadi Anda.
            </p>
          </div>

          {/* Key Features Badges Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="bg-white p-3.5 rounded-2xl border border-[#E2DDD0] flex items-start gap-3 shadow-2xs">
              <div className="w-9 h-9 rounded-xl bg-[#E8F0FE] text-[#174EA6] flex items-center justify-center shrink-0 font-bold">
                <FolderSync className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-xs text-[#2D3127]">Google Drive Per Akun</h4>
                <p className="text-[11px] text-[#6B6E60]">Tercatat & terhubung ke Google Drive akun masing-masing guru.</p>
              </div>
            </div>

            <div className="bg-white p-3.5 rounded-2xl border border-[#E2DDD0] flex items-start gap-3 shadow-2xs">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 font-bold">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-xs text-[#2D3127]">Resi Bukti Dukung PDF</h4>
                <p className="text-[11px] text-[#6B6E60]">Generate otomatis PDF resi fisik RHK SKP per bulan.</p>
              </div>
            </div>

            <div className="bg-white p-3.5 rounded-2xl border border-[#E2DDD0] flex items-start gap-3 shadow-2xs">
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 font-bold">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-xs text-[#2D3127]">Kurikulum Merdeka</h4>
                <p className="text-[11px] text-[#6B6E60]">Jurnal, Modul Ajar, ATP, & Administrasi Guru Lengkap.</p>
              </div>
            </div>

            <div className="bg-white p-3.5 rounded-2xl border border-[#E2DDD0] flex items-start gap-3 shadow-2xs">
              <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0 font-bold">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-xs text-[#2D3127]">Asisten AI Guru</h4>
                <p className="text-[11px] text-[#6B6E60]">Pembuat Asesmen, Rubrik, & Materi Otomatis.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Form Login Card */}
        <div className="lg:col-span-6 bg-white border border-[#E2DDD0] rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 relative">
          <div className="text-center space-y-1 border-b border-[#F2EFE6] pb-4">
            <h3 className="text-xl font-extrabold text-[#2D3127]">
              Masuk / Login Terlebih Dahulu
            </h3>
            <p className="text-xs text-[#6B6E60]">
              Pilih akun terdaftar di bawah ini atau buat akun guru baru.
            </p>
          </div>

          {/* Tab Selector Login vs Register */}
          <div className="flex bg-[#F2EFE6] p-1 rounded-2xl border border-[#E2DDD0]">
            <button
              type="button"
              onClick={() => setActiveTab("login")}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === "login"
                  ? "bg-white text-[#2D3127] shadow-xs"
                  : "text-[#6B6E60] hover:text-[#2D3127]"
              }`}
            >
              <Lock className="w-3.5 h-3.5" /> Masuk Akun Terdaftar
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("register")}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === "register"
                  ? "bg-white text-[#2D3127] shadow-xs"
                  : "text-[#6B6E60] hover:text-[#2D3127]"
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" /> Daftar Guru Baru
            </button>
          </div>

          {/* Quick Preset Accounts Section */}
          {activeTab === "login" && (
            <div className="space-y-2 bg-[#E8F0FE] p-4 rounded-2xl border border-[#D2E3FC]">
              <div className="text-xs font-extrabold text-[#174EA6] flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <KeyRound className="w-4 h-4 text-[#174EA6]" /> Pilih Akun Terdaftar (Masuk 1 Klik):
                </span>
                <span className="text-[10px] bg-white text-[#174EA6] px-2 py-0.5 rounded-full border border-[#D2E3FC]">
                  {allRegisteredUsers.length} User Terdaftar
                </span>
              </div>

              <div className="grid grid-cols-1 gap-2 max-h-56 overflow-y-auto pr-1">
                {allRegisteredUsers.map((u) => {
                  const isSA = u.role === "superadmin";
                  return (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => handleQuickLogin(u)}
                      className={`w-full text-left p-3 rounded-xl border transition flex items-center justify-between cursor-pointer group shadow-2xs ${
                        isSA
                          ? "bg-white hover:bg-[#D2E3FC] border-[#D2E3FC] text-[#174EA6]"
                          : "bg-white hover:bg-[#F2EFE6] border-[#E2DDD0] text-[#2D3127]"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {u.avatar ? (
                          <img
                            src={u.avatar}
                            alt={u.name}
                            className="w-8 h-8 rounded-full object-cover shrink-0"
                          />
                        ) : (
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                              isSA ? "bg-[#174EA6] text-white" : "bg-[#3D4035] text-white"
                            }`}
                          >
                            {u.name.slice(0, 2).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <div className="font-bold text-xs flex items-center gap-1.5">
                            {u.name}
                            {isSA && (
                              <span className="text-[9px] bg-[#174EA6] text-white px-1.5 py-0.2 rounded font-bold">
                                Super Admin
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] opacity-75">{u.email}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <span className="text-[10px] font-bold opacity-0 group-hover:opacity-100 transition text-[#174EA6]">
                          Masuk &rarr;
                        </span>
                        {isSA ? (
                          <ShieldCheck className="w-4 h-4 text-[#174EA6] shrink-0" />
                        ) : (
                          <ArrowRight className="w-4 h-4 text-[#588157] group-hover:translate-x-1 transition shrink-0" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-semibold text-center">
              {errorMsg}
            </div>
          )}

          {/* Login Form */}
          {activeTab === "login" && (
            <form onSubmit={handleSubmitLogin} className="space-y-4 pt-1">
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-[#3D4035] mb-1">Pilih Role / Peran:</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedRole("guru")}
                      className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition ${
                        selectedRole === "guru"
                          ? "bg-[#3D4035] text-white border-[#3D4035]"
                          : "bg-white text-[#3D4035] border-[#D8D4C7]"
                      }`}
                    >
                      <User className="w-4 h-4" /> Guru / Pegawai
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedRole("superadmin")}
                      className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition ${
                        selectedRole === "superadmin"
                          ? "bg-[#174EA6] text-white border-[#174EA6]"
                          : "bg-white text-[#174EA6] border-[#D2E3FC]"
                      }`}
                    >
                      <ShieldCheck className="w-4 h-4" /> Super Admin
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#3D4035] mb-1">
                    Email / Username Google Workspace Belajar.id:
                  </label>
                  <input
                    type="text"
                    placeholder="nama.guru@guru.smk.belajar.id"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#FAF9F5] border border-[#D8D4C7] p-2.5 rounded-xl text-xs text-[#2D3127]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#3D4035] mb-1">Kata Sandi / NIP:</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#FAF9F5] border border-[#D8D4C7] p-2.5 rounded-xl text-xs text-[#2D3127]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#3D4035] hover:bg-[#2D3127] text-white rounded-xl font-bold text-xs transition cursor-pointer shadow-md flex items-center justify-center gap-2"
              >
                Masuk Ke Dashboard Aplikasi <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Register Form */}
          {activeTab === "register" && (
            <form onSubmit={handleSubmitRegister} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#3D4035] mb-1">Nama Lengkap & Gelar:</label>
                <input
                  type="text"
                  required
                  placeholder="misal: Drs. Ahmad Fauzi, M.Pd."
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  className="w-full bg-[#FAF9F5] border border-[#D8D4C7] p-2 rounded-xl text-xs text-[#2D3127]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#3D4035] mb-1">Email Sekolah / Akun Belajar.id:</label>
                <input
                  type="email"
                  required
                  placeholder="ahmad.fauzi@guru.smk.belajar.id"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className="w-full bg-[#FAF9F5] border border-[#D8D4C7] p-2 rounded-xl text-xs text-[#2D3127]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-[#3D4035] mb-1">NIP Pegawai:</label>
                  <input
                    type="text"
                    placeholder="198501012010011002"
                    value={regNip}
                    onChange={(e) => setRegNip(e.target.value)}
                    className="w-full bg-[#FAF9F5] border border-[#D8D4C7] p-2 rounded-xl text-xs text-[#2D3127]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#3D4035] mb-1">Mata Pelajaran:</label>
                  <input
                    type="text"
                    placeholder="Bahasa Indonesia"
                    value={regSubject}
                    onChange={(e) => setRegSubject(e.target.value)}
                    className="w-full bg-[#FAF9F5] border border-[#D8D4C7] p-2 rounded-xl text-xs text-[#2D3127]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#3D4035] mb-1">Peran Akun:</label>
                <select
                  value={regRole}
                  onChange={(e) => setRegRole(e.target.value as any)}
                  className="w-full bg-[#FAF9F5] border border-[#D8D4C7] p-2 rounded-xl text-xs font-bold text-[#2D3127]"
                >
                  <option value="guru">Guru / Pegawai Sekolah</option>
                  <option value="superadmin">Super Admin / Tim Pengawas SKP</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#588157] hover:bg-[#3A5A40] text-white rounded-xl font-bold text-xs transition cursor-pointer shadow-md flex items-center justify-center gap-2 mt-2"
              >
                <CheckCircle2 className="w-4 h-4" /> Daftar Akun & Langsung Masuk
              </button>
            </form>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-[#E2DDD0] py-4 text-center text-xs text-[#6B6E60]">
        &copy; 2026 Portal EduAdmin & SIKEPO SKP Guru. Hak Cipta Dilindungi Undang-Undang.
      </footer>
    </div>
  );
};
