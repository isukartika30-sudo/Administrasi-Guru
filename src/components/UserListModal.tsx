import React, { useState } from "react";
import { AuthUser } from "../types";
import { getAllUsers, saveAllUsers, registerNewUser } from "../utils/auth";
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
  UserPlus
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
  const [isAddFormOpen, setIsAddFormOpen] = useState<boolean>(false);

  // Add User Form State
  const [newName, setNewName] = useState<string>("");
  const [newEmail, setNewEmail] = useState<string>("");
  const [newNip, setNewNip] = useState<string>("");
  const [newSubject, setNewSubject] = useState<string>("");
  const [newRole, setNewRole] = useState<"guru" | "superadmin">("guru");

  // Edit User State
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editName, setEditName] = useState<string>("");
  const [editNip, setEditNip] = useState<string>("");
  const [editSubject, setEditSubject] = useState<string>("");
  const [editDriveUrl, setEditDriveUrl] = useState<string>("");

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
      role: newRole,
      nip: newNip.trim() || "199001012022031001",
      subject: newSubject.trim() || "Guru Mata Pelajaran",
      driveFolderUrl: "https://drive.google.com/drive/u/0/my-drive",
    });

    setNewName("");
    setNewEmail("");
    setNewNip("");
    setNewSubject("");
    setIsAddFormOpen(false);
    refreshUsers();
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

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      (u.nip && u.nip.includes(search)) ||
      (u.subject && u.subject.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#FAF9F5] border border-[#E2DDD0] rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto relative">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#E2DDD0] pb-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8F0FE] text-[#174EA6] font-bold text-xs border border-[#D2E3FC]">
              <Users className="w-3.5 h-3.5" />
              Direktori Akun Terdaftar & Hak Akses
            </div>
            <h2 className="text-xl font-bold text-[#2D3127] flex items-center gap-2">
              Daftar Seluruh User / Guru & Super Admin
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#E2DDD0] text-[#8C8F82] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
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
            {isAddFormOpen ? "Tutup Form" : "Tambah User Baru"}
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
                className="px-4 py-2 bg-[#588157] text-white rounded-xl font-bold text-xs hover:bg-[#3A5A40] transition"
              >
                Simpan & Tambahkan Akun
              </button>
            </div>
          </form>
        )}

        {/* User Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredUsers.map((u) => {
            const isSelf = u.id === currentUser.id;
            const isEditing = editingUserId === u.id;
            const isSuperAdminRole = u.role === "superadmin";

            return (
              <div
                key={u.id}
                className={`p-4 rounded-2xl border transition space-y-3 ${
                  isSelf
                    ? "bg-[#E8F0FE] border-[#174EA6] shadow-xs"
                    : "bg-white border-[#E2DDD0] hover:border-[#D8D4C7]"
                }`}
              >
                {/* Header User Row */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    {u.avatar ? (
                      <img src={u.avatar} alt={u.name} className="w-10 h-10 rounded-full object-cover shrink-0" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-[#3D4035] text-white font-bold flex items-center justify-center text-sm shrink-0">
                        {u.name.slice(0, 2).toUpperCase()}
                      </div>
                    )}

                    <div>
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                            isSuperAdminRole
                              ? "bg-[#174EA6] text-white"
                              : "bg-[#EAE7DC] text-[#3D4035]"
                          }`}
                        >
                          {isSuperAdminRole ? "Super Admin" : "Guru / Pegawai"}
                        </span>
                        {isSelf && (
                          <span className="px-2 py-0.5 rounded-md bg-emerald-600 text-white font-bold text-[10px]">
                            Akun Aktif Anda
                          </span>
                        )}
                      </div>
                      <h3 className="font-bold text-sm text-[#2D3127] mt-0.5">{u.name}</h3>
                    </div>
                  </div>

                  {!isSelf && (
                    <button
                      onClick={() => {
                        onSwitchUser(u);
                        onClose();
                      }}
                      className="px-3 py-1 bg-[#1A73E8] hover:bg-[#1557B0] text-white font-bold text-[11px] rounded-lg transition cursor-pointer shrink-0"
                    >
                      Ganti Ke Akun Ini
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
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-[#8C8F82] shrink-0" />
                      <span className="truncate">{u.email}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>NIP: <strong className="text-[#2D3127]">{u.nip || "-"}</strong></span>
                      <span>Tugas: <strong className="text-[#2D3127]">{u.subject || "-"}</strong></span>
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
                    <FolderOpen className="w-3.5 h-3.5" /> Buka Google Drive User <ExternalLink className="w-3 h-3" />
                  </a>

                  <div className="flex items-center gap-1">
                    {!isEditing && (
                      <button
                        onClick={() => startEdit(u)}
                        className="p-1.5 text-[#3D4035] hover:bg-[#F2EFE6] rounded-lg transition"
                        title="Edit Data User"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteUser(u.id, u.name)}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition"
                      title="Hapus Akun User"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
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
