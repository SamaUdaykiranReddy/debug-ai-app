"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import api from "@/lib/axios";
import { DebugLog } from "@/types";
import toast from "react-hot-toast";
import CreateDebugModal from "@/components/CreateDebugModal";
import DebugCard from "@/components/DebugCard";

export default function DashboardPage() {
  const { token, user, logout, hydrate } = useAuthStore();
  const router = useRouter();
  const [logs, setLogs] = useState<DebugLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Fixed: added hydrate to deps (stable Zustand fn, safe to include)
  useEffect(() => {
    hydrate();
    setHydrated(true);
  }, [hydrate]);

  // Wrapped in useCallback so it can safely go in the dep array below
  const fetchLogs = useCallback(async () => {
    try {
      const { data } = await api.get("/debugs");
      setLogs(data);
    } catch {
      toast.error("Failed to load debug logs");
    } finally {
      setLoading(false);
    }
  }, []);

  // Fixed: added router and fetchLogs to deps
  useEffect(() => {
    if (!hydrated) return;
    if (!token && !localStorage.getItem("token")) {
      router.push("/login");
      return;
    }
    fetchLogs();
  }, [hydrated, token, router, fetchLogs]);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/debugs/${id}`);
      setLogs((prev) => prev.filter((l) => l._id !== id));
      toast.success("Log deleted");
    } catch {
      toast.error("Failed to delete");
    }
  };

  const handleSolve = async (id: string) => {
    toast.loading("AI is analyzing...", { id: "solve" });
    try {
      const { data } = await api.post(`/debugs/${id}/solve`);
      setLogs((prev) => prev.map((l) => (l._id === id ? data : l)));
      toast.success("AI solution ready!", { id: "solve" });
    } catch {
      toast.error("AI solve failed", { id: "solve" });
    }
  };

  const handleApplyFix = async (id: string) => {
    toast.loading("Applying fix...", { id: "fix" });
    try {
      const { data } = await api.post(`/debugs/${id}/fix`);
      setLogs((prev) => prev.map((l) => (l._id === id ? data : l)));
      toast.success("Fix applied!", { id: "fix" });
    } catch {
      toast.error("Apply fix failed", { id: "fix" });
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-4 border-b border-[#1f1f1f] bg-[#111] sticky top-0 z-10">
        <h1 className="text-indigo-500 font-extrabold text-xl">🐛 AI Debug Platform</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-400 text-sm hidden sm:block">
            Hi, <span className="text-white font-medium">{user?.name}</span>
          </span>
          <button
            onClick={() => setShowModal(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-5 py-2 rounded-lg transition"
          >
            + New Debug
          </button>
          <button
            onClick={handleLogout}
            className="bg-[#1a1a1a] hover:bg-[#222] border border-[#333] text-gray-400 text-sm px-4 py-2 rounded-lg transition"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-10">
        <h2 className="text-xl font-semibold text-gray-200 mb-6">
          Your Debug Logs{" "}
          <span className="text-gray-600 text-base font-normal">({logs.length})</span>
        </h2>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : logs.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-[#2a2a2a] rounded-2xl text-gray-600">
            <p className="text-lg">No debug logs yet.</p>
            {/* Fixed: escaped quotes with &quot; to satisfy react/no-unescaped-entities */}
            <p className="text-sm mt-2">Click &quot;+ New Debug&quot; to get started.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {logs.map((log) => (
              <DebugCard
                key={log._id}
                log={log}
                onDelete={handleDelete}
                onSolve={handleSolve}
                onApplyFix={handleApplyFix}
              />
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <CreateDebugModal
          onClose={() => setShowModal(false)}
          onCreated={(newLog) => {
            setLogs((prev) => [newLog, ...prev]);
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
}