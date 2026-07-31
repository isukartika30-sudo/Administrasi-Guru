import {
  SchoolProfile,
  Student,
  ClassRoom,
  ScheduleItem,
  AgendaItem,
  JournalItem,
  HomeroomStudent,
  AssessmentItem,
  AttendanceRecord,
  CpItem,
  TpItem,
  AtpItem,
  KktpItem,
  ProtaProsemItem,
} from "../types";
import {
  initialSchoolProfile,
  sampleStudents,
  sampleSchedules,
  sampleAgendas,
  sampleJournals,
  sampleHomeroomStudents,
  sampleAssessments,
  sampleAttendanceRecords,
  sampleClasses,
  sampleCps,
  sampleTps,
  sampleAtps,
  sampleKktps,
  sampleProtaProsems,
} from "../data/initialData";

const STORAGE_KEYS = {
  PROFILE: "eduadmin_profile_v1",
  CLASSES: "eduadmin_classes_v2",
  STUDENTS: "eduadmin_students_v2",
  SCHEDULES: "eduadmin_schedules_v1",
  AGENDAS: "eduadmin_agendas_v1",
  JOURNALS: "eduadmin_journals_v1",
  HOMEROOM: "eduadmin_homeroom_v2",
  ASSESSMENTS: "eduadmin_assessments_v2",
  ATTENDANCE: "eduadmin_attendance_v2",
  CPS: "eduadmin_cps_v1",
  TPS: "eduadmin_tps_v1",
  ATPS: "eduadmin_atps_v1",
  KKTPS: "eduadmin_kktps_v1",
  PROTA_PROSEM: "eduadmin_prota_prosem_v1",
  USER_API_KEY: "eduadmin_user_gemini_api_key",
};

export const loadFromStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading ${key} from LocalStorage:`, error);
    return defaultValue;
  }
};

export const saveToStorage = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving ${key} to LocalStorage:`, error);
  }
};

// Profile
export const getProfile = (): SchoolProfile => loadFromStorage(STORAGE_KEYS.PROFILE, initialSchoolProfile);
export const saveProfile = (data: SchoolProfile) => saveToStorage(STORAGE_KEYS.PROFILE, data);

// Classes
export const getClasses = (): ClassRoom[] => loadFromStorage(STORAGE_KEYS.CLASSES, sampleClasses);
export const saveClasses = (data: ClassRoom[]) => saveToStorage(STORAGE_KEYS.CLASSES, data);

// Students
export const getStudents = (): Student[] => loadFromStorage(STORAGE_KEYS.STUDENTS, sampleStudents);
export const saveStudents = (data: Student[]) => saveToStorage(STORAGE_KEYS.STUDENTS, data);

// Schedules
export const getSchedules = (): ScheduleItem[] => loadFromStorage(STORAGE_KEYS.SCHEDULES, sampleSchedules);
export const saveSchedules = (data: ScheduleItem[]) => saveToStorage(STORAGE_KEYS.SCHEDULES, data);

// Agendas
export const getAgendas = (): AgendaItem[] => loadFromStorage(STORAGE_KEYS.AGENDAS, sampleAgendas);
export const saveAgendas = (data: AgendaItem[]) => saveToStorage(STORAGE_KEYS.AGENDAS, data);

// Journals
export const getJournals = (): JournalItem[] => loadFromStorage(STORAGE_KEYS.JOURNALS, sampleJournals);
export const saveJournals = (data: JournalItem[]) => saveToStorage(STORAGE_KEYS.JOURNALS, data);

// Homeroom
export const getHomeroomStudents = (): HomeroomStudent[] => loadFromStorage(STORAGE_KEYS.HOMEROOM, sampleHomeroomStudents);
export const saveHomeroomStudents = (data: HomeroomStudent[]) => saveToStorage(STORAGE_KEYS.HOMEROOM, data);

// Assessments
export const getAssessments = (): AssessmentItem[] => loadFromStorage(STORAGE_KEYS.ASSESSMENTS, sampleAssessments);
export const saveAssessments = (data: AssessmentItem[]) => saveToStorage(STORAGE_KEYS.ASSESSMENTS, data);

// Attendance Records
export const getAttendanceRecords = (): AttendanceRecord[] => loadFromStorage(STORAGE_KEYS.ATTENDANCE, sampleAttendanceRecords);
export const saveAttendanceRecords = (data: AttendanceRecord[]) => saveToStorage(STORAGE_KEYS.ATTENDANCE, data);

// CP (Capaian Pembelajaran)
export const getCps = (): CpItem[] => loadFromStorage(STORAGE_KEYS.CPS, sampleCps);
export const saveCps = (data: CpItem[]) => saveToStorage(STORAGE_KEYS.CPS, data);

// TP (Tujuan Pembelajaran)
export const getTps = (): TpItem[] => loadFromStorage(STORAGE_KEYS.TPS, sampleTps);
export const saveTps = (data: TpItem[]) => saveToStorage(STORAGE_KEYS.TPS, data);

// ATP (Alur Tujuan Pembelajaran)
export const getAtps = (): AtpItem[] => loadFromStorage(STORAGE_KEYS.ATPS, sampleAtps);
export const saveAtps = (data: AtpItem[]) => saveToStorage(STORAGE_KEYS.ATPS, data);

// KKTP & KKM (Kriteria Ketuntasan)
export const getKktps = (): KktpItem[] => loadFromStorage(STORAGE_KEYS.KKTPS, sampleKktps);
export const saveKktps = (data: KktpItem[]) => saveToStorage(STORAGE_KEYS.KKTPS, data);

// Prota & Prosem
export const getProtaProsems = (): ProtaProsemItem[] => loadFromStorage(STORAGE_KEYS.PROTA_PROSEM, sampleProtaProsems);
export const saveProtaProsems = (data: ProtaProsemItem[]) => saveToStorage(STORAGE_KEYS.PROTA_PROSEM, data);

// Custom User API Key
export const getUserApiKey = (): string => {
  try {
    return localStorage.getItem(STORAGE_KEYS.USER_API_KEY) || "";
  } catch {
    return "";
  }
};
export const saveUserApiKey = (key: string) => {
  try {
    localStorage.setItem(STORAGE_KEYS.USER_API_KEY, key);
  } catch (err) {
    console.error("Error saving API key:", err);
  }
};

// Reset all data back to factory defaults
export const resetAllData = (): void => {
  localStorage.removeItem(STORAGE_KEYS.PROFILE);
  localStorage.removeItem(STORAGE_KEYS.CLASSES);
  localStorage.removeItem(STORAGE_KEYS.STUDENTS);
  localStorage.removeItem(STORAGE_KEYS.SCHEDULES);
  localStorage.removeItem(STORAGE_KEYS.AGENDAS);
  localStorage.removeItem(STORAGE_KEYS.JOURNALS);
  localStorage.removeItem(STORAGE_KEYS.HOMEROOM);
  localStorage.removeItem(STORAGE_KEYS.ASSESSMENTS);
  localStorage.removeItem(STORAGE_KEYS.ATTENDANCE);
  window.location.reload();
};

// Export JSON Backup
export const exportBackupJSON = (): void => {
  const backup = {
    profile: getProfile(),
    classes: getClasses(),
    students: getStudents(),
    schedules: getSchedules(),
    agendas: getAgendas(),
    journals: getJournals(),
    homeroom: getHomeroomStudents(),
    assessments: getAssessments(),
    attendance: getAttendanceRecords(),
    exportedAt: new Date().toISOString(),
  };

  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backup, null, 2));
  const downloadAnchor = document.createElement("a");
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `Backup_Administrasi_Guru_${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
};

// Import JSON Backup
export const importBackupJSON = (jsonString: string): boolean => {
  try {
    const data = JSON.parse(jsonString);
    if (data.profile) saveProfile(data.profile);
    if (data.classes) saveClasses(data.classes);
    if (data.students) saveStudents(data.students);
    if (data.schedules) saveSchedules(data.schedules);
    if (data.agendas) saveAgendas(data.agendas);
    if (data.journals) saveJournals(data.journals);
    if (data.homeroom) saveHomeroomStudents(data.homeroom);
    if (data.assessments) saveAssessments(data.assessments);
    if (data.attendance) saveAttendanceRecords(data.attendance);
    return true;
  } catch (e) {
    console.error("Failed to import backup JSON:", e);
    return false;
  }
};
