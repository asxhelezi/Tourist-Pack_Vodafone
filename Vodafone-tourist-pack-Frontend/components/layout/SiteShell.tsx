import type React from "react";

import Header from "@/components/Header";
import SelectedPackDrawer from "@/components/packs/SelectedPackDrawer";
import LostSupportButton from "@/components/emergency/LostSupportButton";
import EventNotificationStack from "@/components/events/EventNotificationStack";
import Mascot from "@/components/mascot/Mascot";
import AppBackground from "@/components/layout/AppBackground";

interface SiteShellProps {
  children: React.ReactNode;
}

export default function SiteShell({
  children,
}: SiteShellProps) {
  return (
    <div className="relative flex min-h-screen flex-col bg-[#f7f7f7]/0">
      <AppBackground />
      <Header />

      <main className="w-full flex-1 pb-24 pt-6">
        {children}
      </main>


      <EventNotificationStack />
      <Mascot />
      <LostSupportButton />
      <SelectedPackDrawer />
    </div>
  );
}