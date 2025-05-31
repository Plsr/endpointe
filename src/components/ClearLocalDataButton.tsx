"use client";

import { Trash } from "lucide-react";

export const ClearLocalDataButton = () => {
  const handleClick = () => {
    window.localStorage.removeItem("requests");
  };

  return (
    <button
      onClick={handleClick}
      className="inline-flex items-center gap-2 text-xs px-4 py-2 text-red-400 rounded-md bg-red-950/50 hover:bg-red-950/70 border border-red-900/50 cursor-pointer transition-all"
    >
      <Trash className="w-4 h-4 text-red-400" /> Clear local data
    </button>
  );
};
