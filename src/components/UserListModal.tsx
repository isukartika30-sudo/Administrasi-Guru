import React, { useState } from "react";
import { AuthUser } from "../types";
import {
  getAllUsers,
  saveAllUsers,
  registerNewUser,
  verifyUser,
  approvePasswordReset,
  rejectPasswordReset,
  directResetPassword,
} from "../utils/auth";
import {
  Users,
  ShieldCheck,
  UserCheck,
  Mail,
  FolderOpen,
  Trash2,
  Plus,
  X,
  ExternalLink,
  Edit,
  Check,
  Search,
  Sparkles,
  UserPlus,
  Clock,
  Key,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";

interface UserListModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: AuthUser;
  onSwitchUser: (user: AuthUser) => void;
}

export const UserListModal: React.FC<UserListModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSwitchUser,
}) => {
  const [users, setUsers] = useState<AuthUser[]>(getAllUsers());
  const [search, setSearch] = useState<string>("");
  const [filterType, setFilterType] = useState<"all" | "pending" | "reset">("all");
  const [isAddFormOpen, setIsAddFormOpen] = useState<boolean>(false);

  // Add User Form State
  const [newName, setNewName] = useState<string>("");
  const [newEmail, setNewEmail] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [newNip, setNewNip] = useState<string>("");
  const [newSubject, setNewSubject] = useState<string>("");
  const [newRole, setNewRole] = useState<"guru" | "superadmin">("guru");

  // Edit User State
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editName, setEditName] = useState<string>("");
  const [editNip, setEditNip] = useState<string>("");
  const [editSubject, setEditSubject] = useState<string>("");
  const [editDriveUrl, setEditDriveUrl] = useState<string>("");

  // Direct Password Reset State
  const [resetPromptUserId, setResetPromptUserId] = useState<string | null>(null);
  const [directNewPass, setDirectNewPass] = useState<string>("");

  if (!isOpen) return null;

  const refreshUsers = () => {
    setUsers(getAllUsers());
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim()) return;

    registerNewUser({
      username: newEmail.trim(),
      name: newName.trim(),
      email: newEmail.trim(),
      password: newPassword.trim() || "Password123",
      role: newRole,
      nip: newNip.trim() || "199001012022031001",
      subject: newSubject.trim() || "Guru Mata Pelajaran",
      driveFolderUrl: "https://drive.google.com/drive/u/0/my-drive",
    });

    setNewName("");
    setNewEmail("");
    setNewPassword("");
    setNewNip("");
    setNewSubject("");
    setIsAddFormOpen(false);
    refreshUsers();
  };

  const handleVerifyUser = (userId: string) => {
    const updated = verifyUser(userId);
    setUsers(updated);
  };

  const handleApproveReset = (userId: string) => {
    const updated = approvePasswordReset(userId);
    setUsers(updated);
  };

  const handleRejectReset = (userId: string) => {
    const updated = rejectPasswordReset(userId);
    setUsers(updated);
  };

  const handleDirectReset = (userId: string) => {
    if (!directNewPass.trim()) return;
    const updated = directResetPassword(userId, directNewPass.trim());
    setUsers(updated);
    setResetPromptUserId(null);
    setDirectNewPass("");
  };

  const handleDeleteUser = (userId: string, userName: string) => {
    if (users.length <= 1) {
      alert("Tidak dapat menghapus user terakhir.");
      return;
    }
    if (confirm(`Apakah Anda yakin ingin menghapus akun user "${userName}"?`)) {
      const updated = users.filter((u) => u.id !== userId);
      saveAllUsers(updated);
      setUsers(updated);
      if (currentUser.id === userId && updated.length > 0) {
        onSwitchUser(updated[0]);
      }
    }
  };

  const startEdit = (u: AuthUser) => {
    setEditingUserId(u.id);
    setEditName(u.name);
    setEditNip(u.nip || "");
    setEditSubject(u.subject || "");
    setEditDriveUrl(u.driveFolderUrl || "https://drive.google.com/drive/u/0/my-drive");
  };

  const saveEdit = (userId: string) => {
    const updated = users.map((u) => {
      if (u.id === userId) {
        return {
          ...u,
          name: editName,
          nip: editNip,
          subject: editSubject,
          driveFolderUrl: editDriveUrl,
        };
      }
      return u;
    });
    saveAllUsers(updated);
    setUsers(updated);
    setEditingUserId(null);

    if (currentUser.id === userId) {
      const active = updated.find((u) => u.id === userId);
      if (active) onSwitchUser(active);
    }
  };

  const pendingCount = users.filter((u) => u.isVerified === false).length;
  const resetCount = users.filter((u) => u.resetPasswordRequested === true).length;

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      (u.nip && u.nip.includes(search)) ||
      (u.subject && u.subject.toLowerCase().includes(search.toLowerCase()));

    if (!matchesSearch) return false;

    if (filterType === "pending") return u.isVerified === false;
    if (filterType === "reset") return u.resetPasswordRequested === true;
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#FAF9F5] border border-[#E2DDD0] rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto relative">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#E2DDD0] pb-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8F0FE] text-[#174EA6] font-bold text-xs border border-[#D2E3FC]">
              <Users className="w-3.5 h-3.5" />
              Panel Kontrol Kelola User & Validasi Reset Password
            </div>
            <h2 className="text-xl font-bold text-[#2D3127] flex items-center gap-2">
              Daftar Seluruh User, Verifikasi & Password Manager
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#E2DDD0] text-[#8C8F82] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Badges Tabs */}
        <div className="flex flex-wrap items-center gap-2 bg-[#F2EFE6] p-1.5 rounded-2xl border border-[#E2DDD0]">
          <button
            onClick={() => setFilterType("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              filterType === "all" ? "bg-white text-[#2D3127] shadow-xs" : "text-[#6B6E60]"
            }`}
          >
            <Users className="w-3.5 h-3.5" /> Semua User ({users.length})
          </button>
          <button
            onClick={() => setFilterType("pending")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              filterType === "pending"
                ? "bg-amber-500 text-white shadow-xs"
                : "text-amber-800 hover:bg-amber-100/50"
            }`}
          >
            <Clock className="w-3.5 h-3.5" /> Pending Verifikasi ({pendingCount})
          </button>
          <button
            onClick={() => setFilterType("reset")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              filterType === "reset"
                ? "bg-[#174EA6] text-white shadow-xs"
                : "text-[#174EA6] hover:bg-blue-100/50"
            }`}
          >
            <Key className="w-3.5 h-3.5" /> Request Reset Password ({resetCount})
          </button>
        </div>

        {/* Toolbar: Search + Add Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-[#8C8F82] absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Cari nama, email, NIP, atau mapel..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-white border border-[#D8D4C7] rounded-xl text-xs text-[#2D3127]"
            />
          </div>

          <button
            onClick={() => setIsAddFormOpen(!isAddFormOpen)}
            className="w-full sm:w-auto px-4 py-2 bg-[#588157] hover:bg-[#3A5A40] text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-xs"
          >
            <UserPlus className="w-4 h-4" />
            {isAddFormOpen ? "Tutup Form" : "Tambah User Baru (Otomatis Verifikasi)"}
          </button>
        </div>

        {/* Form Add New User */}
        {isAddFormOpen && (
          <form onSubmit={handleAddUser} className="bg-white p-4 rounded-2xl border border-[#D8D4C7] space-y-3">
            <div className="font-bold text-xs text-[#2D3127] flex items-center gap-2 border-b pb-2">
              <Sparkles className="w-4 h-4 text-[#588157]" /> Form Registrasi Akun Guru / Admin Baru
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-[#3D4035]">Nama Lengkap & Gelar:</label>
                <input
                  type="text"
                  required
                  placeholder="Drs. Ahmad Fauzi, M.Pd."
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-[#FAF9F5] border border-[#D8D4C7] p-2 rounded-xl text-xs text-[#2D3127]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#3D4035]">Email Sekolah / Belajar.id:</label>
                <input
                  type="email"
                  required
                  placeholder="ahmad.fauzi@guru.smk.belajar.id"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full bg-[#FAF9F5] border border-[#D8D4C7] p-2 rounded-xl text-xs text-[#2D3127]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#3D4035]">Kata Sandi / Password:</label>
                <input
                  type="text"
                  placeholder="Password123"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-[#FAF9F5] border border-[#D8D4C7] p-2 rounded-xl text-xs text-[#2D3127]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#3D4035]">NIP Pegawai:</label>
                <input
                  type="text"
                  placeholder="198501012010011002"
                  value={newNip}
                  onChange={(e) => setNewNip(e.target.value)}
                  className="w-full bg-[#FAF9F5] border border-[#D8D4C7] p-2 rounded-xl text-xs text-[#2D3127]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#3D4035]">Mata Pelajaran / Tugas:</label>
                <input
                  type="text"
                  placeholder="Bahasa Indonesia"
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  className="w-full bg-[#FAF9F5] border border-[#D8D4C7] p-2 rounded-xl text-xs text-[#2D3127]"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2">
                <label className="text-[11px] font-bold text-[#3D4035]">Peran Akun:</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as any)}
                  className="bg-[#FAF9F5] border border-[#D8D4C7] text-xs font-bold p-1.5 rounded-xl"
                >
                  <option value="guru">Guru / Pegawai</option>
                  <option value="superadmin">Super Admin</option>
                </select>
              </div>

              <button
                type="submit"
                className="px-4 py-2 bg-[#588157] text-white rounded-xl font-bold text-xs hover:bg-[#3A5A40] transition cursor-pointer"
              >
                Simpan & Tambahkan Akun
              </button>
            </div>
          </form>
        )}

        {/* User Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredUsers.length === 0 ? (
            <div className="col-span-2 text-center py-8 text-xs text-gray-500 bg-white rounded-2xl border border-dashed border-[#D8D4C7]">
              Tidak ada data user yang sesuai dengan filter/pencarian.
            </div>
          ) : (
            filteredUsers.map((u) => {
              const isSelf = u.id === currentUser.id;
              const isEditing = editingUserId === u.id;
              const isSuperAdminRole = u.role === "superadmin";
              const isVerified = u.isVerified !== false;
              const isResetRequested = u.resetPasswordRequested === true;

              return (
                <div
                  key={u.id}
                  className={`p-4 rounded-2xl border transition space-y-3 ${
                    isSelf
                      ? "bg-[#E8F0FE] border-[#174EA6] shadow-xs"
                      : !isVerified
                      ? "bg-amber-50/70 border-amber-300"
                      : isResetRequested
                      ? "bg-blue-50/70 border-blue-300"
                      : "bg-white border-[#E2DDD0] hover:border-[#D8D4C7]"
                  }`}
                >
                  {/* Status Banners for Verification and Reset Password */}
                  {!isVerified && (
                    <div className="p-2.5 bg-amber-100 border border-amber-300 rounded-xl text-xs text-amber-900 space-y-2">
                      <div className="flex items-center justify-between font-bold">
                        <span className="flex items-center gap-1.5">
                          <AlertTriangle className="w-4 h-4 text-amber-700" /> Pending Verifikasi
                        </span>
                        <span className="text-[10px] bg-amber-200 px-2 py-0.5 rounded font-bold">
                          Perlu Persetujuan SA
                        </span>
                      </div>
                      <div className="text-[11px]">User mendaftar dan membutuhkan verifikasi Super Admin untuk bisa masuk beranda.</div>
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          onClick={() => handleVerifyUser(u.id)}
                          className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" /> Setujui & Verifikasi
                        </button>
                        <button
                          onClick={() => handleDeleteUser(u.id, u.name)}
                          className="py-1.5 px-3 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-lg transition flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <XCircle className="w-3.5 h-3.5" /> Tolak
                        </button>
                      </div>
                    </div>
                  )}

                  {isResetRequested && (
                    <div className="p-2.5 bg-blue-100 border border-blue-300 rounded-xl text-xs text-blue-900 space-y-2">
                      <div className="flex items-center justify-between font-bold">
                        <span className="flex items-center gap-1.5">
                          <Key className="w-4 h-4 text-[#174EA6]" /> Request Reset Password
                        </span>
                        <span className="text-[10px] bg-blue-200 px-2 py-0.5 rounded font-bold text-[#174EA6]">
                          Pengajuan User
                        </span>
                      </div>
                      <div className="text-[11px]">
                        Usulan Kata Sandi Baru: <strong className="font-mono bg-white px-2 py-0.5 rounded border border-blue-200">{u.newPasswordCandidate}</strong>
                      </div>
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          onClick={() => handleApproveReset(u.id)}
                          className="flex-1 py-1.5 bg-[#174EA6] hover:bg-[#1557B0] text-white font-bold text-xs rounded-lg transition flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" /> Validasi & Ubah Password
                        </button>
                        <button
                          onClick={() => handleRejectReset(u.id)}
                          className="py-1.5 px-3 bg-gray-500 hover:bg-gray-600 text-white font-bold text-xs rounded-lg transition cursor-pointer"
                        >
                          Tolak
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Header User Row */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full font-bold flex items-center justify-center text-sm shrink-0 ${
                          isSuperAdminRole ? "bg-[#174EA6] text-white" : "bg-[#3D4035] text-white"
                        }`}
                      >
                        {u.name.slice(0, 2).toUpperCase()}
                      </div>

                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span
                            className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                              isSuperAdminRole
                                ? "bg-[#174EA6] text-white"
                                : "bg-[#EAE7DC] text-[#3D4035]"
                            }`}
                          >
                            {isSuperAdminRole ? "Super Admin" : "Guru / Pegawai"}
                          </span>
                          {isVerified ? (
                            <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[9px] flex items-center gap-0.5">
                              <CheckCircle2 className="w-2.5 h-2.5" /> Terverifikasi
                            </span>
                          ) : (
                            <span className="px-1.5 py-0.5 rounded bg-amber-200 text-amber-900 font-bold text-[9px]">
                              Pending
                            </span>
                          )}
                          {isSelf && (
                            <span className="px-2 py-0.5 rounded-md bg-emerald-600 text-white font-bold text-[10px]">
                              Akun Aktif Anda
                            </span>
                          )}
                        </div>
                        <h3 className="font-bold text-sm text-[#2D3127] mt-0.5">{u.name}</h3>
                      </div>
                    </div>

                    {!isSelf && isVerified && (
                      <button
                        onClick={() => {
                          onSwitchUser(u);
                          onClose();
                        }}
                        className="px-3 py-1 bg-[#1A73E8] hover:bg-[#1557B0] text-white font-bold text-[11px] rounded-lg transition cursor-pointer shrink-0"
                      >
                        Ganti Akun
                      </button>
                    )}
                  </div>

                  {/* Edit Mode vs Display Mode */}
                  {isEditing ? (
                    <div className="space-y-2 bg-[#FAF9F5] p-3 rounded-xl border border-[#D8D4C7] text-xs">
                      <div>
                        <label className="font-bold text-[10px] text-[#6B6E60]">Nama Lengkap:</label>
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="w-full bg-white border border-[#D8D4C7] p-1.5 rounded-lg font-bold"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-[10px] text-[#6B6E60]">NIP:</label>
                        <input
                          type="text"
                          value={editNip}
                          onChange={(e) => setEditNip(e.target.value)}
                          className="w-full bg-white border border-[#D8D4C7] p-1.5 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-[10px] text-[#6B6E60]">Mata Pelajaran:</label>
                        <input
                          type="text"
                          value={editSubject}
                          onChange={(e) => setEditSubject(e.target.value)}
                          className="w-full bg-white border border-[#D8D4C7] p-1.5 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-[10px] text-[#6B6E60]">Folder Google Drive:</label>
                        <input
                          type="text"
                          value={editDriveUrl}
                          onChange={(e) => setEditDriveUrl(e.target.value)}
                          className="w-full bg-white border border-[#D8D4C7] p-1.5 rounded-lg text-[11px]"
                        />
                      </div>

                      <div className="flex justify-end gap-2 pt-1">
                        <button
                          onClick={() => setEditingUserId(null)}
                          className="px-2.5 py-1 text-gray-600 bg-gray-200 rounded-lg text-[11px]"
                        >
                          Batal
                        </button>
                        <button
                          onClick={() => saveEdit(u.id)}
                          className="px-2.5 py-1 bg-[#174EA6] text-white rounded-lg text-[11px] font-bold flex items-center gap-1"
                        >
                          <Check className="w-3 h-3" /> Simpan
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-xs text-[#6B6E60] space-y-1 bg-[#FAF9F5] p-2.5 rounded-xl border border-[#F2EFE6]">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 truncate">
                          <Mail className="w-3.5 h-3.5 text-[#8C8F82] shrink-0" />
                          <span className="truncate">{u.email}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-[11px]">
                        <span>Password: <strong className="font-mono text-[#2D3127]">{u.password || "Standard"}</strong></span>
                        <span>NIP: <strong className="text-[#2D3127]">{u.nip || "-"}</strong></span>
                      </div>
                      <div className="text-[11px]">
                        Tugas/Mapel: <strong className="text-[#2D3127]">{u.subject || "-"}</strong>
                      </div>
                    </div>
                  )}

                  {/* Direct Password Reset Form for SA */}
                  {resetPromptUserId === u.id && (
                    <div className="p-2.5 bg-purple-50 border border-purple-200 rounded-xl space-y-2">
                      <div className="text-[11px] font-bold text-purple-900">
                        Set Password Baru untuk {u.name}:
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Password Baru"
                          value={directNewPass}
                          onChange={(e) => setDirectNewPass(e.target.value)}
                          className="flex-1 bg-white border border-purple-300 p-1.5 rounded-lg text-xs font-bold"
                        />
                        <button
                          onClick={() => handleDirectReset(u.id)}
                          className="px-3 py-1 bg-purple-700 text-white rounded-lg font-bold text-xs hover:bg-purple-800 transition cursor-pointer"
                        >
                          Simpan
                        </button>
                        <button
                          onClick={() => setResetPromptUserId(null)}
                          className="px-2 py-1 text-gray-600 bg-gray-200 rounded-lg text-xs cursor-pointer"
                        >
                          Batal
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Footer Link & Actions */}
                  <div className="flex items-center justify-between text-xs border-t border-[#F2EFE6] pt-2">
                    <a
                      href={u.driveFolderUrl || "https://drive.google.com/drive/u/0/my-drive"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#174EA6] hover:underline font-bold text-[11px] flex items-center gap-1"
                    >
                      <FolderOpen className="w-3.5 h-3.5" /> Google Drive <ExternalLink className="w-3 h-3" />
                    </a>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setResetPromptUserId(u.id);
                          setDirectNewPass("");
                        }}
                        className="px-2 py-1 bg-purple-100 hover:bg-purple-200 text-purple-800 font-bold text-[10px] rounded-lg transition flex items-center gap-1 cursor-pointer"
                        title="Reset Password Langsung"
                      >
                        <RefreshCw className="w-3 h-3" /> Reset Password
                      </button>

                      {!isEditing && (
                        <button
                          onClick={() => startEdit(u)}
                          className="p-1.5 text-[#3D4035] hover:bg-[#F2EFE6] rounded-lg transition cursor-pointer"
                          title="Edit Data User"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteUser(u.id, u.name)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                        title="Hapus Akun User"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="flex justify-end pt-2 border-t border-[#E2DDD0]">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-[#3D4035] text-white rounded-xl font-bold text-xs hover:bg-[#2D3127] cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

