import React, { useState } from "react";
import { AuthUser } from "../types";
import { DEFAULT_USERS, getAllUsers, registerNewUser } from "../utils/auth";
import { ShieldCheck, User, Lock, ArrowRight, UserPlus, Sparkles, CheckCircle2, KeyRound } from "lucide-react";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: AuthUser) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
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

  if (!isOpen) return null;

  const handleQuickLogin = (demoUser: AuthUser) => {
    onLoginSuccess(demoUser);
    onClose();
  };

  const handleSubmitLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const allUsers = getAllUsers();
    const found = allUsers.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase() || u.username.toLowerCase() === email.trim().toLowerCase()
    );

    if (found) {
      onLoginSuccess(found);
      onClose();
    } else {
      // Auto-create user if email provided
      if (email.trim()) {
        const newUser: AuthUser = {
          id: `usr_${Date.now()}`,
          username: email.trim(),
          name: email.split("@")[0].toUpperCase().replace(".", " "),
          email: email.trim(),
          role: selectedRole,
          subject: selectedRole === "superadmin" ? "Super Admin" : "Guru Mata Pelajaran",
        };
        onLoginSuccess(newUser);
        onClose();
      } else {
        setErrorMsg("Masukkan email/username atau gunakan tombol Login Cepat.");
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
    });

    onLoginSuccess(newUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#FAF9F5] border border-[#E2DDD0] rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden">
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8F0FE] border border-[#D2E3FC] text-[#174EA6] text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            Portal Otentikasi Multi-User & Super Admin
          </div>
          <h2 className="text-2xl font-black text-[#2D3127] tracking-tight">
            Masuk Akun Administrasi & SIKEPO
          </h2>
          <p className="text-xs text-[#6B6E60]">
            Pilih jenis akun atau gunakan akun demo terdaftar untuk mengisolasi data masing-masing guru.
          </p>
        </div>

        {/* Tab Toggle Login vs Register */}
        <div className="flex bg-[#F2EFE6] p-1 rounded-2xl border border-[#E2DDD0]">
          <button
            type="button"
            onClick={() => setActiveTab("login")}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === "login"
                ? "bg-white text-[#2D3127] shadow-xs"
                : "text-[#6B6E60] hover:text-[#2D3127]"
            }`}
          >
            <Lock className="w-3.5 h-3.5" /> Masuk Akun
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("register")}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === "register"
                ? "bg-white text-[#2D3127] shadow-xs"
                : "text-[#6B6E60] hover:text-[#2D3127]"
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" /> Daftar Guru Baru
          </button>
        </div>

        {/* Quick Demo Login Preset Buttons */}
        {activeTab === "login" && (
          <div className="space-y-2 bg-[#E8F0FE] p-3.5 rounded-2xl border border-[#D2E3FC]">
            <div className="text-[11px] font-bold text-[#174EA6] flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5" /> Akses Cepat Sekali Klik (Demo Accounts):
            </div>
            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin(DEFAULT_USERS[0])}
                className="w-full text-left p-2.5 rounded-xl bg-white hover:bg-[#D2E3FC] border border-[#D2E3FC] text-[#174EA6] transition flex items-center justify-between cursor-pointer group shadow-2xs"
              >
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-[#174EA6] text-white flex items-center justify-center font-bold text-xs shrink-0">
                    SA
                  </div>
                  <div>
                    <div className="font-bold text-xs">Super Admin (Akses Seluruh Data)</div>
                    <div className="text-[10px] opacity-80">phelunk@gmail.com</div>
                  </div>
                </div>
                <ShieldCheck className="w-4 h-4 text-[#174EA6] group-hover:scale-110 transition shrink-0" />
              </button>

              {DEFAULT_USERS[1] && (
                <button
                  type="button"
                  onClick={() => handleQuickLogin(DEFAULT_USERS[1])}
                  className="w-full text-left p-2.5 rounded-xl bg-white hover:bg-[#F2EFE6] border border-[#E2DDD0] text-[#2D3127] transition flex items-center justify-between cursor-pointer group shadow-2xs"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-[#588157] text-white flex items-center justify-center font-bold text-xs shrink-0">
                      IK
                    </div>
                    <div>
                      <div className="font-bold text-xs">Isu Kartika, S.Pd. (Guru)</div>
                      <div className="text-[10px] text-[#6B6E60]">Isukartika30@guru.smk.belajar.id</div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#588157] group-hover:translate-x-1 transition shrink-0" />
                </button>
              )}
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
          <form onSubmit={handleSubmitLogin} className="space-y-4">
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#3D4035] mb-1">Pilih Peran Login:</label>
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
                  Email atau Username Google Workspace:
                </label>
                <input
                  type="text"
                  placeholder="misal: nama.guru@guru.smk.belajar.id"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white border border-[#D8D4C7] p-2.5 rounded-xl text-xs text-[#2D3127]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#3D4035] mb-1">Kata Sandi / NIP:</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white border border-[#D8D4C7] p-2.5 rounded-xl text-xs text-[#2D3127]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#3D4035] hover:bg-[#2D3127] text-white rounded-xl font-bold text-xs transition cursor-pointer shadow-md flex items-center justify-center gap-2"
            >
              Masuk Aplikasi & Isolasi Data <ArrowRight className="w-4 h-4" />
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
                placeholder="misal: Drs. Ahmad Fauzi, M.Pd."
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                className="w-full bg-white border border-[#D8D4C7] p-2 rounded-xl text-xs text-[#2D3127]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#3D4035] mb-1">Email Sekolah / Akun Belajar:</label>
              <input
                type="email"
                placeholder="ahmad.fauzi@guru.smk.belajar.id"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                className="w-full bg-white border border-[#D8D4C7] p-2 rounded-xl text-xs text-[#2D3127]"
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
                  className="w-full bg-white border border-[#D8D4C7] p-2 rounded-xl text-xs text-[#2D3127]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#3D4035] mb-1">Mata Pelajaran:</label>
                <input
                  type="text"
                  placeholder="Bahasa Indonesia"
                  value={regSubject}
                  onChange={(e) => setRegSubject(e.target.value)}
                  className="w-full bg-white border border-[#D8D4C7] p-2 rounded-xl text-xs text-[#2D3127]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#3D4035] mb-1">Peran Akun:</label>
              <select
                value={regRole}
                onChange={(e) => setRegRole(e.target.value as any)}
                className="w-full bg-white border border-[#D8D4C7] p-2 rounded-xl text-xs font-bold text-[#2D3127]"
              >
                <option value="guru">Guru / Pegawai Sekolah</option>
                <option value="superadmin">Super Admin / Tim Pengawas SKP</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#588157] hover:bg-[#3A5A40] text-white rounded-xl font-bold text-xs transition cursor-pointer shadow-md flex items-center justify-center gap-2 mt-2"
            >
              <CheckCircle2 className="w-4 h-4" /> Daftar & Langsung Masuk
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
