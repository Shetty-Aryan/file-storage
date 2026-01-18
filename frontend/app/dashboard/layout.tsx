"use client";

import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-black text-white">
      <header className="flex justify-between items-center px-6 py-4 border-b border-gray-800">
        <h1 className="font-bold">Secure Storage</h1>
        <button
          onClick={() => signOut(auth)}
          className="text-sm text-red-400"
        >
          Logout
        </button>
      </header>

      <main className="p-6">{children}</main>
    </div>
  );
}