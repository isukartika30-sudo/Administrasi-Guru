import React, { useState } from "react";
import { AuthUser } from "../types";
import {
  getAllUsers,
  registerNewUser,
  validateLoginCredentials,
  requestPasswordReset,
} from "../utils/auth";
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
  Bot,
  RefreshCw,
  AlertCircle,
  Clock,
  Key,
} from "lucide-react";

interface LoginPageProps {
  onLoginSuccess: (user: AuthUser) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [activeTab, setActiveTab] = useState<"login" | "register" | "reset">("login");
  const [selectedRole, setSelectedRole] = useState<"guru" | "superadmin">("guru");

  // Form states
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  // Register states
  const [regName, setRegName] = useState<string>("");
  const [regEmail, setRegEmail] = useState<string>("");
  const [regPassword, setRegPassword] = useState<string>("");
  const [regNip, setRegNip] = useState<string>("");
  const [regSubject, setRegSubject] = useState<string>("");
  const [regRole, setRegRole] = useState<"guru" | "superadmin">("guru");

  // Reset states
  const [resetEmail, setResetEmail] = useState<string>("");
  const [resetNewPass, setResetNewPass] = useState<string>("");

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const allRegisteredUsers = getAllUsers();

  const handleQuickLogin = (u: AuthUser) => {
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!u.isVerified) {
      setErrorMsg(`Akun "${u.name}" (${u.email}) belum diverifikasi oleh Super Admin. Harap tunggu verifikasi.`);
      return;
    }

    // Prompt or directly log in if pre-verified
    if (u.password) {
      setEmail(u.email);
      setPassword(u.password);
      const res = validateLoginCredentials(u.email, u.password);
      if (res.success && res.user) {
        onLoginSuccess(res.user);
      } else {
        setErrorMsg(res.error || "Gagal masuk.");
      }
    } else {
      onLoginSuccess(u);
    }
  };

  const handleSubmitLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!email.trim()) {
      setErrorMsg("Masukkan Email / Username terlebih dahulu.");
      return;
    }

    const res = validateLoginCredentials(email, password);
    if (res.success && res.user) {
      onLoginSuccess(res.user);
    } else {
      setErrorMsg(res.error || "Gagal masuk. Periksa kembali email & kata sandi Anda.");
    }
  };

  const handleSubmitRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!regName.trim() || !regEmail.trim() || !regPassword.trim()) {
      setErrorMsg("Nama Lengkap, Email, dan Kata Sandi wajib diisi.");
      return;
    }

    const existingUsers = getAllUsers();
    if (existingUsers.some((u) => u.email.toLowerCase() === regEmail.trim().toLowerCase())) {
      setErrorMsg("Email ini sudah terdaftar di sistem. Silakan gunakan menu Masuk atau Lupa Password.");
      return;
    }

    registerNewUser({
      username: regEmail.trim(),
      name: regName.trim(),
      email: regEmail.trim(),
      password: regPassword.trim(),
      role: regRole,
      nip: regNip.trim() || "199001012022031001",
      subject: regSubject.trim() || "Guru Mata Pelajaran",
      driveFolderUrl: "https://drive.google.com/drive/u/0/my-drive",
    });

    setSuccessMsg(
      `Pendaftaran akun (${regEmail}) berhasil! Akun Anda sedang menunggu verifikasi oleh Super Admin (phelunk@gmail.com). Anda belum dapat masuk sebelum diverifikasi.`
    );
    setRegName("");
    setRegEmail("");
    setRegPassword("");
    setRegNip("");
    setRegSubject("");
    setActiveTab("login");
  };

  const handleSubmitResetRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!resetEmail.trim() || !resetNewPass.trim()) {
      setErrorMsg("Email/Username dan Password Baru wajib diisi.");
      return;
    }

    const res = requestPasswordReset(resetEmail, resetNewPass);
    if (res.success) {
      setSuccessMsg(res.message);
      setResetEmail("");
      setResetNewPass("");
      setActiveTab("login");
    } else {
      setErrorMsg(res.message);
    }
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
                Sistem Administrasi Guru & Verifikasi Akun Super Admin
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F0FE] text-[#174EA6] font-bold text-xs border border-[#D2E3FC]">
              <ShieldCheck className="w-3.5 h-3.5" />
              Ver. 2.5 Access Control & Password Reset
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
            Sistem Autentikasi & Otorisasi Terpusat
          </div>

          <div className="space-y-3">
            <h2 className="text-3xl sm:text-4xl font-black text-[#2D3127] tracking-tight leading-snug">
              Portal Administrasi Mengajar & Verifikasi Super Admin
            </h2>
            <p className="text-sm text-[#525548] leading-relaxed">
              Semua pengguna baru wajib melakukan pendaftaran dan diverifikasi secara langsung oleh <strong className="text-[#174EA6]">Super Admin (phelunk@gmail.com)</strong> sebelum dapat mengakses beranda dan fitur administrasi.
            </p>
          </div>

          {/* Key Features Badges Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="bg-white p-3.5 rounded-2xl border border-[#E2DDD0] flex items-start gap-3 shadow-2xs">
              <div className="w-9 h-9 rounded-xl bg-[#E8F0FE] text-[#174EA6] flex items-center justify-center shrink-0 font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-xs text-[#2D3127]">Verifikasi Super Admin</h4>
                <p className="text-[11px] text-[#6B6E60]">Akun baru ditinjau & disetujui oleh Super Admin.</p>
              </div>
            </div>

            <div className="bg-white p-3.5 rounded-2xl border border-[#E2DDD0] flex items-start gap-3 shadow-2xs">
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 font-bold">
                <RefreshCw className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-xs text-[#2D3127]">Reset Password Request</h4>
                <p className="text-[11px] text-[#6B6E60]">Pengajuan reset password divalidasi oleh Super Admin.</p>
              </div>
            </div>

            <div className="bg-white p-3.5 rounded-2xl border border-[#E2DDD0] flex items-start gap-3 shadow-2xs">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 font-bold">
                <FolderSync className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-xs text-[#2D3127]">Integrasi Google Drive</h4>
                <p className="text-[11px] text-[#6B6E60]">Tersambung ke folder Google Drive pribadi guru.</p>
              </div>
            </div>

            <div className="bg-white p-3.5 rounded-2xl border border-[#E2DDD0] flex items-start gap-3 shadow-2xs">
              <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0 font-bold">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-xs text-[#2D3127]">Resi SKP & Perangkat Ajar</h4>
                <p className="text-[11px] text-[#6B6E60]">Generate dokumen resmi administrasi guru.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Form Login Card */}
        <div className="lg:col-span-6 bg-white border border-[#E2DDD0] rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 relative">
          <div className="text-center space-y-1 border-b border-[#F2EFE6] pb-4">
            <h3 className="text-xl font-extrabold text-[#2D3127]">
              {activeTab === "login" && "Masuk ke Beranda EduAdmin"}
              {activeTab === "register" && "Pendaftaran Akun Guru Baru"}
              {activeTab === "reset" && "Pengajuan Reset Kata Sandi"}
            </h3>
            <p className="text-xs text-[#6B6E60]">
              {activeTab === "login" && "Masukkan kredensial terdaftar atau pilih akun terverifikasi."}
              {activeTab === "register" && "Isi data lengkap. Akun akan ditinjau oleh Super Admin."}
              {activeTab === "reset" && "Kirimkan email & kata sandi baru untuk divalidasi Super Admin."}
            </p>
          </div>

          {/* Tab Selector Login vs Register vs Reset */}
          <div className="flex bg-[#F2EFE6] p-1 rounded-2xl border border-[#E2DDD0] gap-1">
            <button
              type="button"
              onClick={() => {
                setActiveTab("login");
                setErrorMsg(null);
              }}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === "login"
                  ? "bg-white text-[#2D3127] shadow-xs"
                  : "text-[#6B6E60] hover:text-[#2D3127]"
              }`}
            >
              <Lock className="w-3.5 h-3.5" /> Masuk
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab("register");
                setErrorMsg(null);
              }}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === "register"
                  ? "bg-white text-[#2D3127] shadow-xs"
                  : "text-[#6B6E60] hover:text-[#2D3127]"
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" /> Daftar
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab("reset");
                setErrorMsg(null);
              }}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === "reset"
                  ? "bg-white text-[#174EA6] shadow-xs"
                  : "text-[#6B6E60] hover:text-[#2D3127]"
              }`}
            >
              <Key className="w-3.5 h-3.5" /> Reset
            </button>
          </div>

          {/* Messages Alert */}
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-semibold flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Quick Account Switcher (Verified Accounts) */}
          {activeTab === "login" && (
            <div className="space-y-2 bg-[#E8F0FE] p-3.5 rounded-2xl border border-[#D2E3FC]">
              <div className="text-xs font-extrabold text-[#174EA6] flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <KeyRound className="w-4 h-4 text-[#174EA6]" /> Akun Terdaftar Resmi:
                </span>
                <span className="text-[10px] bg-white text-[#174EA6] px-2 py-0.5 rounded-full border border-[#D2E3FC] font-bold">
                  {allRegisteredUsers.length} User
                </span>
              </div>

              <div className="grid grid-cols-1 gap-2 max-h-52 overflow-y-auto pr-1">
                {allRegisteredUsers.map((u) => {
                  const isSA = u.role === "superadmin";
                  const verified = u.isVerified !== false;

                  return (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => handleQuickLogin(u)}
                      className={`w-full text-left p-2.5 rounded-xl border transition flex items-center justify-between cursor-pointer group shadow-2xs ${
                        isSA
                          ? "bg-white hover:bg-[#D2E3FC] border-[#D2E3FC] text-[#174EA6]"
                          : verified
                          ? "bg-white hover:bg-[#F2EFE6] border-[#E2DDD0] text-[#2D3127]"
                          : "bg-amber-50/60 border-amber-200 text-amber-900"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                            isSA ? "bg-[#174EA6] text-white" : "bg-[#3D4035] text-white"
                          }`}
                        >
                          {u.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-bold text-xs flex items-center gap-1.5">
                            {u.name}
                            {isSA && (
                              <span className="text-[9px] bg-[#174EA6] text-white px-1.5 py-0.2 rounded font-bold">
                                Super Admin
                              </span>
                            )}
                            {!verified && (
                              <span className="text-[9px] bg-amber-200 text-amber-900 px-1.5 py-0.2 rounded font-bold flex items-center gap-0.5">
                                <Clock className="w-2.5 h-2.5" /> Pending
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] opacity-75">{u.email}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        {verified ? (
                          <span className="text-[10px] font-bold text-[#174EA6] flex items-center gap-0.5">
                            Masuk <ArrowRight className="w-3 h-3" />
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-amber-800">Menunggu</span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Login Form */}
          {activeTab === "login" && (
            <form onSubmit={handleSubmitLogin} className="space-y-3 pt-1">
              <div>
                <label className="block text-xs font-bold text-[#3D4035] mb-1">
                  Email / Username Belajar.id:
                </label>
                <input
                  type="text"
                  required
                  placeholder="phelunk@gmail.com atau Isukartika30@guru.smk.belajar.id"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#FAF9F5] border border-[#D8D4C7] p-2.5 rounded-xl text-xs text-[#2D3127]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#3D4035] mb-1">Kata Sandi / Password:</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#FAF9F5] border border-[#D8D4C7] p-2.5 rounded-xl text-xs text-[#2D3127]"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("reset");
                    setResetEmail(email);
                  }}
                  className="text-xs text-[#174EA6] hover:underline font-semibold cursor-pointer"
                >
                  Lupa kata sandi? Pengajuan Reset
                </button>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#3D4035] hover:bg-[#2D3127] text-white rounded-xl font-bold text-xs transition cursor-pointer shadow-md flex items-center justify-center gap-2 mt-2"
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
                <label className="block text-xs font-bold text-[#3D4035] mb-1">Email / Username Belajar.id:</label>
                <input
                  type="email"
                  required
                  placeholder="ahmad.fauzi@guru.smk.belajar.id"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className="w-full bg-[#FAF9F5] border border-[#D8D4C7] p-2 rounded-xl text-xs text-[#2D3127]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#3D4035] mb-1">Buat Kata Sandi / Password:</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
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

              <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900 space-y-1">
                <div className="font-bold flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-700" /> Ketentuan Verifikasi:
                </div>
                <div>Setelah mendaftar, akun Anda harus disetujui & diverifikasi oleh Super Admin (<strong className="underline">phelunk@gmail.com</strong>) sebelum bisa membuka halaman beranda.</div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#588157] hover:bg-[#3A5A40] text-white rounded-xl font-bold text-xs transition cursor-pointer shadow-md flex items-center justify-center gap-2 mt-2"
              >
                <CheckCircle2 className="w-4 h-4" /> Daftar Akun (Kirim ke Super Admin)
              </button>
            </form>
          )}

          {/* Reset Password Form */}
          {activeTab === "reset" && (
            <form onSubmit={handleSubmitResetRequest} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#3D4035] mb-1">Email / Username Terdaftar:</label>
                <input
                  type="text"
                  required
                  placeholder="masukkan email/username Anda"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  className="w-full bg-[#FAF9F5] border border-[#D8D4C7] p-2.5 rounded-xl text-xs text-[#2D3127]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#3D4035] mb-1">Usulan Kata Sandi Baru:</label>
                <input
                  type="password"
                  required
                  placeholder="masukkan kata sandi baru yang diinginkan"
                  value={resetNewPass}
                  onChange={(e) => setResetNewPass(e.target.value)}
                  className="w-full bg-[#FAF9F5] border border-[#D8D4C7] p-2.5 rounded-xl text-xs text-[#2D3127]"
                />
              </div>

              <div className="p-2.5 bg-[#E8F0FE] border border-[#D2E3FC] rounded-xl text-[11px] text-[#174EA6]">
                Permintaan ini akan terkirim ke panel kontrol Super Admin untuk divalidasi dan disetujui secara langsung.
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#174EA6] hover:bg-[#1557B0] text-white rounded-xl font-bold text-xs transition cursor-pointer shadow-md flex items-center justify-center gap-2 mt-2"
              >
                <RefreshCw className="w-4 h-4" /> Kirim Pengajuan Reset Password
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

