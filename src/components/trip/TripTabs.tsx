"use client";

import { useState } from "react";

export default function TripTabs({
  people,
  expenses,
  settlement,
}: {
  people: React.ReactNode;
  expenses: React.ReactNode;
  settlement: React.ReactNode;
}) {
  const [activeTab, setActiveTab] =
    useState<
      "people" |
      "expenses" |
      "settlement"
    >("people");

  return (
    <div>
      {/* Tabs */}
      <div className="sticky top-20 z-30 mb-6">
        <div
          className="
            bg-zinc-900/95
            backdrop-blur-xl
            border
            border-zinc-800
            rounded-2xl
            p-1
            grid
            grid-cols-3
          "
        >
          <button
            onClick={() =>
              setActiveTab(
                "people"
              )
            }
            className={`
              py-3
              rounded-xl
              text-sm
              font-semibold
              transition
              ${
                activeTab ===
                "people"
                  ? "bg-violet-600 text-white"
                  : "text-zinc-400"
              }
            `}
          >
            👥 People
          </button>

          <button
            onClick={() =>
              setActiveTab(
                "expenses"
              )
            }
            className={`
              py-3
              rounded-xl
              text-sm
              font-semibold
              transition
              ${
                activeTab ===
                "expenses"
                  ? "bg-violet-600 text-white"
                  : "text-zinc-400"
              }
            `}
          >
            💰 Expenses
          </button>

          <button
            onClick={() =>
              setActiveTab(
                "settlement"
              )
            }
            className={`
              py-3
              rounded-xl
              text-sm
              font-semibold
              transition
              ${
                activeTab ===
                "settlement"
                  ? "bg-violet-600 text-white"
                  : "text-zinc-400"
              }
            `}
          >
            ⚖️ Settlement
          </button>
        </div>
      </div>

      {/* Content */}
      <div>
        {activeTab ===
          "people" && people}

        {activeTab ===
          "expenses" &&
          expenses}

        {activeTab ===
          "settlement" &&
          settlement}
      </div>
    </div>
  );
}