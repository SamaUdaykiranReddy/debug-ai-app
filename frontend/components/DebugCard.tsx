"use client";
import { useState } from "react";
import { DebugLog } from "@/types";

interface Props {
  log: DebugLog;
  onDelete: (id: string) => void;
  onSolve: (id: string) => void;
  onApplyFix: (id: string) => void;
}

const statusConfig = {
  pending: { label: "PENDING", bg: "bg-yellow-500/10", text: "text-yellow-400" },
  solved:  { label: "SOLVED",  bg: "bg-indigo-500/10", text: "text-indigo-400" },
  fixed:   { label: "FIXED",   bg: "bg-emerald-500/10", text: "text-emerald-400" },
};

export default function DebugCard({ log, onDelete, onSolve, onApplyFix }: Props) {
  const [expanded, setExpanded] = useState(false);
  const status = statusConfig[log.status];

  return (
    <div className="bg-[#111] border border-[#1f1f1f] hover:border-[#2a2a2a] rounded-xl p-5 transition">
      {/* Header */}
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap mb-1">
            <h3 className="font-semibold text-gray-100 text-base truncate">{log.title}</h3>
            <span className={`${status.bg} ${status.text} text-xs font-bold px-3 py-0.5 rounded-full`}>
              {status.label}
            </span>
          </div>
          <p className="text-xs text-gray-600">
            {new Date(log.createdAt).toLocaleDateString("en-US", {
              year: "numeric", month: "short", day: "numeric",
            })}
          </p>
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-indigo-400 hover:text-indigo-300 text-xs font-medium bg-transparent shrink-0 transition"
        >
          {expanded ? "▲ Collapse" : "▼ Expand"}
        </button>
      </div>

      {/* Expanded Content */}
      {expanded && (
        <div className="mt-5 flex flex-col gap-4">
          {log.codeSnippet && (
            <div>
              <p className="text-xs text-gray-600 uppercase font-semibold mb-2">Code Snippet</p>
              <pre className="bg-[#0a0a0a] border border-[#1f1f1f] rounded-lg p-4 text-sm text-gray-300 font-mono overflow-x-auto max-h-64 overflow-y-auto">
                {log.codeSnippet}
              </pre>
            </div>
          )}

          {log.errorMessage && (
            <div>
              <p className="text-xs text-red-500/70 uppercase font-semibold mb-2">Error Message</p>
              <pre className="bg-[#0a0a0a] border border-red-900/30 rounded-lg p-4 text-sm text-red-300 font-mono overflow-x-auto max-h-40 overflow-y-auto">
                {log.errorMessage}
              </pre>
            </div>
          )}

          {log.solution && (
            <div>
              <p className="text-xs text-indigo-400/70 uppercase font-semibold mb-2">🤖 AI Solution</p>
              <div className="bg-[#0a0a0a] border border-indigo-900/30 rounded-lg p-4 text-sm text-gray-300 whitespace-pre-wrap max-h-72 overflow-y-auto">
                {log.solution}
              </div>
            </div>
          )}

          {log.fixedCode && (
            <div>
              <p className="text-xs text-emerald-400/70 uppercase font-semibold mb-2">✅ Fixed Code</p>
              <pre className="bg-[#0a0a0a] border border-emerald-900/30 rounded-lg p-4 text-sm text-emerald-200 font-mono overflow-x-auto max-h-64 overflow-y-auto">
                {log.fixedCode}
              </pre>
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2 mt-4 flex-wrap">
        {log.status === "pending" && (
          <button
            onClick={() => onSolve(log._id)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition"
          >
            🤖 Solve with AI
          </button>
        )}
        {log.status === "solved" && (
          <button
            onClick={() => onApplyFix(log._id)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition"
          >
            🔧 Apply Fix
          </button>
        )}
        {/* Fixed: was blank for "fixed" status — now shows a disabled completion badge */}
        {log.status === "fixed" && (
          <span className="bg-emerald-500/10 text-emerald-400 text-xs font-semibold px-4 py-2 rounded-lg">
            ✅ Completed
          </span>
        )}
        <button
          onClick={() => onDelete(log._id)}
          className="bg-[#1a1a1a] hover:bg-red-950 border border-red-900/30 text-red-400 hover:text-red-300 text-xs font-semibold px-4 py-2 rounded-lg transition"
        >
          🗑 Delete
        </button>
      </div>
    </div>
  );
}