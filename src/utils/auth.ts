import { AuthUser } from "../types";

const AUTH_USER_KEY = "eduadmin_active_user_v3";
const ALL_USERS_KEY = "eduadmin_all_users_v3";

export const DEFAULT_USERS: AuthUser[] = [
  {
    id: "usr_superadmin",
    username: "phelunk@gmail.com",
    name: "Super Admin Utama",
    email: "phelunk@gmail.com",
    password: "BaliNesa##2026",
    role: "superadmin",
    nip: "198001012005011001",
    subject: "Pengawas & Admin Utama",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
    driveFolderUrl: "https://drive.google.com/drive/u/0/my-drive",
    isVerified: true,
  },
  {
    id: "usr_guru1",
    username: "Isukartika30@guru.smk.belajar.id",
    name: "Isu Kartika, S.Pd.",
    email: "Isukartika30@guru.smk.belajar.id",
    password: "Sukartika13101991",
    role: "guru",
    nip: "198803152019032008",
    subject: "Informatika / Multimedia",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150",
    driveFolderUrl: "https://drive.google.com/drive/u/0/my-drive",
    isVerified: true,
  },
];

export const getAllUsers = (): AuthUser[] => {
  try {
    const item = localStorage.getItem(ALL_USERS_KEY);
    if (!item) {
      localStorage.setItem(ALL_USERS_KEY, JSON.stringify(DEFAULT_USERS));
      return DEFAULT_USERS;
    }
    const parsed: AuthUser[] = JSON.parse(item);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(ALL_USERS_KEY, JSON.stringify(DEFAULT_USERS));
      return DEFAULT_USERS;
    }
    return parsed;
  } catch (err) {
    console.error("Error reading all users:", err);
    return DEFAULT_USERS;
  }
};

export const saveAllUsers = (users: AuthUser[]): void => {
  try {
    localStorage.setItem(ALL_USERS_KEY, JSON.stringify(users));
  } catch (err) {
    console.error("Error saving users list:", err);
  }
};

export const getCurrentUser = (): AuthUser | null => {
  try {
    const item = localStorage.getItem(AUTH_USER_KEY);
    if (item) {
      const u: AuthUser = JSON.parse(item);
      // Double check if user is verified
      if (u && u.isVerified) return u;
    }
  } catch (err) {
    console.error("Error reading current user:", err);
  }
  return null;
};

export const setCurrentUser = (user: AuthUser): void => {
  try {
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
  } catch (err) {
    console.error("Error setting current user:", err);
  }
};

export const logoutUser = (): void => {
  try {
    localStorage.removeItem(AUTH_USER_KEY);
  } catch (err) {
    console.error("Error logging out:", err);
  }
};

export const validateLoginCredentials = (
  usernameOrEmail: string,
  pass: string
): { success: boolean; user?: AuthUser; error?: string } => {
  const users = getAllUsers();
  const cleanInput = usernameOrEmail.trim().toLowerCase();

  const found = users.find(
    (u) =>
      u.email.toLowerCase() === cleanInput ||
      u.username.toLowerCase() === cleanInput
  );

  if (!found) {
    return {
      success: false,
      error: "Username / Email tidak ditemukan. Silakan mendaftar terlebih dahulu.",
    };
  }

  // Check password if set
  if (found.password && found.password !== pass) {
    return {
      success: false,
      error: "Kata sandi yang Anda masukkan salah.",
    };
  }

  // Check verification status
  if (!found.isVerified) {
    return {
      success: false,
      error:
        "Akun Anda belum diverifikasi oleh Super Admin. Harap tunggu verifikasi dari Super Admin sebelum dapat masuk ke halaman beranda.",
    };
  }

  return {
    success: true,
    user: found,
  };
};

export const registerNewUser = (user: Omit<AuthUser, "id">): AuthUser => {
  const allUsers = getAllUsers();
  const newUser: AuthUser = {
    ...user,
    id: `usr_${Date.now()}`,
    driveFolderUrl: user.driveFolderUrl || "https://drive.google.com/drive/u/0/my-drive",
    isVerified: false, // Must be approved by superadmin
  };
  const updated = [...allUsers, newUser];
  saveAllUsers(updated);
  return newUser;
};

export const verifyUser = (userId: string): AuthUser[] => {
  const allUsers = getAllUsers();
  const updated = allUsers.map((u) => {
    if (u.id === userId) {
      return { ...u, isVerified: true };
    }
    return u;
  });
  saveAllUsers(updated);
  return updated;
};

export const requestPasswordReset = (
  usernameOrEmail: string,
  newPasswordCandidate: string
): { success: boolean; message: string } => {
  const allUsers = getAllUsers();
  const cleanInput = usernameOrEmail.trim().toLowerCase();
  let found = false;

  const updated = allUsers.map((u) => {
    if (u.email.toLowerCase() === cleanInput || u.username.toLowerCase() === cleanInput) {
      found = true;
      return {
        ...u,
        resetPasswordRequested: true,
        newPasswordCandidate,
      };
    }
    return u;
  });

  if (!found) {
    return {
      success: false,
      message: "Email / Username tidak ditemukan di sistem.",
    };
  }

  saveAllUsers(updated);
  return {
    success: true,
    message: "Permintaan reset password berhasil dikirim. Menunggu validasi & persetujuan Super Admin.",
  };
};

export const approvePasswordReset = (userId: string): AuthUser[] => {
  const allUsers = getAllUsers();
  const updated = allUsers.map((u) => {
    if (u.id === userId && u.newPasswordCandidate) {
      return {
        ...u,
        password: u.newPasswordCandidate,
        resetPasswordRequested: false,
        newPasswordCandidate: undefined,
      };
    }
    return u;
  });
  saveAllUsers(updated);
  return updated;
};

export const rejectPasswordReset = (userId: string): AuthUser[] => {
  const allUsers = getAllUsers();
  const updated = allUsers.map((u) => {
    if (u.id === userId) {
      return {
        ...u,
        resetPasswordRequested: false,
        newPasswordCandidate: undefined,
      };
    }
    return u;
  });
  saveAllUsers(updated);
  return updated;
};

export const directResetPassword = (userId: string, newPass: string): AuthUser[] => {
  const allUsers = getAllUsers();
  const updated = allUsers.map((u) => {
    if (u.id === userId) {
      return {
        ...u,
        password: newPass,
        resetPasswordRequested: false,
        newPasswordCandidate: undefined,
      };
    }
    return u;
  });
  saveAllUsers(updated);
  return updated;
};

export const updateUserDriveUrl = (userId: string, driveFolderUrl: string): AuthUser => {
  const allUsers = getAllUsers();
  let updatedUser: AuthUser | null = null;
  const updatedList = allUsers.map((u) => {
    if (u.id === userId) {
      updatedUser = { ...u, driveFolderUrl };
      return updatedUser;
    }
    return u;
  });
  saveAllUsers(updatedList);
  const activeUser = getCurrentUser();
  if (activeUser && activeUser.id === userId && updatedUser) {
    setCurrentUser(updatedUser);
    return updatedUser;
  }
  return updatedUser || activeUser;
};
