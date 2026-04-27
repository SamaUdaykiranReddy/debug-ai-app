"use client";
import { useState } from "react";
import api from "@/lib/axios";
import { DebugLog } from "@/types";
import toast from "react-hot-toast";

interface Props {
  onClose: () => void;
  onCreated: (log: DebugLog) => void;
}

export default function CreateDebugModal({ onClose, onCreated }: Props) {
  const [form, setForm] = useState({ title: "", codeSnippet: "", errorMessage: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post("/debugs", form);
      toast.success("Debug log created!");
      onCreated(data);
    } catch {
      toast.error("Failed to create log");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4"
      onClick={onClose}
    >
      <div
        className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-indigo-400 font-bold text-lg">New Debug Log</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-white text-xl bg-transparent transition"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-gray-400">Title *</label>
            <input
              type="text"
              placeholder="e.g. TypeError in useEffect"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
              className="bg-[#111] border border-[#333] focus:border-indigo-500 text-white rounded-lg px-4 py-2.5 text-sm outline-none transition"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-gray-400">Code Snippet</label>
            <textarea
              rows={7}
              placeholder="Paste your buggy code here..."
              value={form.codeSnippet}
              onChange={(e) => setForm({ ...form, codeSnippet: e.target.value })}
              className="bg-[#111] border border-[#333] focus:border-indigo-500 text-white rounded-lg px-4 py-2.5 text-sm outline-none transition font-mono resize-y"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-gray-400">Error Message</label>
            <textarea
              rows={3}
              placeholder="Paste the error message..."
              value={form.errorMessage}
              onChange={(e) => setForm({ ...form, errorMessage: e.target.value })}
              className="bg-[#111] border border-[#333] focus:border-indigo-500 text-red-300 rounded-lg px-4 py-2.5 text-sm outline-none transition font-mono resize-y"
            />
          </div>

          <div className="flex justify-end gap-3 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-[#111] border border-[#333] text-gray-400 hover:text-white px-5 py-2.5 rounded-lg text-sm transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-6 py-2.5 rounded-lg text-sm transition"
            >
              {loading ? "Creating..." : "Create Log"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}