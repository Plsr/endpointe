import { ClearLocalDataButton } from "@/components/ClearLocalDataButton";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function SettingsPage() {
  return (
    <div className="w-4xl mx-auto p-4">
      <Link
        href="/app"
        className="inline-flex mb-8 items-center gap-2 text-xs px-2 py-1 rounded-md bg-stone-900 hover:bg-stone-800 border border-stone-800 cursor-pointer transition-all"
      >
        <ArrowLeft className="w-4 h-4" /> Back to App
      </Link>
      <h1 className="text-lg font-bold">Settings</h1>
      <div className="mt-4">
        <ClearLocalDataButton />
      </div>
    </div>
  );
}
