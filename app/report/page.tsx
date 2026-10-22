import React from "react";
import { ReportWizard } from "@/components/report/ReportWizard";

export const metadata = {
  title: "Report a Leak — JalRakshak",
  description:
    "Report active freshwater pipe bursts, street leakages, or broken valves in your community. Direct civic escalation with photo verification.",
};

export default function ReportPage() {
  return (
    <div className="w-full bg-[#F9FAF9] min-h-[calc(100vh-80px)]">
      <ReportWizard />
    </div>
  );
}
