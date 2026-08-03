import { AuthUser } from "../types";

const AUTH_USER_KEY = "eduadmin_active_user_v2";
const ALL_USERS_KEY = "eduadmin_all_users_v2";

export const DEFAULT_USERS: AuthUser[] = [
  {
    id: "usr_superadmin",
    username: "admin@smk.belajar.id",
    name: "Super Admin Kurikulum & SDM",
    email: "admin@smk.belajar.id",
    role: "superadmin",
    nip: "198001012005011001",
    subject: "Pengawas & Admin Utama",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
    driveFolderUrl: "https://drive.google.com/drive/u/0/my-drive",
  },
  {
    id: "usr_guru1",
    username: "isukartika30@guru.smk.belajar.id",
    name: "Isu Kartika, S.Pd.",
    email: "isukartika30@guru.smk.belajar.id",
    role: "guru",
    nip: "198803152019032008",
    subject: "Informatika / Multimedia",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150",
    driveFolderUrl: "https://drive.google.com/drive/u/0/my-drive",
  },
  {
    id: "usr_guru2",
    username: "budi.santoso@guru.smk.belajar.id",
    name: "Budi Santoso, M.Pd.",
    email: "budi.santoso@guru.smk.belajar.id",
    role: "guru",
    nip: "198205122008011012",
    subject: "Matematika / Rekayasa",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150",
    driveFolderUrl: "https://drive.google.com/drive/u/0/my-drive",
  },
];

export const getAllUsers = (): AuthUser[] => {
  try {
    const item = localStorage.getItem(ALL_USERS_KEY);
    if (!item) {
      localStorage.setItem(ALL_USERS_KEY, JSON.stringify(DEFAULT_USERS));
      return DEFAULT_USERS;
    }
    return JSON.parse(item);
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

export const getCurrentUser = (): AuthUser => {
  try {
    const item = localStorage.getItem(AUTH_USER_KEY);
    if (item) {
      return JSON.parse(item);
    }
  } catch (err) {
    console.error("Error reading current user:", err);
  }
  // Default to Guru 1 (Isu Kartika) if none logged in
  return DEFAULT_USERS[1];
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

export const registerNewUser = (user: Omit<AuthUser, "id">): AuthUser => {
  const allUsers = getAllUsers();
  const newUser: AuthUser = {
    ...user,
    id: `usr_${Date.now()}`,
    driveFolderUrl: user.driveFolderUrl || "https://drive.google.com/drive/u/0/my-drive",
  };
  const updated = [...allUsers, newUser];
  saveAllUsers(updated);
  setCurrentUser(newUser);
  return newUser;
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
