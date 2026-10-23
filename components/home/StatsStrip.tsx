"use client";

import React, { useEffect, useState } from "react";
import { FileText, Waves, CheckCircle2, Droplet } from "lucide-react";
import { clientStore } from "@/lib/client-store";

interface StatsData {
  totalReports: number;
  inProgress: number;
  resolved: number;
  litresSaved: number;
}

export const StatsStrip: React.FC = () => {
  const [stats, setStats] = useState<StatsData>({
    totalReports: 128,
    inProgress: 42,
    resolved: 63,
    litresSaved: 12500,
  });

  useEffect(() => {
    const updateStats = () => {
      setStats(clientStore.getPublicStats());
    };
    updateStats();
    const unsub = clientStore.subscribe(updateStats);
    return () => unsub();
  }, []);

  const cards = [
    {
      icon: <FileText className="w-5 h-5 text-[#0D382B]" />,
      value: stats.totalReports.toLocaleString(),
      label: "Total Reports",
    },
    {
      icon: <Waves className="w-5 h-5 text-[#0D382B]" />,
      value: stats.inProgress.toLocaleString(),
      label: "In Progress",
    },
    {
      icon: <CheckCircle2 className="w-5 h-5 text-[#0D382B]" />,
      value: stats.resolved.toLocaleString(),
      label: "Resolved",
    },
    {
      icon: <Droplet className="w-5 h-5 text-[#0D382B]" />,
      value: `${stats.litresSaved.toLocaleString()}+`,
      label: "Litres Saved",
    },
  ];

  return (
    <section className="py-4 sm:py-6 bg-[#F9FAF9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {cards.map((card, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl border border-[#EBF0EC] p-5 sm:p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-md transition-all duration-200 flex items-center gap-4 sm:gap-5"
            >
              {/* Circular Icon Badge matching reference */}
              <div className="w-12 h-12 rounded-full bg-[#EAF2EC] flex items-center justify-center flex-shrink-0">
                {card.icon}
              </div>

              {/* Metric Count and Label */}
              <div className="flex flex-col min-w-0">
                <span className="text-2xl sm:text-[28px] font-bold text-[#0D241B] leading-tight tracking-tight">
                  {card.value}
                </span>
                <span className="text-xs sm:text-[13px] text-[#63776D] font-normal mt-0.5 truncate">
                  {card.label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
