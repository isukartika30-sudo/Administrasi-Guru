import React, { useState } from "react";
import { TabType, SchoolProfile, PrintData } from "./types";
import { getProfile, getStudents, getSchedules, getJournals } from "./utils/storage";

import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import { OverviewModule } from "./components/OverviewModule";
import { AbsensiModule } from "./components/AbsensiModule";
import { JadwalModule } from "./components/JadwalModule";
import { AgendaModule } from "./components/AgendaModule";
import { JurnalModule } from "./components/JurnalModule";
import { WaliKelasModule } from "./components/WaliKelasModule";
import { PenilaianModule } from "./components/PenilaianModule";
import { KurikulumModule } from "./components/KurikulumModule";
import { SikepoModule } from "./components/SikepoModule";
import { GoogleWorkspaceModule } from "./components/GoogleWorkspaceModule";
import { AiAssistantModule } from "./components/AiAssistantModule";
import { PrintModal } from "./components/PrintModal";
import { SettingsModal } from "./components/SettingsModal";

export default function App() {
  const [profile, setProfile] = useState<SchoolProfile>(getProfile());
  const [activeTab, setActiveTab] = useState<TabType>("overview");

  // Modals state
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState<boolean>(false);
  const [printData, setPrintData] = useState<PrintData | null>(null);

  const students = getStudents();
  const schedules = getSchedules();
  const journals = getJournals();

  const handleOpenPrint = (data: PrintData) => {
    setPrintData(data);
    setIsPrintModalOpen(true);
  };

  const handleQuickPrintFromSidebar = () => {
    handleOpenPrint({
      type: "absensi",
      title: "Laporan Rekapitulasi Presensi & Administrasi Guru",
      className: profile.homeroomClass,
      items: students.map((s) => ({ ...s, status: "H" })),
    });
  };

  return (
    <div className="min-h-screen bg-[#F9F8F3] text-[#2F3327] font-sans flex flex-col antialiased">
      {/* Header Bar */}
      <Header
        profile={profile}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main Container Layout */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex flex-col lg:flex-row">
        {/* Sidebar Navigation */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenQuickPrint={handleQuickPrintFromSidebar}
        />

        {/* Content View Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden space-y-6">
          {activeTab === "overview" && (
            <OverviewModule
              profile={profile}
              students={students}
              schedules={schedules}
              journals={journals}
              setActiveTab={setActiveTab}
              onOpenQuickPrint={handleQuickPrintFromSidebar}
            />
          )}

          {activeTab === "sikepo" && (
            <SikepoModule profile={profile} onOpenPrint={handleOpenPrint} />
          )}

          {activeTab === "kurikulum" && (
            <KurikulumModule onOpenPrint={handleOpenPrint} />
          )}

          {activeTab === "absensi" && (
            <AbsensiModule onOpenPrint={handleOpenPrint} />
          )}

          {activeTab === "jadwal" && <JadwalModule />}

          {activeTab === "agenda" && (
            <AgendaModule onOpenPrint={handleOpenPrint} />
          )}

          {activeTab === "jurnal" && (
            <JurnalModule onOpenPrint={handleOpenPrint} />
          )}

          {activeTab === "perwalian" && (
            <WaliKelasModule profile={profile} setActiveTab={setActiveTab} />
          )}

          {activeTab === "penilaian" && (
            <PenilaianModule onOpenPrint={handleOpenPrint} />
          )}

          {activeTab === "google_workspace" && <GoogleWorkspaceModule />}

          {activeTab === "ai_assistant" && <AiAssistantModule />}
        </main>
      </div>

      {/* Global Modals */}
      <PrintModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        printData={printData}
        profile={profile}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        profile={profile}
        onProfileUpdate={(updated) => setProfile(updated)}
      />
    </div>
  );
}
